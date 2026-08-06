import Navbar from "./pages/navbar";
import Footer from "./pages/footer";

import IndexPage from "./pages/home";
import ExplorePage from "./pages/Explore";
import Client from "./pages/client_listing";
import Talent from "./pages/talent_listing";
import Services from "./pages/Services";
import OurTeam from "./pages/OurTeam";
import Chat from "./pages/Chat";
import StickyButton from "./components/StickyButton";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import TalentOnlyRoute from "./components/TalentOnlyRoute";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-page">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/Explore" element={<ExplorePage />} />
          <Route path="/OurTeam" element={<OurTeam />} />
          <Route path="/Services" element={<Services />} />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<IndexPage />} />
          <Route path="/home" element={<IndexPage />} />

          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/client" element={<Client />} />
          <Route path="/talent"
            element={
              <TalentOnlyRoute>
                <Talent />
              </TalentOnlyRoute>} />

          <Route path="/services" element={<Services />} />
          <Route path="/ourteam" element={<OurTeam />} />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>

        <StickyButton />
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;