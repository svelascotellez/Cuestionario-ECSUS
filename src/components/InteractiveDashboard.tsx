'use client'

import { useState, useMemo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar, Doughnut } from 'react-chartjs-2'
import { parseTechIssues } from '@/lib/utils'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const SPANISH_STOPWORDS = new Set([
  'de', 'la', 'el', 'en', 'y', 'a', 'que', 'un', 'una', 'con', 'no', 'sí', 'si',
  'por', 'para', 'es', 'al', 'del', 'lo', 'los', 'las', 'o', 'u', 'e', 'pero',
  'como', 'más', 'mas', 'este', 'esta', 'estos', 'estas', 'todo', 'todos', 'toda',
  'todas', 'sin', 'sobre', 'su', 'sus', 'mi', 'tu', 'te', 'me', 'se', 'le', 'les',
  'nos', 'os', 'ya', 'muy', 'también', 'ningún', 'ninguna', 'otro', 'otra', 'otros',
  'otras', 'hay', 'donde', 'cuando', 'quien', 'como', 'cual', 'cuales', 'ser', 'estar',
  'hacer', 'tener', 'poder', 'ver', 'ir', 'dar', 'saber', 'querer', 'deber', 'venir',
  'pensar', 'decir', 'porque', 'entonces', 'así', 'solo', 'sólo', 'tienen', 'tiene',
  'tenemos', 'tengo', 'había', 'habían', 'era', 'eran', 'fui', 'fueron', 'está',
  'están', 'estaba', 'estaban', 'bien', 'mal', 'mismo', 'misma', 'mismos', 'mismas',
  'cada', 'alguno', 'alguna', 'algunos', 'algunas', 'nada', 'algo', 'así', 'esta',
  'unidades', 'unidad', 'cuestionario', 'cuestionarios', 'cuesta', 'cuestas', 'pregunta',
  'preguntas', 'respuesta', 'respuestas', 'comentario', 'comentarios', 'favor', 'gracias',
  'hola', 'buenos', 'días', 'tardes', 'noches', 'estamos', 'equipo', 'internet', 'impresora',
  'computadora', 'computadoras', 'sistema', 'sistemas', 'red', 'redes', 'servicio', 'servicios'
])

interface InteractiveDashboardProps {
  initialResults: any[]
}

interface WordFrequency {
  text: string
  value: number
}

