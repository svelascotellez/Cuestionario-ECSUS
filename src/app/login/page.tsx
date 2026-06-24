'use client'

import { useActionState } from 'react'
import { loginAction } from '@/app/actions'
import { useEffect } from 'react'

const initialState = {
  error: ''
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center">Bienvenido a ECSUS</h2>
        <p className="text-center text-muted mb-4">Actualización de Estado Operativo</p>
        
        <form action={formAction}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Nombre de Usuario</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              className="form-input" 
              placeholder="Ingresa tu usuario"
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className="form-input" 
              placeholder="••••••••"
              required 
            />
          </div>
          
          {state?.error && (
            <div className="form-group" style={{ color: 'var(--danger)', fontSize: '0.875rem', textAlign: 'center' }}>
              {state.error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={isPending}
          >
            {isPending ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
