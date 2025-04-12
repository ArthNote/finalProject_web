import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL || 'http://localhost:8080'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const response = await fetch(`${API_URL}/api/projects?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const response = await fetch(`${API_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating project:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}