// import jsPDF from "jspdf";
// declare module "jspdf" {
//   interface jsPDF {
//     lastAutoTable: {
//       finalY: number;
//       [key: string]: any;
//     };
//   }
// }
// import autoTable from "jspdf-autotable";

// export async function generateConsultationPDF(data: any, patient: any) {
//   const doc = new jsPDF();
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(11);

//   function calculateAge(dob: string) {
//     const birth = new Date(dob);
//     const now = new Date();
//     let years = now.getFullYear() - birth.getFullYear();
//     let months = now.getMonth() - birth.getMonth();
//     if (months < 0) {
//       years--;
//       months += 12;
//     }
//     return `${years} years ${months} months`;
//   }

//   const vitals = patient?.Vitals;

//   const vitalsText = vitals
//     ? [
//         `BP: ${vitals.Systolic}/${vitals.Diastolic}`,
//         `Weight: ${vitals.Weight} kg`,
//         `Height: ${vitals.Height} cm`,
//         `BMI: ${vitals.BMI}`,
//         `Temp: ${vitals.Temperature} °F`,
//         `O₂ Sat: ${vitals.OxygenSaturation}%`,
//       ].join("\n")
//     : "Not Recorded";

//   function drawChip(doc: any, text: any, x: any, y: any) {
//     const padding = 2;
//     const textWidth = doc.getTextWidth(text);
//     const chipWidth = textWidth + padding * 4;
//     const chipHeight = 8;

//     doc.setFillColor(230, 247, 255);
//     doc.roundedRect(x, y - 6, chipWidth, chipHeight, 2, 2, "F");

//     doc.setTextColor(30, 60, 90);
//     doc.text(text, x + padding, y);
//   }

//   function formatKeyValueRows(obj: Record<string, string | undefined>) {
//     return Object.entries(obj)
//       .map(([k, v]) => `${k} : ${v ?? ""}`)
//       .join("\n");
//   }

//   const printDateTime = new Date().toLocaleString();
//   const consultationDateTime = data.appointment?.appointmentDate
//     ? new Date(data.appointment.appointmentDate).toLocaleString()
//     : "—";

//   // ---------------- HEADER ----------------
//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.height;

//   // Top teal bar
//   doc.setFillColor(162, 182, 180);
//   doc.rect(0, 0, pageWidth, 20, "F");

//   // Logo (if exists)
//   if (data?.appointment?.hospital?.logo) {
//     try {
//       doc.addImage(data.appointment.hospital.logo, "PNG", 10, 2, 16, 16);
//     } catch (error) {
//       console.warn("Could not load hospital logo:", error);
//     }
//   }

//   // Hospital name
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(18);
//   doc.setTextColor(255, 255, 255);
//   doc.text(data.appointment?.hospital.HospitalName || "", 30, 12);

//   // Contact info + Code
//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(10);
//   doc.text(
//     `${data.appointment?.hospital.contactNumber || ""} | ${
//       data.appointment?.hospital.email || ""
//     } | Code: ${data.appointment?.hospital.HospitalCode || ""}`,
//     30,
//     17
//   );

//   // Address under the bar
//   doc.setTextColor(60);
//   doc.setFontSize(12);
//   const hospitalAddress = data.appointment?.hospital.address || "";
//   const splitAddress = doc.splitTextToSize(hospitalAddress, 160);

//   const addressY = 27;
//   doc.text(splitAddress, 35, addressY);

//   // Divider positioning
//   const addressHeight = splitAddress.length * 5; // Adjusted line height
//   const dividerY = addressY + addressHeight + 3;

//   doc.setDrawColor(200);
//   doc.setLineWidth(0.3);
//   doc.line(10, dividerY, pageWidth - 10, dividerY);

//   // ---------------- PATIENT & DOCTOR INFO ----------------
//   const patientInfo = formatKeyValueRows({
//     Name: `${data.appointment?.patient?.firstName || ""} ${
//       data.appointment?.patient?.lastName || ""
//     }`,
//     MRN: data.appointment?.patient?.Patient_Medical_Record_No,
//     AGE: calculateAge(data.appointment?.patient?.dateOfBirth),
//     Email: data.appointment?.patient?.email,
//     Phone: data.appointment?.patient?.mobile,
//     Address: data.appointment?.patient?.addressLine1,
//   });

//   const doctorInfo = formatKeyValueRows({
//     Name: `${data.appointment?.doctor?.firstName || ""} ${
//       data.appointment?.doctor?.lastName || ""
//     }`,
//     Experience: `${data.appointment?.doctor?.Experience || ""} years`,
//     Specialist: data.appointment?.doctor?.Specialization?.SpecializationName,
//   });

//   autoTable(doc, {
//     startY: dividerY + 10,
//     head: [["Patient Info", "Doctor Info"]],
//     body: [[patientInfo, doctorInfo]],
//     styles: {
//       fontSize: 10,
//       cellPadding: 2,
//       valign: "top",
//       overflow: "linebreak",
//     },
//     headStyles: { fillColor: [0, 121, 107], textColor: 255 },
//   });

//   // ---------------- INFO DATES ----------------
//   autoTable(doc, {
//     startY: doc.lastAutoTable.finalY + 5,
//     head: [["Info", "Date & Time"]],
//     body: [
//       ["Print Date & Time", printDateTime],
//       ["Consultation Date & Time", consultationDateTime],
//     ],
//     styles: { fontSize: 10, cellPadding: 3 },
//     headStyles: { fillColor: [96, 125, 139], textColor: 255 },
//   });

