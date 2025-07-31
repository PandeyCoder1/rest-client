import { NextResponse } from 'next/server'
import { orm } from '@/lib/database'
import { RequestHistory } from '@/entities/RequestHistory'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const ormInstance = await orm
  const em = ormInstance.em.fork()

  try {
    const [history, total] = await em.findAndCount(
      RequestHistory,
      {},
      {
        orderBy: { createdAt: 'DESC' },
        limit,
        offset: (page - 1) * limit
      }
    )

    return NextResponse.json({
      data: history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  const ormInstance = await orm
  const em = ormInstance.em.fork()

  try {
    const body = await req.json()
    const { method, url, requestData, responseData, statusCode } = body

    const historyEntry = new RequestHistory()
    historyEntry.method = method
    historyEntry.url = url
    historyEntry.requestData = requestData
    historyEntry.responseData = responseData
    historyEntry.statusCode = statusCode

    await em.persistAndFlush(historyEntry)

    return NextResponse.json(historyEntry, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save history' },
      { status: 500 }
    )
  }
}