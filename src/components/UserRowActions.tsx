'use client'

import { useActionState, useState } from 'react'
import { updateUserAction, deleteUserAction } from '@/app/actions'

export default function UserRowActions({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const initialState = { error: '' }
  const [state, formAction, isPending] = useActionState(updateUserAction, initialState)

  const handleDelete = async () => {
    if (user.username === 'admin') {
      alert('No se puede eliminar el usuario administrador principal.')
      return
    }
    if (confirm(`¿Estás seguro de dar de baja al usuario ${user.username}? Esta acción no se puede deshacer.`)) {
      setIsDeleting(true)
      try {
        await deleteUserAction(user.id)
      } catch (err: any) {
        alert(err.message || 'Error al eliminar')
        setIsDeleting(false)
      }
    }
  }

  if (isEditing) {
    return (
      <td colSpan={2} style={{ padding: '1rem' }}>
        <form action={formAction} className="card" style={{ padding: '1rem', background: '#F8F9FA' }}>
          <input type="hidden" name="id" value={user.id} />
          
          <div className="form-group mb-2">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Nuevo Rol (Actual: {user.role})</label>
            <select name="role" className="form-input" defaultValue={user.role} style={{ padding: '0.2rem' }}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          
          <div className="form-group mb-2">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Nueva Contraseña (dejar en blanco para no cambiar)</label>
            <input 
              type="password" 
              name="password" 
              className="form-input" 
              style={{ padding: '0.2rem' }}
              placeholder="••••••••" 
            />
          </div>
          
          {state?.error && <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{state.error}</div>}
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }} disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', background: '#ddd', color: '#333' }} onClick={() => setIsEditing(false)}>
              Cancelar
            </button>
          </div>
        </form>
      </td>
    )
  }

  return (
    <td style={{ padding: '1rem' }}>
      <button 
        className="btn" 
        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem', background: 'var(--accent-color)', color: 'white' }}
        onClick={() => setIsEditing(true)}
        disabled={isDeleting}
      >
        Editar
      </button>
      <button 
        className="btn btn-primary" 
        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'var(--danger)', borderColor: 'var(--danger)' }}
        onClick={handleDelete}
        disabled={isDeleting || user.username === 'admin'}
        title={user.username === 'admin' ? "No se puede eliminar el admin" : ""}
      >
        {isDeleting ? 'Eliminando...' : 'Dar de Baja'}
      </button>
    </td>
  )
}