//   // ---------------- PATIENT OVERVIEW ----------------
//   autoTable(doc, {
//     startY: doc.lastAutoTable.finalY + 5,
//     head: [["Patient Overview", "Details"]],
//     body: [
//       [
//         "Allergies",
//         data.appointment?.patient.allergies?.length
//           ? data.appointment.patient.allergies
//               .map((a: any) => a.AllergyName)
//               .join(", ")
//           : "None",
//       ],
//       [
//         "Medical History",
//         data.appointment?.patient?.medicalHistory?.length
//           ? data.appointment.patient.medicalHistory
//               .map((m: any) => m.MedicalHistoryName)
//               .join(", ")
//           : "None",
//       ],
//       ["Vitals", ""],
//     ],

//     styles: { fontSize: 10, cellPadding: 3 },

//     columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 135 } },

//     headStyles: { fillColor: [0, 121, 107], textColor: 255 },

//     didDrawCell: (dataArg) => {
//       if (dataArg.row.index !== 2 || dataArg.column.index !== 1) return;

//       const v = patient?.Vitals;
//       if (!v) return;

//       const chipTexts = [
//         `BP: ${v.Systolic}/${v.Diastolic}`,
//         `HR: ${v.HeartRate} bpm`,
//         `Weight: ${v.Weight} kg`,
//         `Height: ${v.Height} cm`,
//         `BMI: ${v.BMI}`,
//         `Temp: ${v.Temperature}°F`,
//         `Oxygen: ${v.OxygenSaturation}%`,
//         `Blood: ${v.BloodGroup}`,
//       ];

//       const cellX = dataArg.cell.x;
//       const cellY = dataArg.cell.y;
//       const cellWidth = dataArg.cell.width;

//       let x = cellX + 4;
//       let y = cellY + 10;
//       const maxX = cellX + cellWidth - 4;

//       // track how far content extends to increase row height
//       let rowBottom = y;

//       chipTexts.forEach((chip) => {
//         const chipWidth = doc.getTextWidth(chip) + 16;

//         if (x + chipWidth > maxX) {
//           x = cellX + 4;
//           y += 12;
//         }

//         drawChip(doc, chip, x, y);

//         x += chipWidth + 4;
//         rowBottom = Math.max(rowBottom, y + 12);
//       });

//       // 🔥 Auto-grow the row if needed — NO WHITE SPACE
//       const neededHeight = rowBottom - cellY + 4;

//       if (neededHeight > dataArg.row.height) {
//         dataArg.row.height = neededHeight;
//       }
//     },
//   });

//   // ---------------- CONSULTATION SUMMARY ----------------
//   const summarySections = [
//     ["Chief Complaint Notes", data.CheifcomplaintNotes || "None"],
//     [
//       "Chief Complaint",
//       data.ConsultationCheifComplaint?.length
//         ? data.ConsultationCheifComplaint.map(
//             (c: any) => c.chiefComplaint?.ChiefComplainTagName
//           ).join(", ")
//         : "None",
//     ],
//     [
//       "Clinical Notes",
//       data.ConsultationclinicalNotes?.length
//         ? data.ConsultationclinicalNotes.map((n: any) => n.content).join("\n")
//         : "None",
//     ],
//     [
//       "Investigations",
//       data.ConsultationInvestigation?.length
//         ? data.ConsultationInvestigation.map(
//             (i: any) =>
//               `${i.BillingItemCharge?.BillingItemName || ""} - ${
//                 i.InvestigationType?.InvestigationTypeName || ""
//               }\nRemark: ${i.ConsultationInvestigatRemark || ""}`
//           ).join("\n\n")
//         : "None",
//     ],
//     [
//       "Diagnosis",
//       data.ConsultationDiagnosis?.length
//         ? data.ConsultationDiagnosis.map(
//             (d: any) =>
//               `${d.diagnosis?.DiagnosisName || ""} (${d.diagnosis?.icdCode || ""})\nRemark: ${d.DiagnosisRemark || ""}`
//           ).join("\n\n")
//         : "None",
//     ],
//     [
//       "Procedure",
//       data.ConsultationProcedure?.length
//         ? data.ConsultationProcedure.map(
//             (p: any) =>
//               `${p.BillingItemCharge?.BillingItemName || ""}\n${
//                 p.ConsultationProcedureRemark?.trim()
//                   ? `Description: ${p.ConsultationProcedureRemark.trim()}`
//                   : "Description: —"
//               }`
//           ).join("\n\n")
//         : "None",
//     ],
//     [
//       "Treatment & Instructions",
//       data.ConsultationTreatment?.length
//         ? data.ConsultationTreatment.map((t: any) => t.treatmentText).join(
//             "\n\n"
//           )
//         : "None",
//     ],
//     [
//       "Follow-Up Plan",
//       data.ConsultationFollowUpPlan
//         ? `${data.ConsultationFollowUpPlan.followUpText || ""}
// Next Date: ${
//             data.ConsultationFollowUpPlan.nextDate
//               ? new Date(
//                   data.ConsultationFollowUpPlan.nextDate
//                 ).toLocaleDateString()
//               : ""
//           } (${data.ConsultationFollowUpPlan.duration || ""} ${
//             data.ConsultationFollowUpPlan.unit || ""
//           })`
//         : "None",
//     ],
//   ];

//   autoTable(doc, {
//     startY: doc.lastAutoTable.finalY + 5,
//     head: [["Section", "Details"]],
//     body: summarySections,
//     styles: { fontSize: 10, cellPadding: 3, valign: "top" },
//     headStyles: { fillColor: [63, 81, 181], textColor: 255 },
//   });

