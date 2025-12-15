import {
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  endOfWeek,
} from 'date-fns';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/common/mailer/mailer.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { generateScheduledReportHtml } from 'src/utils/scheduled-report-html';
import { generatePdfFromHtml } from 'src/utils/pdf-generator.util';
import { subDays, differenceInDays, startOfWeek, format } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { Prisma } from '@prisma/client';
const TZ = 'Asia/Kolkata';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async getDashboardSummary(filters: {
    startDate?: Date;
    endDate?: Date;
    hospitalId?: number;
    doctorId?: number;
    specializationId?: number;
  }) {
    const { startDate, endDate, hospitalId, doctorId, specializationId } =
      filters;

    // 🕒 Normalize once for full-day coverage
    const normalizeDateRange = (start?: Date, end?: Date) => {
      const gte = start ? new Date(start) : new Date();
      const lte = end ? new Date(end) : new Date();
      gte.setHours(0, 0, 0, 0);
      lte.setHours(23, 59, 59, 999);
      return { gte, lte };
    };

    const { gte, lte } = normalizeDateRange(startDate, endDate);

    // -------------------------
    // 1️⃣ Appointment Filters
    // -------------------------
    const appointmentWhere: any = {
      appointmentDate: { gte, lte },
      ...(hospitalId ? { hospitalId } : {}),
      ...(doctorId ? { DoctorId: doctorId } : {}),
      ...(specializationId ? { SpecializationId: specializationId } : {}),
    };

    const todaysAppointments = await this.prisma.appointment.findMany({
      where: appointmentWhere,
      select: { status: true },
    });

    const bookedCount = todaysAppointments.filter(
      (a) => a.status === 'SCHEDULED' || a.status === 'RESCHEDULED',
    ).length;
    const cancelledCount = todaysAppointments.filter(
      (a) => a.status === 'CANCELLED',
    ).length;
    const completedCount = todaysAppointments.filter(
      (a) => a.status === 'COMPLETED',
    ).length;

    // -------------------------
    // 2️⃣ Revenue
    // -------------------------
    const paymentWhere: any = {
      isAmountPaid: true,
      appointments: {
        some: {
          appointmentDate: { gte, lte },
          ...(hospitalId ? { hospitalId } : {}),
          ...(doctorId ? { DoctorId: doctorId } : {}),
          ...(specializationId ? { SpecializationId: specializationId } : {}),
        },
      },
    };

    const selectedRevenue = await this.prisma.paymentHistory.aggregate({
      _sum: { AppointmentChargesPaid: true },
      where: paymentWhere,
    });

    // 📆 Previous range for comparison
    const diffMs = lte.getTime() - gte.getTime();
    const previousStart = new Date(gte.getTime() - diffMs - 1);
    const previousEnd = new Date(gte.getTime() - 1);

    const previousRangeWhere = {
      isAmountPaid: true,
      appointments: {
        some: {
          appointmentDate: { gte: previousStart, lte: previousEnd },
          ...(hospitalId ? { hospitalId } : {}),
          ...(doctorId ? { DoctorId: doctorId } : {}),
          ...(specializationId ? { SpecializationId: specializationId } : {}),
        },
      },
    };

    const previousRangeRevenue = await this.prisma.paymentHistory.aggregate({
      _sum: { AppointmentChargesPaid: true },
      where: previousRangeWhere,
    });

    const dateRangeGrowth = previousRangeRevenue._sum.AppointmentChargesPaid
      ? (((selectedRevenue._sum.AppointmentChargesPaid || 0) -
          (previousRangeRevenue._sum.AppointmentChargesPaid || 0)) /
          previousRangeRevenue._sum.AppointmentChargesPaid) *
        100
      : 0;

    // -------------------------
    // 3️⃣ Consultation Completion %
    // -------------------------
    const completedAppointments = await this.prisma.appointment.count({
      where: { ...appointmentWhere, status: 'COMPLETED' },
    });
    const totalAppointments = await this.prisma.appointment.count({
      where: appointmentWhere,
    });
    const completionRate = totalAppointments
      ? (completedAppointments / totalAppointments) * 100
      : 0;

    // -------------------------
    // 4️⃣ Appointment Trends
    // -------------------------
    const trends = await this.prisma.$queryRawUnsafe(
      `
    SELECT 
      TO_CHAR(DATE("appointmentDate"), 'YYYY-MM-DD') as date,
      COUNT(*) as count
    FROM "Appointment"
    WHERE "appointmentDate" BETWEEN $1 AND $2
      ${hospitalId ? `AND "hospitalId" = ${hospitalId}` : ''}
      ${doctorId ? `AND "DoctorId" = ${doctorId}` : ''}
    GROUP BY DATE("appointmentDate")
    ORDER BY date ASC;
    `,
      gte,
      lte,
    );

    // -------------------------
    // 5️⃣ Top Specializations
    // -------------------------
    const consultationsWithSpecialization =
      await this.prisma.consultation.findMany({
        where: {
          consultationStatus: 'COMPLETED',
          consultationEndDateTime: { not: null },
          appointment: {
            appointmentDate: { gte, lte }, // ✅ use appointment date only
            ...(hospitalId ? { hospitalId } : {}),
            ...(doctorId ? { DoctorId: doctorId } : {}),
            ...(specializationId ? { SpecializationId: specializationId } : {}),
          },
        },
        select: {
          appointment: {
            select: {
              doctor: {
                select: {
                  Specialization: {
                    select: {
                      SpecializationId: true,
                      SpecializationName: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

    const specializationCounts = consultationsWithSpecialization.reduce(
      (acc, c) => {
        const specId = c.appointment?.doctor.Specialization?.SpecializationId;
        if (specId) acc[specId] = (acc[specId] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    const topSpecializations = Object.entries(specializationCounts)
      .map(([id, count]) => ({
        SpecializationId: Number(id),
        count: count as number,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const specializationDetails = await this.prisma.specialization.findMany({
      where: {
        SpecializationId: {
          in: topSpecializations.map((s) => s.SpecializationId),
        },
      },
      select: { SpecializationId: true, SpecializationName: true },
    });

    const topSpecializationsWithNames = topSpecializations.map((s) => ({
      id: s.SpecializationId,
      name:
        specializationDetails.find(
          (d) => d.SpecializationId === s.SpecializationId,
        )?.SpecializationName || 'Unknown',
      count: s.count,
    }));

    // -------------------------
    // 6️⃣ Doctor Performance
    // -------------------------
    const consultations = await this.prisma.consultation.findMany({
      where: {
        consultationStatus: 'COMPLETED',
        consultationEndDateTime: { not: null },
        appointment: {
          appointmentDate: { gte, lte }, // ✅ use appointment date only
          ...(hospitalId ? { hospitalId } : {}),
          ...(doctorId ? { DoctorId: doctorId } : {}),
          ...(specializationId ? { SpecializationId: specializationId } : {}),
        },
      },
      select: {
        consultationDatTime: true,
        consultationEndDateTime: true,
        appointment: {
          select: {
            DoctorId: true,
            doctor: {
              select: {
                firstName: true,
                lastName: true,
                Specialization: { select: { SpecializationName: true } },
              },
            },
          },
        },
      },
    });

    interface DoctorPerformance {
      name: string;
      specialization: string;
      completed: number;
      totalDuration: number;
    }

    const result: Record<number, DoctorPerformance> = consultations.reduce(
      (acc, c) => {
        if (!c.appointment?.doctor) return acc;
        const docId = c.appointment.DoctorId!;
        const duration =
          (new Date(c.consultationEndDateTime!).getTime() -
            new Date(c.consultationDatTime).getTime()) /
          60000;

        if (!acc[docId]) {
          acc[docId] = {
            name: `${c.appointment.doctor.firstName} ${c.appointment.doctor.lastName}`,
            specialization:
              c.appointment.doctor.Specialization?.SpecializationName ?? 'N/A',
            completed: 0,
            totalDuration: 0,
          };
        }

        acc[docId].completed += 1;
        acc[docId].totalDuration += duration;
        return acc;
      },
      {},
    );

    const performanceList = Object.values(result).map((doc) => ({
      name: doc.name,
      specialization: doc.specialization,
      completed: doc.completed,
      avgMin: (doc.totalDuration / doc.completed).toFixed(1),
    }));

    // -------------------------
    // 7️⃣ Transform BigInts
    // -------------------------
    const transformBigInt = (obj: any): any => {
      if (Array.isArray(obj)) return obj.map(transformBigInt);
      if (obj && typeof obj === 'object')
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, transformBigInt(v)]),
        );
      if (typeof obj === 'bigint') return Number(obj);
      return obj;
    };

    // -------------------------
    // ✅ Final Response
    // -------------------------
    return transformBigInt({
      summaryCards: [
        {
          id: 'appointments',
          title: 'Appointments in Range',
          value: bookedCount + cancelledCount + completedCount,
          subtitle: `Booked ${bookedCount} · Cancelled ${cancelledCount} · Completed ${completedCount}`,
        },
        {
          id: 'revenue',
          title: 'Revenue in Range',
          value: `₹${(
            Number(selectedRevenue._sum.AppointmentChargesPaid) || 0
          ).toLocaleString()}`,
          subtitle: `${dateRangeGrowth >= 0 ? '+' : ''}${dateRangeGrowth.toFixed(
            1,
          )}% vs previous range`,
        },
        {
          id: 'completion',
          title: 'Avg Consultation Completion',
          value: `${completionRate.toFixed(0)}%`,
          subtitle: `Trend: ${
            completionRate >= 84 ? '+' : ''
          }${(completionRate - 84).toFixed(1)}%`,
        },
        {
          id: 'satisfaction',
          title: 'Patient Satisfaction',
          value: '92%',
          subtitle: 'AI Sentiment',
        },
      ],
      appointmentTrends: trends,
      topSpecializations: topSpecializationsWithNames,
      DoctorPerformance: performanceList,
      revenueBreakdown: await this.prisma.paymentHistory.groupBy({
        by: ['paymentTypePaymentTypeId'],
        _sum: { AppointmentChargesPaid: true },
        where: paymentWhere,
      }),
    });
  }

  // dashboard.service.ts
  async getPatientDemographics(filters: {
    startDate?: Date;
    endDate?: Date;
    hospitalId?: number;
    doctorId?: number;
    specializationId?: number;
  }) {
    const { startDate, endDate, hospitalId, doctorId, specializationId } =
      filters;

    /**
     * -------------------------------------------------
     * BUILD PRISMA WHERE CLAUSE (SAFE & CORRECT)
     * -------------------------------------------------
     */
    const andConditions: any[] = [];

    // Date range filter
    if (startDate && endDate) {
      const gte = new Date(startDate);
      const lte = new Date(endDate);
      gte.setHours(0, 0, 0, 0);
      lte.setHours(23, 59, 59, 999);

      andConditions.push({
        appointmentDate: { gte, lte },
      });
    }

    // Hospital filter
    if (hospitalId) {
      andConditions.push({ hospitalId });
    }

    // Doctor filter
    if (doctorId) {
      andConditions.push({ DoctorId: doctorId });
    }

    // Specialization filter (Appointment OR Doctor specialization)
    if (specializationId) {
      andConditions.push({
        OR: [
          { SpecializationId: specializationId },
          {
            doctor: {
              is: {
                SpecializationId: specializationId,
              },
            },
          },
        ],
      });
    }

    const appointmentWhere = andConditions.length ? { AND: andConditions } : {};

    console.dir(
      { getPatientDemographicsWhere: appointmentWhere },
      { depth: null },
    );

    /**
     * -------------------------------------------------
     * FETCH APPOINTMENTS
     * -------------------------------------------------
     */
    const appointments = await this.prisma.appointment.findMany({
      where: appointmentWhere,
      select: {
        AppointmentId: true,
        PatientId: true,
        acuity: true,
        visitTypeId: true,
        visitType: {
          select: { AppointmentTypeName: true },
        },
        fasttrackpatient: true,
        appointmentDate: true,
        patient: {
          select: {
            firstName: true,
            lastName: true,
            gender: true,
            dateOfBirth: true,
          },
        },
      },
      orderBy: { appointmentDate: 'asc' },
    });

    /**
     * -------------------------------------------------
     * NO DATA CASE (IMPORTANT)
     * -------------------------------------------------
     */
    if (!appointments.length) {
      return {
        genderStats: [],
        summary: {
          fastTrack: 0,
          highAcuity: 0,
          newPatients: 0,
          newAppointments: 0,
        },
        list: [],
      };
    }

    /**
     * -------------------------------------------------
     * DEMOGRAPHIC CALCULATIONS
     * -------------------------------------------------
     */
    const maleCount = appointments.filter(
      (a) => a.patient.gender?.toUpperCase() === 'MALE',
    ).length;

    const femaleCount = appointments.filter(
      (a) => a.patient.gender?.toUpperCase() === 'FEMALE',
    ).length;

    const fastTrack = appointments.filter((a) => a.fasttrackpatient).length;

    const highAcuity = appointments.filter((a) => a.acuity === 'HIGH').length;

    const newAppointments = appointments.filter(
      (a) => a.visitTypeId === 1,
    ).length;

    /**
     * -------------------------------------------------
     * NEW VS RETURNING PATIENTS
     * -------------------------------------------------
     */
    const uniquePatientIds = [...new Set(appointments.map((a) => a.PatientId))];

    const earliestAppointmentDate =
      appointments[0]?.appointmentDate ?? new Date();

    const previousAppointments = await this.prisma.appointment.groupBy({
      by: ['PatientId'],
      _count: { _all: true },
      where: {
        PatientId: { in: uniquePatientIds },
        appointmentDate: { lt: earliestAppointmentDate },
      },
    });

    const oldPatientIds = new Set(previousAppointments.map((p) => p.PatientId));

    const newPatients = uniquePatientIds.filter(
      (id) => !oldPatientIds.has(id),
    ).length;

    /**
     * -------------------------------------------------
     * FINAL RESPONSE
     * -------------------------------------------------
     */
    return {
      genderStats: [
        { label: 'Male', value: maleCount },
        { label: 'Female', value: femaleCount },
      ],
      summary: {
        fastTrack,
        highAcuity,
        newPatients,
        newAppointments,
      },
      list: appointments.map((a) => ({
        firstName: a.patient.firstName,
        lastName: a.patient.lastName,
        gender: a.patient.gender,
        visitType: a.visitType.AppointmentTypeName,
        acuity: a.acuity,
      })),
    };
  }

  // Helper — checks if patient is first-time
  private async isNewPatient(patientId: number): Promise<boolean> {
    const count = await this.prisma.appointment.count({
      where: { PatientId: patientId },
    });
    return count === 1;
  }

  // async getAdvancedReport(filters: {
  //   startDate: string;
  //   endDate: string;
  //   doctorId?: number;
  //   hospitalId?: number;
  //   specializationId?: number;
  // }) {
  //   const { startDate, endDate, doctorId, hospitalId, specializationId } =
  //     filters;

  //   const whereClause: any = {
  //     appointmentDate: {
  //       gte: new Date(startDate),
  //       lte: new Date(endDate),
  //     },
  //   };

  //   if (doctorId) whereClause.DoctorId = doctorId;
  //   if (hospitalId) whereClause.hospitalId = hospitalId;
  //   if (specializationId) whereClause.specializationId = specializationId;

  //   // Summary Cards
  //   const totalAppointments = await this.prisma.appointment.count({
  //     where: whereClause,
  //   });

  //   const totalRevenue = await this.prisma.paymentHistory.aggregate({
  //     _sum: { AppointmentChargesPaid: true },
  //     where: {
  //       appointments: {
  //         some: whereClause,
  //       },
  //     },
  //   });

  //   const topSpecialization = await this.prisma.specialization.findFirst({
  //     where: {
  //       Users: {
  //         some: {
  //           DoctorAppointments: {
  //             some: whereClause,
  //           },
  //         },
  //       },
  //     },
  //     orderBy: {
  //       Users: { _count: 'desc' },
  //     },
  //   });

  //   const topDoctor = await this.prisma.user.findFirst({
  //     where: { DoctorAppointments: { some: whereClause } },
  //     orderBy: { DoctorAppointments: { _count: 'desc' } },
  //   });

  //   // ✅ Monthly Revenue Trend (group by month)
  //   const monthlyRevenue = await this.prisma.paymentHistory.groupBy({
  //     by: ['Transaction_DateTime'],
  //     _sum: { AppointmentChargesPaid: true },
  //     where: {
  //       appointments: { some: whereClause },
  //     },
  //   });

  //   // Format monthly revenue data into Month vs Revenue
  //   const monthlyRevenueFormatted = monthlyRevenue.reduce(
  //     (acc, item) => {
  //       const month = new Date(item.Transaction_DateTime).toLocaleString(
  //         'en-US',
  //         {
  //           month: 'short',
  //         },
  //       );
  //       if (!acc[month]) acc[month] = 0;
  //       acc[month] += item._sum.AppointmentChargesPaid || 0;
  //       return acc;
  //     },
  //     {} as Record<string, number>,
  //   );

  //   const trends = Object.entries(monthlyRevenueFormatted).map(
  //     ([month, revenue]) => ({
  //       month,
  //       revenue,
  //     }),
  //   );

  //   // ✅ Doctor Performance (Doctor name vs appointment count)
  //   const doctorPerformanceRaw = await this.prisma.appointment.groupBy({
  //     by: ['DoctorId'],
  //     _count: { _all: true },
  //     where: whereClause,
  //   });

  //   // Get doctor names
  //   const doctorIds = doctorPerformanceRaw.map((d) => d.DoctorId);
  //   const doctors = await this.prisma.user.findMany({
  //     where: { UserId: { in: doctorIds } },
  //     select: { UserId: true, firstName: true, lastName: true },
  //   });

  //   const doctorPerformance = doctorPerformanceRaw.map((d) => {
  //     const doc = doctors.find((doc) => doc.UserId === d.DoctorId);
  //     return {
  //       doctorName: doc ? `Dr. ${doc.firstName} ${doc.lastName}` : 'Unknown',
  //       appointments: d._count._all,
  //     };
  //   });

  //   return {
  //     summaryCards: [
  //       {
  //         id: 'appointments',
  //         title: 'Total Appointments',
  //         value: totalAppointments,
  //       },
  //       {
  //         id: 'revenue',
  //         title: 'Total Revenue',
  //         value: new Intl.NumberFormat('en-IN', {
  //           style: 'currency',
  //           currency: 'INR',
  //           maximumFractionDigits: 2,
  //         }).format(totalRevenue._sum.AppointmentChargesPaid || 0),
  //       },
  //       {
  //         id: 'specialization',
  //         title: 'Top Specialization',
  //         value: topSpecialization?.SpecializationName || 'N/A',
  //       },
  //       {
  //         id: 'doctors',
  //         title: 'Top Performing Doctor',
  //         value: topDoctor
  //           ? `${topDoctor.firstName} ${topDoctor.lastName}`
  //           : 'N/A',
  //       },
  //     ],
  //     trends, // Month vs Revenue
  //     doctorPerformance, // Doctor name vs No. of appointments
  //   };
  // }

  //ScheduledReport

  async getAdvancedReport(filters: {
    startDate?: string;
    endDate?: string;
    doctorId?: number;
    hospitalId?: number;
    specializationId?: number;
    status?: string; // optional, future support
  }) {
    const { startDate, endDate, doctorId, hospitalId, specializationId } =
      filters;

    // -----------------------------
    // 1️⃣ Flexible Date Filter Setup
    // -----------------------------
    const appointmentDateFilter: any = {};

    if (startDate) {
      appointmentDateFilter.gte = new Date(startDate);
      appointmentDateFilter.gte.setHours(0, 0, 0, 0);
    }
    if (endDate) {
      appointmentDateFilter.lte = new Date(endDate);
      appointmentDateFilter.lte.setHours(23, 59, 59, 999);
    }

    // -----------------------------
    // 2️⃣ Base WHERE Clause
    // -----------------------------
    const whereClause: any = {};

    if (Object.keys(appointmentDateFilter).length > 0) {
      whereClause.appointmentDate = appointmentDateFilter;
    }
    if (doctorId) whereClause.DoctorId = Number(doctorId);
    if (hospitalId) whereClause.hospitalId = Number(hospitalId);
    if (specializationId)
      whereClause.SpecializationId = Number(specializationId);

    console.log('🧩 Dynamic whereClause:', whereClause);

    // -----------------------------
    // 3️⃣ Summary Counts
    // -----------------------------
    const totalAppointments = await this.prisma.appointment.count({
      where: whereClause,
    });

    const totalRevenue = await this.prisma.paymentHistory.aggregate({
      _sum: { AppointmentChargesPaid: true },
      where: { appointments: { some: whereClause } },
    });

    // -----------------------------
    // 4️⃣ Top Specialization & Doctor
    // -----------------------------
    const topSpecialization = await this.prisma.specialization.findFirst({
      where: {
        Users: {
          some: { DoctorAppointments: { some: whereClause } },
        },
      },
      orderBy: { Users: { _count: 'desc' } },
    });

    const topDoctor = await this.prisma.user.findFirst({
      where: { DoctorAppointments: { some: whereClause } },
      orderBy: { DoctorAppointments: { _count: 'desc' } },
    });

    // -----------------------------
    // 5️⃣ Date Range Logic
    // -----------------------------
    const safeStart = startDate ? new Date(startDate) : new Date();
    const safeEnd = endDate ? new Date(endDate) : new Date();
    const diffDays = Math.max(1, differenceInDays(safeEnd, safeStart) || 1);

    let groupByField: 'hour' | 'day' | 'week';
    if (diffDays === 1) groupByField = 'hour';
    else if (diffDays <= 7) groupByField = 'day';
    else groupByField = 'week';

    // -----------------------------
    // 6️⃣ Trends (Appointments + Revenue)
    // -----------------------------
    const appointments = await this.prisma.appointment.findMany({
      where: whereClause,
      select: { appointmentDate: true, AppointmentId: true },
    });

    const revenue = await this.prisma.paymentHistory.findMany({
      where: { appointments: { some: whereClause } },
      select: { Transaction_DateTime: true, AppointmentChargesPaid: true },
    });

    const groupAppointments: Record<string, number> = {};
    const groupRevenue: Record<string, number> = {};
    const TZ = 'Asia/Kolkata';

    function bucketLabel(
      dateUTC: Date | string,
      type: 'hour' | 'day' | 'week',
    ) {
      const z = toZonedTime(new Date(dateUTC), TZ);
      if (type === 'hour') return formatInTimeZone(z, TZ, 'HH:00');
      if (type === 'day') return formatInTimeZone(z, TZ, 'dd-MMM');
      const ws = startOfWeek(z, { weekStartsOn: 1 });
      const we = endOfWeek(z, { weekStartsOn: 1 });
      return `Week of ${formatInTimeZone(ws, TZ, 'dd-MMM')} - ${formatInTimeZone(
        we,
        TZ,
        'dd-MMM',
      )}`;
    }

    for (const appt of appointments) {
      const key = bucketLabel(appt.appointmentDate, groupByField);
      groupAppointments[key] = (groupAppointments[key] || 0) + 1;
    }

    for (const pay of revenue) {
      const key = bucketLabel(pay.Transaction_DateTime, groupByField);
      groupRevenue[key] =
        (groupRevenue[key] || 0) + (pay.AppointmentChargesPaid || 0);
    }

    const appointmentTrend = Object.entries(groupAppointments).map(
      ([time, count]) => ({ time, appointments: count }),
    );

    const revenueTrend = Object.entries(groupRevenue).map(([time, value]) => ({
      time,
      revenue: value,
    }));

    // -----------------------------
    // 7️⃣ Doctor Performance (Dynamic)
    // -----------------------------
    const doctorPerformanceRaw = await this.prisma.appointment.groupBy({
      by: ['DoctorId'],
      _count: { _all: true },
      where: {
        ...whereClause,
        NOT: { status: 'CANCELLED' }, // ✅ includes completed, booked, etc.
      },
    });

    const doctorIds = doctorPerformanceRaw.map((d) => d.DoctorId);
    const doctorInfo = doctorIds.length
      ? await this.prisma.user.findMany({
          where: { UserId: { in: doctorIds } },
          select: {
            UserId: true,
            firstName: true,
            lastName: true,
            Specialization: { select: { SpecializationName: true } },
          },
        })
      : [];

    const doctorPerformance = doctorPerformanceRaw.map((d) => {
      const doc = doctorInfo.find((x) => x.UserId === d.DoctorId);
      return {
        name: doc ? `${doc.firstName} ${doc.lastName}` : 'Unknown',
        specialization: doc?.Specialization?.SpecializationName ?? 'N/A',
        completed: d._count._all,
        avgMin: 0,
      };
    });

    console.log('📊 Doctor Performance:', doctorPerformance);

    // -----------------------------
    // 8️⃣ Specialization Performance
    // -----------------------------
    const specializationPerformanceRaw = await this.prisma.appointment.groupBy({
      by: ['SpecializationId'],
      _count: { _all: true },
      where: whereClause,
    });

    const specializationIds = specializationPerformanceRaw
      .map((s) => s.SpecializationId)
      .filter((id): id is number => id !== null);

    const specializationInfo = specializationIds.length
      ? await this.prisma.specialization.findMany({
          where: { SpecializationId: { in: specializationIds } },
          select: { SpecializationId: true, SpecializationName: true },
        })
      : [];

    const specializationRevenue = await this.prisma.paymentHistory.findMany({
      where: { appointments: { some: whereClause } },
      select: {
        AppointmentChargesPaid: true,
        appointments: { select: { SpecializationId: true } },
      },
    });

    const revenueBySpec: Record<number, number> = {};
    for (const payment of specializationRevenue) {
      const specId = payment.appointments[0]?.SpecializationId;
      if (specId) {
        revenueBySpec[specId] =
          (revenueBySpec[specId] || 0) + (payment.AppointmentChargesPaid || 0);
      }
    }

    const specializationPerformance = specializationPerformanceRaw
      .filter((s) => s.SpecializationId !== null)
      .map((s) => {
        const spec = specializationInfo.find(
          (x) => x.SpecializationId === s.SpecializationId,
        );
        return {
          specializationName: spec?.SpecializationName || 'Unknown',
          appointments: s._count._all,
          revenue: new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
          }).format(revenueBySpec[s.SpecializationId!] || 0),
        };
      });

    // -----------------------------
    // 9️⃣ Final Response
    // -----------------------------
    return {
      summaryCards: [
        {
          id: 'appointments',
          title: 'Total Appointments',
          value: totalAppointments,
        },
        {
          id: 'revenue',
          title: 'Total Revenue',
          value: new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
          }).format(totalRevenue._sum.AppointmentChargesPaid || 0),
        },
        {
          id: 'specialization',
          title: 'Top Specialization',
          value: topSpecialization?.SpecializationName || 'N/A',
        },
        {
          id: 'doctor',
          title: 'Top Performing Doctor',
          value: topDoctor
            ? `${topDoctor.firstName} ${topDoctor.lastName}`
            : 'N/A',
        },
      ],
      appointmentTrend: appointmentTrend ?? [],
      revenueTrend: revenueTrend ?? [],
      doctorPerformance: doctorPerformance ?? [],
      specializationPerformance: specializationPerformance ?? [],
    };
  }

  // 🔔 CRON — Runs EVERY DAY at 7 AM IST
  @Cron(CronExpression.EVERY_DAY_AT_7AM, { timeZone: 'Asia/Kolkata' })
  async checkAndSendReports() {
    const now = new Date();

    this.logger.log(`⏰ Scheduler running at ${now.toISOString()}`);

    const isMonday = now.getDay() === 1;
    const isFirstOfMonth = now.getDate() === 1;

    const frequencyConditions: Prisma.ScheduledReportWhereInput[] = [];

    if (isMonday) {
      frequencyConditions.push({
        frequency: 'WEEKLY',
        nextRunAt: { lte: now },
      });
    }

    if (isFirstOfMonth) {
      frequencyConditions.push({
        frequency: 'MONTHLY',
        nextRunAt: { lte: now },
      });
    }

    if (!frequencyConditions.length) {
      this.logger.log('ℹ️ No scheduled reports eligible today');
      return;
    }

    const reports = await this.prisma.scheduledReport.findMany({
      where: {
        AND: [
          { OR: frequencyConditions },
          {
            OR: [{ lastRunAt: null }, { lastRunAt: { lt: now } }],
          },
        ],
      },
    });

    for (const report of reports) {
      await this.processReport(report, now);
    }
  }

  // 🔄 PROCESS SINGLE REPORT
  private async processReport(report: any, now: Date) {
    try {
      const whereClause = this.buildWhereClause(report);

      await this.generateAndSendPDF(report, whereClause);

      const nextRunAt =
        report.frequency === 'WEEKLY'
          ? this.calculateNextWeeklyRun(now)
          : this.calculateNextMonthlyRun(now);

      await this.prisma.scheduledReport.update({
        where: { ScheduledReportId: report.ScheduledReportId },
        data: {
          lastRunAt: now,
          nextRunAt,
        },
      });

      this.logger.log(
        `✅ ${report.frequency} report sent. Next run: ${nextRunAt.toISOString()}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed report ${report.ScheduledReportId}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  // 🗓 NEXT MONDAY 7 AM IST
  private calculateNextWeeklyRun(from: Date): Date {
    const next = new Date(from);
    next.setHours(7, 0, 0, 0);

    const day = next.getDay(); // 0=Sun
    const daysUntilMonday = (8 - day) % 7 || 7;

    next.setDate(next.getDate() + daysUntilMonday);
    return next;
  }

  // 🗓 1ST OF NEXT MONTH 7 AM IST
  private calculateNextMonthlyRun(from: Date): Date {
    const next = new Date(from);
    next.setMonth(next.getMonth() + 1);
    next.setDate(1);
    next.setHours(7, 0, 0, 0);
    return next;
  }

  // 📄 PDF + EMAIL
  private async generateAndSendPDF(report: any, whereClause: any) {
    const sections = await this.fetchReportSections(
      report.reportTypes,
      whereClause,
      report.frequency,
    );

    const hospital = await this.prisma.hospital.findUnique({
      where: { HospitalId: report.HospitalId },
      select: {
        HospitalName: true,
        HospitalCode: true,
        email: true,
        contactNumber: true,
        address: true,
      },
    });

    const html = generateScheduledReportHtml({
      frequency: report.frequency,
      reportTypes: report.reportTypes,
      generatedAt: new Date().toLocaleString(),
      sections,
      hospitalInfo: {
        name: hospital?.HospitalName || '',
        code: hospital?.HospitalCode || '',
        email: hospital?.email || '',
        mobile: hospital?.contactNumber || '',
        Address: hospital?.address || '',
      },
    });

    const pdfBuffer = await generatePdfFromHtml(html);

    const admin = await this.prisma.user.findUnique({
      where: { UserId: report.adminId },
      select: { email: true, firstName: true },
    });

    if (!admin) throw new Error('Admin not found');

    if (!pdfBuffer) {
      await this.mailerService.sendMail(
        admin.email,
        `${report.frequency} Scheduled Report`,
        `<p>Dear ${admin.firstName},</p>
         <p>Report generation failed.</p>`,
      );
      return;
    }

    await this.mailerService.sendMailWithAttachment(
      admin.email,
      `${report.frequency} Scheduled Report`,
      `<p>Dear ${admin.firstName},</p>
       <p>Please find attached your report.</p>`,
      [
        {
          filename: `ScheduledReport_${report.frequency}_${Date.now()}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    );
  }

  private async fetchReportSections(
    reportTypes: string[],
    whereClause: any,
    frequency: string,
  ) {
    const sections: any[] = [];

    // Top Doctors
    if (reportTypes.includes('Top Doctors')) {
      const data = await this.getTopDoctorsGrouped(whereClause, frequency);
      sections.push({
        title:
          frequency === 'Weekly'
            ? 'Day-wise Top Doctors'
            : 'Week-wise Top Doctors',
        type: 'table',
        headers: [
          frequency === 'Weekly' ? 'Day (Date)' : 'Week',
          'Doctor Name',
          'Appointments',
          'Total Revenue (₹)',
        ],
        rows: data.map((d) => [
          d.group,
          d.doctor,
          d.appointments,
          `₹${d.revenue.toLocaleString()}`,
          d.highlight ? 'highlight' : '',
        ]),
      });
    }

    // Revenue Breakdown
    if (reportTypes.includes('Revenue Breakdown')) {
      const { rows, total } = await this.getRevenueGrouped(
        whereClause,
        frequency,
      );
      sections.push({
        title:
          frequency === 'Weekly' ? 'Day-wise Revenue' : 'Week-wise Revenue',
        type: 'table',
        headers: [frequency === 'Weekly' ? 'Day' : 'Week', 'Amount (₹)'],
        rows: [...rows, ['Total', `₹${total.toLocaleString()}`]],
      });
    }

    // Total Appointments
    if (reportTypes.includes('Total Appointments')) {
      const { rows, total } = await this.getAppointmentsGrouped(
        whereClause,
        frequency,
      );
      sections.push({
        title:
          frequency === 'Weekly'
            ? 'Day-wise Appointments'
            : 'Week-wise Appointments',
        type: 'table',
        headers: [frequency === 'Weekly' ? 'Day' : 'Week', 'Appointments'],
        rows: [...rows, ['Total', total]],
      });
    }

    // Top Specialization
    if (reportTypes.includes('Top Specialization')) {
      const data = await this.getTopSpecializationsGrouped(
        whereClause,
        frequency,
      );
      sections.push({
        title:
          frequency === 'Weekly'
            ? 'Day-wise Top Specializations'
            : 'Week-wise Top Specializations',
        type: 'table',
        headers: [
          frequency === 'Weekly' ? 'Day (Date)' : 'Week',
          'Specialization',
          'Appointments',
          'Total Revenue (₹)',
        ],
        rows: data.map((d) => [
          d.group,
          d.specialization,
          d.appointments,
          `₹${d.revenue.toLocaleString()}`,
          d.highlight ? '🌟' : '', // for PDF rendering
        ]),
      });
    }

    return sections;
  }

  private async getTopDoctorsGrouped(whereClause: any, frequency: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: whereClause,
      select: {
        appointmentDate: true,
        doctor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        paymentHistory: {
          select: {
            AppointmentChargesPaid: true,
          },
        },
      },
    });

    const grouped: Record<string, any[]> = {};

    for (const appt of appointments) {
      const date = new Date(appt.appointmentDate);
      const groupLabel =
        frequency === 'Weekly'
          ? `${date.toLocaleDateString('en-US', { weekday: 'long' })} (${date.toLocaleDateString()})`
          : `Week ${Math.ceil(date.getDate() / 7)}`;

      const doctorName = `${appt.doctor.firstName} ${appt.doctor.lastName}`;

      // Sum revenue for this appointment
      // type PaymentHistoryItem = {
      //   AppointmentChargesPaid: number | null;
      // };

      // type Appointment = {
      //   paymentHistory?: PaymentHistoryItem | PaymentHistoryItem[] | null;
      // };

      type PaymentHistoryItem = {
        AppointmentChargesPaid: number | null;
      };

      const historyArray: PaymentHistoryItem[] = Array.isArray(
        appt.paymentHistory,
      )
        ? appt.paymentHistory
        : appt.paymentHistory
          ? [appt.paymentHistory]
          : [];

      const revenue = historyArray.reduce(
        (sum, ph) => sum + (ph.AppointmentChargesPaid ?? 0),
        0,
      );

      if (!grouped[groupLabel]) grouped[groupLabel] = [];

      // Check if doctor already exists in this group
      const existing = grouped[groupLabel].find((d) => d.doctor === doctorName);
      if (existing) {
        existing.appointments += 1;
        existing.revenue += revenue;
      } else {
        grouped[groupLabel].push({
          doctor: doctorName,
          appointments: 1,
          revenue,
        });
      }
    }

    // Sort and mark top 3
    const rows: any[] = [];
    for (const groupLabel of Object.keys(grouped)) {
      const sorted = grouped[groupLabel]?.sort(
        (a, b) => b.appointments - a.appointments,
      );
      sorted?.forEach((d, idx) => {
        rows.push({
          group: groupLabel,
          doctor: d.doctor,
          appointments: d.appointments,
          revenue: d.revenue,
          '🌟': idx < 3, // top 3 get light green
        });
      });
    }

    return rows;
  }

  private async getTopSpecializationsGrouped(
    whereClause: any,
    frequency: string,
  ) {
    const results = await this.prisma.appointment.findMany({
      where: whereClause,
      select: {
        appointmentDate: true,
        doctor: {
          select: {
            firstName: true,
            lastName: true,
            Specialization: true,
          },
        },
        paymentHistory: {
          select: {
            AppointmentChargesPaid: true,
          },
        },
      },
    });

    // Map for grouping by day/week
    const grouped: Record<string, any[]> = {};

    for (const r of results) {
      const date = new Date(r.appointmentDate);
      const groupLabel =
        frequency === 'Weekly'
          ? `${date.toLocaleDateString('en-US', { weekday: 'long' })} (${date.toLocaleDateString()})`
          : `Week ${Math.ceil(date.getDate() / 7)}`;

      if (!grouped[groupLabel]) grouped[groupLabel] = [];

      // Normalize paymentHistory to always be an array
      // Ensure historyArray is typed as array of objects with number|null
      type PaymentHistoryItem = { AppointmentChargesPaid: number | null };

      const historyArray: PaymentHistoryItem[] = Array.isArray(r.paymentHistory)
        ? r.paymentHistory
        : r.paymentHistory
          ? [r.paymentHistory]
          : [];

      const revenue = historyArray.reduce(
        (sum: number, ph) => sum + (ph.AppointmentChargesPaid ?? 0),
        0,
      );

      grouped[groupLabel].push({
        specialization: `${r.doctor.Specialization?.SpecializationName ?? ''}`,
        appointments: 1, // each findMany row is one appointment
        revenue,
      });
    }

    // Aggregate per doctor per group
    const aggregated: Record<string, any[]> = {};

    for (const [groupLabel, entries] of Object.entries(grouped)) {
      const map: Record<string, { appointments: number; revenue: number }> = {};

      for (const e of entries) {
        const spec = e.specialization ?? 'Unknown';
        if (!map[spec]) {
          map[spec] = { appointments: 0, revenue: 0 };
        }
        const current = map[spec]; // <-- now TypeScript knows it's defined
        current.appointments += e.appointments || 0;
        current.revenue += e.revenue || 0;
      }

      aggregated[groupLabel] = Object.entries(map).map(
        ([specialization, stats]) => ({
          specialization,
          appointments: stats.appointments,
          revenue: stats.revenue,
        }),
      );
    }

    // Sort & mark top 3
    const rows: any[] = [];
    for (const groupLabel of Object.keys(aggregated)) {
      const sorted = aggregated[groupLabel]?.sort(
        (a, b) => b.appointments - a.appointments,
      );
      sorted?.forEach((s, idx) => {
        rows.push({
          group: groupLabel,
          specialization: s.specialization,
          appointments: s.appointments,
          revenue: s.revenue,
          '🌟': idx < 3, // highlight top 3
        });
      });
    }

    return rows;
  }

  private async getRevenueGrouped(whereClause: any, frequency: string) {
    const revenueData = await this.prisma.paymentHistory.findMany({
      where: whereClause,
      select: {
        AppointmentChargesPaid: true,
        Transaction_DateTime: true,
      },
    });

    if (frequency === 'Weekly') {
      // Group by day
      const daysMap: Record<string, number> = {};
      for (const r of revenueData) {
        const dayLabel = `${r.Transaction_DateTime.toLocaleDateString('en-US', { weekday: 'long' })} (${r.Transaction_DateTime.toLocaleDateString()})`;
        daysMap[dayLabel] =
          (daysMap[dayLabel] || 0) + (r?.AppointmentChargesPaid ?? 0);
      }
      const rows = Object.entries(daysMap).map(([day, amount]) => [
        day,
        `₹${amount.toLocaleString()}`,
      ]);
      const total = Object.values(daysMap).reduce((sum, a) => sum + a, 0);
      return { rows, total };
    } else {
      // Group by week number of month
      const weeksMap: Record<string, number> = {};
      for (const r of revenueData) {
        const weekNumber = Math.ceil(r.Transaction_DateTime.getDate() / 7);
        const label = `Week ${weekNumber}`;
        weeksMap[label] =
          (weeksMap[label] || 0) + (r.AppointmentChargesPaid ?? 0);
      }
      const rows = Object.entries(weeksMap).map(([week, amount]) => [
        week,
        `₹${amount.toLocaleString()}`,
      ]);
      const total = Object.values(weeksMap).reduce((sum, a) => sum + a, 0);
      return { rows, total };
    }
  }

  private async getAppointmentsGrouped(whereClause: any, frequency: string) {
    const appointmentData = await this.prisma.appointment.findMany({
      where: whereClause,
      select: { appointmentDate: true },
    });

    if (frequency === 'Weekly') {
      const daysMap: Record<string, number> = {};
      for (const a of appointmentData) {
        const dayLabel = `${a.appointmentDate.toLocaleDateString('en-US', { weekday: 'long' })} (${a.appointmentDate.toLocaleDateString()})`;
        daysMap[dayLabel] = (daysMap[dayLabel] || 0) + 1;
      }
      const rows = Object.entries(daysMap).map(([day, count]) => [day, count]);
      const total = Object.values(daysMap).reduce((sum, c) => sum + c, 0);
      return { rows, total };
    } else {
      const weeksMap: Record<string, number> = {};
      for (const a of appointmentData) {
        const weekNumber = Math.ceil(a.appointmentDate.getDate() / 7);
        const label = `Week ${weekNumber}`;
        weeksMap[label] = (weeksMap[label] || 0) + 1;
      }
      const rows = Object.entries(weeksMap).map(([week, count]) => [
        week,
        count,
      ]);
      const total = Object.values(weeksMap).reduce((sum, c) => sum + c, 0);
      return { rows, total };
    }
  }

  private buildWhereClause(report: any) {
    const where: any = {};

    // Example: filter by date range
    if (report.startDate && report.endDate) {
      where.appointmentDate = {
        gte: new Date(report.startDate),
        lte: new Date(report.endDate),
      };
    }

    // Example: filter by hospital
    if (report.hospitalId) {
      where.HospitalId = report.hospitalId;
    }

    return where;
  }

  async getReportsSchedularByAdminHospital(
    adminId: number,
    hospitalId: number,
  ) {
    return this.prisma.scheduledReport.findMany({
      where: {
        adminId,
        HospitalId: hospitalId,
      },
      select: {
        ScheduledReportId: true,
        adminId: true,
        HospitalId: true,
        frequency: true,
        reportTypes: true,
      },
      orderBy: {
        frequency: 'asc', // optional: keeps Weekly before Monthly
      },
    });
  }

  async getAllHospital() {
    return this.prisma.hospital.findMany({
      orderBy: { HospitalId: 'asc' },
    });
  }
}
