
import html2canvas from 'html2canvas';
import { Clipboard, ClipboardCheck } from 'lucide-react';

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
    
    // Updated email configuration as requested
    const subject = `CRC - Estatus de desarrollo Proyecto para ${company}`;
    const emailBody = `Estimado,
Adjunto el estatus de estado de los proyectos en que se encuentra colaborando, por favor atender las fechas y comentarios.

Resumen de Proyectos a cargo de ${company}
Fecha del informe: ${new Date().toLocaleDateString('es-ES')}

[Espacio para pegar la Foto de la tabla]`;
    
    // For desktop email clients, we can use the mailto protocol
    const mailtoLink = `mailto:jvega.CRC@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Get report date from Index.tsx (or could be passed as parameter)
    const reportDate = new Date().toLocaleDateString('es-ES');
    
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
                width: 90%;
                max-width: 1200px;
                margin: 20px auto;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                border-radius: 8px;
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
                padding: 20px;
                box-sizing: border-box;
              }
              img { 
                max-width: 100%;
                width: auto;
                display: block;
                margin: 0 auto;
                border: 1px solid #e5e7eb;
                border-radius: 4px;
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
                display: flex;
                align-items: center;
                gap: 8px;
              }
              button:hover { 
                background-color: #1e4e8c;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              .copy-success {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #10b981;
                color: white;
                padding: 10px 16px;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                opacity: 0;
                pointer-events: none;
              }
              .copy-success.show {
                opacity: 1;
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
                <button onclick="window.location.href='${mailtoLink}'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                  Abrir Cliente de Correo
                </button>
                <button onclick="downloadImage()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar Imagen
                </button>
                <button onclick="copyToClipboard()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copiar al Portapapeles
                </button>
              </div>
              <div id="copySuccess" class="copy-success">¡Imagen copiada al portapapeles!</div>
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

              async function copyToClipboard() {
                try {
                  // Convert the image to a blob
                  const response = await fetch("${imageDataUrl}");
                  const blob = await response.blob();
                  
                  // Use the clipboard API to copy the image
                  await navigator.clipboard.write([
                    new ClipboardItem({
                      [blob.type]: blob
                    })
                  ]);
                  
                  // Show success message
                  const successEl = document.getElementById('copySuccess');
                  successEl.classList.add('show');
                  setTimeout(() => {
                    successEl.classList.remove('show');
                  }, 3000);
                } catch (err) {
                  console.error('Error copying to clipboard:', err);
                  alert('No se pudo copiar la imagen al portapapeles. Por favor, descargue la imagen e intente copiarla manualmente.');
                }
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