//   // ---------------- MEDICATION TABLE ----------------
//   if (data.ConsultationMedication?.length) {
//     autoTable(doc, {
//       startY: doc.lastAutoTable.finalY + 10,
//       head: [
//         [
//           "Medication Name",
//           "Dosage",
//           "Frequency",
//           "Duration (Days)",
//           "Remarks",
//         ],
//       ],
//       body: data.ConsultationMedication.map((med: any) => [
//         med.medicationName || "",
//         med.dosage || "",
//         med.frequency || "",
//         med.duration || "",
//         med.remarks || "",
//       ]),
//       styles: { fontSize: 10, cellPadding: 3, valign: "middle" },
//       headStyles: { fillColor: [0, 150, 136], textColor: 255 },
//     });
//   }

//   // ---------------- FOOTER ----------------
//   doc.setFontSize(10);
//   doc.setTextColor(0);
//   doc.text(
//     `Doctor: ${data.appointment?.doctor?.firstName || ""} ${
//       data.appointment?.doctor?.lastName || ""
//     }`,
//     14,
//     pageHeight - 35 // Moved up to make room for signature
//   );

//   // Draw the signature line first (so we know the reference position)
//   const lineY = pageHeight - 15;
//   doc.text("Signature: ____________________", 14, lineY);

//   // Add doctor signature if available (positioned above the line, right after "Signature:")
//   if (patient?.doctor?.SignatureOfUser) {
//     try {
//       const apiBase =
//         process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

//       let signatureUrl = patient.doctor.SignatureOfUser;
//       if (signatureUrl.startsWith("/uploads")) {
//         signatureUrl = `${apiBase}${signatureUrl}`;
//       }

//       console.log("Resolved Signature URL:", signatureUrl);

//       // Fetch image
//       const response = await fetch(signatureUrl);
//       const blob = await response.blob();

//       // Convert to Base64
//       const base64data: string = await new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(blob);
//         reader.onloadend = () => resolve(reader.result as string);
//         reader.onerror = reject;
//       });

//       // Measure where the text "Signature:" ends
//       const signatureLabelWidth = doc.getTextWidth("Signature:");

//       // Position the signature right after the label
//       const sigX = 14 + signatureLabelWidth + 2; // +2px padding
//       const sigY = lineY - 12; // place slightly above the line
//       const sigWidth = 40; // adjust if needed
//       const sigHeight = 15;

//       doc.addImage(base64data, "PNG", sigX, sigY, sigWidth, sigHeight);
//     } catch (err) {
//       console.error("Error loading signature:", err);
//     }
//   }

//   // Footer note (removed duplicate)
//   doc.setFontSize(8);
//   doc.setTextColor(150);
//   doc.text(
//     "This clinic is powered by LightningQ — www.lightningq.com",
//     pageWidth / 2,
//     pageHeight - 5,
//     { align: "center" }
//   );

//   // Save PDF
//   doc.save(
//     `Consultation_${data.appointment?.patient?.Patient_Medical_Record_No}.pdf`
//   );
// }

// generateConsultationPDF.ts — Final corrected file (medication included)

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
      [key: string]: any;
    };
    getNumberOfPages(): number;
  }
}

/* -------------------------------------------------------
   CDN URL FIX
------------------------------------------------------- */
export function fixCDNUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (!url.startsWith("http")) return "";
  return url.replace(
    "https://cdn.lightningq.com/",
    "https://fancy-boat-3c2d.kamranquamar2579.workers.dev/lightningq-storage/"
  );
}

/* -------------------------------------------------------
   FETCH IMAGE AS DATA URL
------------------------------------------------------- */
async function fetchImageAsDataUrl(
  url?: string | null
): Promise<string | null> {
  if (!url) return null;
  const fixed = fixCDNUrl(url);
  try {
    const res = await fetch(fixed);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn("Image load failed:", e);
    return null;
  }
}

function getFormat(dataUrl: string) {
  return dataUrl.startsWith("data:image/png") ? "PNG" : "JPEG";
}

/* -------------------------------------------------------
   ELEGANT MONOCHROME COLOR PALETTE
------------------------------------------------------- */
const COLORS = {
  // Primary grayscale
  richBlack: { r: 30, g: 30, b: 30 },           // #1E1E1E - Headers, important text
  charcoal: { r: 55, g: 65, b: 81 },            // #374151 - Body text
  slate: { r: 100, g: 116, b: 139 },            // #64748B - Secondary text
  
  // Backgrounds
  platinum: { r: 248, g: 249, b: 250 },         // #F8F9FA - Light background
  pearl: { r: 243, g: 244, b: 246 },            // #F3F4F6 - Card backgrounds
  silver: { r: 229, g: 231, b: 235 },           // #E5E7EB - Borders
  
  // Accents
  graphite: { r: 75, g: 85, b: 99 },            // #4B5563 - Subtle accents
  smoke: { r: 156, g: 163, b: 175 },            // #9CA3AF - Very subtle
  
  // Base
  white: { r: 255, g: 255, b: 255 },            // #FFFFFF - Pure white
  offWhite: { r: 252, g: 252, b: 253 },         // #FCFCFD - Soft white
};

/* -------------------------------------------------------
   HELPER: SET RGB COLOR
------------------------------------------------------- */
function setColor(doc: jsPDF, color: {r: number, g: number, b: number}, type: 'fill' | 'draw' | 'text') {
  if (type === 'fill') {
    doc.setFillColor(color.r, color.g, color.b);
  } else if (type === 'draw') {
    doc.setDrawColor(color.r, color.g, color.b);
  } else {
    doc.setTextColor(color.r, color.g, color.b);
  }
}

