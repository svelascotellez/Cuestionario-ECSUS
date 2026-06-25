'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { logoutAction } from '@/app/actions'

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <aside 
        style={{ 
          width: isOpen ? '250px' : '0px', 
          background: 'var(--card-bg)', 
          borderRight: isOpen ? '1px solid var(--card-border)' : 'none', 
          padding: isOpen ? '2rem 1rem' : '0', 
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.2s', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h2 style={{ marginBottom: '2rem', textAlign: 'center', whiteSpace: 'nowrap' }}>ECSUS Admin</h2>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <Link href="/admin" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                Dashboard
            </Link>
            <Link href="/admin/usuarios" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                Usuarios
            </Link>
            <Link href="/admin/resultados" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                Resultados
            </Link>
            
            <form action={logoutAction} style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                <button type="submit" className="btn btn-danger" style={{ width: '100%', whiteSpace: 'nowrap' }}>Cerrar Sesión</button>
            </form>
            </nav>
        </div>
      </aside>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Ocultar menú" : "Mostrar menú"}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: isOpen ? '235px' : '10px',
          zIndex: 50,
          background: 'var(--primary-color)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'left 0.3s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        {isOpen ? '❮' : '❯'}
      </button>
    </>
  )
}
