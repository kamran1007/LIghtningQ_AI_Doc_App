export function generateScheduledReportHtml(reportData: any) {
  const {
    frequency,
    reportTypes,
    generatedAt,
    sections,
    hospitalInfo 
  } = reportData;

  return `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .hospital-header {
          background-color: #f9f9f9;
          border-bottom: 2px solid #00b3b3;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .hospital-left {
          display: flex;
          flex-direction: column;
        }
        .hospital-name {
          font-size: 20px;
          font-weight: bold;
          color: #003366;
          margin: 0;
        }
        .hospital-code {
          font-size: 12px;
          color: #555;
        }
        .hospital-address {
          font-size: 14px;
          color: #555;
        }
        .hospital-right {
          text-align: right;
          font-size: 12px;
          color: #444;
        }
        .hospital-right div {
          margin-bottom: 3px;
        }
        h1 { color: #008080; margin-top: 20px; }
        .section {
          margin-bottom: 20px;
          border: 1px solid #eee;
          padding: 10px;
          border-radius: 8px;
        }
        .section h2 {
          margin-bottom: 8px;
          color: #444;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        th {
          background-color: #f4f4f4;
        }
      </style>
    </head>
    <body>

      <!-- Modern Hospital Header -->
      <div class="hospital-header">
        <div class="hospital-left">
          <div class="hospital-name">${hospitalInfo.name}</div>
          <div class="hospital-code">Hospital Code: ${hospitalInfo.code}</div>
          <div class="hospital-address">${hospitalInfo.Address}</div>
        </div>

        <div class="hospital-right">
          <div>📧 ${hospitalInfo.email}</div>
          <div>📞 ${hospitalInfo.mobile}</div>
        </div>
      </div>

      <h1>📊 ${frequency} Scheduled Report</h1>
      <p>Generated at: ${generatedAt}</p>
      <p>Included Sections: ${reportTypes.join(", ")}</p>

      ${sections.map((section: any) => `
        <div class="section">
          <h2>${section.title}</h2>
          ${section.type === 'table' ? `
            <table>
              <thead>
                <tr>${section.headers.map((h: string) => `<th>${h}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${section.rows.map((row: any[]) => `
                  <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
                `).join('')}
              </tbody>
            </table>
          ` : `<p>${section.content}</p>`}
        </div>
      `).join('')}
    </body>
  </html>
  `;
}
