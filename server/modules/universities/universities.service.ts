import { prisma } from '../../config/db';
import { University } from '../../../src/types';

export class UniversityService {
  async getAllUniversities() {
    const universities = await prisma.university.findMany({
      include: { facultyMentors: true },
    });
    return universities.map(u => ({
      ...u,
      specializationDomains: JSON.parse(u.specializationDomains || '[]'),
      departments: JSON.parse(u.departments || '[]'),
    }));
  }

  async getUniversityById(id: string) {
    const uni = await prisma.university.findUnique({
      where: { id },
      include: { facultyMentors: true },
    });
    if (!uni) return null;
    return {
      ...uni,
      specializationDomains: JSON.parse(uni.specializationDomains || '[]'),
      departments: JSON.parse(uni.departments || '[]'),
    };
  }

  async createUniversity(data: any) {
    const { specializationDomains, departments, ...rest } = data;
    const newUni = await prisma.university.create({
      data: {
        ...rest,
        specializationDomains: JSON.stringify(specializationDomains || []),
        departments: JSON.stringify(departments || []),
      },
    });
    return {
      ...newUni,
      specializationDomains: JSON.parse(newUni.specializationDomains || '[]'),
      departments: JSON.parse(newUni.departments || '[]'),
    };
  }

  async updateUniversity(id: string, data: any) {
    const { specializationDomains, departments, ...rest } = data;
    const updateData: any = { ...rest };
    if (specializationDomains) updateData.specializationDomains = JSON.stringify(specializationDomains);
    if (departments) updateData.departments = JSON.stringify(departments);

    const updatedUni = await prisma.university.update({
      where: { id },
      data: updateData,
    });
    return {
      ...updatedUni,
      specializationDomains: JSON.parse(updatedUni.specializationDomains || '[]'),
      departments: JSON.parse(updatedUni.departments || '[]'),
    };
  }

  async deleteUniversity(id: string) {
    return await prisma.university.delete({
      where: { id },
    });
  }
}

export const universityService = new UniversityService();
