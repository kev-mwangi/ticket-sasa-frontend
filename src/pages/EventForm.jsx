import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";

const CATEGORIES = ["Music", "Tech", "Sports", "Arts", "Food", "General"];

const EMPTY = {
  title: "",
  description: "",
  venue: "",
  category: "General",
  event_date: "",
  event_time: "",
  ticket_price: "",
  tickets_available: "",
  image_url: "",
};

export default function EventForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    api
      .getEvent(id)
      .then((event) =>
        setForm({
          title: event.title,
          description: event.description,
          venue: event.venue,
          category: event.category,
          event_date: event.event_date,
          event_time: event.event_time,
          ticket_price: event.ticket_price,
          tickets_available: event.tickets_available,
          image_url: event.image_url,
        })
      )
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (isEditing) {
        await api.updateEvent(id, form);
      } else {
        await api.createEvent(form);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="page-status">Loading...</p>;

  return (
    <div className="page-container">
      <form className="event-form" onSubmit={handleSubmit}>
        <h1>{isEditing ? "Edit event" : "Create a new event"}</h1>

        {error && <p className="auth-card__error">{error}</p>}

        <label>
          Title
          <input value={form.title} onChange={(e) => update("title", e.target.value)} required />
        </label>

        <label>
          Description
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </label>

        <div className="event-form__row">
          <label>
            Venue
            <input value={form.venue} onChange={(e) => update("venue", e.target.value)} />
          </label>

          <label>
            Category
            <select value={form.category} onChange={(e) => update("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="event-form__row">
          <label>
            Date
            <input
              type="date"
              value={form.event_date}
              onChange={(e) => update("event_date", e.target.value)}
              required
            />
          </label>

          <label>
            Time
            <input
              type="time"
              value={form.event_time}
              onChange={(e) => update("event_time", e.target.value)}
            />
          </label>
        </div>

        <div className="event-form__row">
          <label>
            Ticket price ($)
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.ticket_price}
              onChange={(e) => update("ticket_price", e.target.value)}
            />
          </label>

          <label>
            Tickets available
            <input
              type="number"
              min={0}
              value={form.tickets_available}
              onChange={(e) => update("tickets_available", e.target.value)}
            />
          </label>
        </div>

        <label>
          Image URL (optional)
          <input value={form.image_url} onChange={(e) => update("image_url", e.target.value)} />
        </label>

        <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEditing ? "Save changes" : "Create event"}
        </button>
      </form>
    </div>
  );
}
