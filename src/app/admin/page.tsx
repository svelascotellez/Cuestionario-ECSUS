import prisma from '@/lib/db'
import InteractiveDashboard from '@/components/InteractiveDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
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
      <h1>Dashboard de Resultados</h1>
      
      <InteractiveDashboard initialResults={results} />
    </div>
  )
}
