import prisma from '@/lib/db'
import CreateUserForm from '@/components/CreateUserForm'

export default async function UsuariosPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div>
          <div className="card">
            <h3 className="mb-4">Crear Nuevo Usuario</h3>
            <CreateUserForm />
          </div>
        </div>
        
        <div>
          <div className="card" style={{ overflowX: 'auto' }}>
            <h3 className="mb-4">Lista de Usuarios</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>Usuario</th>
                  <th style={{ padding: '1rem' }}>Rol</th>
                  <th style={{ padding: '1rem' }}>Fecha Registro (CDMX)</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '1rem' }}>{user.username}</td>
                    <td style={{ padding: '1rem' }}>{user.role}</td>
                    <td style={{ padding: '1rem' }}>
                      {new Date(user.createdAt).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
