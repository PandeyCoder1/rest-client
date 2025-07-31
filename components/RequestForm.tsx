'use client'

import { useState } from 'react'
import axios from 'axios'

export default function RequestForm() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [body, setBody] = useState('')
  const [headers, setHeaders] = useState('{"Content-Type": "application/json"}')
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await axios.post('/api/request', {
        method,
        url,
        data: body ? JSON.parse(body) : undefined,
        headers: headers ? JSON.parse(headers) : undefined
      })
      
      setResponse(res.data)
    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="request-form">
      <form onSubmit={handleSubmit}>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          required
        />
        
        {['POST', 'PUT', 'PATCH'].includes(method) && (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Request body (JSON)"
            rows={6}
          />
        )}
        
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder="Request headers (JSON)"
          rows={3}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  )
}