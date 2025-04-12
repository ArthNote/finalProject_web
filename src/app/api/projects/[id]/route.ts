import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'http://localhost:8080'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const response = await fetch(`${API_URL}/api/projects/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching project:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const response = await fetch(`${API_URL}/api/projects/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating project:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const response = await fetch(`${API_URL}/api/projects/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (response.ok) {
      return new NextResponse(null, { status: 204 })
    }

    return new NextResponse('Failed to delete project', { status: response.status })
  } catch (error) {
    console.error('Error deleting project:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}