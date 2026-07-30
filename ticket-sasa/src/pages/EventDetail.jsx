import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext";
import { getDefaultImage } from "../assets/categoryImages.js";

export default function EventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api
      .getEvent(id)
      .then(setEvent)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleBuy() {
    if (!user) {
      navigate("/login");
      return;
    }
    setBuying(true);
    setMessage(null);
    try {
      await api.buyTicket(event.id, quantity);
      setMessage({ type: "success", text: "Tickets reserved! Check My Tickets." });
      const refreshed = await api.getEvent(id);
      setEvent(refreshed);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setBuying(false);
    }
  }

  if (loading) return <p className="page-status">Loading event...</p>;
  if (!event) return <p className="page-status">Event not found.</p>;

  const remaining = Math.max(event.tickets_available - event.tickets_sold, 0);
  const soldOut = remaining === 0;

  return (
    <div className="page-container event-detail">
      <div
        className="event-detail__hero"
        style={{ backgroundImage: `url(${event.image_url || getDefaultImage(event.category)})` }}
      >
        <span className="event-detail__category">{event.category}</span>
      </div>

      <div className="event-detail__grid">
        <div className="event-detail__main">
          <h1>{event.title}</h1>
          <p className="event-detail__meta">
            {event.event_date} &middot; {event.event_time} &middot; {event.venue}
          </p>
          <p className="event-detail__organizer">Hosted by {event.organizer_name}</p>
          <p className="event-detail__description">{event.description}</p>
        </div>

        <aside className="event-detail__sidebar">
          <p className="event-detail__price">
            {event.ticket_price > 0 ? `$${event.ticket_price.toFixed(2)}` : "Free"}
          </p>
          <p className="event-detail__remaining">
            {soldOut ? "Sold out" : `${remaining} tickets remaining`}
          </p>

          {!soldOut && (
            <div className="event-detail__quantity">
              <label htmlFor="qty">Quantity</label>
              <input
                id="qty"
                type="number"
                min={1}
                max={remaining}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
          )}

          <button
            className="btn btn--primary btn--block"
            disabled={soldOut || buying}
            onClick={handleBuy}
          >
            {soldOut ? "Sold out" : buying ? "Processing..." : "Get tickets"}
          </button>

          {message && (
            <p className={`event-detail__message event-detail__message--${message.type}`}>
              {message.text}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
