import prisma from '@/lib/db'
import ExportExcelButton from '@/components/ExportExcelButton'
import ResultsTable from '@/components/ResultsTable'

export const dynamic = 'force-dynamic'

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

      <ResultsTable results={results} />
    </div>
  )
}
