import RequestForm from '@/components/RequestForm'
import HistoryList from '@/components/HistoryList'

export default function Home() {
  return (
    <div className="app-container">
      <h1>REST Client</h1>
      <div className="grid">
        <section className="request-section">
          <h2>Make a Request</h2>
          <RequestForm />
        </section>
        <section className="history-section">
          <h2>Request History</h2>
          <HistoryList />
        </section>
      </div>
    </div>
  )
}