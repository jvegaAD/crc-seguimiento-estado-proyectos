import html2canvas from 'html2canvas';

export const sendEmail = async (company: string, tableId: string) => {
  try {
    const table = document.querySelector(`#${tableId}`);
    if (!table) {
      console.error('Table not found:', tableId);
      return false;
    }
    
    // Temporarily hide filter elements
    const filterElements = table.querySelectorAll('.filter-container, .filter-button, .filter-indicator');
    const hiddenElements: HTMLElement[] = [];
    
    filterElements.forEach(el => {
      if (el instanceof HTMLElement) {
        hiddenElements.push(el);
        el.style.display = 'none';
      }
    });
    
    // Capture table as image
    const canvas = await html2canvas(table as HTMLElement);
    
    // Restore visibility of filter elements
    hiddenElements.forEach(el => {
      el.style.display = '';
    });
    
    const imageDataUrl = canvas.toDataURL('image/png');
    
    let emailBody = `Resumen de Proyectos a cargo de ${company}:\n\n`;
    
    // Add image placeholder with attachment cid reference
    emailBody += `[Esta es una imagen del resumen de proyectos. Si no la visualiza, active las imágenes en su cliente de correo]\n\n`;
    
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
    
    // For desktop email clients, we can use the mailto protocol
    // But it doesn't support image attachments, so we'll notify users
    const mailtoLink = `mailto:jvega.CRC@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody + "\n\n[La imagen de la tabla se ha omitido debido a limitaciones del protocolo mailto. Para incluir imágenes, utilice un cliente de correo electrónico.]")}`;
    
    // Get report date from Index.tsx (or could be passed as parameter)
    const reportDate = "12/03/2025";
    
    // Open in a new tab to give the option to download the image
    const imageWindow = window.open('');
    if (imageWindow) {
      imageWindow.document.write(`
        <html>
          <head>
            <title>Resumen de Proyectos - ${company}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 0; 
                margin: 0;
                background-color: #f5f7fa;
                color: #333;
              }
              .container {
                background-color: white;
                width: 100%;
                padding: 20px 0;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 1px solid #e5e7eb;
                padding: 0 20px 20px;
              }
              h2 {
                color: #2d3748;
                margin-bottom: 8px;
              }
              .date {
                color: #718096;
                font-size: 14px;
                margin-bottom: 20px;
              }
              .image-container {
                width: 100%;
                text-align: center;
              }
              img { 
                max-width: 100%;
                width: 100%;
                display: block;
                margin: 0 auto;
              }
              .buttons { 
                display: flex;
                justify-content: center;
                gap: 15px;
                margin: 20px 0;
                padding: 0 20px;
              }
              button { 
                padding: 12px 24px; 
                cursor: pointer; 
                background-color: #2b6cb0; 
                color: white; 
                border: none; 
                border-radius: 4px;
                font-weight: 500;
                transition: all 0.2s ease;
              }
              button:hover { 
                background-color: #1e4e8c;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Resumen de Proyectos a cargo de ${company}</h2>
                <div class="date">Fecha del informe: ${reportDate}</div>
              </div>
              
              <div class="image-container">
                <img src="${imageDataUrl}" alt="Resumen de Proyectos ${company}" />
              </div>
              
              <div class="buttons">
                <button onclick="window.location.href='${mailtoLink}'">Abrir Cliente de Correo</button>
                <button onclick="downloadImage()">Descargar Imagen</button>
              </div>
            </div>
            
            <script>
              function downloadImage() {
                const a = document.createElement('a');
                a.href = "${imageDataUrl}";
                a.download = "Resumen_Proyectos_${company.replace(/\s+/g, '_')}.png";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
            </script>
          </body>
        </html>
      `);
      imageWindow.document.close();
    }
    
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
