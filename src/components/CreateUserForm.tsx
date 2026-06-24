'use client'

import { useActionState, useEffect } from 'react'
import { createUserAction } from '@/app/actions'
import { useRouter } from 'next/navigation'

const initialState = {
  error: '',
  success: false
}

export default function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(createUserAction, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      alert('Usuario creado exitosamente')
      router.refresh()
    }
  }, [state, router])

  return (
    <form action={formAction}>
      <div className="form-group">
        <label className="form-label">Nombre de Usuario</label>
        <input type="text" name="username" className="form-input" required />
      </div>
      
      <div className="form-group">
        <label className="form-label">Contraseña</label>
        <input type="password" name="password" className="form-input" required />
      </div>

      <div className="form-group">
        <label className="form-label">Rol</label>
        <select name="role" className="form-select" defaultValue="USER">
          <option value="USER">Usuario (Solo cuestionario)</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      {state?.error && (
        <div className="form-group" style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>
          {state.error}
        </div>
      )}

      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isPending}>
        {isPending ? 'Creando...' : 'Crear Usuario'}
      </button>
    </form>
  )
}
