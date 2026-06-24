'use client'

import { logoutAction } from '@/app/actions'

export default function LogoutButton() {
  return (
    <button 
      onClick={() => logoutAction()} 
      className="btn" 
      style={{
        background: 'var(--danger)', 
        color: 'white', 
        padding: '0.3rem 0.8rem', 
        fontSize: '0.9rem',
        border: 'none',
        float: 'right'
      }}
    >
      Cerrar Sesión
    </button>
  )
}
