import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

async function getLogoDataUrl() {
  try {
    const response = await fetch('/logo.png')
    const blob = await response.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function generateCutoffReport({ studentName, group, marks, cutoffResults, language = 'en' }) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 14

  // Header — logo left, title centred
  const logoDataUrl = await getLogoDataUrl()
  const logoSize = 18
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', 14, y - 4, logoSize, logoSize)
  }

  doc.setFontSize(20)
  doc.setTextColor(30, 64, 120)
  doc.text('Educaption', pageWidth / 2, y + 4, { align: 'center' })

  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text('Cutoff Score Report', pageWidth / 2, y + 12, { align: 'center' })

  doc.setFontSize(9)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, y + 18, { align: 'center' })

  y += 26

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
    head: [['Particulars', 'Value']],
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
      `${g.maxCutoff}`
    ])
  })

  autoTable(doc, {
    startY: y,
    head: [['Admission Body', 'Cutoff', 'Max']],
    body: cutoffRows,
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 120], fontSize: 10 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 14, right: 14 }
  })

  y = doc.lastAutoTable.finalY + 12

  // Eligible Courses by body
  doc.setFontSize(13)
  doc.setTextColor(30, 30, 30)
  doc.text('Eligible Courses', 14, y)
  y += 8

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
        margin: { left: 14, right: 14 },
        columnStyles: {
          0: { cellWidth: 112 },
          1: { cellWidth: 40, halign: 'left' },
          2: { cellWidth: 30, halign: 'left' }
        }
      })

      y = doc.lastAutoTable.finalY + 6
    }

    y += 4
  }

  // Useful Links section
  const bodyUrlMap = {
    'TNAU':        'https://tnau.ac.in/ugadmission/',
    'TNDALU':      'https://www.tndalu.ac.in/',
    'TNJFU':       'https://www.tnjfu.ac.in/ugadmissions',
    'TANUVAS':     'https://www.tanuvas.ac.in/ce_ugad.php',
    'PARAMEDICAL': 'https://tnmedicalselection.net/Notification.aspx'
  }

  const seenLinks = new Map()
  for (const body of cutoffResults) {
    const name = body.admissionBodyName || ''
    for (const [key, url] of Object.entries(bodyUrlMap)) {
      if (name.toUpperCase().includes(key) && !seenLinks.has(key)) {
        const label = key === 'PARAMEDICAL' ? 'TN Paramedical Counselling' : key
        seenLinks.set(key, { label, url })
      }
    }
  }

  if (seenLinks.size > 0) {
    if (y > 240) {
      doc.addPage()
      y = 20
    }
    doc.setFontSize(13)
    doc.setTextColor(30, 30, 30)
    doc.text('Useful Links', 14, y)
    y += 8

    for (const { label, url } of seenLinks.values()) {
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 80)
      doc.text(`${label}:`, 14, y)
      y += 5
      doc.setTextColor(30, 64, 120)
      doc.textWithLink(url, 20, y, { url })
      y += 7
    }
  }

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages()
  const siteUrl = 'https://www.educaption.in/'
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    const footerY = doc.internal.pageSize.getHeight() - 10
    doc.setFontSize(8)
    doc.setTextColor(30, 64, 120)
    doc.textWithLink(siteUrl, pageWidth / 2, footerY, { align: 'center', url: siteUrl })
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, footerY, { align: 'right' })
  }

  doc.save(`educaption-cutoff-report-${Date.now()}.pdf`)
}
