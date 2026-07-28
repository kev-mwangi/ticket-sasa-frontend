import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  function refresh() {
    setLoading(true);
    api
      .getMyEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }

  useEffect(refresh, []);

  async function handleDelete(id) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    await api.deleteEvent(id);
    refresh();
  }

  return (
    <div className="page-container">
      <div className="dashboard__header">
        <h1>Your events</h1>
        <Link to="/dashboard/new" className="btn btn--primary">
          + Create event
        </Link>
      </div>

      {loading ? (
        <p className="page-status">Loading...</p>
      ) : events.length === 0 ? (
        <p className="page-status">
          You haven't created any events yet. Click "Create event" to get started.
        </p>
      ) : (
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Price</th>
              <th>Sold</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.event_date}</td>
                <td>{event.ticket_price > 0 ? `$${event.ticket_price.toFixed(2)}` : "Free"}</td>
                <td>
                  {event.tickets_sold} / {event.tickets_available}
                </td>
                <td className="dashboard-table__actions">
                  <Link to={`/dashboard/edit/${event.id}`}>Edit</Link>
                  <button className="link-btn link-btn--danger" onClick={() => handleDelete(event.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
