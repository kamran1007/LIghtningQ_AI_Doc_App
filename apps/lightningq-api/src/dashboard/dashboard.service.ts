import {
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/common/mailer/mailer.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { generateScheduledReportHtml } from 'src/utils/scheduled-report-html';
import { generatePdfFromHtml } from 'src/utils/pdf-generator.util';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async getDashboardSummary(filters: {
    startDate?: Date;
    endDate?: Date;
    hospitalId?: number;
    doctorId?: number;
  }) {
    const { startDate, endDate, hospitalId, doctorId } = filters;

    // Common appointment filter
    const appointmentWhere: any = {};
    if (startDate && endDate) {
      appointmentWhere.appointmentDate = { gte: startDate, lte: endDate };
    }
    if (hospitalId) {
      appointmentWhere.HospitalId = hospitalId;
    }
    if (doctorId) {
      appointmentWhere.DoctorId = doctorId;
    }

    // Common consultation filter
    const consultationWhere: any = {
      IsconsultationCompleted: true,
      consultationEndDateTime: { not: null },
    };
    if (startDate && endDate) {
      consultationWhere.consultationDatTime = { gte: startDate, lte: endDate };
    }
    if (doctorId) {
      consultationWhere.appointment = {
        ...(consultationWhere.appointment || {}),
        DoctorId: doctorId,
      };
    }
    if (hospitalId) {
      consultationWhere.appointment = {
        ...(consultationWhere.appointment || {}),
        HospitalId: hospitalId,
      };
    }

    // 1. Appointments count
    const todaysAppointments = await this.prisma.appointment.findMany({
      where: appointmentWhere,
      select: { status: true },
    });

    const bookedCount = todaysAppointments.filter(
      (a) => a.status === 'SCHEDULED',
    ).length;
    const cancelledCount = todaysAppointments.filter(
      (a) => a.status === 'CANCELLED',
    ).length;
    const completedCount = todaysAppointments.filter(
      (a) => a.status === 'COMPLETED',
    ).length;

    // 2. Revenue
    const paymentWhere: any = {};
    if (startDate && endDate) {
      paymentWhere.Transaction_DateTime = { gte: startDate, lte: endDate };
    }
    if (hospitalId || doctorId) {
      paymentWhere.appointment = {};
      if (hospitalId) paymentWhere.appointment.HospitalId = hospitalId;
      if (doctorId) paymentWhere.appointment.DoctorId = doctorId;
    }

    const monthlyRevenue = await this.prisma.paymentHistory.aggregate({
      _sum: { AppointmentChargesPaid: true },
      where: paymentWhere,
    });

    const lastMonthRevenue = await this.prisma.paymentHistory.aggregate({
      _sum: { AppointmentChargesPaid: true },
      where: {
        ...paymentWhere,
        Transaction_DateTime: {
          gte: startOfMonth(subMonths(new Date(), 1)),
          lte: endOfMonth(subMonths(new Date(), 1)),
        },
      },
    });

    const monthlyGrowth = lastMonthRevenue._sum.AppointmentChargesPaid
      ? (((monthlyRevenue._sum.AppointmentChargesPaid || 0) -
          (lastMonthRevenue._sum.AppointmentChargesPaid || 0)) /
          lastMonthRevenue._sum.AppointmentChargesPaid) *
        100
      : 0;

    // 3. Completion rate
    const completedAppointments = await this.prisma.appointment.count({
      where: { ...appointmentWhere, status: 'COMPLETED' },
    });
    const totalAppointments = await this.prisma.appointment.count({
      where: appointmentWhere,
    });
    const completionRate = totalAppointments
      ? (completedAppointments / totalAppointments) * 100
      : 0;

    // 4. Trends (raw SQL with filters)
    const trends = await this.prisma.$queryRawUnsafe<
      { date: string; count: number }[]
    >(
      `
      SELECT DATE("appointmentDate") as date, COUNT(*) as count
      FROM "Appointment"
      WHERE "appointmentDate" >= CURRENT_DATE - INTERVAL '6 days'
      ${hospitalId ? `AND "HospitalId" = ${hospitalId}` : ''}
      ${doctorId ? `AND "DoctorId" = ${doctorId}` : ''}
      GROUP BY DATE("appointmentDate")
      ORDER BY date ASC
    `,
    );

    // 5. Top Specializations
    const consultationsWithSpecialization =
      await this.prisma.consultation.findMany({
        where: consultationWhere,
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
        if (specId) {
          acc[specId] = (acc[specId] || 0) + 1;
        }
        return acc;
      },
      {} as Record<number, number>,
    );

    const topSpecializations = Object.entries(specializationCounts)
      .map(([id, count]) => ({ SpecializationId: Number(id), count }))
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

    // 6. Doctor Performance
    const consultations = await this.prisma.consultation.findMany({
      where: consultationWhere,
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
            specialist: { select: { Specialization: true } },
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

    const result = consultations.reduce<Record<number, DoctorPerformance>>(
      (acc, c) => {
        if (!c.appointment?.doctor) return acc;

        const docId = c.appointment.DoctorId;
        const duration =
          (new Date(c.consultationEndDateTime!).getTime() -
            new Date(c.consultationDatTime).getTime()) /
          60000;

        if (!acc[docId]) {
          acc[docId] = {
            name: `${c.appointment.doctor.firstName} ${c.appointment.doctor.lastName}`,
            completed: 0,
            totalDuration: 0,
            specialization:
              c.appointment.doctor.Specialization?.SpecializationName ?? 'N/A',
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

    function transformBigInt(obj: any): any {
      if (Array.isArray(obj)) {
        return obj.map(transformBigInt);
      } else if (obj && typeof obj === 'object') {
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [
            key,
            transformBigInt(value),
          ]),
        );
      } else if (typeof obj === 'bigint') {
        return Number(obj); // ✅ fixed: use obj, not value
      }
      return obj;
    }

    // Final response
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
          value: `$${(Number(monthlyRevenue._sum.AppointmentChargesPaid) || 0).toLocaleString()}`,
          subtitle: `${monthlyGrowth >= 0 ? '+' : ''}${monthlyGrowth.toFixed(1)}% vs last period`,
        },
        {
          id: 'completion',
          title: 'Avg Consultation Completion',
          value: `${completionRate.toFixed(0)}%`,
          subtitle: `Trend: ${completionRate >= 84 ? '+' : ''}${(completionRate - 84).toFixed(1)}%`,
        },
        {
          id: 'satisfaction',
          title: 'Patient Satisfaction',
          value: `92%`,
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
  }) {
    const { startDate, endDate, hospitalId, doctorId } = filters;

    // Fetch appointments for today with patient info
    const appointmentWhere: any = {};
    if (startDate && endDate) {
      appointmentWhere.appointmentDate = { gte: startDate, lte: endDate };
    }
    if (hospitalId) {
      appointmentWhere.HospitalId = hospitalId;
    }
    if (doctorId) {
      appointmentWhere.DoctorId = doctorId;
    }
    const appointments = await this.prisma.appointment.findMany({
      where: appointmentWhere,

      select: {
        PatientId: true,
        acuity: true,
        visitType: { select: { AppointmentTypeName: true } },
        patient: {
          select: {
            firstName: true,
            lastName: true,
            gender: true,
            dateOfBirth: true,
          },
        },
      },
    });

    // Build demographic stats
    const total = appointments.length;
    const maleCount = appointments.filter(
      (a) => a.patient.gender === 'MALE',
    ).length;
    const femaleCount = appointments.filter(
      (a) => a.patient.gender === 'FEMALE',
    ).length;
    const fastTrack = appointments.filter(
      (a) => a.visitType.AppointmentTypeName === 'Fast Track',
    ).length;
    const highAcuity = appointments.filter((a) => a.acuity === 'HIGH').length;
    const newPatients = appointments.filter((a) => {
      // Example: define "new patient" as no previous appointments
      return a.patient && a.patient.firstName && this.isNewPatient(a.PatientId);
    }).length;

    return {
      genderStats: [
        { label: 'Male', value: maleCount },
        { label: 'Female', value: femaleCount },
      ],
      summary: {
        fastTrack,
        highAcuity,
        newPatients,
        newAppointments: total,
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

  async getAdvancedReport(filters: {
    startDate: string;
    endDate: string;
    doctorId?: number;
    hospitalId?: number;
    specializationId?: number;
  }) {
    const { startDate, endDate, doctorId, hospitalId, specializationId } =
      filters;

    const whereClause: any = {
      appointmentDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    };

    if (doctorId) whereClause.doctorId = doctorId;
    if (hospitalId) whereClause.hospitalId = hospitalId;
    if (specializationId) whereClause.specializationId = specializationId;

    // Summary Cards
    const totalAppointments = await this.prisma.appointment.count({
      where: whereClause,
    });

    const totalRevenue = await this.prisma.paymentHistory.aggregate({
      _sum: { AppointmentChargesPaid: true },
      where: {
        appointments: {
          some: whereClause, // filter by related Appointment fields
        },
      },
    });

    const topSpecialization = await this.prisma.specialization.findFirst({
      where: {
        Users: {
          some: {
            DoctorAppointments: {
              // assuming User has DoctorAppointments relation
              some: whereClause, // filters like date, hospitalId, etc.
            },
          },
        },
      },
      orderBy: {
        Users: {
          _count: 'desc',
        },
      },
      include: {
        Users: {
          select: {
            DoctorAppointments: {
              where: whereClause,
              select: { AppointmentId: true },
            },
          },
        },
      },
    });

    const topDoctor = await this.prisma.user.findFirst({
      where: { DoctorAppointments: { some: whereClause } },
      orderBy: { DoctorAppointments: { _count: 'desc' } },
    });

    // Trends (monthly)
    const trends = await this.prisma.appointment.groupBy({
      by: ['appointmentDate'],
      _count: { _all: true },
      where: whereClause,
    });

    // Doctor Performance
    const doctorPerformance = await this.prisma.appointment.groupBy({
      by: ['DoctorId'],
      _count: { _all: true },
      where: whereClause,
    });

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
          value: totalRevenue._sum.AppointmentChargesPaid || 0,
        },
        {
          id: 'specialization',
          title: 'Top Specialization',
          value: topSpecialization?.SpecializationName || 'N/A',
        },
        {
          id: 'doctors',
          title: 'Top Performing Doctor',
          value: topDoctor
            ? `${topDoctor.firstName} ${topDoctor.lastName}`
            : 'N/A',
        },
      ],
      trends,
      doctorPerformance,
    };
  }

  //ScheduledReport
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Cron('*/1 * * * *')
  async checkAndSendReports() {
    const today = new Date();
    // const dueReports = await this.prisma.scheduledReport.findMany({
    //   where: {
    //     nextRunAt: { lte: today },
    //   },
    // });
    const dueReports = await this.prisma.scheduledReport.findMany({
      where: {
        nextRunAt: { lte: today },
        OR: [{ lastRunAt: null }, { lastRunAt: { lt: today } }],
      },
    });

    for (const report of dueReports) {
      const whereClause = this.buildWhereClause(report); // 👈 build filters from report config

      await this.generateAndSendPDF(report, whereClause);
      await this.prisma.scheduledReport.update({
        where: { ScheduledReportId: report.ScheduledReportId },
        data: {
          lastRunAt: today,
          nextRunAt: this.calculateNextRun(report.frequency),
        },
      });
    }
  }
  private calculateNextRun(frequency: string): Date {
    const now = new Date();
    if (frequency === 'Weekly') {
      now.setDate(now.getDate() + (7 - now.getDay())); // next Monday
    } else {
      now.setMonth(now.getMonth() + 1, 1); // first day of next month
    }
    return now;
  }

  private async generateAndSendPDF(report: any, whereClause: any) {
    // 1. Get data for report sections
    const sections = await this.fetchReportSections(
      report.reportTypes,
      whereClause,
      report.frequency,
    );

    const hospitalInfo = await this.prisma.hospital.findUnique({
      where: { HospitalId: report.HospitalId },
      select: {
        HospitalName: true,
        HospitalCode: true,
        email: true,
        contactNumber: true,
        address: true
      },
    });

    // 2. Generate HTML
    const html = generateScheduledReportHtml({
      frequency: report.frequency,
      reportTypes: report.reportTypes,
      generatedAt: new Date().toLocaleString(),
      sections,
      hospitalInfo: {
        name: hospitalInfo?.HospitalName || '',
        code: hospitalInfo?.HospitalCode || '',
        email: hospitalInfo?.email || '',
        mobile: hospitalInfo?.contactNumber || '',
        Address:hospitalInfo?.address || '',
      },
    });

    // 3. Convert to PDF
    const pdfBuffer = await generatePdfFromHtml(html);

    // 4. Get admin email
    const admin = await this.prisma.user.findUnique({
      where: { UserId: report.adminId },
      select: { email: true, firstName: true },
    });

    if (!admin) throw new Error(`Admin with ID ${report.adminId} not found`);

    // 5. Send email
    await this.mailerService.sendMailWithAttachment(
      admin.email,
      `${report.frequency} Scheduled Report`,
      `<p>Dear ${admin.firstName},</p>
     <p>Please find attached your ${report.frequency.toLowerCase()} scheduled report.</p>
     <p>Best regards,<br/>LightningQ Team</p>`,
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

      const historyArray = Array.isArray(appt.paymentHistory)
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

      // Calculate revenue from paymentHistory array
      const historyArray = Array.isArray(r.paymentHistory)
        ? r.paymentHistory
        : r.paymentHistory
          ? [r.paymentHistory]
          : [];

      const revenue = historyArray.reduce(
        (sum, ph) => sum + (ph.AppointmentChargesPaid ?? 0),
        0,
      );

      grouped[groupLabel].push({
        specialization: `${r.doctor.Specialization?.SpecializationName}`,
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
      select: { createdAt: true },
    });

    if (frequency === 'Weekly') {
      const daysMap: Record<string, number> = {};
      for (const a of appointmentData) {
        const dayLabel = `${a.createdAt.toLocaleDateString('en-US', { weekday: 'long' })} (${a.createdAt.toLocaleDateString()})`;
        daysMap[dayLabel] = (daysMap[dayLabel] || 0) + 1;
      }
      const rows = Object.entries(daysMap).map(([day, count]) => [day, count]);
      const total = Object.values(daysMap).reduce((sum, c) => sum + c, 0);
      return { rows, total };
    } else {
      const weeksMap: Record<string, number> = {};
      for (const a of appointmentData) {
        const weekNumber = Math.ceil(a.createdAt.getDate() / 7);
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
}
