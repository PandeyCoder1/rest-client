'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface HistoryItem {
  id: number
  method: string
  url: string
  statusCode: number
  createdAt: string
}

export default function HistoryList() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('/api/history', {
        params: {
          page: pagination.page,
          limit: pagination.limit
        }
      })
      setHistory(data.data)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [pagination.page])

  return (
    <div className="history-list">
      <h2>Request History</h2>
      
      {loading ? (
        <p>Loading history...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>URL</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{item.method}</td>
                  <td>{item.url}</td>
                  <td>{item.statusCode}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="pagination">
            <button
              onClick={() => setPagination(prev => ({
                ...prev,
                page: Math.max(1, prev.page - 1)
              }))}
              disabled={pagination.page === 1}
            >
              Previous
            </button>
            
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            
            <button
              onClick={() => setPagination(prev => ({
                ...prev,
                page: Math.min(pagination.totalPages, prev.page + 1)
              }))}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}