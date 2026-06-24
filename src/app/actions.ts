'use server'

import prisma from '@/lib/db'
import { login as loginAuth, getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Por favor, ingresa usuario y contraseña' }
  }

  const user = await prisma.user.findUnique({
    where: { username }
  })

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: 'Credenciales inválidas' }
  }

  await loginAuth(user.id)
  
  // Log login action
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: 'LOGIN',
      details: 'Usuario inició sesión exitosamente'
    }
  })

  redirect('/cuestionario')
}

export async function submitQuestionnaire(prevState: any, formData: FormData) {
  const session = await getSession()
  
  if (!session) {
    return { error: 'Sesión expirada o inválida' }
  }

  const unitNumber = formData.get('unitNumber') as string
  const q1 = formData.getAll('q1').join(', ')
  const q2 = formData.get('q2') as string
  const q3 = formData.get('q3') as string
  const q4 = formData.get('q4') as string
  const q5 = formData.get('q5') as string
  const location = formData.get('location') as string || 'Desconocido'

  if (!unitNumber || !q2 || !q3 || !q4) {
    return { error: 'Por favor completa todas las preguntas obligatorias' }
  }

  try {
    const questionnaire = await prisma.questionnaire.create({
      data: {
        userId: session.id,
        location,
        unitNumber,
        q1_techIssue: q1,
        q2_accessIssue: q2,
        q3_powerIssue: q3,
        q4_trainingNeeded: q4,
        q5_comments: q5 || ''
      }
    })

    // Log the submission
    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'SUBMIT_QUESTIONNAIRE',
        details: `Cuestionario ${questionnaire.id} completado con ubicación: ${location}`
      }
    })

    return { success: true }
  } catch (err) {
    console.error(err)
    return { error: 'Error al guardar el cuestionario' }
  }
}

export async function createUserAction(prevState: any, formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return { error: 'No tienes permisos para crear usuarios' }
  }

  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string || 'USER'

  if (!username || !password) {
    return { error: 'Usuario y contraseña son requeridos' }
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        username,
        passwordHash,
        role
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'CREATE_USER',
        details: `Usuario creado: ${username}`
      }
    })

    return { success: true }
  } catch (err) {
    return { error: 'Error al crear el usuario. Posiblemente el nombre de usuario ya existe.' }
  }
}

import { revalidatePath } from 'next/cache'

export async function deleteQuestionnaireAction(id: string) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('No tienes permisos')
  }

  try {
    await prisma.questionnaire.delete({
      where: { id }
    })

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: 'DELETE_QUESTIONNAIRE',
        details: `Cuestionario eliminado con ID: ${id}`
      }
    })

    revalidatePath('/admin/resultados')
    revalidatePath('/admin')
  } catch (err) {
    console.error('Error deleting questionnaire', err)
    throw new Error('No se pudo eliminar el registro')
  }
}
