import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import EventForm from "./pages/EventForm.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import MyTickets from "./pages/MyTickets.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="organizer">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/new"
          element={
            <ProtectedRoute role="organizer">
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/edit/:id"
          element={
            <ProtectedRoute role="organizer">
              <EventForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}