export default function InteractiveDashboard({ initialResults }: InteractiveDashboardProps) {
  // Filters state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [techIssueFilter, setTechIssueFilter] = useState('ALL')

  // Get unique users for dropdown list
  const usersList = useMemo<string[]>(() => {
    const usernames = new Set<string>()
    initialResults.forEach((item: any) => {
      if (item.user && item.user.username) {
        usernames.add(item.user.username)
      }
    })
    return Array.from(usernames).sort()
  }, [initialResults])

  // Filter logic
  const filteredResults = useMemo<any[]>(() => {
    return initialResults.filter((item: any) => {
      // 1. Search term match (Unit Number or Location)
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const unit = (item.unitNumber || '').toLowerCase()
        const loc = (item.location || '').toLowerCase()
        if (!unit.includes(term) && !loc.includes(term)) {
          return false
        }
      }

      // 2. User match
      if (selectedUser && item.user?.username !== selectedUser) {
        return false
      }

      // 3. Date range match
      if (startDate) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        if (new Date(item.createdAt) < start) return false
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        if (new Date(item.createdAt) > end) return false
      }

      // 4. Tech issue filter match
      if (techIssueFilter !== 'ALL') {
        const parsed = parseTechIssues(item.q1_techIssue)
        if (techIssueFilter === 'PC_ONLY' && parsed.equipo !== 'Sí') return false
        if (techIssueFilter === 'NET_ONLY' && parsed.internet !== 'Sí') return false
        if (techIssueFilter === 'PRINT_ONLY' && parsed.impresora !== 'Sí') return false
        if (techIssueFilter === 'ANY' && parsed.equipo !== 'Sí' && parsed.internet !== 'Sí' && parsed.impresora !== 'Sí') return false
      }

      return true
    })
  }, [initialResults, searchTerm, selectedUser, startDate, endDate, techIssueFilter])

  // Get unique units count
  const uniqueUnitsCount = useMemo(() => {
    const units = new Set<string>()
    filteredResults.forEach((item: any) => {
      if (item.unitNumber) {
        units.add(item.unitNumber.trim().toLowerCase())
      }
    })
    return units.size
  }, [filteredResults])

  // Clean filters
  const resetFilters = () => {
    setSearchTerm('')
    setSelectedUser('')
    setStartDate('')
    setEndDate('')
    setTechIssueFilter('ALL')
  }

  // Statistics calculation for filtered dataset
  const stats = useMemo(() => {
    let q1EquipoSi = 0
    let q1InternetSi = 0
    let q1ImpresoraSi = 0

    let q2Si = 0
    let q2No = 0

    const q3Frequencies: { [key: string]: number } = {
      'No': 0,
      '1 a 4 horas': 0,
      'Más de 8 horas': 0,
      '1 o más días': 0
    }

    let q4Si = 0
    let q4No = 0

    filteredResults.forEach((item: any) => {
      // Q1 parsing
      const parsedQ1 = parseTechIssues(item.q1_techIssue)
      if (parsedQ1.equipo === 'Sí') q1EquipoSi++
      if (parsedQ1.internet === 'Sí') q1InternetSi++
      if (parsedQ1.impresora === 'Sí') q1ImpresoraSi++

      // Q2
      if (item.q2_accessIssue === 'Sí') q2Si++
      else q2No++

      // Q3
      const q3Val = item.q3_powerIssue
      if (q3Val in q3Frequencies) {
        q3Frequencies[q3Val]++
      } else if (q3Val) {
        q3Frequencies[q3Val] = (q3Frequencies[q3Val] || 0) + 1
      }

      // Q4
      if (item.q4_trainingNeeded === 'Sí') q4Si++
      else q4No++
    })

    return {
      q1: { equipo: q1EquipoSi, internet: q1InternetSi, impresora: q1ImpresoraSi },
      q2: { si: q2Si, no: q2No },
      q3: q3Frequencies,
      q4: { si: q4Si, no: q4No }
    }
  }, [filteredResults])

  // Word Cloud calculation
  const wordCloudData = useMemo<WordFrequency[]>(() => {
    const counts: { [word: string]: number } = {}
    filteredResults.forEach((item: any) => {
      if (!item.q5_comments) return
      // Split words and clean punctuation
      const words = item.q5_comments
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'¡¿\r\n]/g, ' ')
        .split(/\s+/)
      
      words.forEach((word: string) => {
        const cleanWord = word.trim()
        // Skip short words and stopwords
        if (cleanWord.length > 2 && !SPANISH_STOPWORDS.has(cleanWord) && isNaN(Number(cleanWord))) {
          counts[cleanWord] = (counts[cleanWord] || 0) + 1
        }
      })
    })

    return Object.entries(counts)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 45) // Get top 45 words
  }, [filteredResults])

  // Chart data formatting
  const maxWordsVal = Math.max(...wordCloudData.map((w: WordFrequency) => w.value), 1)
  const minWordsVal = Math.min(...wordCloudData.map((w: WordFrequency) => w.value), 1)

  // Chart: Q1 (Technical Issues Comparison)
  const q1ChartData = {
    labels: ['S.T. Equipo de Cómputo', 'S.T. Internet', 'S.T. Impresora'],
    datasets: [
      {
        label: 'Casos Reportados (Sí)',
        data: [stats.q1.equipo, stats.q1.internet, stats.q1.impresora],
        backgroundColor: [
          'rgba(239, 68, 68, 0.85)', // Coral/Red
          'rgba(245, 158, 11, 0.85)', // Gold/Amber
          'rgba(59, 130, 246, 0.85)', // Teal/Blue
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      }
    ]
  }

  // Chart: Q2 (Access Issues)
  const q2ChartData = {
    labels: ['Sí', 'No'],
    datasets: [
      {
        data: [stats.q2.si, stats.q2.no],
        backgroundColor: ['rgba(239, 68, 68, 0.85)', 'rgba(34, 197, 94, 0.85)'],
        borderColor: ['rgba(239, 68, 68, 1)', 'rgba(34, 197, 94, 1)'],
        borderWidth: 1,
      }
    ]
  }

  // Chart: Q3 (Power outages)
  const q3ChartData = {
    labels: Object.keys(stats.q3),
    datasets: [
      {
        label: 'Cantidad de Reportes',
        data: Object.values(stats.q3),
        backgroundColor: 'rgba(35, 91, 78, 0.85)', // Verde IMSS
        borderColor: 'rgba(35, 91, 78, 1)',
        borderWidth: 1,
      }
    ]
  }

  // Chart: Q4 (Training needed)
  const q4ChartData = {
    labels: ['Sí', 'No'],
    datasets: [
      {
        data: [stats.q4.si, stats.q4.no],
        backgroundColor: ['rgba(179, 142, 93, 0.85)', 'rgba(34, 197, 94, 0.85)'], // Gold vs Green
        borderColor: ['rgba(179, 142, 93, 1)', 'rgba(34, 197, 94, 1)'],
        borderWidth: 1,
      }
    ]
  }

  // Word Cloud styles helper
  const getWordStyle = (value: number) => {
    const size = wordCloudData.length === 1 
      ? 1.5 
      : 0.95 + ((value - minWordsVal) / (maxWordsVal - minWordsVal || 1)) * 1.55 // scale from 0.95rem to 2.5rem
    
    // Choose dynamic colors
    let color = '#235B4E' // Regular IMSS green
    if (wordCloudData.length > 1) {
      const ratio = (value - minWordsVal) / (maxWordsVal - minWordsVal)
      if (ratio > 0.75) color = '#12332c' // Deepest green
      else if (ratio > 0.45) color = '#235B4E' // IMSS green
      else if (ratio > 0.2) color = '#B38E5D' // IMSS gold
      else color = '#7f8c8d' // Grey
    }

    return {
      fontSize: `${size}rem`,
      color,
      fontWeight: value > 1 ? ('bold' as const) : ('normal' as const),
      padding: '0.3rem 0.6rem',
      borderRadius: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.35)',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      cursor: 'pointer',
      transition: 'transform 0.15s, box-shadow 0.15s',
      margin: '0.2rem',
      display: 'inline-block'
    }
  }

  return (
    <div>
      {/* Dynamic Filter Panel */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--accent-color)' }}>Filtros Interactivos</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Buscar Unidad o Coordenada</label>
            <input
              type="text"
              className="form-input"
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}
              placeholder="Ej. UMF 24"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Usuario Supervisor</label>
            <select
              className="form-select"
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Todos los usuarios</option>
              {usersList.map((u: string) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Fallas Técnicas (Q1)</label>
            <select
              className="form-select"
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.9rem' }}
              value={techIssueFilter}
              onChange={(e) => setTechIssueFilter(e.target.value)}
            >
              <option value="ALL">Cualquier respuesta</option>
              <option value="ANY">Con alguna falla (Cómputo/Net/Imp)</option>
              <option value="PC_ONLY">Falla en Equipo de Cómputo</option>
              <option value="NET_ONLY">Falla en Internet</option>
              <option value="PRINT_ONLY">Falla en Impresora</option>
            </select>
          </div>
          <div>
            <label className="form-label" style={{ fontSize: '0.85rem' }}>Rango de Fechas</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="date"
                className="form-input"
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', flex: 1 }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span style={{ fontSize: '0.8rem' }}>a</span>
              <input
                type="date"
                className="form-input"
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem', flex: 1 }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Mostrando <strong>{filteredResults.length}</strong> de <strong>{initialResults.length}</strong> cuestionarios
          </span>
          <button 
            onClick={resetFilters} 
            className="btn btn-danger" 
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', margin: 0 }}
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card text-center" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Cuestionarios</h5>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--accent-color)' }}>
            {filteredResults.length}
          </p>
        </div>
        <div className="card text-center" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Unidades Supervisadas</h5>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--primary-color)' }}>
            {uniqueUnitsCount}
          </p>
        </div>
        <div className="card text-center" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Con Fallas Técnicas</h5>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'rgba(239, 68, 68, 1)' }}>
            {filteredResults.filter((item: any) => {
              const parsed = parseTechIssues(item.q1_techIssue)
              return parsed.equipo === 'Sí' || parsed.internet === 'Sí' || parsed.impresora === 'Sí'
            }).length}
          </p>
        </div>
        <div className="card text-center" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Problemas de Acceso</h5>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'rgba(245, 158, 11, 1)' }}>
            {stats.q2.si}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Q1 Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 className="text-center mb-3">1. Tipos de Fallas Técnicas (Reportes Activos)</h4>
          <div style={{ height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {filteredResults.length === 0 ? (
              <p className="text-muted">Sin datos</p>
            ) : (
              <Bar 
                data={q1ChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                }} 
              />
            )}
          </div>
        </div>

        {/* Q2 Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 className="text-center mb-3">2. Problemas con Accesos o Aplicativo</h4>
          <div style={{ height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {filteredResults.length === 0 ? (
              <p className="text-muted">Sin datos</p>
            ) : (
              <Pie data={q2ChartData} options={{ maintainAspectRatio: false }} />
            )}
          </div>
        </div>

        {/* Q3 Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 className="text-center mb-3">3. Cortes de Energía Eléctrica</h4>
          <div style={{ height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {filteredResults.length === 0 ? (
              <p className="text-muted">Sin datos</p>
            ) : (
              <Bar 
                data={q3ChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                }} 
              />
            )}
          </div>
        </div>

        {/* Q4 Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h4 className="text-center mb-3">4. Requerimiento de Capacitación</h4>
          <div style={{ height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {filteredResults.length === 0 ? (
              <p className="text-muted">Sin datos</p>
            ) : (
              <Doughnut data={q4ChartData} options={{ maintainAspectRatio: false }} />
            )}
          </div>
        </div>
      </div>

      {/* Word Cloud for Comments (Q5) */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h4 className="text-center mb-2" style={{ color: 'var(--accent-color)' }}>
          Nube de Palabras Frecuentes (Comentarios Q5)
        </h4>
        <p className="text-center text-muted text-sm" style={{ marginBottom: '1.5rem' }}>
          Visualización de las palabras más repetidas en los comentarios de los cuestionarios filtrados (excluyendo conectores comunes).
        </p>
        
        {wordCloudData.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }} className="text-muted">
            No hay suficientes palabras clave en los comentarios de los resultados seleccionados.
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '1.5rem', 
            backgroundColor: '#F8F9FA', 
            borderRadius: '8px', 
            minHeight: '200px',
            border: '1px solid var(--card-border)'
          }}>
            {wordCloudData.map((word: WordFrequency) => (
              <span
                key={word.text}
                style={getWordStyle(word.value)}
                title={`Frecuencia: ${word.value} ${word.value === 1 ? 'vez' : 'veces'}`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)'
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)'
                }}
              >
                {word.text} <span style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '0.15rem' }}>({word.value})</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
