'use client'

import React, { useState, useMemo } from 'react'
import { parseTechIssues } from '@/lib/utils'
import { deleteQuestionnaireAction } from '@/app/actions'

export default function ResultsTable({ results }: { results: any[] }) {
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)
  const [filters, setFilters] = useState<Record<string, string>>({})

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const processedData = useMemo(() => {
    // 1. Parse tech issues so we can filter/sort by them easily
    let data = results.map(item => {
      const tech = parseTechIssues(item.q1_techIssue)
      return {
        ...item,
        _fecha: new Date(item.createdAt).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
        _usuario: item.user.username,
        _unidad: item.unitNumber || 'N/A',
        _techEquipo: tech.equipo,
        _techInternet: tech.internet,
        _techImpresora: tech.impresora,
        _comentarios: item.q5_comments || 'N/A'
      }
    })

    // 2. Filter
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key].toLowerCase()
      if (!filterValue) return
      
      data = data.filter(item => {
        const value = String(item[key] || '').toLowerCase()
        return value.includes(filterValue)
      })
    })

    // 3. Sort
    if (sortConfig !== null) {
      data.sort((a, b) => {
        const valA = String(a[sortConfig.key] || '')
        const valB = String(b[sortConfig.key] || '')

        // Try to sort numerically if possible for certain fields (like fecha if parsed, but string comparison works for iso sort, but we stringified fecha)
        // Note: For dates, since they are 'DD/MM/YYYY', string comparison might be off.
        // Let's implement a small date fix if key is '_fecha':
        if (sortConfig.key === '_fecha') {
          const timeA = new Date(a.createdAt).getTime()
          const timeB = new Date(b.createdAt).getTime()
          if (timeA < timeB) return sortConfig.direction === 'asc' ? -1 : 1
          if (timeA > timeB) return sortConfig.direction === 'asc' ? 1 : -1
          return 0
        }

        if (valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return data
  }, [results, filters, sortConfig])

  // Helpers for UI
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return ' ↕'
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
  }

  const renderColumnHeader = (label: string, sortKey: string, filterKey: string) => (
    <th style={{ padding: '0.5rem', verticalAlign: 'top', minWidth: '150px' }}>
      <div 
        style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem', userSelect: 'none' }}
        onClick={() => requestSort(sortKey)}
        title="Haz clic para ordenar"
      >
        {label} <span style={{ color: 'var(--primary-color)' }}>{getSortIndicator(sortKey)}</span>
      </div>
      <input 
        type="text" 
        placeholder="Filtrar..." 
        value={filters[filterKey] || ''}
        onChange={(e) => handleFilterChange(filterKey, e.target.value)}
        style={{ 
          width: '100%', 
          padding: '0.3rem', 
          fontSize: '0.8rem',
          border: '1px solid var(--input-border)',
          borderRadius: '4px',
          background: 'var(--input-bg)',
          color: 'var(--text-primary)'
        }}
      />
    </th>
  )

  return (
    <div className="card" style={{ overflowX: 'auto', marginTop: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left', background: 'rgba(0,0,0,0.05)' }}>
            {renderColumnHeader("Fecha (CDMX)", "_fecha", "_fecha")}
            {renderColumnHeader("Usuario", "_usuario", "_usuario")}
            {renderColumnHeader("Unidad", "_unidad", "_unidad")}
            {renderColumnHeader("Ubicación", "location", "location")}
            {renderColumnHeader("S.T. Equipo", "_techEquipo", "_techEquipo")}
            {renderColumnHeader("S.T. Internet", "_techInternet", "_techInternet")}
            {renderColumnHeader("S.T. Impresora", "_techImpresora", "_techImpresora")}
            {renderColumnHeader("Problemas Acceso", "q2_accessIssue", "q2_accessIssue")}
            {renderColumnHeader("Suministro Energía", "q3_powerIssue", "q3_powerIssue")}
            {renderColumnHeader("Capacitación", "q4_trainingNeeded", "q4_trainingNeeded")}
            {renderColumnHeader("Comentarios", "_comentarios", "_comentarios")}
            <th style={{ padding: '0.5rem', verticalAlign: 'top' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
              <td style={{ padding: '1rem' }}>{item._fecha}</td>
              <td style={{ padding: '1rem' }}>{item._usuario}</td>
              <td style={{ padding: '1rem' }}>{item._unidad}</td>
              <td style={{ padding: '1rem' }}>{item.location}</td>
              <td style={{ padding: '1rem' }}>{item._techEquipo}</td>
              <td style={{ padding: '1rem' }}>{item._techInternet}</td>
              <td style={{ padding: '1rem' }}>{item._techImpresora}</td>
              <td style={{ padding: '1rem' }}>{item.q2_accessIssue}</td>
              <td style={{ padding: '1rem' }}>{item.q3_powerIssue}</td>
              <td style={{ padding: '1rem' }}>{item.q4_trainingNeeded}</td>
              <td style={{ padding: '1rem', whiteSpace: 'pre-wrap', maxWidth: '250px' }}>{item._comentarios}</td>
              <td style={{ padding: '1rem' }}>
                <form action={deleteQuestionnaireAction.bind(null, item.id)}>
                  <button type="submit" className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                    Borrar
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {processedData.length === 0 && (
            <tr>
              <td colSpan={12} style={{ padding: '2rem', textAlign: 'center' }}>No se encontraron resultados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
