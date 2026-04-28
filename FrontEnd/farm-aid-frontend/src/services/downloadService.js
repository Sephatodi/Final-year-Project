import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class DownloadService {
  // ─── JSON ────────────────────────────────────────────────────────────────
  downloadJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    saveAs(blob, `${filename}.json`);
  }

  // ─── CSV ─────────────────────────────────────────────────────────────────
  downloadCSV(data, filename) {
    const csv = this._jsonToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  }

  // Helper method to convert JSON array to CSV
  _jsonToCSV(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return '';
    }
    
    const headers = Object.keys(data[0]);
    const headerRow = headers.map(h => this._escapeCSVField(h)).join(',');
    
    const rows = data.map(obj => 
      headers.map(header => this._escapeCSVField(obj[header])).join(',')
    );
    
    return [headerRow, ...rows].join('\n');
  }

  // Escape CSV field values that contain special characters
  _escapeCSVField(field) {
    const value = String(field ?? '');
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  // ─── Excel ───────────────────────────────────────────────────────────────
  // NOTE: Excel export removed due to security vulnerabilities in xlsx library
  // Use CSV export as an alternative for spreadsheet compatibility
  downloadExcel(data, filename, sheetName = 'Sheet1') {
    console.warn('[DownloadService] Excel export is deprecated. Use downloadCSV instead.');
    this.downloadCSV(data, filename);
  }

  // ─── PDF from HTML element ───────────────────────────────────────────────
  async downloadPDF(elementId, filename) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`[DownloadService] Element #${elementId} not found`);
      return;
    }
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData  = canvas.toDataURL('image/png');
      const pdf      = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgWidth = 210;
      const pageH    = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position   = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageH;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageH;
      }

      pdf.save(`${filename}.pdf`);
    } catch (err) {
      console.error('[DownloadService] PDF generation failed:', err);
      throw err;
    }
  }

  // ─── Structured report PDF ───────────────────────────────────────────────
  async generateReportPDF(reportData, filename) {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(18, 202, 73);
    pdf.text('Farm-Aid Report', 20, 20);

    pdf.setFontSize(11);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, 35, 190, 35);

    let y = 45;

    for (const section of reportData) {
      if (y > 270) { pdf.addPage(); y = 20; }

      pdf.setFontSize(13);
      pdf.setTextColor(30, 30, 30);
      pdf.text(section.title, 20, y);
      y += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      const lines = pdf.splitTextToSize(section.content, 170);
      pdf.text(lines, 20, y);
      y += lines.length * 5 + 10;
    }

    pdf.save(`${filename}.pdf`);
  }

  // ─── Farm summary PDF ────────────────────────────────────────────────────
  async generateFarmSummary(farmData, filename) {
    const pdf = new jsPDF();
    let y = 20;

    const green = [18, 202, 73];
    const black = [0, 0, 0];
    const gray  = [80, 80, 80];

    pdf.setFontSize(22); pdf.setTextColor(...green);
    pdf.text('Farm Summary Report', 20, y); y += 15;

    pdf.setFontSize(11); pdf.setTextColor(...black);
    pdf.text(`Farm Name:   ${farmData.farmName || 'N/A'}`, 20, y); y += 8;
    pdf.text(`Location:    ${farmData.location || 'N/A'}`, 20, y); y += 8;
    pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, y); y += 15;

    pdf.setFontSize(13); pdf.setTextColor(...green);
    pdf.text('Livestock Summary', 20, y); y += 10;

    pdf.setFontSize(11); pdf.setTextColor(...black);
    const s = farmData.stats || {};
    [
      `Total Animals: ${s.total || 0}`,
      `Cattle:        ${s.cattle || 0}`,
      `Goats:         ${s.goats || 0}`,
      `Sheep:         ${s.sheep || 0}`,
    ].forEach(line => { pdf.text(line, 20, y); y += 7; });
    y += 5;

    pdf.setFontSize(13); pdf.setTextColor(...green);
    pdf.text('Health Status', 20, y); y += 9;

    pdf.setFontSize(11); pdf.setTextColor(...gray);
    [
      `Healthy:  ${s.healthy || 0}`,
      `Sick:     ${s.sick || 0}`,
      `Critical: ${s.critical || 0}`,
    ].forEach(line => { pdf.text(line, 25, y); y += 6; });
    y += 8;

    pdf.setFontSize(13); pdf.setTextColor(...green);
    pdf.text('Vaccination Status', 20, y); y += 9;

    pdf.setFontSize(11); pdf.setTextColor(...gray);
    [
      `Vaccinated: ${s.vaccinated || 0}`,
      `Pending:    ${s.pendingVaccinations || 0}`,
    ].forEach(line => { pdf.text(line, 25, y); y += 6; });

    pdf.save(`${filename}.pdf`);
  }

  // ─── Domain-specific spreadsheet exports ─────────────────────────────────
  downloadLivestockReport(livestock, filename) {
    const rows = livestock.map(a => ({
      'BAITS Tag':      a.baitsTagNumber,
      'Name':           a.name        || 'N/A',
      'Species':        a.species,
      'Breed':          a.breed       || 'Mixed',
      'Gender':         a.gender,
      'Age':            a.age         || 'Unknown',
      'Weight (kg)':    a.weight      || 'N/A',
      'Health Status':  a.healthStatus,
      'Last Check':     a.lastHealthEvent || 'Never',
      'Created':        new Date(a.createdAt).toLocaleDateString(),
    }));
    this.downloadExcel(rows, filename, 'Livestock');
  }

  downloadDiseaseReports(reports, filename) {
    const rows = reports.map(r => ({
      'Report ID':        r.reportId,
      'Date':             new Date(r.submittedAt).toLocaleDateString(),
      'Species':          r.species,
      'Animals Affected': r.animalCount,
      'Location':         r.location,
      'Suspected Disease':r.suspectedDisease || 'Unknown',
      'Status':           r.status,
      'Priority':         r.priority,
    }));
    this.downloadExcel(rows, filename, 'Disease Reports');
  }

  downloadHealthRecords(records, filename) {
    const rows = records.map(r => ({
      'Date':         new Date(r.date).toLocaleDateString(),
      'Type':         r.type,
      'Title':        r.title,
      'Description':  r.description || 'N/A',
      'Performed By': r.performedBy || 'Self',
      'Medications':  r.medications?.join(', ') || 'None',
      'Follow-up':    r.followUp    || 'Not scheduled',
    }));
    this.downloadExcel(rows, filename, 'Health Records');
  }

  // ─── Consultation transcript (plain text) ────────────────────────────────
  downloadConsultationTranscript(messages, filename) {
    const transcript = messages
      .map(m => `[${new Date(m.timestamp).toLocaleString()}] ${m.senderName}: ${m.content}`)
      .join('\n\n');
    const blob = new Blob([transcript], { type: 'text/plain' });
    saveAs(blob, `${filename}.txt`);
  }

  // ─── Full offline data backup ─────────────────────────────────────────────
  async downloadOfflineBackup() {
    try {
      const db     = await import('../services/db');
      const stores = ['livestock', 'healthRecords', 'diseaseReports', 'consultations', 'messages'];
      const backup = {};

      for (const store of stores) {
        try {
          backup[store] = await db.getAllFromStore?.(store) ?? [];
        } catch {
          backup[store] = [];
        }
      }

      backup.metadata = {
        exportedAt: new Date().toISOString(),
        version:    '1.0',
        appName:    'Farm-Aid',
      };

      this.downloadJSON(backup, `farm-aid-backup-${new Date().toISOString().split('T')[0]}`);
    } catch (err) {
      console.error('[DownloadService] Backup failed:', err);
      throw err;
    }
  }

  // ─── Capture current page as PDF ─────────────────────────────────────────
  async downloadPageAsPDF(pageTitle, elementId = 'main-content') {
    const el = document.getElementById(elementId);
    if (el) {
      await this.downloadPDF(elementId, `${pageTitle}-${new Date().toISOString().split('T')[0]}`);
    } else {
      console.warn(`[DownloadService] #${elementId} not found for page capture`);
    }
  }
}

export default new DownloadService();
