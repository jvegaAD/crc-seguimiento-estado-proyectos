import html2canvas from 'html2canvas';
import { Clipboard, ClipboardCheck } from 'lucide-react';

// This function handles both copying the image to clipboard and opening the email dialog
export const sendEmail = async (company: string, tableId: string, reportDate: string) => {
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
    
    // Automatically copy the image to clipboard
    try {
      // Convert the image to a blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      // Use the clipboard API to copy the image
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      console.log('Image copied to clipboard successfully');
    } catch (clipboardError) {
      console.error('Error copying to clipboard:', clipboardError);
      // Continue execution even if clipboard copy fails
    }
    
    // Updated email configuration
    const formattedDate = reportDate || new Date().toLocaleDateString('es-ES');
    const subject = `CRC - Estatus de desarrollo Proyecto para ${company}`;
    const emailBody = `Estimado,
Adjunto el estatus de estado de los proyectos en que se encuentra colaborando, por favor atender las fechas y comentarios.

Resumen de Proyectos a cargo de ${company}
Fecha del informe: ${formattedDate}

[Espacio para pegar la Foto de la tabla]`;
    
    // For desktop email clients, we can use the mailto protocol
    const mailtoLink = `mailto:jvega.CRC@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open the default email client
    window.location.href = mailtoLink;
    
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
