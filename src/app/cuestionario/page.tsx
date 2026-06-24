'use client'

import { useActionState, useEffect, useState } from 'react'
import { submitQuestionnaire } from '@/app/actions'
import { useRouter } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

const initialState = {
  error: ''
}

export default function CuestionarioPage() {
  const [state, formAction, isPending] = useActionState(submitQuestionnaire, initialState)
  const [location, setLocation] = useState('Obteniendo ubicación...')
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      alert('Cuestionario guardado exitosamente. Gracias por su respuesta.')
      // Puede redirigir o recargar
      router.refresh()
    }
  }, [state, router])

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`)
        },
        (error) => {
          console.warn('Error al obtener ubicación:', error)
          setLocation('No se pudo obtener la ubicación')
        }
      )
    } else {
      setLocation('Geolocalización no soportada')
    }
  }, [])

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>Cuestionario ECSUS</h2>
          <LogoutButton />
        </div>
        <div style={{ backgroundColor: '#F8F9FA', borderLeft: '4px solid var(--accent-color)', padding: '1rem', marginBottom: '2rem', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontWeight: 500 }}>
            Agradecemos su atención para esta llamada, formamos parte del equipo de despliegue de ECSUS. El objetivo de esta llamada es ver si podemos apoyarle en algún tema, ya que vemos que la productividad de esta Unidad está por debajo del promedio que se manejaba SISPA.
          </p>
        </div>
        
        <form action={formAction}>
          {/* Ubicación oculta pero guardada en el form */}
          <input type="hidden" name="location" value={location} />

          <div className="form-group">
            <label className="form-label" htmlFor="unitNumber">Número de la Unidad</label>
            <input 
              type="text" 
              id="unitNumber" 
              name="unitNumber" 
              className="form-input" 
              placeholder="Ej. UMF 24"
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">1. ¿Tiene alguna situación técnica con:</label>
            
            <div style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 500, display: 'block', marginBottom: '0.35rem' }}>a) Equipo de cómputo</span>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="checkbox-group" style={{ margin: 0 }}>
                  <input type="radio" id="q1_equipo_si" name="q1_equipo" value="Sí" required />
                  <label htmlFor="q1_equipo_si">Sí</label>
                </div>
                <div className="checkbox-group" style={{ margin: 0 }}>
                  <input type="radio" id="q1_equipo_no" name="q1_equipo" value="No" defaultChecked />
                  <label htmlFor="q1_equipo_no">No</label>
                </div>
              </div>
            </div>

            <div style={{ marginLeft: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 500, display: 'block', marginBottom: '0.35rem' }}>b) Internet</span>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="checkbox-group" style={{ margin: 0 }}>
                  <input type="radio" id="q1_internet_si" name="q1_internet" value="Sí" required />
                  <label htmlFor="q1_internet_si">Sí</label>
                </div>
                <div className="checkbox-group" style={{ margin: 0 }}>
                  <input type="radio" id="q1_internet_no" name="q1_internet" value="No" defaultChecked />
                  <label htmlFor="q1_internet_no">No</label>
                </div>
              </div>
            </div>

            <div style={{ marginLeft: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 500, display: 'block', marginBottom: '0.35rem' }}>c) Impresora</span>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div className="checkbox-group" style={{ margin: 0 }}>
                  <input type="radio" id="q1_impresora_si" name="q1_impresora" value="Sí" required />
                  <label htmlFor="q1_impresora_si">Sí</label>
                </div>
                <div className="checkbox-group" style={{ margin: 0 }}>
                  <input type="radio" id="q1_impresora_no" name="q1_impresora" value="No" defaultChecked />
                  <label htmlFor="q1_impresora_no">No</label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">2. ¿Tiene problemas con los accesos o con el aplicativo como tal?</label>
            <div className="checkbox-group">
              <input type="radio" id="q2_si" name="q2" value="Sí" required />
              <label htmlFor="q2_si">Sí</label>
            </div>
            <div className="checkbox-group">
              <input type="radio" id="q2_no" name="q2" value="No" />
              <label htmlFor="q2_no">No</label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">3. ¿El suministro de energía eléctrica de la unidad presenta interrupciones?</label>
            <select name="q3" className="form-select" required defaultValue="">
              <option value="" disabled>Seleccione una opción</option>
              <option value="No">No</option>
              <option value="1 a 4 horas">1 a 4 horas</option>
              <option value="Más de 8 horas">Más de 8 horas</option>
              <option value="1 o más días">1 o más días</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">4. ¿Requieres nuevamente capacitación?</label>
            <div className="checkbox-group">
              <input type="radio" id="q4_si" name="q4" value="Sí" required />
              <label htmlFor="q4_si">Sí</label>
            </div>
            <div className="checkbox-group">
              <input type="radio" id="q4_no" name="q4" value="No" />
              <label htmlFor="q4_no">No</label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="q5">5. ¿Tienes algún comentario?</label>
            <textarea 
              id="q5" 
              name="q5" 
              className="form-textarea" 
              rows={4}
              placeholder="Escribe tus comentarios aquí..."
            ></textarea>
          </div>

          <div className="form-group text-sm text-muted">
            Ubicación actual: {location}
          </div>

          {state?.error && (
            <div className="form-group" style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>
              {state.error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? 'Enviando...' : 'Enviar Respuestas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
