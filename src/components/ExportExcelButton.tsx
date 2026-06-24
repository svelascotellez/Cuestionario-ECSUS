'use client'

import * as XLSX from 'xlsx'

export default function ExportExcelButton({ data }: { data: any[] }) {
  const exportToExcel = () => {
    // Format data specifically for export
    const formattedData = data.map(item => ({
      ID: item.id,
      Usuario: item.user.username,
      Fecha: new Date(item.createdAt).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
      'Unidad': item.unitNumber || 'N/A',
      Ubicación: item.location,
      'Situación Técnica': item.q1_techIssue,
      'Problemas Acceso/App': item.q2_accessIssue,
      'Interrupciones Energía': item.q3_powerIssue,
      'Requiere Capacitación': item.q4_trainingNeeded,
      'Comentarios': item.q5_comments
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados ECSUS')
    
    XLSX.writeFile(workbook, 'resultados_ecsus.xlsx')
  }

  return (
    <button onClick={exportToExcel} className="btn btn-primary" style={{ marginBottom: '1rem' }}>
      Descargar en Excel
    </button>
  )
}