/* -------------------------------------------------------
   DRAW LUCIDE-STYLE ICONS
------------------------------------------------------- */
function drawIcon(doc: jsPDF, iconName: string, x: number, y: number, size: number = 16) {
  const halfSize = size / 2;
  const quarterSize = size / 4;
  
  doc.setLineWidth(1.5);
  setColor(doc, COLORS.graphite, 'draw');
  
  switch(iconName) {
    case 'user':
      // Circle for head
      doc.circle(x + halfSize, y + quarterSize, quarterSize, 'S');
      // Arc for body
      doc.ellipse(x + halfSize, y + size - quarterSize, halfSize * 0.6, quarterSize * 0.8, 'S');
      break;
      
    case 'stethoscope':
      // Simple stethoscope representation
      doc.circle(x + halfSize, y + quarterSize, quarterSize * 0.6, 'S');
      doc.line(x + halfSize, y + halfSize, x + halfSize, y + size - quarterSize);
      doc.circle(x + halfSize, y + size - quarterSize, quarterSize * 0.5, 'S');
      break;
      
    case 'calendar':
      // Rectangle
      doc.roundedRect(x + 2, y + 3, size - 4, size - 5, 1, 1, 'S');
      // Top bar
      doc.line(x + 2, y + 6, x + size - 2, y + 6);
      // Dots for dates
      doc.circle(x + 5, y + 9, 0.8, 'F');
      doc.circle(x + 9, y + 9, 0.8, 'F');
      doc.circle(x + 5, y + 12, 0.8, 'F');
      doc.circle(x + 9, y + 12, 0.8, 'F');
      break;
      
    case 'clock':
      // Circle
      doc.circle(x + halfSize, y + halfSize, halfSize - 2, 'S');
      // Clock hands
      doc.line(x + halfSize, y + halfSize, x + halfSize, y + 5);
      doc.line(x + halfSize, y + halfSize, x + size - 5, y + halfSize);
      break;
      
    case 'pill':
      // Capsule shape
      doc.ellipse(x + quarterSize, y + halfSize, quarterSize, halfSize - 2, 'S');
      doc.ellipse(x + size - quarterSize, y + halfSize, quarterSize, halfSize - 2, 'S');
      doc.line(x + quarterSize, y + 3, x + size - quarterSize, y + 3);
      doc.line(x + quarterSize, y + size - 3, x + size - quarterSize, y + size - 3);
      break;
      
    case 'clipboard':
      // Clipboard
      doc.roundedRect(x + 3, y + 2, size - 6, size - 4, 1, 1, 'S');
      // Clip
      doc.roundedRect(x + 5, y, size - 10, 4, 1, 1, 'S');
      // Lines
      doc.line(x + 6, y + 7, x + size - 6, y + 7);
      doc.line(x + 6, y + 10, x + size - 6, y + 10);
      break;
      
    case 'phone':
      // Phone handset - simplified with circles instead of arcs
      doc.line(x + 3, y + 3, x + 6, y + 6);
      doc.line(x + 10, y + 10, x + 13, y + 13);
      doc.circle(x + 6, y + 6, 2, 'S');
      doc.circle(x + 10, y + 10, 2, 'S');
      break;
      
    case 'mail':
      // Envelope
      doc.roundedRect(x + 2, y + 4, size - 4, size - 8, 1, 1, 'S');
      // Flap
      doc.line(x + 2, y + 4, x + halfSize, y + 9);
      doc.line(x + size - 2, y + 4, x + halfSize, y + 9);
      break;
      
    case 'mapPin':
      // Pin shape
      doc.circle(x + halfSize, y + quarterSize + 2, quarterSize, 'S');
      doc.line(x + halfSize, y + halfSize + 2, x + halfSize, y + size - 2);
      break;
  }
}

/* -------------------------------------------------------
   DRAW ELEGANT PAGE BORDER
------------------------------------------------------- */
function drawElegantBorder(doc: jsPDF, pageWidth: number, pageHeight: number) {
  const margin = 20;
  const innerMargin = 24;
  
  // White background for the entire page (fixes black background issue)
  setColor(doc, COLORS.white, 'fill');
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Outer border - very subtle
  setColor(doc, COLORS.silver, 'draw');
  doc.setLineWidth(0.5);
  doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
  
  // Inner elegant border
  setColor(doc, COLORS.graphite, 'draw');
  doc.setLineWidth(1.5);
  doc.rect(innerMargin, innerMargin, pageWidth - 2 * innerMargin, pageHeight - 2 * innerMargin);
  
  // Corner decorations (minimal dots)
  setColor(doc, COLORS.graphite, 'fill');
  const dotSize = 2;
  doc.circle(innerMargin, innerMargin, dotSize, 'F');
  doc.circle(pageWidth - innerMargin, innerMargin, dotSize, 'F');
  doc.circle(innerMargin, pageHeight - innerMargin, dotSize, 'F');
  doc.circle(pageWidth - innerMargin, pageHeight - innerMargin, dotSize, 'F');
}

