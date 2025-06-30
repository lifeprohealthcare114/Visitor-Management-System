import React from 'react';
import * as XLSX from 'xlsx';
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

  return (
    <button onClick={exportToExcel} className="export-button">
      Export to Excel
    </button>
  );
}

export default ExportButton;