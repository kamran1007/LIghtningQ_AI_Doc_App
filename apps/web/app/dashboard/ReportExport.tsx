"use client";

import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface ReportExportProps {
  reportData: any;
  hospitalInfo: {
    name: string;
    address: string;
    code: string;
    email: string;
    contact: string;
  };
}

const ReportExport: React.FC<ReportExportProps> = ({
  reportData,
  hospitalInfo,
}) => {
  // -------------------- Export PDF --------------------
  const exportPDF = () => {
    const doc = new jsPDF("p", "pt");
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 40;
    const rightMargin = 40;
    let yOffset = 40;

    // -------------------- Header --------------------
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(hospitalInfo.name, pageWidth / 2, yOffset, { align: "center" });

    yOffset += 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const wrapText = (text: string, yStart: number) => {
      const splitText = doc.splitTextToSize(
        text,
        pageWidth - leftMargin - rightMargin
      );
      doc.text(splitText, pageWidth / 2, yStart, { align: "center" });
      return yStart + splitText.length * 12; // 12pt line height
    };

    yOffset = wrapText(`Address: ${hospitalInfo.address}`, yOffset);
    yOffset = wrapText(`Hospital Code: ${hospitalInfo.code}`, yOffset);
    yOffset = wrapText(`Email: ${hospitalInfo.email}`, yOffset);
    yOffset = wrapText(`Contact: ${hospitalInfo.contact}`, yOffset);

    yOffset += 10;
    doc.setDrawColor(0);
    doc.setLineWidth(0.8);
    doc.line(leftMargin, yOffset, pageWidth - rightMargin, yOffset); // separator line
    yOffset += 20;

    // -------------------- Helper: render table --------------------
    const renderTable = (
      title: string,
      columns: { key: string; label: string }[],
      data: any[]
    ) => {
      if (!data?.length) return;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, leftMargin, yOffset);
      yOffset += 10;

      autoTable(doc, {
        startY: yOffset,
        head: [columns.map((c) => c.label)],
        body: data.map((row) => columns.map((c) => row[c.key] ?? "")),
        theme: "grid",
        headStyles: {
          fillColor: [0, 180, 180],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: { fontSize: 9, cellPadding: 4 },
        margin: { left: leftMargin, right: rightMargin },
        didDrawPage: (dataArg) => {
          if (dataArg.cursor) {
            yOffset = dataArg.cursor.y + 20;
          }
        },
      });
    };

    // -------------------- Render All Tables --------------------
    renderTable(
      "Appointment Trend",
      [
        { key: "time", label: "Date" },
        { key: "appointments", label: "Appointments" },
      ],
      reportData?.appointmentTrend
    );

    renderTable(
      "Revenue Trend",
      [
        { key: "time", label: "Date" },
        { key: "month", label: "Month" },
        { key: "revenue", label: "Amount (INR)" },
      ],
      reportData?.revenueTrend
    );

    renderTable(
      "Doctor Performance",
      [
        { key: "date", label: "Date" },
        { key: "doctorName", label: "Doctor Name" },
        { key: "appointments", label: "No. of Appointments" },
        { key: "revenue", label: "Revenue" },
      ],
      reportData?.doctorPerformance
    );

    renderTable(
      "Specialization Performance",
      [
        { key: "date", label: "Date" },
        { key: "specializationName", label: "Specialist" },
        { key: "appointments", label: "No. of Appointments" },
        { key: "revenue", label: "Revenue" },
      ],
      reportData?.specializationPerformance
    );

    // -------------------- Footer: page numbers --------------------
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    doc.save(`Hospital_Report_${hospitalInfo.name}.pdf`);
  };

  // -------------------- Export Excel --------------------
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    const addSheet = (
      sheetName: string,
      data: any[],
      columns: { key: string; label: string }[]
    ) => {
      if (!data?.length) return;
      const wsData = [
        columns.map((c) => c.label),
        ...data.map((row) => columns.map((c) => row[c.key] ?? "")),
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    };

    addSheet("Appointment Trend", reportData?.appointmentTrend, [
      { key: "time", label: "Date" },
      { key: "appointments", label: "Appointments" },
    ]);

    addSheet("Revenue Trend", reportData?.revenueTrend, [
      { key: "time", label: "Date" },
      { key: "month", label: "Month" },
      { key: "revenue", label: "Amount (INR)" },
    ]);

    addSheet("Doctor Performance", reportData?.doctorPerformance, [
      { key: "date", label: "Date" },
      { key: "doctorName", label: "Doctor Name" },
      { key: "appointments", label: "No. of Appointments" },
      { key: "revenue", label: "Revenue" },
    ]);

    addSheet(
      "Specialization Performance",
      reportData?.specializationPerformance,
      [
        { key: "date", label: "Date" },
        { key: "specializationName", label: "Specialist" },
        { key: "appointments", label: "No. of Appointments" },
        { key: "revenue", label: "Revenue" },
      ]
    );

    XLSX.writeFile(wb, `Hospital_Report_${hospitalInfo.name}.xlsx`);
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        onClick={exportPDF}
      >
        Export PDF
      </button>
      <button
        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
        onClick={exportExcel}
      >
        Export Excel
      </button>
    </div>
  );
};

export default ReportExport;
