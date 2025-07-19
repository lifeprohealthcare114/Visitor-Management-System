import React from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Correct import
import './ExportButton.css';

function ExportButton({ data }) {
  const exportToExcel = () => {
    if (data.length === 0) {
      alert('No data to export!');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Visitors");

    XLSX.writeFile(workbook, `visitors_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    if (data.length === 0) {
      alert('No data to export!');
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Visitor Registrations", 14, 22);

    const tableColumn = [
      "ID", "Name", "Company",
      "Designation", "Phone", "Email",
      "Purpose", "Comment", "Date"
    ];

    const tableRows = data.map(visitor => ([
      visitor.id,
      `${visitor.title} ${visitor.firstName} ${visitor.lastName}`.trim(),
      visitor.companyName || "-",
      visitor.designation || "-",
      visitor.phone || "-",
      visitor.email || "-",
      visitor.purpose || "-",
      visitor.comment || "-",
      new Date(visitor.registrationDate).toLocaleDateString()
    ]));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [40, 167, 69] },
    });

    doc.save(`visitors_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="export-buttons-container">
      <button onClick={exportToExcel} className="export-button">
        Export to Excel
      </button>
      <button onClick={exportToPDF} className="export-button pdf-button">
        Export to PDF
      </button>
    </div>
  );
}

export default ExportButton;
