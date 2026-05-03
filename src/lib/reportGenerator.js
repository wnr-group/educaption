import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function generateCutoffReport({ studentName, group, marks, cutoffResults, language = 'en' }) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // Header
  doc.setFontSize(20)
  doc.setTextColor(30, 64, 120)
  doc.text('Educaption', pageWidth / 2, y, { align: 'center' })
  y += 8

  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text('Cutoff Score Report', pageWidth / 2, y, { align: 'center' })
  y += 6

  doc.setFontSize(9)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, y, { align: 'center' })
  y += 10

  doc.setDrawColor(30, 64, 120)
  doc.setLineWidth(0.5)
  doc.line(14, y, pageWidth - 14, y)
  y += 10

  // Student Info
  doc.setFontSize(13)
  doc.setTextColor(30, 30, 30)
  doc.text('Student Information', 14, y)
  y += 8

  const groupName = language === 'ta' ? (group.name_ta || group.name) : group.name
  const studentInfoRows = [
    ['Name', studentName || 'N/A'],
    ['Group', `${group.code} — ${groupName}`]
  ]

  const subjects = Object.entries(marks)
  for (const [subject, mark] of subjects) {
    studentInfoRows.push([subject, String(mark)])
  }

  autoTable(doc, {
    startY: y,
    head: [['Field', 'Value']],
    body: studentInfoRows,
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 120], fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } }
  })

  y = doc.lastAutoTable.finalY + 12

  // Cutoff Scores Summary
  doc.setFontSize(13)
  doc.setTextColor(30, 30, 30)
  doc.text('Cutoff Scores', 14, y)
  y += 8

  const cutoffRows = cutoffResults.flatMap(body => {
    const bodyName = language === 'ta'
      ? (body.admissionBodyDisplayNameTa || body.admissionBodyName)
      : (body.admissionBodyDisplayName || body.admissionBodyName)
    return body.cutoffGroups.map(g => [
      bodyName,
      `${g.cutoff}`,
      `${g.maxCutoff}`,
      `${g.courses.length}`
    ])
  })

  autoTable(doc, {
    startY: y,
    head: [['Admission Body', 'Cutoff', 'Max', 'Courses']],
    body: cutoffRows,
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 120], fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 14, right: 14 }
  })

  y = doc.lastAutoTable.finalY + 12

  // Eligible Courses by body
  for (const body of cutoffResults) {
    if (y > 250) {
      doc.addPage()
      y = 20
    }

    const bodyName = language === 'ta'
      ? (body.admissionBodyDisplayNameTa || body.admissionBodyName)
      : (body.admissionBodyDisplayName || body.admissionBodyName)

    doc.setFontSize(12)
    doc.setTextColor(30, 64, 120)
    doc.text(bodyName, 14, y)
    y += 8

    for (const cutoffGroup of body.cutoffGroups) {
      if (y > 260) {
        doc.addPage()
        y = 20
      }

      const courseRows = cutoffGroup.courses.map(c => {
        const name = language === 'ta' ? (c.courseNameTa || c.courseName) : c.courseName
        return [name, c.courseCategory || '', c.duration || '']
      })

      autoTable(doc, {
        startY: y,
        head: [[`Cutoff: ${cutoffGroup.cutoff}/${cutoffGroup.maxCutoff}`, 'Category', 'Duration']],
        body: courseRows,
        theme: 'striped',
        headStyles: { fillColor: [60, 120, 80], fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14, right: 14 }
      })

      y = doc.lastAutoTable.finalY + 6
    }

    y += 4
  }

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('https://www.educaption.in/', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 10, { align: 'right' })
  }

  doc.save(`educaption-cutoff-report-${Date.now()}.pdf`)
}
