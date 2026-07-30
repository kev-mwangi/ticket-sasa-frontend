import { Link } from "react-router-dom";

const CATEGORY_COLORS = {
  Music: "#7C3AED",
  Tech: "#2563EB",
  Sports: "#059669",
  Arts: "#DB2777",
  Food: "#EA580C",
  General: "#475569",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function EventCard({ event }) {
  const remaining = Math.max(event.tickets_available - event.tickets_sold, 0);
  const soldOut = remaining === 0;
  const color = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.General;

  return (
    <Link to={`/events/${event.id}`} className="event-card">
      <div
        className="event-card__image"
        style={{
          backgroundImage: event.image_url ? `url(${event.image_url})` : undefined,
          backgroundColor: event.image_url ? undefined : color,
        }}
      >
        <span className="event-card__date">{formatDate(event.event_date)}</span>
        {soldOut && <span className="event-card__soldout">Sold out</span>}
      </div>

      <div className="event-card__body">
        <span className="event-card__category" style={{ color }}>
          {event.category}
        </span>
        <h3 className="event-card__title">{event.title}</h3>
        <p className="event-card__venue">{event.venue || "Venue TBA"}</p>

        <div className="event-card__footer">
          <span className="event-card__price">
            {event.ticket_price > 0 ? `$${event.ticket_price.toFixed(2)}` : "Free"}
          </span>
          <span className="event-card__remaining">
            {soldOut ? "" : `${remaining} left`}
          </span>
        </div>
      </div>
    </Link>
  );
}