/* -------------------------------------------------------
   DRAW ELEGANT SECTION HEADER
------------------------------------------------------- */
function drawElegantSectionHeader(
  doc: jsPDF,
  title: string,
  y: number,
  marginLeft: number,
  pageWidth: number,
  marginRight: number,
  iconName?: string
): number {
  const contentWidth = pageWidth - marginLeft - marginRight;
  const headerHeight = 32;
  
  // Subtle background
  setColor(doc, COLORS.platinum, 'fill');
  doc.rect(marginLeft, y, contentWidth, headerHeight, 'F');
  
  // Left accent line
  setColor(doc, COLORS.richBlack, 'fill');
  doc.rect(marginLeft, y, 3, headerHeight, 'F');
  
  // Bottom border
  setColor(doc, COLORS.silver, 'draw');
  doc.setLineWidth(0.5);
  doc.line(marginLeft, y + headerHeight, marginLeft + contentWidth, y + headerHeight);
  
  // Icon
  if (iconName) {
    drawIcon(doc, iconName, marginLeft + 12, y + 8, 16);
  }
  
  // Title text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  setColor(doc, COLORS.richBlack, 'text');
  const textX = marginLeft + (iconName ? 38 : 15);
  doc.text(title, textX, y + headerHeight / 2 + 4);
  
  return y + headerHeight + 12;
}

