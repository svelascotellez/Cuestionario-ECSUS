'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default function DashboardCharts({ q2Stats, q3Stats, q4Stats }: { q2Stats: any[], q3Stats: any[], q4Stats: any[] }) {
  
  const prepareData = (stats: any[], key: string) => {
    return {
      labels: stats.map(s => s[key]),
      datasets: [
        {
          label: 'Cantidad',
          data: stats.map(s => s._count[key]),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(245, 158, 11, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  return (
    <>
      <div className="card">
        <h4 className="text-center mb-4">Problemas de Acceso / Aplicativo</h4>
        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
          <Pie data={prepareData(q2Stats, 'q2_accessIssue')} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="card">
        <h4 className="text-center mb-4">Interrupciones de Energía</h4>
        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
          <Bar 
            data={prepareData(q3Stats, 'q3_powerIssue')} 
            options={{ 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} 
          />
        </div>
      </div>

      <div className="card">
        <h4 className="text-center mb-4">Requerimiento de Capacitación</h4>
        <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
          <Pie data={prepareData(q4Stats, 'q4_trainingNeeded')} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </>
  )
}
