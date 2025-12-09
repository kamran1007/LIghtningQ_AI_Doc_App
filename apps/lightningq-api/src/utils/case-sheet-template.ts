export function generateCaseSheetHtml(
  patientName: string,
  appointmentId: number,
  consultation: any,
  appointmentDetails: any,
) {
  const { hospital, patient, doctor, Vitals } = appointmentDetails;
  console.log('🏥 Hospital:', Vitals);
const vital = Array.isArray(Vitals)
  ? Vitals[0]
  : (typeof Vitals === "object" ? Vitals : null);
  console.log('📊 Vitals Count:', vital);
  console.log(
    '🩺 Procedures Count:',
    consultation.ConsultationProcedure?.length,
  );

  const vitalsBlock = vital
    ? `
    ${vital.Systolic ? `<tr><td>Blood Pressure</td><td>${vital.Systolic}/${vital.Diastolic} mmHg</td></tr>` : ''}
    ${vital.Temperature ? `<tr><td>Temperature</td><td>${vital.Temperature} °F</td></tr>` : ''}
    ${vital.HeartRate ? `<tr><td>Heart Rate</td><td>${vital.HeartRate} bpm</td></tr>` : ''}
    ${vital.OxygenSaturation ? `<tr><td>Oxygen Saturation</td><td>${vital.OxygenSaturation}%</td></tr>` : ''}
    ${vital.Weight ? `<tr><td>Weight</td><td>${vital.Weight} kg</td></tr>` : ''}
    ${vital.Height ? `<tr><td>Height</td><td>${vital.Height} cm</td></tr>` : ''}
    ${vital.BMI ? `<tr><td>BMI</td><td>${vital.BMI}</td></tr>` : ''}
    ${vital.BloodGroup ? `<tr><td>Blood Group</td><td>${vital.BloodGroup.replace('_', '+')}</td></tr>` : ''}
  `
    : '';

  const calculateAge = (dobString: string) => {
    if (!dobString) return '-';
    const dob = new Date(dobString);
    const now = new Date();

    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
  };

  const age = calculateAge(patient?.dateOfBirth);

  const medicationsTable =
    consultation.ConsultationMedication?.map(
      (m: any) => `
        <tr>
          <td>${m.medicationName}</td>
          <td>${m.dosage}</td>
          <td>${m.frequency}</td>
          <td>${m.duration}</td>
          <td>${m.remarks}</td>
        </tr>`,
    ).join('') || '';

  // 🩺 Procedures Section
  const proceduresBlock =
    consultation.ConsultationProcedure?.length > 0
      ? `
        <div class="section">
          <h2>Procedures</h2>
          <table class="table">
            <thead>
              <tr><th>Procedure Name</th><th>Description</th></tr>
            </thead>
            <tbody>
              ${consultation.ConsultationProcedure.map(
                (p: any) => `
                <tr>
                  <td>${p.BillingItemCharge?.BillingItemName || '-'}</td>
                  <td>${p.ConsultationProcedureRemark || '-'}</td>
                </tr>`,
              ).join('')}
            </tbody>
          </table>
        </div>`
      : '';

  return `
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          padding: 30px;
          color: #333;
          background: #fff;
        }
        h1, h2 {
          margin-bottom: 8px;
          color: #111;
        }
        .section {
          margin-bottom: 30px;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          margin-top: 10px;
        }
        .table th, .table td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        .table th {
          background-color: #f9f9f9;
        }
        .header, .footer {
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          background: #f8f8f8;
        }
        .hospital-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }
        .hospital-name h2 {
          font-size: 16px;
          margin: 0 0 2px 0;
          color: #222;
          font-weight: 600;
        }
        .hospital-details {
          text-align: right;
          font-size: 13px;
          color: #444;
        }
        .hospital-details div {
          margin-bottom: 4px;
        }
        .hospital-address {
          font-size: 14px;
          color: #777;
          margin-top: 4px;
          text-align: right;
          border-top: 1px solid #ccc;
          padding-top: 4px;
        }
        .thin-divider {
          border-top: 1px solid #ccc;
          margin: 20px 0;
        }
        .patient-grid {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }
        .left, .right {
          width: 48%;
        }
        .field {
          display: flex;
          margin-bottom: 6px;
        }
        .label {
          width: 90px;
          font-weight: 600;
        }
        ul.custom-bullets {
          list-style: none;
          padding-left: 0;
        }
        ul.custom-bullets li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 8px;
        }
        ul.custom-bullets li::before {
          content: '●';
          position: absolute;
          left: 0;
          color: #22E0D4;
        }
      </style>
    </head>
    <body>

      <div class="header">
        <div class="hospital-header">
          <div><h2>${hospital?.HospitalName}</h2></div>
          <div class="hospital-details">
            <div>🏥 ${hospital?.HospitalCode || '-'}</div>
            <div>✆ ${hospital?.contactNumber || '-'}</div>
            <div>✉ ${hospital?.email || '-'}</div>
          </div>
        </div>
        <div class="hospital-address">${hospital?.address || '-'}</div>
      </div>

      <div class="thin-divider"></div>

      <div class="patient-grid">
        <div class="left">
          <div class="field"><div class="label">Name:</div><div>${patientName}</div></div>
          <div class="field"><div class="label">MRN:</div><div>${patient?.Patient_Medical_Record_No || '-'}</div></div>
          <div class="field"><div class="label">Gender:</div><div>${patient?.gender || '-'}</div></div>
          <div class="field"><div class="label">Age:</div><div>${age}</div></div>
          <div class="field"><div class="label">Phone:</div><div>${patient?.mobile || '-'}</div></div>
        </div>
        <div class="right">
          <div class="field"><div class="label">Doctor:</div><div>Dr. ${doctor?.firstName} ${doctor?.lastName}</div></div>
          <div class="field"><div class="label">Appointment Date:</div><div>${new Date(
            consultation.consultationDatTime,
          ).toLocaleString()}</div></div>
        </div>
      </div>

      <div class="thin-divider"></div>

      <div class="section">
        <h2>Chief Complaints</h2>
        <ul class="custom-bullets">
          ${
            consultation.ConsultationCheifComplaint?.map(
              (c: any) => `
              <li><strong>${c.chiefComplaint?.ChiefComplainTagName}</strong>${
                consultation.CheifcomplaintNotes
                  ? ` : ${consultation.CheifcomplaintNotes}`
                  : ''
              }</li>`,
            ).join('') || ''
          }
        </ul>
      </div>

      <div class="section">
        <h2>Diagnosis</h2>
        <ul class="custom-bullets">
          ${
            consultation.ConsultationDiagnosis?.map(
              (d: any) =>
                `<li><strong>${d.diagnosis?.DiagnosisName}</strong> : ${d.DiagnosisRemark || '-'}</li>`,
            ).join('') || ''
          }
        </ul>
      </div>

      ${proceduresBlock}

      <div class="section">
        <h2>Vitals</h2>
        <table class="table">
          <thead><tr><th>Type</th><th>Value</th></tr></thead>
          <tbody>${vitalsBlock}</tbody>
        </table>
      </div>

      <div class="section">
        <h2>Medications</h2>
        <table class="table">
          <thead>
            <tr><th>Name</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Remarks</th></tr>
          </thead>
          <tbody>${medicationsTable}</tbody>
        </table>
      </div>

      <div class="section">
  <h2>Investigations</h2>
  <ul class="custom-bullets">
    ${
      consultation.ConsultationInvestigation?.map(
        (inv: any) => `
        <li>
          ${inv.BillingItemCharge?.BillingItemName || '-'}
          (${
            inv.BillingItemCharge?.InvestigationType?.InvestigationTypeName ||
            'N/A'
          })
          - ${inv.ConsultationInvestigatRemark || '-'}
        </li>`,
      ).join('') || ''
    }
  </ul>
</div>


      <div class="section">
        <h2>Treatment Plan</h2>
        <ul class="custom-bullets">
          ${consultation.ConsultationTreatment?.map((t: any) => `<li>${t.treatmentText}</li>`).join('') || ''}
        </ul>
      </div>

      <div class="section">
        <h2>Follow-up</h2>
        <ul class="custom-bullets">
          ${
            consultation.ConsultationFollowUpPlan
              ? `<li>${consultation.ConsultationFollowUpPlan.followUpText}, After ${consultation.ConsultationFollowUpPlan.duration} ${consultation.ConsultationFollowUpPlan.unit}<br><strong>Next Date: ${new Date(
                  consultation.ConsultationFollowUpPlan.nextDate,
                ).toLocaleDateString()}</strong></li>`
              : ''
          }
        </ul>
      </div>

      <div class="footer">
        <p><strong>Doctor:</strong> Dr. ${doctor?.firstName} ${doctor?.lastName}</p>
        <p style="margin-top: 30px;">Signature: _______________________</p>
      </div>

    </body>
  </html>`;
}