/* -------------------------------------------------------
   MAIN PDF GENERATOR - ELEGANT VERSION
------------------------------------------------------- */
export async function generateConsultationPDF(
  data: any,
  patient: any,
  Printsettings?: any
) {
  /* -------------------- SETUP -------------------- */
  const root = Printsettings?.data || Printsettings || {};
  const details = root?.details || [];
  const global = root?.globalLogos || root || {};

  const config =
    details.find(
      (p: any) =>
        (p.pageName || "").toLowerCase() === "prescription" &&
        (p.printPageId === 2 || p.printPageId === "2")
    ) || null;

  const pageSettings = config?.pageSettings || {};

  const doc = new jsPDF({
    unit: "pt",
    format: pageSettings?.pageSize || "A4",
    orientation: pageSettings?.pageOrientation || "portrait",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginTop = Number(pageSettings.marginTop ?? 30);
  const marginLeft = Number(pageSettings.marginLeft ?? 40);
  const marginRight = Number(pageSettings.marginRight ?? 40);

  const HEADER_HEIGHT = 180;
  const FOOTER_HEIGHT = 60;

  const headerUrl = (
    global?.printImageHeaderUrl ||
    global?.printHeaderImgUrl ||
    ""
  ).trim();
  const footerUrl = (
    global?.printImageFooterUrl ||
    global?.printFooterImgUrl ||
    ""
  ).trim();

  let contentStartY = marginTop;

  /* -------------------------------------------------------
      ELEGANT HOSPITAL HEADER (GRAY BG + BLACK TEXT + ICONS)
  ------------------------------------------------------- */
  function renderElegantHeader() {
    const hosp = data?.appointment?.hospital || {};
    const headerHeight = 110;
    
    // Gray background (not black!)
    setColor(doc, COLORS.pearl, 'fill');
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    // Bottom accent line
    setColor(doc, COLORS.graphite, 'fill');
    doc.rect(0, headerHeight - 2, pageWidth, 2, 'F');
    
    // Hospital name - BLACK TEXT
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    setColor(doc, COLORS.richBlack, 'text');
    doc.text(hosp.HospitalName || "Medical Center", marginLeft, 38);
    
    // Tagline - darker gray (moved closer)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    setColor(doc, COLORS.slate, 'text');
    doc.text("Excellence in Healthcare", marginLeft, 52);
    
    // Contact info with ICONS (moved up, no separator yet)
    doc.setFontSize(9);
    setColor(doc, COLORS.charcoal, 'text');
    let infoY = 68;
    
    // Address with icon
    if (hosp.address || hosp.city) {
      const addr = [hosp.address, hosp.city, hosp.state].filter(Boolean).join(", ");
      
      // Draw map pin icon
      drawIcon(doc, 'mapPin', marginLeft, infoY - 10, 12);
      
      doc.text(addr, marginLeft + 18, infoY);
      infoY += 13;
    }
    
    // Phone with icon
    if (hosp.contactNumber) {
      // Draw phone icon
      drawIcon(doc, 'phone', marginLeft, infoY - 10, 12);
      
      doc.text(`Tel: ${hosp.contactNumber}`, marginLeft + 18, infoY);
      infoY += 13;
    }
    
    // Email with icon
    if (hosp.email) {
      // Draw mail icon
      drawIcon(doc, 'mail', marginLeft, infoY - 10, 12);
      
      doc.text(`Email: ${hosp.email}`, marginLeft + 18, infoY);
      infoY += 8;
    }
    
    // NOW draw separator line AFTER all contact info
    setColor(doc, COLORS.silver, 'draw');
    doc.setLineWidth(0.5);
    doc.line(marginLeft, infoY, marginLeft + 180, infoY);
    
    contentStartY = headerHeight + 30;
  }

  /* -------------------------------------------------------
   HEADER LOGIC
------------------------------------------------------- */
  const letterHead = config?.letterHeadValue || root?.letterHeadValue || "With Letter";
  const showHeaderImage = letterHead === "With Image(Header/Footer)" && headerUrl;
  const showFooterImage = letterHead === "With Image(Header/Footer)" && footerUrl;

  // Draw border with WHITE background first
  drawElegantBorder(doc, pageWidth, pageHeight);

  // Header
  if (showHeaderImage && headerUrl) {
    const img = await fetchImageAsDataUrl(headerUrl);
    if (img) {
      doc.addImage(img, getFormat(img), 0, 0, pageWidth, HEADER_HEIGHT);
    }
    // Leave white space for header image on first page
    contentStartY = HEADER_HEIGHT + 20;
  } else if (letterHead === "With Letter") {
    renderElegantHeader();
  } else {
    contentStartY = marginTop + 40;
  }

  /* ---------------------------------------------
      TRACKING
  ---------------------------------------------- */
  let lastTableY = contentStartY;

  const updateLastY = (tableData: any) => {
    const currentPage = doc.getNumberOfPages();
    if (tableData.pageNumber === currentPage) {
      const y = tableData.cursor?.y;
      if (y && y > lastTableY) lastTableY = y;
    }
  };

  function getRealLastY() {
    const pageInfo = doc.getCurrentPageInfo();
    const page = pageInfo.pageNumber;
    const prev = doc.lastAutoTable?.finalY || contentStartY;
    
    // On first page, use the actual contentStartY (accounts for header)
    // On subsequent pages, use marginTop + small offset
    if (page === 1) {
      return prev;
    } else {
      // For pages after the first, start from top with normal margin
      return doc.lastAutoTable?.finalY || (marginTop + 50);
    }
  }

  const contentWidth = pageWidth - marginLeft - marginRight;

  /* ---------------------------------------------
      HELPERS
  ---------------------------------------------- */
  const calcAge = (dob?: string) => {
    if (!dob) return "N/A";
    const d = new Date(dob);
    const n = new Date();
    let y = n.getFullYear() - d.getFullYear();
    let m = n.getMonth() - d.getMonth();
    if (m < 0) {
      y--;
      m += 12;
    }
    return `${y} years ${m} months`;
  };

  /* ---------------------------------------------
      PATIENT & DOCTOR INFO - SIDE BY SIDE CARDS
  ---------------------------------------------- */
  const cardGap = 20;
  const cardWidth = (contentWidth - cardGap) / 2;

  // Draw Patient Card
  const drawPatientCard = (x: number, y: number) => {
    const cardHeight = 160;
    
    // Card background - WHITE
    setColor(doc, COLORS.white, 'fill');
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'F');
    
    // Card border
    setColor(doc, COLORS.silver, 'draw');
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'S');
    
    // Header background
    setColor(doc, COLORS.pearl, 'fill');
    doc.rect(x, y, cardWidth, 32, 'F');
    
    // Icon
    drawIcon(doc, 'user', x + 12, y + 8, 16);
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(doc, COLORS.richBlack, 'text');
    doc.text("PATIENT INFORMATION", x + 35, y + 20);
    
    // Content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(doc, COLORS.charcoal, 'text');
    
    let contentY = y + 50;
    const lineHeight = 14;
    
    const patientInfo = [
      { label: "Name", value: `${data.appointment?.patient?.firstName || ""} ${data.appointment?.patient?.lastName || ""}`.trim() },
      { label: "MRN", value: data.appointment?.patient?.Patient_Medical_Record_No || "N/A" },
      { label: "Age", value: calcAge(data.appointment?.patient?.dateOfBirth) },
      { label: "Email", value: data.appointment?.patient?.email || "N/A" },
      { label: "Phone", value: data.appointment?.patient?.mobile || "N/A" },
      { label: "Address", value: data.appointment?.patient?.addressLine1 || "N/A" },
    ];
    
    patientInfo.forEach((info) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      setColor(doc, COLORS.slate, 'text');
      doc.text(info.label, x + 15, contentY);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setColor(doc, COLORS.charcoal, 'text');
      const valueText = doc.splitTextToSize(info.value, cardWidth - 80);
      doc.text(valueText, x + 70, contentY);
      
      contentY += lineHeight;
    });
  };

  // Draw Doctor Card
  const drawDoctorCard = (x: number, y: number) => {
    const cardHeight = 160;
    
    // Card background - WHITE
    setColor(doc, COLORS.white, 'fill');
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'F');
    
    // Card border
    setColor(doc, COLORS.silver, 'draw');
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'S');
    
    // Header background
    setColor(doc, COLORS.pearl, 'fill');
    doc.rect(x, y, cardWidth, 32, 'F');
    
    // Icon
    drawIcon(doc, 'stethoscope', x + 12, y + 8, 16);
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    setColor(doc, COLORS.richBlack, 'text');
    doc.text("ATTENDING PHYSICIAN", x + 35, y + 20);
    
    // Content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    setColor(doc, COLORS.charcoal, 'text');
    
    let contentY = y + 50;
    const lineHeight = 14;
    
    const doctorInfo = [
      { label: "Name", value: `Dr. ${data.appointment?.doctor?.firstName || ""} ${data.appointment?.doctor?.lastName || ""}`.trim() },
      { label: "Experience", value: `${data.appointment?.doctor?.Experience || "N/A"} years` },
      { label: "Specialist", value: data.appointment?.doctor?.Specialization?.SpecializationName || "N/A" },
    ];
    
    doctorInfo.forEach((info) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      setColor(doc, COLORS.slate, 'text');
      doc.text(info.label, x + 15, contentY);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      setColor(doc, COLORS.charcoal, 'text');
      const valueText = doc.splitTextToSize(info.value, cardWidth - 80);
      doc.text(valueText, x + 70, contentY);
      
      contentY += lineHeight;
    });
  };

  // Render both cards
  drawPatientCard(marginLeft, contentStartY);
  drawDoctorCard(marginLeft + cardWidth + cardGap, contentStartY);
  
  lastTableY = contentStartY + 160 + 20;

  /* ---------------------------------------------
      APPOINTMENT INFO TABLE
  ---------------------------------------------- */
  autoTable(doc, {
    startY: lastTableY,
    margin: { left: marginLeft, right: marginRight },
    head: [["Information", "Date & Time"]],
    body: [
      ["Print Date & Time", new Date().toLocaleString()],
      [
        "Consultation Date",
        data.appointment?.appointmentDate
          ? new Date(data.appointment.appointmentDate).toLocaleString()
          : "N/A",
      ],
    ],
    styles: {
      fontSize: 9,
      cellPadding: 10,
      lineColor: [229, 231, 235],
      lineWidth: 0.5,
      textColor: [55, 65, 81],
      halign: 'left',
    },
    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [30, 30, 30],
      fontSize: 9,
      fontStyle: "bold",
      halign: "left",
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [100, 116, 139] },
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
    didDrawPage: (data) => {
      updateLastY(data);
      if (data.pageNumber > 1) {
        drawElegantBorder(doc, pageWidth, pageHeight);
      }
    },
  });

  /* ---------------------------------------------
      CONSULTATION SUMMARY
  ---------------------------------------------- */
  lastTableY = getRealLastY() + 20;

  lastTableY = drawElegantSectionHeader(
    doc,
    "Consultation Summary",
    lastTableY,
    marginLeft,
    pageWidth,
    marginRight,
    "clipboard"
  );

  const summary = [
    ["Chief Complaint Notes", data.CheifcomplaintNotes || "None"],
    [
      "Chief Complaint",
      data.ConsultationCheifComplaint?.map(
        (c: any) => c.chiefComplaint?.ChiefComplainTagName
      ).join(", ") || "None",
    ],
    [
      "Clinical Notes",
      data.ConsultationclinicalNotes?.map((n: any) => n.content).join("\n") || "None",
    ],
    [
      "Investigations",
      data.ConsultationInvestigation?.map(
        (i: any) =>
          `${i.BillingItemCharge?.BillingItemName || "N/A"} - ${i.InvestigationType?.InvestigationTypeName || "N/A"}${i.InvestigationRemark ? `\nNote: ${i.InvestigationRemark}` : ""}`
      ).join("\n\n") || "None",
    ],
    [
      "Diagnosis",
      data.ConsultationDiagnosis?.map(
        (d: any) =>
          `${d.diagnosis?.DiagnosisName || "N/A"}${d.diagnosis?.icdCode ? ` (${d.diagnosis.icdCode})` : ""}${d.DiagnosisRemark ? `\nNote: ${d.DiagnosisRemark}` : ""}`
      ).join("\n\n") || "None",
    ],
    [
      "Treatment & Instructions",
      data.ConsultationTreatment?.map((t: any) => t.treatmentText).join("\n\n") || "None",
    ],
    [
      "Follow-Up Plan",
      data.ConsultationFollowUpPlan
        ? `${data.ConsultationFollowUpPlan.followUpText}\nNext Appointment: ${new Date(
            data.ConsultationFollowUpPlan.nextDate
          ).toLocaleDateString()}`
        : "None",
    ],
  ];

  autoTable(doc, {
    startY: lastTableY,
    margin: { left: marginLeft, right: marginRight },
    head: [["Section", "Details"]],
    body: summary,
    styles: {
      fontSize: 9,
      cellPadding: 10,
      valign: "top",
      lineColor: [229, 231, 235],
      lineWidth: 0.5,
      textColor: [55, 65, 81],
      halign: 'left',
    },
    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [30, 30, 30],
      fontSize: 9,
      fontStyle: "bold",
      halign: "left",
    },
    columnStyles: {
      0: {
        cellWidth: 130,
        fontStyle: "bold",
        fillColor: [248, 249, 250],
        textColor: [100, 116, 139],
      },
      1: { cellWidth: contentWidth - 130 },
    },
    didDrawPage: (data) => {
      updateLastY(data);
      if (data.pageNumber > 1) {
        drawElegantBorder(doc, pageWidth, pageHeight);
      }
    },
  });

  /* ---------------------------------------------
      MEDICATIONS
  ---------------------------------------------- */
  if (data.ConsultationMedication?.length) {
    lastTableY = getRealLastY() + 20;

    lastTableY = drawElegantSectionHeader(
      doc,
      "Prescribed Medications",
      lastTableY,
      marginLeft,
      pageWidth,
      marginRight,
      "pill"
    );

    autoTable(doc, {
      startY: lastTableY,
      margin: { left: marginLeft, right: marginRight },
      head: [["Medication", "Dosage", "Frequency", "Duration", "Instructions"]],
      body: data.ConsultationMedication.map((m: any) => [
        m.medicationName || m.MedicineName || "N/A",
        m.dosage || m.Dosage || "N/A",
        m.frequency || m.Frequency || "N/A",
        m.duration || "N/A",
        m.remarks || "—",
      ]),
      styles: {
        fontSize: 8.5,
        cellPadding: 9,
        lineColor: [229, 231, 235],
        lineWidth: 0.5,
        textColor: [55, 65, 81],
        halign: 'left',
      },
      headStyles: {
        fillColor: [243, 244, 246],
        textColor: [30, 30, 30],
        fontSize: 8.5,
        fontStyle: "bold",
        halign: "left",
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      didDrawPage: (data) => {
        updateLastY(data);
        if (data.pageNumber > 1) {
          drawElegantBorder(doc, pageWidth, pageHeight);
        }
      },
    });
  }

  /* -------------------------------------------------------
        ELEGANT SIGNATURE SECTION
------------------------------------------------------- */
  let lastY = getRealLastY() + 30;

  // Subtle separator
  setColor(doc, COLORS.silver, 'draw');
  doc.setLineWidth(0.5);
  doc.line(marginLeft, lastY - 12, pageWidth - marginRight, lastY - 12);

  const sigHeight = 85;
  const footerStart = pageHeight - (showFooterImage ? FOOTER_HEIGHT : 35);

  if (lastY + sigHeight > footerStart - 20) {
    doc.addPage();
    drawElegantBorder(doc, pageWidth, pageHeight);
    lastY = marginTop + 50;
  }

  // Signature container
  const sigBoxHeight = 80;
  setColor(doc, COLORS.offWhite, 'fill');
  doc.roundedRect(marginLeft, lastY, contentWidth, sigBoxHeight, 2, 2, 'F');

  setColor(doc, COLORS.silver, 'draw');
  doc.setLineWidth(0.5);
  doc.roundedRect(marginLeft, lastY, contentWidth, sigBoxHeight, 2, 2, 'S');

  // Doctor info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  setColor(doc, COLORS.richBlack, 'text');
  doc.text(
    `Dr. ${data.appointment?.doctor?.firstName || ""} ${data.appointment?.doctor?.lastName || ""}`,
    marginLeft + 15,
    lastY + 20
  );

  // Specialization
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setColor(doc, COLORS.slate, 'text');
  doc.text(
    data.appointment?.doctor?.Specialization?.SpecializationName || "",
    marginLeft + 15,
    lastY + 34
  );

  const sigY = lastY + 55;

  // Signature label and line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  setColor(doc, COLORS.slate, 'text');
  doc.text("Authorized Signature", marginLeft + 15, sigY + 10);

  setColor(doc, COLORS.graphite, 'draw');
  doc.setLineWidth(0.8);
  doc.line(marginLeft + 120, sigY + 10, pageWidth - marginRight - 20, sigY + 10);

  // Signature image
  if (patient?.doctor?.SignatureOfUser) {
    const sigData = await fetchImageAsDataUrl(fixCDNUrl(patient.doctor.SignatureOfUser));
    if (sigData) {
      doc.addImage(sigData, getFormat(sigData), marginLeft + 125, sigY - 20, 130, 35);
    }
  }

  /* ---------------- FOOTER IMAGE ---------------- */
  if (showFooterImage) {
    const fData = await fetchImageAsDataUrl(footerUrl);
    if (fData) {
      doc.addImage(fData, getFormat(fData), 0, footerStart, pageWidth, FOOTER_HEIGHT);
    }
  }

  /* ---------------- ELEGANT FOOTER ---------------- */
  const footerY = pageHeight - (showFooterImage ? 12 : 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  setColor(doc, COLORS.slate, 'text');
  doc.text(
    "Powered by LightningQ Healthcare Solutions",
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  /* ---------------- SAVE FILE ---------------- */
  const mrn = data?.appointment?.patient?.Patient_Medical_Record_No ?? "UNKNOWN";
  const timestamp = new Date().toISOString().slice(0, 10);
  doc.save(`Consultation_${mrn}_${timestamp}.pdf`);
}
// // ----------------------------------------------------------
// // SMART FOOTER (Signature above footer image, no overlap)
// // ----------------------------------------------------------
// const footerImageHeight = FOOTER_HEIGHT_PT; // 72px (your default)
// const footerBottomY = pageHeight - footerImageHeight; // footer image starts here

// // Determine safe area for signature block:
// let signatureStartY = doc.lastAutoTable?.finalY
//   ? doc.lastAutoTable.finalY + 30
//   : marginTop;

// // If signature will collide with footer → move to NEW PAGE
// if (signatureStartY + 120 > footerBottomY) {
//   doc.addPage();
//   signatureStartY = marginTop;
// }

// // ------------------------------------
// // Signature + Doctor Name block
// // ------------------------------------
// doc.setFontSize(11);
// doc.setTextColor(0);

// doc.text(
//   `Doctor: DR. ${data.appointment?.doctor?.firstName || ""} ${data.appointment?.doctor?.lastName || ""}`,
//   leftContentStartX,
//   signatureStartY
// );

// const sigLabelY = signatureStartY + 25;
// doc.text("Signature:", leftContentStartX, sigLabelY);

// const lineStartX = leftContentStartX + 80;
// const lineEndX = lineStartX + 220;
// doc.setDrawColor(80);
// doc.line(lineStartX, sigLabelY + 2, lineEndX, sigLabelY + 2);

// // ------------- Signature Image ---------------
// if (patient?.doctor?.SignatureOfUser) {
//   try {
//     const sigUrl = fixCDNUrl(patient.doctor.SignatureOfUser);
//     const sigData = await fetchImageAsDataUrl(sigUrl);

//     if (sigData) {
//       const fmt = getImageFormatFromDataUrl(sigData);

//       const sigWidth = 140;
//       const sigHeight = 50;

//       const sigX = lineStartX + 10;
//       const sigY = sigLabelY - sigHeight + 12;

//       doc.addImage(sigData, fmt, sigX, sigY, sigWidth, sigHeight);
//     }
//   } catch (err) {
//     console.warn("Signature fetch error", err);
//   }
// }

// // ------------------------------------
// // FOOTER IMAGE (Always at bottom)
// // ------------------------------------
// if (footerUrl) {
//   const footerData = await fetchImageAsDataUrl(footerUrl);
//   if (footerData) {
//     const fmt = getImageFormatFromDataUrl(footerData);

//     doc.addImage(
//       footerData,
//       fmt,
//       0,
//       pageHeight - footerImageHeight, // always bottom
//       pageWidth,
//       footerImageHeight
//     );
//   }
// }

// // Powered by (just above bottom)
// doc.setFontSize(8);
// doc.setTextColor(120);
// doc.text(
//   "This clinic is powered by LightningQ — www.lightningq.com",
//   pageWidth / 2,
//   pageHeight - 5,
//   { align: "center" }
// );
