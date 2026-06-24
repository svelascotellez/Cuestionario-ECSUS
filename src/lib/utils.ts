export function parseTechIssues(q1_techIssue: string) {
  let equipo = 'No'
  let internet = 'No'
  let impresora = 'No'

  if (!q1_techIssue) {
    return { equipo: 'N/A', internet: 'N/A', impresora: 'N/A' }
  }

  // Check if it's in the new format: "Equipo: Sí, Internet: No, Impresora: No"
  if (q1_techIssue.includes('Equipo:') || q1_techIssue.includes('Internet:') || q1_techIssue.includes('Impresora:')) {
    const parts = q1_techIssue.split(', ')
    parts.forEach(part => {
      const [key, value] = part.split(': ')
      if (key && value) {
        const cleanKey = key.trim().toLowerCase()
        const cleanVal = value.trim()
        if (cleanKey === 'equipo') equipo = cleanVal
        if (cleanKey === 'internet') internet = cleanVal
        if (cleanKey === 'impresora') impresora = cleanVal
      }
    })
  } else {
    // Parse old format (comma-separated list of checked categories or "No")
    const cleanLower = q1_techIssue.toLowerCase()
    if (cleanLower !== 'no') {
      if (cleanLower.includes('cómputo') || cleanLower.includes('computo') || cleanLower.includes('equipo')) {
        equipo = 'Sí'
      }
      if (cleanLower.includes('internet')) {
        internet = 'Sí'
      }
      if (cleanLower.includes('impresora')) {
        impresora = 'Sí'
      }
    }
  }

  return { equipo, internet, impresora }
}
