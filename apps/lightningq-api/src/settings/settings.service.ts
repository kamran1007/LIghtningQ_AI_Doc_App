import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpsertPrintSettingDto } from './dto/upsert-print-setting.dto';
import { R2Service } from 'src/r2/r2.service';

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  async upsertPrintSettings(dto: UpsertPrintSettingDto, files: any) {
    const details = dto.Printdetails ?? [];
    let uploaded: any = {};

    // -----------------------------
    // 1️⃣ Upload global images
    // -----------------------------
    const uploadMap = {
      printHeaderImg: 'printHeaderImgUrl',
      printFooterImg: 'printImageFooterUrl',
      billingLogo: 'printBillingLogoUrl',
      prescriptionLogo: 'printPrescriptionLogoUrl',
      visitSummaryLogo: 'printVisitSummaryLogoUrl',
    };

    for (const field in uploadMap) {
      if (files?.[field]?.[0]) {
        uploaded[uploadMap[field]] = await this.r2.uploadFile(
          files[field][0],
          `print/${field}`,
        );
      }
    }

    // -----------------------------
    // 2️⃣ Check existing setting
    // -----------------------------
    const existing = await this.prisma.doctorPrintSetting.findFirst({
      where: {
        userId: Number(dto.userId),
        HospitalId: Number(dto.hospitalId),
        parentOrganizationId: Number(dto.parentOrganizationId),
      },
      include: {
        printDetails: {
          include: { pageSettings: true, customSettings: true },
        },
      },
    });

    // -----------------------------
    // 3️⃣ If NOT FOUND → create new
    // -----------------------------
    if (!existing) {
      return this.prisma.doctorPrintSetting.create({
        data: {
          parentOrganizationId: dto.parentOrganizationId,
          HospitalId: dto.hospitalId,
          userId: dto.userId,
          language: dto.language,
          type: dto.type,
          ...dto.globalLogos,
          ...uploaded,

          printDetails: {
            create: details.map((d) => ({
              printPageId: d.printPageId,
              letterHeadValue: d.letterHeadValue,
              pageSettings: { create: d.pageSettings },
              customSettings: { create: d.customSettings },
            })),
          },
        },
        include: { printDetails: true },
      });
    }

    // -----------------------------
    // 4️⃣ Build a map of existing pages for fast lookup
    // -----------------------------
    const existingMap = new Map();
    existing.printDetails.forEach((pd) => {
      existingMap.set(pd.printPageId, pd);
    });

    const updates: any[] = [];
    const creations: any[] = [];

    // -----------------------------
    // 5️⃣ Loop through incoming details and decide update OR create
    // -----------------------------
    for (const d of details) {
      const old = existingMap.get(d.printPageId);

      if (old) {
        // -----------------------------
        // UPDATE EXISTING PAGE SETTINGS
        // -----------------------------
        updates.push(
          this.prisma.printDetail.update({
            where: { PrintDetailId: old.PrintDetailId },
            data: {
              letterHeadValue: d.letterHeadValue,

              pageSettings: {
                upsert: {
                  create: d.pageSettings,
                  update: d.pageSettings,
                },
              },

              customSettings: {
                upsert: {
                  create: d.customSettings,
                  update: d.customSettings,
                },
              },
            },
          }),
        );
      } else {
        // -----------------------------
        // CREATE NEW PAGE SETTINGS
        // -----------------------------
        creations.push(
          this.prisma.printDetail.create({
            data: {
              DoctorPrintSettingId: existing.DoctorPrintSettingId,
              printPageId: d.printPageId,
              letterHeadValue: d.letterHeadValue,

              pageSettings: { create: d.pageSettings },
              customSettings: { create: d.customSettings },
            },
          }),
        );
      }
    }

    // -----------------------------
    // 6️⃣ Update global settings + run updates and creates in transaction
    // -----------------------------
    return this.prisma.$transaction([
      this.prisma.doctorPrintSetting.update({
        where: { DoctorPrintSettingId: existing.DoctorPrintSettingId },
        data: {
          language: dto.language,
          type: dto.type,
          ...dto.globalLogos,
          ...uploaded,
        },
      }),
      ...updates,
      ...creations,
    ]);
  }

  async getPrintSettings(userId:number,hospitalId: number, parentOrganizationId: number) {
    const setting = await this.prisma.doctorPrintSetting.findFirst({
      where: {
        userId,
        HospitalId: hospitalId,
        parentOrganizationId,
      },
      include: {
        printDetails: {
          include: {
            pageSettings: true,
            customSettings: true,
            printPage: true,
          },
        },
      },
    });

    // -----------------------------
    //      🚨 NOT FOUND HANDLING
    // -----------------------------
    if (!setting) {
      return {
        success: false,
        message: 'No print settings found for this hospital and organization.',
        data: null,
      };
    }

    // -----------------------------
    //         SUCCESS RESPONSE
    // -----------------------------
    return {
      success: true,
      message: 'Print settings loaded successfully.',
      data: {
        DoctorPrintSettingId: setting.DoctorPrintSettingId,
        parentOrganizationId: setting.parentOrganizationId,
        hospitalId: setting.HospitalId,
        userId: setting.userId,
        language: setting.language,
        type: setting.type,

        globalLogos: {
          printHeaderImgUrl: setting.printHeaderImgUrl,
          printHeaderImgAlignment: setting.printHeaderImgAlignment,
          printImageHeaderUrl: setting.printImageHeaderUrl,
          printImageFooterUrl: setting.printImageFooterUrl,
        },

        details: setting.printDetails.map((d) => ({
          printPageId: d.printPageId,
          pageName: d.printPage?.pageName ?? null,
          letterHeadValue: d.letterHeadValue,
          pageSettings: d.pageSettings,
          customSettings: d.customSettings,
        })),
      },
    };
  }
}
