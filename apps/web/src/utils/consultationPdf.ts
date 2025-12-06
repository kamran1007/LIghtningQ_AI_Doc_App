import jsPDF from "jspdf";
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
      [key: string]: any;
    };
  }
}
import autoTable from "jspdf-autotable";

export async function generateConsultationPDF(data: any, patient: any) {
  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  function calculateAge(dob: string) {
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} years ${months} months`;
  }

  function formatKeyValueRows(obj: Record<string, string | undefined>) {
    return Object.entries(obj)
      .map(([k, v]) => `${k} : ${v ?? ""}`)
      .join("\n");
  }

  const printDateTime = new Date().toLocaleString();
  const consultationDateTime = data.appointment?.appointmentDate
    ? new Date(data.appointment.appointmentDate).toLocaleString()
    : "—";

  // ---------------- HEADER ----------------
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.height;

  // Top teal bar
  doc.setFillColor(162, 182, 180);
  doc.rect(0, 0, pageWidth, 20, "F");

  // Logo (if exists)
  if (data?.appointment?.hospital?.logo) {
    try {
      doc.addImage(data.appointment.hospital.logo, "PNG", 10, 2, 16, 16);
    } catch (error) {
      console.warn("Could not load hospital logo:", error);
    }
  }

  // Hospital name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(data.appointment?.hospital.HospitalName || "", 30, 12);

  // Contact info + Code
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `${data.appointment?.hospital.contactNumber || ""} | ${
      data.appointment?.hospital.email || ""
    } | Code: ${data.appointment?.hospital.HospitalCode || ""}`,
    30,
    17
  );

  // Address under the bar
  doc.setTextColor(60);
  doc.setFontSize(12);
  const hospitalAddress = data.appointment?.hospital.address || "";
  const splitAddress = doc.splitTextToSize(hospitalAddress, 160);

  const addressY = 27;
  doc.text(splitAddress, 35, addressY);

  // Divider positioning
  const addressHeight = splitAddress.length * 5; // Adjusted line height
  const dividerY = addressY + addressHeight + 3;

  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(10, dividerY, pageWidth - 10, dividerY);

  // ---------------- PATIENT & DOCTOR INFO ----------------
  const patientInfo = formatKeyValueRows({
    Name: `${data.appointment?.patient?.firstName || ""} ${
      data.appointment?.patient?.lastName || ""
    }`,
    MRN: data.appointment?.patient?.Patient_Medical_Record_No,
    AGE: calculateAge(data.appointment?.patient?.dateOfBirth),
    Email: data.appointment?.patient?.email,
    Phone: data.appointment?.patient?.mobile,
    Address: data.appointment?.patient?.addressLine1,
  });

  const doctorInfo = formatKeyValueRows({
    Name: `${data.appointment?.doctor?.firstName || ""} ${
      data.appointment?.doctor?.lastName || ""
    }`,
    Experience: `${data.appointment?.doctor?.Experience || ""} years`,
    Specialist: data.appointment?.doctor?.Specialization?.SpecializationName,
  });

  autoTable(doc, {
    startY: dividerY + 10,
    head: [["Patient Info", "Doctor Info"]],
    body: [[patientInfo, doctorInfo]],
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "top",
      overflow: "linebreak",
    },
    headStyles: { fillColor: [0, 121, 107], textColor: 255 },
  });

  // ---------------- INFO DATES ----------------
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 5,
    head: [["Info", "Date & Time"]],
    body: [
      ["Print Date & Time", printDateTime],
      ["Consultation Date & Time", consultationDateTime],
    ],
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [96, 125, 139], textColor: 255 },
  });

  // ---------------- PATIENT OVERVIEW ----------------
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 5,
    head: [["Patient Overview", "Details"]],
    body: [
      [
        "Allergies",
        data.appointment?.patient.allergies?.length
          ? data.appointment.patient.allergies
              .map((a: any) => a.AllergyName)
              .join(", ")
          : "None",
      ],
      [
        "Medical History",
        data.appointment?.patient?.medicalHistory?.length
          ? data.appointment.patient.medicalHistory
              .map((m: any) => m.MedicalHistoryName)
              .join(", ")
          : "None",
      ],
      [
        "Vitals",
        data.appointment?.Vitals?.length
          ? `BP: ${data.appointment.Vitals[0].Systolic}/${data.appointment.Vitals[0].Diastolic} | Weight: ${data.appointment.Vitals[0].Weight}kg | Height: ${data.appointment.Vitals[0].Height}cm | BMI: ${data.appointment.Vitals[0].BMI} | Temp: ${data.appointment.Vitals[0].Temperature}°F | O2 Sat: ${data.appointment.Vitals[0].OxygenSaturation}%`
          : "Not Recorded",
      ],
    ],
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [0, 121, 107], textColor: 255 },
  });

  // ---------------- CONSULTATION SUMMARY ----------------
  const summarySections = [
    ["Chief Complaint Notes", data.CheifcomplaintNotes || "None"],
    [
      "Chief Complaint",
      data.ConsultationCheifComplaint?.length
        ? data.ConsultationCheifComplaint.map(
            (c: any) => c.chiefComplaint?.ChiefComplainTagName
          ).join(", ")
        : "None",
    ],
    [
      "Clinical Notes",
      data.ConsultationclinicalNotes?.length
        ? data.ConsultationclinicalNotes.map((n: any) => n.content).join("\n")
        : "None",
    ],
    [
      "Investigations",
      data.ConsultationInvestigation?.length
        ? data.ConsultationInvestigation.map(
            (i: any) =>
              `${i.BillingItemCharge?.BillingItemName || ""} - ${
                i.InvestigationType?.InvestigationTypeName || ""
              }\nRemark: ${i.ConsultationInvestigatRemark || ""}`
          ).join("\n\n")
        : "None",
    ],
    [
      "Diagnosis",
      data.ConsultationDiagnosis?.length
        ? data.ConsultationDiagnosis.map(
            (d: any) =>
              `${d.diagnosis?.DiagnosisName || ""} (${d.diagnosis?.icdCode || ""})\nRemark: ${d.DiagnosisRemark || ""}`
          ).join("\n\n")
        : "None",
    ],
    [
      "Procedure",
      data.ConsultationProcedure?.length
        ? data.ConsultationProcedure.map(
            (p: any) =>
              `${p.BillingItemCharge?.BillingItemName || ""}\n${
                p.ConsultationProcedureRemark?.trim()
                  ? `Description: ${p.ConsultationProcedureRemark.trim()}`
                  : "Description: —"
              }`
          ).join("\n\n")
        : "None",
    ],
    [
      "Treatment & Instructions",
      data.ConsultationTreatment?.length
        ? data.ConsultationTreatment.map((t: any) => t.treatmentText).join(
            "\n\n"
          )
        : "None",
    ],
    [
      "Follow-Up Plan",
      data.ConsultationFollowUpPlan
        ? `${data.ConsultationFollowUpPlan.followUpText || ""}
Next Date: ${
            data.ConsultationFollowUpPlan.nextDate
              ? new Date(
                  data.ConsultationFollowUpPlan.nextDate
                ).toLocaleDateString()
              : ""
          } (${data.ConsultationFollowUpPlan.duration || ""} ${
            data.ConsultationFollowUpPlan.unit || ""
          })`
        : "None",
    ],
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 5,
    head: [["Section", "Details"]],
    body: summarySections,
    styles: { fontSize: 10, cellPadding: 3, valign: "top" },
    headStyles: { fillColor: [63, 81, 181], textColor: 255 },
  });

  // ---------------- MEDICATION TABLE ----------------
  if (data.ConsultationMedication?.length) {
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [
        [
          "Medication Name",
          "Dosage",
          "Frequency",
          "Duration (Days)",
          "Remarks",
        ],
      ],
      body: data.ConsultationMedication.map((med: any) => [
        med.medicationName || "",
        med.dosage || "",
        med.frequency || "",
        med.duration || "",
        med.remarks || "",
      ]),
      styles: { fontSize: 10, cellPadding: 3, valign: "middle" },
      headStyles: { fillColor: [0, 150, 136], textColor: 255 },
    });
  }

  // ---------------- FOOTER ----------------
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(
    `Doctor: ${data.appointment?.doctor?.firstName || ""} ${
      data.appointment?.doctor?.lastName || ""
    }`,
    14,
    pageHeight - 35 // Moved up to make room for signature
  );

  // Draw the signature line first (so we know the reference position)
  const lineY = pageHeight - 15;
  doc.text("Signature: ____________________", 14, lineY);

  // Add doctor signature if available (positioned above the line, right after "Signature:")
  if (patient?.doctor?.SignatureOfUser) {
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      let signatureUrl = patient.doctor.SignatureOfUser;
      if (signatureUrl.startsWith("/uploads")) {
        signatureUrl = `${apiBase}${signatureUrl}`;
      }

      console.log("Resolved Signature URL:", signatureUrl);

      // Fetch image
      const response = await fetch(signatureUrl);
      const blob = await response.blob();

      // Convert to Base64
      const base64data: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      // Measure where the text "Signature:" ends
      const signatureLabelWidth = doc.getTextWidth("Signature:");

      // Position the signature right after the label
      const sigX = 14 + signatureLabelWidth + 2; // +2px padding
      const sigY = lineY - 12; // place slightly above the line
      const sigWidth = 40; // adjust if needed
      const sigHeight = 15;

      doc.addImage(base64data, "PNG", sigX, sigY, sigWidth, sigHeight);
    } catch (err) {
      console.error("Error loading signature:", err);
    }
  }

  // Footer note (removed duplicate)
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    "This clinic is powered by LightningQ — www.lightningq.com",
    pageWidth / 2,
    pageHeight - 5,
    { align: "center" }
  );

  // Save PDF
  doc.save(
    `Consultation_${data.appointment?.patient?.Patient_Medical_Record_No}.pdf`
  );
}
