export interface User {
  UserId: number;
  Prefix: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  mobile: string;
  dateOfBirth: string; // or Date if you convert it
  roleId: number;
  SpecializationId?: number;
  
  Experience: string;
  Employee_ID?: string;
  SignatureOfUser: string;
  organizationId: number; // ✅ required because Prisma enforces it
  isActive: boolean;

  AdminAccess?: {
    hospital: {
      HospitalId: number;
      HospitalName: string;
    };
  }[];
}
