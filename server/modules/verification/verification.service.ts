import { prisma } from '../../config/db';
import { VerificationStatus, Role } from '@prisma/client';
import { notificationsService } from '../notifications/notifications.service';

export class VerificationService {
  async getPendingRequests(reviewerId: string) {
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewerId },
    });

    if (!reviewer) throw new Error('Reviewer not found');

    const whereClause: any = {
      status: 'PENDING',
    };

    // University Admins only see requests for their own university
    if (reviewer.role === 'UNIVERSITY_ADMIN') {
      const universityId = await prisma.facultyProfile.findUnique({
        where: { userId: reviewerId },
      })?.then(p => p?.universityId);

      if (!universityId) throw new Error('University admin not linked to a university');

      // Filter requests where the user belongs to this university
      // This requires joining with profiles
      const requests = await prisma.verificationRequest.findMany({
        where: {
          status: 'PENDING',
          user: {
            OR: [
              { studentProfile: { universityId } },
              { facultyProfile: { universityId } },
            ],
          },
        },
        include: {
          user: {
            include: {
              studentProfile: true,
              facultyProfile: true,
              industryProfile: { include: { organization: true } },
            },
          },
        },
      });
      return requests;
    }

    // Government/Super Admins see everything
    return await prisma.verificationRequest.findMany({
      where: whereClause,
      include: {
        user: {
          include: {
            studentProfile: true,
            facultyProfile: true,
            industryProfile: { include: { organization: true } },
          },
        },
      },
    });
  }

  async updateRequestStatus(
    requestId: string,
    reviewerId: string,
    status: VerificationStatus,
    notes?: string
  ) {
    const request = await prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!request) throw new Error('Verification request not found');

    const userId = request.userId;
    const role = request.role;

    // 1. Update the request
    await prisma.verificationRequest.update({
      where: { id: requestId },
      data: {
        status,
        reviewedById: reviewerId,
        reviewerNotes: notes,
        reviewedAt: new Date(),
      },
    });

    // 2. Update User verification status
    const finalStatus = status === 'VERIFIED' ? 'VERIFIED' : 'REJECTED';
    await prisma.user.update({
      where: { id: userId },
      data: { verificationStatus: finalStatus },
    });

    // 3. Update Profile if verified
    if (status === 'VERIFIED') {
      if (role === 'STUDENT') {
        await prisma.studentProfile.update({
          where: { userId },
          data: { verifiedById: reviewerId, verifiedAt: new Date() },
        });
      } else if (role === 'FACULTY') {
        await prisma.facultyProfile.update({
          where: { userId },
          data: { verifiedById: reviewerId, verifiedAt: new Date() },
        });
      } else if (role === 'INDUSTRY_REP') {
        await prisma.industryProfile.update({
          where: { userId },
          data: { verifiedById: reviewerId, verifiedAt: new Date() },
        });
        // Also mark organization as verified
        const profile = await prisma.industryProfile.findUnique({
          where: { userId },
        });
        if (profile?.organizationId) {
          await prisma.organization.update({
            where: { id: profile.organizationId },
            data: { isVerified: true },
          });
        }
      }
    }

    // 4. Trigger Notification
    await notificationsService.createNotification({
      recipientId: userId,
      type: status === 'VERIFIED' ? 'success' : 'warning',
      title: status === 'VERIFIED' ? 'Verification Approved' : 'Verification Rejected',
      message: `Your verification request for the role ${role} has been ${status.toLowerCase()}. ${notes || ''}`,
      actionUrl: '/profile',
    });

    // 5. Audit Log
    await prisma.auditLog.create({
      data: {
        userId: reviewerId,
        action: `VERIFICATION_${status}`,
        details: `Verified user ${userId} with role ${role}. Notes: ${notes || 'None'}`,
      },
    });

    return { success: true };
  }

  async getSignedUploadUrl(bucket: string, fileName: string) {
    // This is a stub. In a real Supabase app, we would use:
    // await supabase.storage.from(bucket).createSignedUploadUrl(fileName, expiry)
    return {
      url: `https://your-supabase-project.supabase.co/storage/v1/object/sign/${bucket}/${fileName}`,
      expiresIn: 3600,
    };
  }
}

export const verificationService = new VerificationService();
