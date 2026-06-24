import prisma from '@/lib/db'
import DashboardCharts from '@/components/DashboardCharts'

export default async function AdminDashboard() {
  const totalQuestionnaires = await prisma.questionnaire.count()
  
  // Aggregate Q2 (Access issues)
  const q2Stats = await prisma.questionnaire.groupBy({
    by: ['q2_accessIssue'],
    _count: { q2_accessIssue: true }
  })

  // Aggregate Q3 (Power issues)
  const q3Stats = await prisma.questionnaire.groupBy({
    by: ['q3_powerIssue'],
    _count: { q3_powerIssue: true }
  })

  // Aggregate Q4 (Training needed)
  const q4Stats = await prisma.questionnaire.groupBy({
    by: ['q4_trainingNeeded'],
    _count: { q4_trainingNeeded: true }
  })

  return (
    <div>
      <h1>Dashboard de Resultados</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card text-center">
          <h3>Total de Cuestionarios</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{totalQuestionnaires}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <DashboardCharts q2Stats={q2Stats} q3Stats={q3Stats} q4Stats={q4Stats} />
      </div>
    </div>
  )
}
