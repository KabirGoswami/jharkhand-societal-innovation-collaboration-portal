import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ENV } from '../../config/env';
import { logger } from '../../utils/logger';
import { prisma } from '../../config/db';

export interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export class AuthService {
  async register(data: {
    email: string;
    password: string;
    name: string;
    role: string;
    phone?: string;
    organization?: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new Error('User with this email already exists');

    const passwordHash = await bcrypt.hash(data.password, 12);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: data.role,
        phone: data.phone,
        organization: data.organization,
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };
  }

  async login(credentials: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });
    if (!user) throw new Error('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!isPasswordValid) throw new Error('Invalid email or password');

    const token = this.generateToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      organization: user.organization,
    };
  }

  async updateProfile(userId: string, data: any) {
    // Prevent updating critical fields
    const { role, email, passwordHash, ...updateData } = data;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      phone: updatedUser.phone,
      organization: updatedUser.organization,
    };
  }

  async changePassword(userId: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { success: true, message: 'Password changed successfully' };
  }

  private generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '24h' });
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      return jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }
}

export const authService = new AuthService();
