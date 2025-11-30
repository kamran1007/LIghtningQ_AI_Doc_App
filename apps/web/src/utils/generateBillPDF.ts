export async function generateBillPDF(bill: any, appointment?: any) {
  const pdfMakeModule = await import("pdfmake/build/pdfmake");
  const pdfFontsModule = await import("pdfmake/build/vfs_fonts");
  const pdfMake = pdfMakeModule.default;
  pdfMake.vfs = pdfFontsModule.default.vfs;

  // Helper functions
  const formatDateTime = (val: string) =>
    new Date(val).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const calculateAge = (dob: string) => {
    if (!dob) return "-";
    const diff = Date.now() - new Date(dob).getTime();
    const age = new Date(diff).getUTCFullYear() - 1970;
    return age;
  };

  const formatPaymentDate = (isoDate: string) => {
    if (!isoDate) return "-";

    const date = new Date(isoDate);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";

    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${day}${suffix} ${month} ${year}, ${time}`;
  };

  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [40, 30, 40, 40],

    content: [
      // ---------------------- HEADER -------------------------
      { text: bill.hospital?.HospitalName, style: "header" },
      {
        text: `${bill.hospital?.address} | Phone: ${bill.hospital?.contactNumber}`,
        style: "subheader",
      },
      {
        text: `GST: ${bill.hospital?.GSTNumber || "N/A"}`,
        style: "subheader",
        margin: [0, 0, 0, 20],
      },

      { text: "FINAL BILL", style: "title", margin: [0, 0, 0, 15] },

      // ---------------------- SEPARATOR LINE -------------------------
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 0.8,
            lineColor: "#cccccc",
          },
        ],
        margin: [0, 10, 0, 15],
      },

      // ---------------------- INVOICE DETAILS -------------------------
      {
        columns: [
          {
            width: "50%",
            stack: [
              { text: `Invoice No: ${bill.OPInvoiceNo}`, style: "field" },
              {
                text: `Invoice Date: ${formatDateTime(bill.billDate)}`,
                style: "field",
              },
              {
                text: `Created By: MR. ${bill.createdUser?.firstName} ${bill.createdUser?.lastName}`,
                style: "field",
              },
            ],
          },
          {
            width: "50%",
            alignment: "right", // <-- Forces right alignment
            margin: [20, 0, 0, 0], // <-- Slight push for perfect right alignment
            stack: [
              { text: `Bill Type: ${bill.billType}`, style: "field" },
              {
                text: `Payment Status: ${bill.paymentStatus?.StatusName}`,
                style: "field",
              },
              {
                text: `Visit Type: ${appointment?.type || "OPD"}`,
                style: "field",
              },
            ],
          },
        ],
        columnGap: 20,
        margin: [0, 0, 0, 20],
      },

      // ---------------------- SEPARATOR LINE -------------------------
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 0.8,
            lineColor: "#cccccc",
          },
        ],
        margin: [0, 10, 0, 15],
      },

      // ---------------------- PATIENT + DOCTOR INFO -------------------------
      {
        columns: [
          {
            width: "50%",
            stack: [
              { text: "Patient Information", style: "sectionTitle" },
              {
                text: `Name: ${bill.patient.firstName} ${bill.patient.lastName}`,
                style: "field",
              },
              {
                text: `Appointment Date: ${formatDateTime(appointment?.appointmentDate) || "-"}`,
                style: "field",
              },
              {
                text: `MRN: ${bill.patient.Patient_Medical_Record_No}`,
                style: "field",
              },
              { text: `Mobile: ${bill.patient.mobile}`, style: "field" },
              { text: `Email: ${bill.patient.email || "-"}`, style: "field" },
              {
                text: `Age: ${calculateAge(bill.patient.dateOfBirth)} Years`,
                style: "field",
              },
              {
                text: `Address: ${
                  bill.patient.addressLine1 &&
                  bill.patient.addressLine1.trim() !== ""
                    ? bill.patient.addressLine1
                    : bill.patient.area ||
                        bill.patient.city ||
                        bill.patient.state
                      ? [
                          bill.patient.area,
                          bill.patient.city,
                          bill.patient.state,
                        ]
                          .filter(Boolean)
                          .join(", ")
                      : "-"
                }`,
                style: "field",
              },
            ],
          },

          {
            width: "50%",
            alignment: "right", // <-- Forces right alignment
            margin: [20, 0, 0, 0], // <-- Slight push for perfect right alignment

            stack: [
              {
                text: "Doctor Information",
                style: "sectionTitle",
                alignment: "right",
              },
              {
                text: `Doctor: Dr. ${bill.doctor.firstName} ${bill.doctor.lastName}`,
                style: "field",
                alignment: "right",
              },
              {
                text: `Specialization: ${bill.doctor.Specialization.SpecializationName || "-"}`,
                style: "field",
                alignment: "right",
              },
              // {
              //   text: `Department: ${bill.doctor.department || "-"}`,
              //   style: "field",
              //   alignment: "right",
              // },
            ],
          },
        ],
        columnGap: 20,
        margin: [0, 0, 0, 25],
      },

      // ---------------------- SEPARATOR LINE -------------------------
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 515,
            y2: 0,
            lineWidth: 0.8,
            lineColor: "#cccccc",
          },
        ],
        margin: [0, 10, 0, 15],
      },

      // ---------------------- ITEMS TABLE -------------------------
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "auto", "auto"],
          body: [
            [
              { text: "S.No", style: "tableHeader" },
              { text: "Particulars", style: "tableHeader" },
              { text: "Price", style: "tableHeader" },
              { text: "Qty", style: "tableHeader" },
              { text: "Amount", style: "tableHeader" },
            ],
            ...bill.items.map((row: any, i: number) => [
              i + 1,
              `${row.itemName} — ${row.billingItemCharge?.chargeType?.BillItemTypeName || ""}`,
              `₹${row.price}`,
              row.units,
              `₹${row.totalAmount}`,
            ]),
          ],
        },
        layout: "lightHorizontalLines",
      },

      // ---------------------- TOTALS -------------------------
      {
        style: "totals",
        margin: [0, 20, 0, 0],
        table: {
          widths: ["*", "auto"],
          body: [
            ["Subtotal", `₹${bill.subtotal}`],
            [
              "Discount",
              `-₹${Number(bill.totalDiscount) + Number(bill.overallDiscountValue)}`,
            ],
            ["GST", `₹${bill.totalTax}`],
            [
              { text: "Net Amount", bold: true },
              { text: `₹${bill.netAmount}`, bold: true },
            ],
            ["Paid", `₹${bill.amountPaid}`],
            bill.balanceDue > 0 ? ["Balance Due", `₹${bill.balanceDue}`] : [],
          ].filter((row) => row.length > 0),
        },
      },

      // ---------------------- PAYMENT HISTORY -------------------------
      {
        text: "Payment History",
        style: "sectionTitle",
        margin: [0, 25, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "*", "auto"], // ✅ Fixed: 4 columns
          body: [
            [
              { text: "Mode", style: "tableHeader" },
              { text: "Amount", style: "tableHeader" },
              { text: "Transaction Number", style: "tableHeader" },
              { text: "Date & Time", style: "tableHeader" },
            ],
            ...bill.payments.map((p: any) => [
              p.paymentMode,
              `₹${p.amount}`,
              p.PaymentReceptNo || "-",
              formatPaymentDate(p.createdAt),
            ]),
          ],
        },
        layout: "lightHorizontalLines",
      },

      {
        text: "\nThank you for visiting LightningQ!",
        style: "footer",
      },
    ],

    styles: {
      header: { fontSize: 20, bold: true, alignment: "center" },
      subheader: { fontSize: 10, alignment: "center", color: "#666" },
      title: { fontSize: 16, bold: true, alignment: "center", margin: [0, 10] },
      field: { fontSize: 11, margin: [0, 2] },
      sectionTitle: { fontSize: 13, bold: true, margin: [0, 5] },
      tableHeader: { bold: true, fillColor: "#e5e5e5" },
      totals: { alignment: "right" },
      footer: { alignment: "center", margin: [0, 30], color: "gray" },
    },
  };

  pdfMake.createPdf(docDefinition).open();
}
