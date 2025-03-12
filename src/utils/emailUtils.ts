
export const sendEmail = (company: string, tableId: string) => {
  try {
    const table = document.querySelector(`#${tableId}`);
    if (!table) {
      console.error('Table not found:', tableId);
      return;
    }
    
    let emailBody = `Resumen de Proyectos para ${company}:\n\n`;
    
    // Get headers
    const headers = Array.from(table.querySelectorAll('th'))
      .map(th => {
        // Clean header text by removing any sort icons or extra spaces
        const text = th.textContent || '';
        return text.replace(/[↑↓⇕]/g, '').trim();
      })
      .filter(header => header);
    
    // Get rows
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    rows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('td'));
      const rowData = cells.map(cell => cell.textContent?.trim() || '');
      
      // Format each row as "Header: Value" pairs
      const rowContent = headers
        .map((header, i) => `${header}: ${rowData[i] || 'N/A'}`)
        .join('\n\n');
      
      emailBody += rowContent + '\n\n\n';
    });
    
    const subject = `Estatus de desarrollo Proyecto para ${company}`;
    const mailtoLink = `mailto:jvega.CRC@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Create and click a temporary link
    const tempLink = document.createElement('a');
    tempLink.href = mailtoLink;
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sortTable = (columnIndex: number, tableId: string) => {
  const table = document.getElementById(tableId) as HTMLTableElement;
  if (!table) return;
  
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  
  const header = table.querySelectorAll('th')[columnIndex];
  if (!header) return;
  
  // Determine sort direction
  let dir = 'asc';
  if (header.classList.contains('asc')) {
    dir = 'desc';
    header.classList.remove('asc');
    header.classList.add('desc');
  } else if (header.classList.contains('desc')) {
    dir = 'asc';
    header.classList.remove('desc');
    header.classList.add('asc');
  } else {
    header.classList.add('asc');
  }
  
  // Reset other headers
  const headers = table.querySelectorAll('th');
  headers.forEach((h, i) => {
    if (i !== columnIndex) {
      h.classList.remove('asc', 'desc');
    }
  });
  
  // Get all rows from the tbody
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  // Sort the rows
  const sortedRows = rows.sort((a, b) => {
    const cellA = a.querySelectorAll('td')[columnIndex]?.textContent?.toLowerCase() || '';
    const cellB = b.querySelectorAll('td')[columnIndex]?.textContent?.toLowerCase() || '';
    
    if (dir === 'asc') {
      return cellA > cellB ? 1 : -1;
    } else {
      return cellA < cellB ? 1 : -1;
    }
  });
  
  // Remove existing rows
  rows.forEach(row => tbody.removeChild(row));
  
  // Add sorted rows
  sortedRows.forEach(row => tbody.appendChild(row));
};
