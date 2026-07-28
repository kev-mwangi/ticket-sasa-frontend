import { useEffect, useState } from "react";
import { api } from "../api.js";
import EventCard from "../components/EventCard.jsx";

const CATEGORIES = ["All", "Music", "Tech", "Sports", "Arts", "Food", "General"];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== "All") params.category = category;

    api
      .getEvents(params)
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div>
      <section className="hero">
        <h1 className="hero__title">Find your next unforgettable event</h1>
        <p className="hero__subtitle">
          Discover concerts, conferences, and gatherings happening near you
        </p>

        <div className="hero__search">
          <input
            type="text"
            placeholder="Search events by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <div className="category-row">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`category-pill ${category === c ? "category-pill--active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="page-container">
        {loading ? (
          <p className="page-status">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="page-status">No events found. Try a different search.</p>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
