import { NextResponse } from 'next/server'
import axios from 'axios'
import { orm } from '@/lib/database'
import { RequestHistory } from '@/entities/RequestHistory'

export async function POST(req: Request) {
  const { method, url, data, headers } = await req.json()
  const ormInstance = await orm
  const em = ormInstance.em.fork()

  try {
    const startTime = performance.now()
    const response = await axios({
      method,
      url,
      data,
      headers,
      validateStatus: () => true
    })
    const duration = performance.now() - startTime

    const historyEntry = new RequestHistory()
    historyEntry.method = method
    historyEntry.url = url
    historyEntry.requestData = data
    historyEntry.responseData = response.data
    historyEntry.statusCode = response.status
    historyEntry.duration = duration

    await em.persistAndFlush(historyEntry)

    return NextResponse.json({
      status: response.status,
      data: response.data,
      headers: response.headers,
      duration
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}