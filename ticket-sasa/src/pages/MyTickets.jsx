import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  function refresh() {
    setLoading(true);
    api
      .getMyTickets()
      .then(setTickets)
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  async function handleCancel(id) {
    if (!confirm("Cancel this ticket?")) return;
    await api.cancelTicket(id);
    refresh();
  }

  if (loading) return <p className="page-status">Loading your tickets...</p>;

  return (
    <div className="page-container">
      <h1>My tickets</h1>

      {tickets.length === 0 ? (
        <p className="page-status">
          You haven't booked any tickets yet. <Link to="/">Browse events</Link>
        </p>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div>
                <h3>{ticket.event?.title}</h3>
                <p className="ticket-card__meta">
                  {ticket.event?.event_date} &middot; {ticket.event?.venue}
                </p>
                <p className="ticket-card__meta">
                  Qty {ticket.quantity} &middot; ${ticket.total_price.toFixed(2)}
                </p>
                <span className={`ticket-card__status ticket-card__status--${ticket.status}`}>
                  {ticket.status}
                </span>
              </div>

              {ticket.status === "confirmed" && (
                <button className="link-btn link-btn--danger" onClick={() => handleCancel(ticket.id)}>
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
