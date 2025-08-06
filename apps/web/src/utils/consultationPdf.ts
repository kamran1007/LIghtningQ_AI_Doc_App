import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateConsultationPDF(data: any) {
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

  // Top teal bar
  doc.setFillColor(162, 182, 180); // teal
  doc.rect(0, 0, pageWidth, 20, "F");

  // Logo (if exists)
  if (data?.appointment?.hospital?.logo) {
    doc.addImage(data.appointment.hospital.logo, "PNG", 10, 2, 16, 16);
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
  const splitAddress = doc.splitTextToSize(hospitalAddress, 160); // 160px width for wrapping
  doc.text(splitAddress, 35, 27); // Will auto-wrap
  // Divider
  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(10, 30, pageWidth - 10, 30);

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
    startY: 35,
    head: [["Patient Info", "Doctor Info"]],
    body: [[patientInfo, doctorInfo]],
    styles: { fontSize: 10, cellPadding: 2, valign: "top", overflow: 'linebreak' },
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
              .map((a) => a.AllergyName)
              .join(", ")
          : "None",
      ],
      [
        "Medical History",
        data.appointment?.patient?.medicalHistory?.length
          ? data.appointment.patient.medicalHistory
              .map((m) => m.MedicalHistoryName)
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
            (c) => c.chiefComplaint?.ChiefComplainTagName
          ).join(", ")
        : "None",
    ],
    [
      "Clinical Notes",
      data.ConsultationclinicalNotes?.length
        ? data.ConsultationclinicalNotes.map((n) => n.content).join("\n")
        : "None",
    ],
    [
      "Investigations",
      data.ConsultationInvestigation?.length
        ? data.ConsultationInvestigation.map(
            (i) =>
              `${i.InvestigationType?.InvestigationTypeName || ""} - ${
                i.InvestigationSubType?.InvestigationSubTypename || ""
              }\nRemark: ${i.ConsultationInvestigatRemark || ""}`
          ).join("\n\n")
        : "None",
    ],
    [
      "Diagnosis",
      data.ConsultationDiagnosis?.length
        ? data.ConsultationDiagnosis.map(
            (d) =>
              `${d.diagnosis?.DiagnosisName || ""} (${d.diagnosis?.icdCode || ""})\nRemark: ${d.DiagnosisRemark || ""}`
          ).join("\n\n")
        : "None",
    ],
    [
      "Treatment & Instructions",
      data.ConsultationTreatment?.length
        ? data.ConsultationTreatment.map((t) => t.treatmentText).join("\n\n")
        : "None",
    ],
    [
      "Follow-Up Plan",
      data.ConsultationFollowUpPlan?.length
        ? data.ConsultationFollowUpPlan.map(
            (f) =>
              `${f.followUpText || ""}\nNext Date: ${
                f.nextDate ? new Date(f.nextDate).toLocaleDateString() : ""
              } (${f.duration} ${f.unit})`
          ).join("\n\n")
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
      body: data.ConsultationMedication.map((med) => [
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
  doc.text(
    `Doctor: ${data.appointment?.doctor?.firstName || ""} ${data.appointment?.doctor?.lastName || ""}`,
    14,
    doc.internal.pageSize.height - 20
  );
  doc.text(
    "Signature: ____________________",
    14,
    doc.internal.pageSize.height - 15
  );

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    "This clinic is powered by LightningQ — www.lightningq.com",
    pageWidth / 2,
    doc.internal.pageSize.height - 5,
    { align: "center" }
  );

  // Save PDF
  doc.save(
    `Consultation_${data.appointment?.patient?.Patient_Medical_Record_No}.pdf`
  );
}
