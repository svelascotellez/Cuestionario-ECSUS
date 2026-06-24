import Link from 'next/link'
import { logout } from '@/lib/auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', background: 'var(--card-bg)', borderRight: '1px solid var(--card-border)', padding: '2rem 1rem' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>ECSUS Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link href="/admin" className="btn btn-secondary">
            Dashboard
          </Link>
          <Link href="/admin/usuarios" className="btn btn-secondary">
            Usuarios
          </Link>
          <Link href="/admin/resultados" className="btn btn-secondary">
            Resultados
          </Link>
          
          <form action={async () => {
            'use server'
            await logout()
          }} style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <button type="submit" className="btn btn-danger" style={{ width: '100%' }}>Cerrar Sesión</button>
          </form>
        </nav>
      </aside>
      
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
