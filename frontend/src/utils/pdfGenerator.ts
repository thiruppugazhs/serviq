import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DashboardStats } from '../types';

export const generateFleetReportPDF = (
  stats: DashboardStats | null,
  companyName: string = 'ORCHIDS The International School (SAT)'
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const generatedTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Top Accent Banner (SERVIQ Navy/Blue)
  doc.setFillColor(35, 53, 242); // #2335f2
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Header Area
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('SERVIQ', 40, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('Commercial Fleet Intelligence & Operations Platform', 40, 62);

  // Report Title & Meta (Right Aligned)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('FLEET OPERATIONS REPORT', pageWidth - 40, 48, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${currentDate} ${generatedTime}`, pageWidth - 40, 62, { align: 'right' });

  // Thin separator line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(1);
  doc.line(40, 75, pageWidth - 40, 75);

  // Organization Information Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(40, 88, pageWidth - 80, 52, 6, 6, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(40, 88, pageWidth - 80, 52, 6, 6, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('ORGANIZATION / SCHOOL', 55, 105);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(companyName, 55, 124);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Status: Verified Active Tier`, pageWidth - 55, 124, { align: 'right' });

  // Key KPI Cards Grid (4 boxes)
  const cardY = 152;
  const cardWidth = (pageWidth - 80 - 30) / 4;
  const cardHeight = 60;

  const kpis = [
    { label: 'TOTAL FLEET', val: `${stats?.vehicles.total || 0} Vehicles`, sub: `${stats?.vehicles.available || 0} Ready on Road`, color: [35, 53, 242] },
    { label: 'DRIVER WORKFORCE', val: `${stats?.drivers.total || 0} Drivers`, sub: `${stats?.drivers.active || 0} Active on Duty`, color: [16, 185, 129] },
    { label: 'PENDING SERVICES', val: `${(stats?.maintenance.dueOrOverdue || 0) + (stats?.repairs.active || 0)} Items`, sub: `${stats?.maintenance.dueOrOverdue || 0} Maint | ${stats?.repairs.active || 0} Repairs`, color: [245, 158, 11] },
    { label: 'TOTAL SPEND', val: `Rs. ${(stats?.expenses.totalSpent || 0).toLocaleString('en-IN')}`, sub: 'Fuel & Operations', color: [15, 23, 42] },
  ];

  kpis.forEach((kpi, index) => {
    const x = 40 + index * (cardWidth + 10);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, cardY, cardWidth, cardHeight, 6, 6, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, cardY, cardWidth, cardHeight, 6, 6, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 10, cardY + 16);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.text(kpi.val, x + 10, cardY + 34);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.sub, x + 10, cardY + 48);
  });

  // Section 1: Detailed Operational Audit Metrics Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Operational Fleet Metrics & Breakdown', 40, 236);

  const metricsBody = [
    ['Total Registered Fleet Vehicles', `${stats?.vehicles.total || 0} Units`, 'Commercial buses, vans, pickups registered'],
    ['Operational Vehicles on Road', `${stats?.vehicles.available || 0} Units`, 'Fully roadworthy & compliance cleared'],
    ['Vehicles In Workshop / Service', `${stats?.vehicles.inShop || 0} Units`, 'Scheduled maintenance or under active repair'],
    ['Total Commercial Drivers', `${stats?.drivers.total || 0} Drivers`, 'Verified with commercial driving licenses'],
    ['Active Drivers on Duty', `${stats?.drivers.active || 0} Drivers`, 'Available or currently on assigned vehicle trip'],
    ['Routine Maintenance Due / Overdue', `${stats?.maintenance.dueOrOverdue || 0} Tasks`, 'Periodic FC inspection, oil change, brake tests'],
    ['Open Defect & Repair Tickets', `${stats?.repairs.active || 0} Issues`, 'Reported vehicle mechanical/electrical issues'],
    ['Total Recorded Fleet Spend', `Rs. ${(stats?.expenses.totalSpent || 0).toLocaleString('en-IN')}`, 'Verified fuel fill-ups, workshop bills, and toll fees'],
  ];

  autoTable(doc, {
    startY: 246,
    head: [['Fleet Metric', 'Current Count / Value', 'Operational Context']],
    body: metricsBody,
    theme: 'grid',
    headStyles: {
      fillColor: [35, 53, 242],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [51, 65, 85],
      cellPadding: 5.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    styles: {
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    margin: { left: 40, right: 40 },
  });

  // Section 2: Fleet Compliance & Regulatory Status
  const nextY = (doc as any).lastAutoTable.finalY + 22;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Regulatory Compliance & Safety Protocols', 40, nextY);

  const complianceBody = [
    ['Vehicle Registration (RC)', 'Mandatory', 'Digital copy & registration ID stored in Vault'],
    ['Fitness Certificate (FC Book)', 'Mandatory', 'Quarterly/annual RTO fitness renewal tracking'],
    ['Commercial State & Interstate Permits', 'Active Compliance', 'Inter-district & interstate routing licenses'],
    ['Comprehensive Motor Insurance', 'Protected', 'Third-party & collision cover valid tracking'],
    ['Pollution Under Control (PUC)', 'Verified', 'Emission compliance logged per motor vehicle norms'],
  ];

  autoTable(doc, {
    startY: nextY + 10,
    head: [['Compliance Category', 'Audit Status', 'Standard Compliance Policy']],
    body: complianceBody,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42], // Slate-900
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [51, 65, 85],
      cellPadding: 5.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    styles: {
      lineColor: [226, 232, 240],
      lineWidth: 0.5,
    },
    margin: { left: 40, right: 40 },
  });

  // Footer Note
  const footerY = pageHeight - 30;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.line(40, footerY - 10, pageWidth - 40, footerY - 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('SERVIQ Fleet Management Systems · Confidential Document · Generated for Administration Records', 40, footerY);
  doc.text(`Page 1 of 1`, pageWidth - 40, footerY, { align: 'right' });

  // Save PDF file
  const fileName = `serviq-fleet-report-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
};
