// declarations.d.ts
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { toWords } from "number-to-words";

dayjs.extend(advancedFormat);

export const generateAppointmentPDF = async (appointmentData: any) => {
  console.log("Patient Data for PDF", appointmentData)
  const pdfMakeModule = await import("pdfmake/build/pdfmake");
  const pdfFontsModule = await import("pdfmake/build/vfs_fonts");

  const formatDate = (date: string) => dayjs(date).format("Do MMM YYYY");
  const formatDateTime = (date: string) =>
    dayjs(date).format("Do MMM YYYY & hh:mm A");

  const formatTime = (time: string) =>
    dayjs(`2000-01-01T${time}`).format("hh:mm A");

  const pdfMake = pdfMakeModule.default;
  pdfMake.vfs = pdfFontsModule.default.vfs; // ✅ fixed
  const formatAge = (dob: string) => {
    if (!dob) return "";
    const birth = dayjs(dob);
    const now = dayjs();
    const years = now.diff(birth, "year");
    const months = now.diff(birth.add(years, "year"), "month");
    return `${years} Years ${months} Months`;
  };

  const numberToWords = (num: number) => {
    if (!num) return "Zero";
    return toWords(num).replace(/^\w/, (c:any) => c.toUpperCase()); // Capitalize first letter
  };

  // const formatDateTime = (date: string) =>
  //   dayjs(date).format("DD/MM/YYYY, hh:mm A");

  // const docDefinition: any = {
  //   content: [
  //     // Header
  //     {
  //       columns: [
  //         ...(appointmentData?.hospital?.LogoUrl
  //           ? [
  //               {
  //                 image: appointmentData?.hospital?.hospital?.LogoUrl,
  //                 width: 60,
  //               },
  //             ]
  //           : []),
  //         [
  //           {
  //             text: appointmentData?.hospital?.hospital?.HospitalName || "",
  //             style: "header",
  //           },
  //           {
  //             text: `${appointmentData?.hospital?.hospital?.contactNumber || ""} | ${appointmentData?.hospital?.hospital?.email || ""} | Code: ${appointmentData?.hospital?.hospital?.HospitalCode || ""}`,
  //             style: "subheader",
  //           },
  //           {
  //             text: appointmentData?.hospital?.hospital?.address || "",
  //             // (appointmentData?.hospital?.city
  //             //   ? ", " + appointmentData.hospital.city
  //             //   : ""),
  //             style: "subheader",
  //           },
  //         ],
  //       ],
  //     },

  //     { text: "\n" },

  //     // Patient + Doctor Info
  //     {
  //       columns: [
  //         [
  //           { text: "Patient Info", style: "sectionHeader" },
  //           {
  //             text: `Name: ${appointmentData?.firstName} ${appointmentData?.lastName}`,
  //           },
  //           {
  //             text: `MRN: ${appointmentData?.patient?.Patient_Medical_Record_No}`,
  //           },
  //           {
  //             text: `Age: ${formatAge(appointmentData?.patient?.dateOfBirth)}`,
  //           },
  //           { text: `Email: ${appointmentData?.patient?.email}` },
  //           { text: `Phone: ${appointmentData?.patient?.mobile}` },
  //           {
  //             text: `Address: ${appointmentData?.patient?.addressLine1 || ""}, ${appointmentData?.patient?.city || ""}`,
  //           },
  //         ],
  //         [
  //           { text: "Doctor Info", style: "sectionHeader" },
  //           {
  //             text: `Name: Dr. ${appointmentData?.doctor?.firstName} ${appointmentData?.doctor?.lastName}`,
  //           },
  //           {
  //             text: `Experience: ${appointmentData?.doctor?.Experience} Years`,
  //           },
  //           {
  //             text: `Specialist: ${appointmentData?.doctor?.Specialization?.SpecializationName}`,
  //           },
  //         ],
  //       ],
  //     },
  //     { text: "\n" },

  //     // Patient + Doctor Info (strict left/right alignment)
  //     {
  //       columns: [
  //         {
  //           width: "50%",
  //           stack: [
  //             { text: "Patient Info", style: "sectionHeader" },
  //             {
  //               text: `Name: ${appointmentData?.firstName || ""} ${appointmentData?.lastName || ""}`,
  //             },
  //             {
  //               text: `MRN: ${appointmentData?.patient?.Patient_Medical_Record_No || appointmentData?.Patient_Medical_Record_No || "-"}`,
  //             },
  //             {
  //               text: `Age: ${formatAge(appointmentData?.patient?.dateOfBirth || appointmentData?.dateOfBirth)}`,
  //             },
  //             {
  //               text: `Email: ${appointmentData?.patient?.email || appointmentData?.email || "-"}`,
  //             },
  //             {
  //               text: `Phone: ${appointmentData?.patient?.mobile || appointmentData?.mobile || "-"}`,
  //             },
  //             {
  //               text: `Address: ${appointmentData?.patient?.addressLine1 || ""}${appointmentData?.patient?.city ? ", " + appointmentData.patient.city : ""}`,
  //             },
  //           ],
  //         },
  //         {
  //           width: "50%",
  //           alignment: "right", // pushes the whole right column to the right edge
  //           stack: [
  //             {
  //               text: "Doctor Info",
  //               style: "sectionHeader",
  //               alignment: "right",
  //             },
  //             {
  //               text: `Name: Dr. ${appointmentData?.doctor?.firstName || ""} ${appointmentData?.doctor?.lastName || ""}`,
  //               alignment: "right",
  //             },
  //             {
  //               text: `Experience: ${appointmentData?.doctor?.Experience ? `${appointmentData.doctor.Experience} Years` : "-"}`,
  //               alignment: "right",
  //             },
  //             {
  //               text: `Specialist: ${appointmentData?.doctor?.Specialization?.SpecializationName || "-"}`,
  //               alignment: "right",
  //             },
  //           ],
  //         },
  //       ],
  //       columnGap: 16, // optional spacing between columns
  //     },
  //     { text: "\n" },

  //     // Summary
  //     { text: "Appointment Summary", style: "sectionHeader" },
  //     {
  //       text: `Visit Type: ${appointmentData?.AppoitmentSummary?.visitType?.AppointmentTypeName}`,
  //     },
  //     { text: `Visit Reason: ${appointmentData?.VisitReason || ""}` },
  //     { text: "\n" },

  //     // Charges
  //     { text: "Charges", style: "sectionHeader" },
  //     {
  //       table: {
  //         widths: ["*", "*"],
  //         body: [
  //           [
  //             "Appointment Fee",
  //             `₹${appointmentData?.ActualAppointmentCharges || 0}`,
  //           ],
  //           ["Fast Track", `₹${appointmentData?.FastTrackCharges || 0}`],
  //           ["Discount", `₹${appointmentData?.DiscountOnAppointment || 0}`],
  //           [
  //             { text: "Total Payable", bold: true },
  //             {
  //               text: `₹${appointmentData?.AppointmentChargesPaid || 0}`,
  //               bold: true,
  //             },
  //           ],
  //           [
  //             "Mode of Payment",
  //             appointmentData?.AppoitmentSummary?.PaymentType
  //               ?.PaymentTypeName || "N/A",
  //           ],
  //         ],
  //       },
  //     },
  //     { text: "\n\n" },

  //     // Footer
  //     {
  //       text: "This is a computer generated invoice. No signature required.",
  //       style: "footer",
  //       alignment: "center",
  //     },
  //     {
  //       text: "Powered by LightningQ — www.lightningq.com",
  //       link: "https://www.lightningq.com",
  //       style: "watermark",
  //       alignment: "center",
  //     },
  //   ],

  //   styles: {
  //     header: {
  //       fontSize: 16,
  //       bold: true,
  //       margin: [0, 0, 0, 5],
  //       color: "#0d6efd",
  //     },
  //     subheader: { fontSize: 10, margin: [0, 0, 0, 2], color: "#444" },
  //     sectionHeader: {
  //       fontSize: 12,
  //       bold: true,
  //       margin: [0, 10, 0, 5],
  //       color: "#0d6efd",
  //     },
  //     footer: { fontSize: 9, color: "gray" },
  //     watermark: { fontSize: 9, color: "#0d6efd", italics: true },
  //   },
  // };
  const docDefinition: any = {
    content: [
      // ✅ Header
      {
        columns: [
          ...(appointmentData?.hospital?.hospital?.LogoUrl
            ? [
                {
                  image: appointmentData?.hospital?.hospital?.LogoUrl,
                  width: 60,
                },
              ]
            : []),
          [
            {
              text: appointmentData?.hospital?.hospital?.HospitalName || "",
              style: "header",
            },
            {
              text: `☎ ${appointmentData?.hospital?.hospital?.contactNumber || ""}   ✉ ${
                appointmentData?.hospital?.hospital?.email || ""
              }   █ █ █  Code: ${appointmentData?.hospital?.hospital?.HospitalCode || ""}`,
              style: "subheader",
            },
            {
              text: `◉ ${appointmentData?.hospital?.hospital?.address || ""}`,
              style: "subheader",
            },
          ],
        ],
      },

      { text: "\n" },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 520,
            y2: 0,
            lineWidth: 0.5,
            lineColor: "#5eead4",
          },
        ],
      }, // separator

      { text: "\n" },

      // ✅ Patient + Doctor Info strict alignment
      {
        columns: [
          {
            width: "50%",
            stack: [
              { text: "Patient Info", style: "sectionHeader" },
              {
                text: `Name: ${appointmentData?.firstName || ""} ${appointmentData?.lastName || ""}`,
                margin: [0, 2, 0, 2],
              },
              {
                text: `MRN: ${appointmentData?.AppoitmentSummary?.Patient_Medical_Record_No || "-"}`,
                margin: [0, 2, 0, 2],
              },
              {
                text: `Age: ${formatAge(appointmentData?.dateOfBirth || appointmentData?.dateOfBirth)}`,
                margin: [0, 2, 0, 2],
              },
              {
                text: `Email: ${appointmentData?.email || "-"}`,
                margin: [0, 2, 0, 2],
              },
              {
                text: `Phone: ${appointmentData?.mobile || "-"}`,
                margin: [0, 2, 0, 2],
              },
              {
                text: `Address: ${
                  appointmentData?.patient?.addressLine1
                    ? appointmentData.patient.addressLine1
                    : [
                        appointmentData?.patient?.area,
                        appointmentData?.patient?.city,
                        appointmentData?.patient?.postalCode,
                        appointmentData?.patient?.state,
                        'India'
                      ]
                        .filter(Boolean)
                        .join(", ")
                }`,
                margin: [0, 2, 0, 2],
              },
            ],
          },
          {
            width: "50%",
            alignment: "right",
            stack: [
              {
                text: "Doctor Info",
                style: "sectionHeader",
                alignment: "right",
              },
              {
                text: `Name: Dr. ${appointmentData?.doctor?.firstName || ""} ${appointmentData?.doctor?.lastName || ""}`,
                alignment: "right",
                margin: [0, 2, 0, 2],
              },
              {
                text: `Experience: ${appointmentData?.doctor?.Experience ? `${appointmentData.doctor.Experience} Years` : "-"}`,
                alignment: "right",
                margin: [0, 2, 0, 2],
              },
              {
                text: `Specialist: ${appointmentData?.doctor?.Specialization?.SpecializationName || "-"}`,
                alignment: "right",
                margin: [0, 2, 0, 2],
              },
            ],
          },
        ],
        columnGap: 16,
      },

      { text: "\n" },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 520,
            y2: 0,
            lineWidth: 0.5,
            lineColor: "#5eead4",
          },
        ],
      }, // separator

      { text: "\n" },

      // ✅ Appointment Info (renamed header)
      { text: "Appointment Info", style: "sectionHeader" },
      {
        columns: [
          {
            text: `Consultation Date: ${formatDate(appointmentData?.appointmentDate)}`,
          },
          {
            text: `Print Date & Time: ${formatDateTime(new Date().toISOString())}`,
            alignment: "right",
          },
        ],
      },
      {
        columns: [
          {
            text: `Consultation Time: ${formatTime(appointmentData?.appointmentTime)}`,
          },
          {
            text: `Appot. Booked At: ${formatDateTime(appointmentData?.AppoitmentSummary?.bookedAt || new Date().toISOString())}`,
            alignment: "right",
          },
        ],
      },

      { text: "\n" },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 520,
            y2: 0,
            lineWidth: 0.5,
            lineColor: "#5eead4",
          },
        ],
      }, // separator

      { text: "\n" },

      // ✅ Summary
      { text: "Appointment Summary", style: "sectionHeader" },
      {
        text: `Visit Type: ${appointmentData?.AppoitmentSummary?.visitType?.AppointmentTypeName}`,
      },
      { text: `Visit Reason: ${appointmentData?.VisitReason || ""}` },

      { text: "\n" },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 520,
            y2: 0,
            lineWidth: 0.5,
            lineColor: "#5eead4",
          },
        ],
      }, // separator

      { text: "\n" },

      // ✅ Charges
      { text: "Appointment Breakup Charges", style: "sectionHeader" },
      {
        table: {
          widths: ["*", "*"],
          body: [
            [
              "Appointment Fee",
              `₹${appointmentData?.ActualAppointmentCharges || 0}`,
            ],
            ["Fast Track", `₹${appointmentData?.FastTrackCharges || 0}`],
            ["Discount", `₹${appointmentData?.DiscountOnAppointment || 0}`],
            [
              { text: "Total Payable", bold: true },
              {
                text: `₹${appointmentData?.AppointmentChargesPaid || 0}`,
                bold: true,
              },
            ],
            [
              { text: "Amount in Word", bold: true },
              {
                text: `${numberToWords(appointmentData?.AppointmentChargesPaid || 0)} only`,
                italics: true,
                bold: true,
              },
            ],
            [
              "Mode of Payment",
              appointmentData?.AppoitmentSummary?.PaymentType
                ?.PaymentTypeName || "N/A",
            ],
          ],
        },
      },

      { text: "\n\n" },
    ],

    // ✅ Footer
    footer: () => {
      return {
        stack: [
          {
            text: "This is a computer generated invoice. No signature required.",
            style: "footer",
            alignment: "center",
            margin: [0, 0, 0, 5],
          },
          {
            text: "Powered by LightningQ — www.lightningq.com",
            link: "https://www.lightningq.com",
            style: "watermark",
            alignment: "center",
          },
        ],
        margin: [0, 0, 0, 10],
      };
    },

    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 5],
        color: "#5eead4", // teal-400
      },
      subheader: { fontSize: 10, margin: [0, 0, 0, 3], color: "#555" },
      sectionHeader: {
        fontSize: 13,
        bold: true,
        margin: [0, 10, 0, 6],
        color: "#5eead4",
      },
      footer: { fontSize: 9, color: "gray" },
      watermark: { fontSize: 9, color: "#5eead4", italics: true },
    },
  };

  pdfMake.createPdf(docDefinition).open(); // opens in PDF viewer
  // use .download("Consultation.pdf") to download directly
};
