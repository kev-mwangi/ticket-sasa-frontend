const BASE_URL = "http://localhost:5000/api";

async function request(path, { auth = false, ...options } = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };

  if (auth) {
    const token = localStorage.getItem("eventhub_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  signup: (data) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: () => request("/auth/me", { auth: true }),

  getEvents: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/events${qs ? `?${qs}` : ""}`);
  },
  getEvent: (id) => request(`/events/${id}`),
  getMyEvents: () => request("/events/mine", { auth: true }),
  createEvent: (data) =>
    request("/events", { method: "POST", body: JSON.stringify(data), auth: true }),
  updateEvent: (id, data) =>
    request(`/events/${id}`, { method: "PUT", body: JSON.stringify(data), auth: true }),
  deleteEvent: (id) => request(`/events/${id}`, { method: "DELETE", auth: true }),

  buyTicket: (eventId, quantity) =>
    request("/tickets", {
      method: "POST",
      body: JSON.stringify({ event_id: eventId, quantity }),
      auth: true,
    }),
  getMyTickets: () => request("/tickets/mine", { auth: true }),
  cancelTicket: (id) => request(`/tickets/${id}`, { method: "DELETE", auth: true }),
};