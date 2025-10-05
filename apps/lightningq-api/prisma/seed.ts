import {
  PrismaClient,
  OrganizationType,
  Hospital_Org_status,
  Title,
  SpecializationType,
  HospitalLevel,
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function seedOrganizations() {
  console.log('🌱 Seeding Organization data...');

  const organizations = [
    {
      OrganizationName: 'Sunrise Healthcare Group',
      Organizationcode: 'SHG01',
      logoUrl: 'https://cdn.sunrisehospital.com/logos/sunrise.png',
      email: 'info@sunrisehealth.com',
      contactNumber: '+91-9876543210',
      Orgnizationtype: OrganizationType.HOSPITAL,
      website: 'https://www.sunrisehealth.com',
      addressLine1: '123 Palm Avenue',
      addressLine2: 'Opposite Metro Station',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560001',
      registrationNo: 'REG-HOSP-2024-0912',
      establishedOn: new Date('2005-07-15'),
      industryType: 'Healthcare',
      status: Hospital_Org_status.ACTIVE,
      description: 'Leading multi-specialty hospital chain across India',
      isActive: true,
    },
    {
      OrganizationName: 'Medilife Diagnostics Pvt Ltd',
      Organizationcode: 'MDI01',
      logoUrl: 'https://dummyimage.com/200x200/ddd/000.png&text=Medilife',
      email: 'contact@medilifediagnostics.com',
      contactNumber: '+91-9123456789',
      Orgnizationtype: OrganizationType.DIAGNOSTICS,
      website: 'https://www.medilifediagnostics.com',
      addressLine1: '45 Health Street',
      addressLine2: 'Near City Mall',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '411001',
      registrationNo: 'REG-DIAG-2022-0321',
      establishedOn: new Date('2012-03-21'),
      industryType: 'Diagnostics',
      status: Hospital_Org_status.ACTIVE,
      description: 'Advanced pathology and radiology diagnostics provider',
      isActive: true,
    },
  ];

  for (const org of organizations) {
    await prisma.organization.upsert({
      where: { Organizationcode: org.Organizationcode },
      update: org,
      create: org,
    });
  }

  console.log('✅ Organizations seeded successfully!');
}

async function seedRoles() {
  console.log('🌱 Seeding Roles...');

  const roles = [
    { Rolename: 'Admin', Description: 'Full system access' },
    { Rolename: 'Doctor', Description: 'Handles patient consultations' },
    { Rolename: 'Admin Doctor', Description: 'Doctor with admin privileges' },
    { Rolename: 'Front Desk', Description: 'Manages appointments and billing' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { Rolename: role.Rolename },
      update: role,
      create: role,
    });
  }

  console.log('✅ Roles seeded successfully!');
}

async function seedUsers() {
  console.log('🌱 Seeding Users...');

  const organization = await prisma.organization.findFirst({
    where: { Organizationcode: 'SHG01' },
  });
  const roleAdmin = await prisma.role.findFirst({ where: { Rolename: 'Admin' } });
  const roleDoctor = await prisma.role.findFirst({ where: { Rolename: 'Doctor' } });
  const roleFrontDesk = await prisma.role.findFirst({ where: { Rolename: 'Front Desk' } });

  if (!organization || !roleAdmin) {
    throw new Error('❌ Missing required organization or role records.');
  }

  const passwordAdmin = await argon2.hash('Admin@123');
  const passwordDoctor = await argon2.hash('Doctor@123');
  const passwordFrontDesk = await argon2.hash('FrontDesk@123');

  const users = [
    {
      Prefix: Title.Mr,
      imageUrl: '',
      firstName: 'Shahbaz',
      lastName: 'Quamar',
      gender: 'Male',
      email: 'squamar7@gmail.com',
      mobile: '9999999999',
      passwordHash: passwordAdmin,
      dateOfBirth: new Date('1985-05-10'),
      roleId: roleAdmin.RoleId,
      organizationId: organization.OrganizationId,
      Experience: '10 Years',
      SignatureOfUser: '',
    },
    {
      Prefix: Title.Dr,
      imageUrl: '',
      firstName: 'Amit',
      lastName: 'Sharma',
      gender: 'Male',
      email: 'doctor@sunrisehealth.com',
      mobile: '8888888888',
      passwordHash: passwordDoctor,
      dateOfBirth: new Date('1990-04-12'),
      roleId: roleDoctor?.RoleId ?? roleAdmin.RoleId,
      organizationId: organization.OrganizationId,
      Experience: '6 Years',
      SignatureOfUser: 'DoctorSignature',
    },
    {
      Prefix: Title.Mr,
      imageUrl: '',
      firstName: 'Ramesh',
      lastName: 'Kumar',
      gender: 'Male',
      email: 'frontdesk@sunrisehealth.com',
      mobile: '7777777777',
      passwordHash: passwordFrontDesk,
      dateOfBirth: new Date('1995-08-22'),
      roleId: roleFrontDesk?.RoleId ?? roleAdmin.RoleId,
      organizationId: organization.OrganizationId,
      Experience: '3 Years',
      SignatureOfUser: 'FrontDeskSignature',
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }

  console.log('✅ Users seeded successfully!');
}

async function seedHospitals() {
  console.log('🌱 Seeding Hospitals...');

  const organization = await prisma.organization.findFirst({
    where: { Organizationcode: 'SHG01' },
  });
  const creator = await prisma.user.findUnique({
    where: { email: 'squamar7@gmail.com' },
  });

  if (!organization || !creator) {
    throw new Error('❌ Missing required organization or creator user.');
  }

  const hospitals = [
    {
      HospitalName: 'Sunrise Multispecialty Hospital',
      HospitalCode: 'SUN001',
      ParentHospitalCode: 'ROOT',
      Organizationcode: organization.Organizationcode,
      SpecializationType: SpecializationType.GENERAL,
      address: '45 MG Road, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560066',
      contactNumber: '+91-9876501234',
      email: 'contact@sunrisehospital.com',
      website: 'https://www.sunrisehospital.com',
      logoUrl: 'https://cdn.sunrisehospital.com/logos/hospital.png',
      latitude: 12.9716,
      longitude: 77.5946,
      status: Hospital_Org_status.ACTIVE,
      level: HospitalLevel.SUPER,
      organizationId: organization.OrganizationId,
      createdById: creator.UserId,
      isActive: true,
    },
    {
      HospitalName: 'Sunrise Diagnostics Center',
      HospitalCode: 'SUN002',
      ParentHospitalCode: 'SUN001',
      Organizationcode: organization.Organizationcode,
      SpecializationType: SpecializationType.MULTISPECIALITY,
      address: '22 Residency Road',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560025',
      contactNumber: '+91-9823012345',
      email: 'info@sunrisediagnostics.com',
      website: 'https://diagnostics.sunrisehospital.com',
      logoUrl: 'https://dummyimage.com/200x200/ddd/000.png&text=Diagnostics',
      latitude: 12.9721,
      longitude: 77.6033,
      status: Hospital_Org_status.ACTIVE,
      level: HospitalLevel.SUB_CHILD,
      organizationId: organization.OrganizationId,
      createdById: creator.UserId,
      isActive: true,
    },
  ];

  for (const hospital of hospitals) {
    await prisma.hospital.upsert({
      where: { HospitalCode: hospital.HospitalCode },
      update: hospital,
      create: hospital,
    });
  }

  console.log('✅ Hospitals seeded successfully!');
}

async function main() {
  await seedOrganizations();
  await seedRoles();
  await seedUsers();
  await seedHospitals();
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
