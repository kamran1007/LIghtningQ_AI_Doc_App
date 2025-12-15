import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOrUpdateBillingItemChargeDto } from './dto/create-billing-item-charge.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePatientPackageUsageDto } from './dto/create-patient-package-usage.dto';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(private prisma: PrismaService) {}

  async createUpdateBillingItemCharge(dto: CreateOrUpdateBillingItemChargeDto) {
    const {
      BillingItemChargeId,
      BillingItemName,
      code,
      description,
      price,
      hospitalId,
      specializationId,
      chargeTypeId,
      appointmentTypeId,
      investigationTypeId,
      maxDiscountPercent,
      maxDiscountInr,
      isActive = true,
      createdBy,
      // 🩺 New Consultation Fields
      walkinPrice,
      telePrice,
      fastTrackCharges,
      numberOfFollowups,
      followupValidity,
      doctorId,
    } = dto;

    // Prepare the data object once for both create and update
    const data = {
      BillingItemName,
      code,
      description,
      price,
      hospitalId,
      specializationId,
      chargeTypeId,
      appointmentTypeId,
      investigationTypeId,
      maxDiscountPercent,
      maxDiscountInr,
      isActive,
      walkinPrice,
      telePrice,
      fastTrackCharges,
      numberOfFollowups,
      followupValidity,
      doctorId,
    };

    if (BillingItemChargeId) {
      // 🟡 Update existing record
      return this.prisma.billingItemCharge.update({
        where: { BillingItemChargeId },
        data: {
          ...data,
          updatedBy: createdBy ?? null,
        },
      });
    } else {
      // 🟢 Create new record
      return this.prisma.billingItemCharge.create({
        data: {
          ...data,
          createdBy: createdBy ?? null,
          updatedAt: new Date(), // ⭐ REQUIRED
        },
      });
    }
  }

  async getBillItem(params: {
    hospitalId?: number;
    page?: number;
    limit?: number;
    chargeType?: string;
    BillingItemName?: string;
    doctorId?: number; // ⭐ NEW
  }) {
    const {
      hospitalId,
      page = 1,
      limit = 10,
      chargeType,
      BillingItemName,
      doctorId, // ⭐ NEW
    } = params;

    const where: any = {
      isActive: true,
    };

    if (hospitalId) where.hospitalId = hospitalId;

    if (doctorId) where.doctorId = doctorId; // ⭐ NEW — simple and correct

    if (chargeType)
      where.chargeType = {
        BillItemTypeName: {
          equals: chargeType,
          mode: 'insensitive',
        },
      };

    if (BillingItemName)
      where.BillingItemName = {
        contains: BillingItemName,
        mode: 'insensitive',
      };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.billingItemCharge.findMany({
        where,
        include: {
          chargeType: true,
          Specialization: true,
          AppointmentType: true,
          User_BillingItemCharge_createdByToUser: true,
          Hospital: true,
          User_BillingItemCharge_doctorIdToUser: true,
          InvestigationType: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.billingItemCharge.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 🗑️ DELETE (Soft Delete)
  async deleteBillingItemCharge(id: number, deletedBy?: number) {
    const existing = await this.prisma.billingItemCharge.findUnique({
      where: { BillingItemChargeId: id },
    });

    if (!existing) {
      throw new NotFoundException(`BillingItemCharge with ID ${id} not found`);
    }

    // Soft delete: just mark as inactive
    return this.prisma.billingItemCharge.update({
      where: { BillingItemChargeId: id },
      data: {
        isActive: false,
        updatedBy: deletedBy ?? null,
      },
    });
  }

  // 🧮 Financial year helper (April–March)
  private getFinancialYear(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    // Example: April 2025 -> FY 2025-26
    return month >= 4
      ? `${year}-${String(year + 1).slice(-2)}`
      : `${year - 1}-${String(year).slice(-2)}`;
  }

  // 🧾 Generate invoice number (FY + HospitalCode + OP + padded sequence)
  private async generateInvoiceNumber(
    tx: any,
    hospitalId: number,
    hospitalCode: string,
  ): Promise<string> {
    const fy = this.getFinancialYear();

    const startOfFY = new Date(`${fy.split('-')[0]}-04-01`);
    const endOfFY = new Date(
      `${parseInt(fy.split('-')[1] ?? '25') + 2000}-03-31`,
    );

    // Count how many invoices were generated in this financial year
    const count = await tx.billingTransaction.count({
      where: {
        hospitalId,
        billDate: { gte: startOfFY, lte: endOfFY },
      },
    });

    const nextNo = String(count + 1).padStart(7, '0');
    // ✅ Example: 2025-26YMLOP0000001
    return `${fy}${hospitalCode}OP${nextNo}`;
  }

  // ✅ Auto determine paymentStatus based on net & paid
  private determinePaymentStatus(amountPaid: number, netAmount: number) {
    if (amountPaid === 0) return 'unpaid';
    if (amountPaid < netAmount) return 'partial';
    if (amountPaid >= netAmount) return 'paid';
    return 'unpaid';
  }
  private generateReceiptNumberByBillId(
    billingTransactionId: number,
    hospitalCode: string,
  ): string {
    const fy = this.getFinancialYear();
    const nextNo = String(billingTransactionId).padStart(7, '0');
    return `${fy}${hospitalCode}RBOP${nextNo}`;
  }

  private generateReceiptNo(
    billingPaymentId: number,
    hospitalCode: string,
    type: 'OP' | 'IP',
  ) {
    const financialYear = this.getFinancialYear();
    const padded = String(billingPaymentId).padStart(6, '0');

    return `${financialYear}${hospitalCode}R${type}${padded}`;
  }

  async createOrUpdateBilling(data: any, userId: number) {
    data.billingTransactionId =
      data.billingTransactionId ?? data.BillingTransactionId ?? null;

    const isEdit = !!data.billingTransactionId;

    // --------------------------------------------------------
    // 1️⃣ FAST TRANSACTION - Only writes, no heavy reads
    // --------------------------------------------------------
    const billingId = await this.prisma.$transaction(async (tx) => {
      let billing;

      // ----------------------
      // CREATE MODE
      // ----------------------
      if (!isEdit) {
        const hospital = await tx.hospital.findUnique({
          where: { HospitalId: data.hospitalId },
        });
        if (!hospital) throw new NotFoundException('Hospital not found');

        const hospitalCode = hospital.HospitalCode || 'HOS';

        const OPInvoiceNo = await this.generateInvoiceNumber(
          tx,
          data.hospitalId,
          hospitalCode,
        );

        const paymentStatusName = this.determinePaymentStatus(
          data.amountPaid,
          data.netAmount,
        );

        const paymentStatus = await tx.paymentStatus.findFirst({
          where: { StatusName: paymentStatusName },
        });

        const billStatus = await tx.billStatus.findFirst({
          where: { StatusName: 'Finalized' },
        });

        billing = await tx.billingTransaction.create({
          data: {
            OPInvoiceNo,
            billDate: new Date(),
            patientId: data.patientId,
            appointmentId: data.appointmentId,
            hospitalId: data.hospitalId,
            organizationId: data.organizationId,
            doctorId: data.doctorId,
            createdBy: userId,
            subtotal: data.subtotal,
            totalDiscount: data.totalDiscount,
            totalTax: data.totalTax,
            overallDiscountType: data.overallDiscountType,
            overallDiscountValue: data.overallDiscountValue,
            netAmount: data.netAmount,
            amountPaid: data.amountPaid,
            balanceDue: data.netAmount - data.amountPaid,
            remarks: data.remarks,
            billStatusId: data.billStatusId ?? undefined,
            paymentStatusId: data.PaymentStatusId ?? undefined,
            updatedAt: new Date(),
          },
        });
      }

      // ----------------------
      // UPDATE MODE
      // ----------------------
      else {
        billing = await tx.billingTransaction.update({
          where: { BillingTransactionId: data.billingTransactionId },
          data: {
            patientId: data.patientId,
            appointmentId: data.appointmentId,
            hospitalId: data.hospitalId,
            organizationId: data.organizationId,
            doctorId: data.doctorId,
            subtotal: data.subtotal,
            totalDiscount: data.totalDiscount,
            totalTax: data.totalTax,
            overallDiscountType: data.overallDiscountType,
            overallDiscountValue: data.overallDiscountValue,
            netAmount: data.netAmount,
            amountPaid: data.amountPaid,
            balanceDue: data.netAmount - data.amountPaid,
            remarks: data.remarks,
            billStatusId: data.billStatusId,
            paymentStatusId: data.PaymentStatusId,
          },
        });

        await tx.billingTransactionItem.deleteMany({
          where: { billingTransactionId: billing.BillingTransactionId },
        });
      }

      // ----------------------
      // INSERT ITEMS
      // ----------------------
      if (data.items?.length) {
        await tx.billingTransactionItem.createMany({
          data: data.items.map((item) => ({
            billingTransactionId: billing.BillingTransactionId,
            billingItemChargeId: item.BillingItemChargeId,
            itemName: item.BillingItemName,
            chargeType: item.chargeType || null,
            units: item.quantity || 1,
            price: item.price,
            discountType: item.discountType || 'flat',
            discountValue: item.discountValue || 0,
            discountAmount: item.discount || 0,
            gstType: item.gstType || 'flat',
            gstValue: item.gstValue || 0,
            gstAmount: item.gst || 0,
            totalAmount: item.netAmount,
          })),
        });
      }

      // ----------------------
      // INSERT PAYMENTS
      // ----------------------
      if (data.payments?.length) {
        for (const p of data.payments) {
          const payment = await tx.billingPayment.create({
            data: {
              billingTransactionId: billing.BillingTransactionId,
              paymentMode: p.paymentMode,
              amount: p.amount,
              referenceNumber: p.referenceNumber || null,
              remarks: p.remarks || null,
              createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            },
          });

          const hospital = await tx.hospital.findUnique({
            where: { HospitalId: billing.hospitalId },
          });

          const receipt = this.generateReceiptNo(
            payment.BillingPaymentId,
            hospital?.HospitalCode || 'HOS',
            billing.billType === 'OPD' ? 'OP' : 'IP',
          );

          await tx.billingPayment.update({
            where: { BillingPaymentId: payment.BillingPaymentId },
            data: { PaymentReceptNo: receipt },
          });
        }
      }

      // ----------------------
      // HISTORY
      // ----------------------
      await tx.billingHistory.create({
        data: {
          BillingTransactionId: billing.BillingTransactionId,
          historyType: isEdit ? 'updated' : 'created',
          remarks: isEdit ? 'Bill updated' : 'Bill created',
          snapshot: {},
          createdBy: userId,
        },
      });

      return billing.BillingTransactionId;
    });

    // --------------------------------------------------------
    // 🔁 SECOND TRANSACTION — RESTORES tx (NO LINE REMOVED)
    // --------------------------------------------------------
    if (data.paymentHistory) {
      await this.prisma.$transaction(async (tx) => {
        const paymentHistory = await tx.paymentHistory.create({
          data: {
            TransactionId: Date.now(),
            Transaction_DateTime: new Date(),
            paymentTypePaymentTypeId: data.paymentHistory.paymentTypeId,
            AppointmentChargesPaid: data.paymentHistory.AppointmentChargesPaid,
            isAmountPaid: data.paymentHistory.isAmountPaid,
            ActualAppointmentCharges:
              data.paymentHistory.ActualAppointmentCharges,
            DiscountOnAppointment: data.paymentHistory.DiscountOnAppointment,
            FastTrackCharges: data.paymentHistory.FastTrackCharges,
            TotalAppointmentCharges:
              data.paymentHistory.TotalAppointmentCharges,
            appointments: {
              connect: { AppointmentId: data.appointmentId },
            },
          },
        });

        await tx.appointment.update({
          where: { AppointmentId: data.appointmentId },
          data: { paymentHistoryId: paymentHistory.PaymentHistoryId },
        });
      });
    }

    // --------------------------------------------------------
    // 2️⃣ HEAVY FETCH OUTSIDE TRANSACTION
    // --------------------------------------------------------
    const fullBill = await this.prisma.billingTransaction.findUnique({
      where: { BillingTransactionId: billingId },
      include: {
        Patient: true,
        User_BillingTransaction_doctorIdToUser: {
          include: { Specialization: true },
        },
        Hospital: true,
        Organization: true,
        BillStatus: true,
        PaymentStatus: true,
        User_BillingTransaction_createdByToUser: true,
        BillingTransactionItem: {
          include: {
            BillingItemCharge: {
              include: { chargeType: true },
            },
          },
        },
        BillingPayment: true,
        BillingHistory: {
          include: {
            BillingHistoryDetails: {
              include: { HistoryPaymentInfo: true },
            },
          },
        },
      },
    });

    return {
      message: isEdit
        ? 'Billing updated successfully'
        : 'Billing created successfully',
      data: fullBill,
    };
  }

  async cancelBilling(
    billingTransactionId: number,
    reason: string,
    userId: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Fetch bill
      const bill = await tx.billingTransaction.findUnique({
        where: { BillingTransactionId: billingTransactionId },
        include: {
          BillingTransactionItem: true,
          BillingPayment: true,
        },
      });

      if (!bill) throw new NotFoundException('Billing record not found');

      // 2️⃣ Determine correct cancel status
      let targetStatus;

      if (bill.billStatusId === 1) {
        // Draft → Cancelled Draft
        targetStatus = await tx.billStatus.findFirst({
          where: {
            StatusName: { equals: 'Cancelled Draft', mode: 'insensitive' },
          },
        });
      } else {
        // Finalized → Cancelled
        targetStatus = await tx.billStatus.findFirst({
          where: { StatusName: { equals: 'Cancelled', mode: 'insensitive' } },
        });
      }

      if (!targetStatus) throw new NotFoundException('Cancel status not found');

      // 3️⃣ Payment status → unpaid
      const unpaidStatus = await tx.paymentStatus.findFirst({
        where: { StatusName: { equals: 'Unpaid', mode: 'insensitive' } },
      });

      // 4️⃣ Update bill
      const updated = await tx.billingTransaction.update({
        where: { BillingTransactionId: billingTransactionId },
        data: {
          billStatusId: targetStatus.BillStatusId,
          paymentStatusId:
            unpaidStatus?.PaymentStatusId ?? bill.paymentStatusId,
          cancelledBy: userId,
          cancelledAt: new Date(),
          remarks: reason,
        },
      });

      // 5️⃣ History
      await tx.billingHistory.create({
        data: {
          BillingTransactionId: billingTransactionId,
          historyType: 'cancelled',
          remarks: reason,
          createdBy: userId,
          snapshot: { ...bill, cancelledAt: new Date(), cancelledBy: userId },
        },
      });

      return { message: 'Billing cancelled successfully', data: updated };
    });
  }

  async getBillingByPatient(patientId: number) {
    if (!patientId) throw new NotFoundException('PatientId is required');

    const bills = await this.prisma.billingTransaction.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      include: {
        // Correct relation names
        Patient: true,

        User_BillingTransaction_doctorIdToUser: {
          select: {
            UserId: true,
            firstName: true,
            lastName: true,
            Specialization: true,
          },
        },

        Hospital: true,
        Organization: true,
        BillStatus: true,
        PaymentStatus: true,

        User_BillingTransaction_createdByToUser: true,
        User_BillingTransaction_cancelledByToUser: true,

        BillingTransactionItem: {
          include: {
            BillingItemCharge: {
              include: {
                chargeType: true, // BillItemType
              },
            },
          },
        },

        BillingPayment: true,

        BillingHistory: {
          orderBy: { createdAt: 'desc' },
          include: {
            BillingHistoryDetails: {
              include: {
                HistoryPaymentInfo: true,
              },
            },
          },
        },
      },
    });

    return {
      message: 'Billing records fetched successfully',
      count: bills.length,
      data: bills,
    };
  }

  //addupdate patient package usage
  async addupdatePatientPackageUsage(dto: CreatePatientPackageUsageDto) {
    if (dto.PatientPackageUsageId) {
      // UPDATE
      const data: any = {};

      if (dto.patientId !== undefined) data.patientId = dto.patientId;
      if (dto.appointmentId !== undefined)
        data.appointmentId = dto.appointmentId;
      if (dto.consultationId !== undefined)
        data.consultationId = dto.consultationId;
      if (dto.billingItemChargeId !== undefined)
        data.billingItemChargeId = dto.billingItemChargeId;

      // ✅ ADD THESE TWO
      if (dto.IsFastTrack !== undefined) data.IsFastTrack = dto.IsFastTrack;
      if (dto.IsFreeFollowUp !== undefined)
        data.IsFreeFollowUp = dto.IsFreeFollowUp;

      if (dto.status !== undefined) data.status = dto.status;

      return this.prisma.patientPackageUsage.update({
        where: { PatientPackageUsageId: dto.PatientPackageUsageId },
        data,
      });
    }

    // CREATE
    const createData: any = {};

    if (dto.patientId !== undefined) createData.patientId = dto.patientId;
    if (dto.appointmentId !== undefined)
      createData.appointmentId = dto.appointmentId;
    if (dto.consultationId !== undefined)
      createData.consultationId = dto.consultationId;
    if (dto.billingItemChargeId !== undefined)
      createData.billingItemChargeId = dto.billingItemChargeId;

    // ✅ ADD THESE TWO
    if (dto.IsFastTrack !== undefined) createData.IsFastTrack = dto.IsFastTrack;
    if (dto.IsFreeFollowUp !== undefined)
      createData.IsFreeFollowUp = dto.IsFreeFollowUp;

    if (dto.status !== undefined) createData.status = dto.status;

    return this.prisma.patientPackageUsage.create({
      data: createData,
    });
  }

  async syncPatientPackageUsage(
    patientId: number,
    appointmentId: number,
    consultationId: number,
    billingItemChargeIds: number[],
    status: string,
  ) {
    if (!status) status = 'Incomplete';

    const existing = await this.prisma.patientPackageUsage.findMany({
      where: { patientId, appointmentId },
    });

    const existingIds = existing.map((e) => e.billingItemChargeId);

    // ---------------------------------------------------------------
    // 1️⃣ If status = COMPLETED → Update ONLY selected items
    // ---------------------------------------------------------------
    if (status === 'Completed') {
      for (const row of existing) {
        const shouldComplete = billingItemChargeIds.includes(
          row.billingItemChargeId,
        );

        // Only update the selected IDs
        if (shouldComplete) {
          await this.prisma.patientPackageUsage.update({
            where: { PatientPackageUsageId: row.PatientPackageUsageId },
            data: {
              status: 'Completed',
              consultationId,
            },
          });
        }
      }

      return { message: 'Selected items marked as Completed' };
    }

    // ---------------------------------------------------------------
    // 2️⃣ If status = INCOMPLETE → Full edit allowed
    // ---------------------------------------------------------------

    // DELETE rows not present in selected
    const toDelete = existing.filter(
      (e) => !billingItemChargeIds.includes(e.billingItemChargeId),
    );

    for (const row of toDelete) {
      await this.prisma.patientPackageUsage.delete({
        where: { PatientPackageUsageId: row.PatientPackageUsageId },
      });
    }

    // UPDATE rows that stay
    const toUpdate = existing.filter((e) =>
      billingItemChargeIds.includes(e.billingItemChargeId),
    );

    for (const row of toUpdate) {
      await this.prisma.patientPackageUsage.update({
        where: { PatientPackageUsageId: row.PatientPackageUsageId },
        data: {
          status: 'Incomplete',
          consultationId,
        },
      });
    }

    // CREATE new rows not in DB
    const toCreate = billingItemChargeIds.filter(
      (id) => !existingIds.includes(id),
    );

    for (const id of toCreate) {
      await this.prisma.patientPackageUsage.create({
        data: {
          patientId,
          appointmentId,
          consultationId,
          billingItemChargeId: id,
          status: 'Incomplete',
          updatedAt: new Date(), // ✅ REQUIRED
        },
      });
    }

    return { message: 'Patient package usage synced (editable mode)' };
  }

  async getPatientPackageUsage(
    id?: number,
    patientId?: number,
    appointmentId?: number,
  ) {
    if (id) {
      const data = await this.prisma.patientPackageUsage.findUnique({
        where: { PatientPackageUsageId: id },
        include: {
          Patient: true,
          Consultation: true,
          Appointment: true,
          BillingItemCharge: {
            include: {
              chargeType: true,
            },
          },
        },
      });
      if (!data)
        throw new NotFoundException(`PatientPackageUsage ${id} not found`);
      return data;
    }

    // FIND ALL
    return this.prisma.patientPackageUsage.findMany({
      where: {
        ...(patientId && { patientId }),
        ...(appointmentId && { appointmentId }),
      },
      include: {
        Patient: true,
        Consultation: true,
        Appointment: true,
        BillingItemCharge: {
          include: {
            chargeType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
