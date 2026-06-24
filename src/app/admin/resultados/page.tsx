import prisma from '@/lib/db'
import ExportExcelButton from '@/components/ExportExcelButton'

export const dynamic = 'force-dynamic'
import { deleteQuestionnaireAction } from '@/app/actions'

export default async function ResultadosPage() {
  const results = await prisma.questionnaire.findMany({
    include: {
      user: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div>
      <h1>Resultados de Cuestionarios</h1>
      
      <ExportExcelButton data={results} />

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Fecha (CDMX)</th>
              <th style={{ padding: '1rem' }}>Usuario</th>
              <th style={{ padding: '1rem' }}>Unidad</th>
              <th style={{ padding: '1rem' }}>Ubicación</th>
              <th style={{ padding: '1rem' }}>S. Técnica</th>
              <th style={{ padding: '1rem' }}>Problemas Acceso</th>
              <th style={{ padding: '1rem' }}>Suministro Energía</th>
              <th style={{ padding: '1rem' }}>Capacitación</th>
              <th style={{ padding: '1rem' }}>Comentarios</th>
              <th style={{ padding: '1rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                <td style={{ padding: '1rem' }}>
                  {new Date(item.createdAt).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
                </td>
                <td style={{ padding: '1rem' }}>{item.user.username}</td>
                <td style={{ padding: '1rem' }}>{item.unitNumber || 'N/A'}</td>
                <td style={{ padding: '1rem' }}>{item.location}</td>
                <td style={{ padding: '1rem' }}>{item.q1_techIssue}</td>
                <td style={{ padding: '1rem' }}>{item.q2_accessIssue}</td>
                <td style={{ padding: '1rem' }}>{item.q3_powerIssue}</td>
                <td style={{ padding: '1rem' }}>{item.q4_trainingNeeded}</td>
                <td style={{ padding: '1rem', whiteSpace: 'pre-wrap', maxWidth: '250px' }}>{item.q5_comments || 'N/A'}</td>
                <td style={{ padding: '1rem' }}>
                  <form action={async () => {
                    'use server'
                    await deleteQuestionnaireAction(item.id)
                  }}>
                    <button type="submit" className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                      Borrar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={10} style={{ padding: '2rem', textAlign: 'center' }}>No hay resultados aún.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
