import Navbar from "./pages/navbar";
import Footer from "./pages/footer";
import IndexPage from "./pages/home";
import ExplorePage from "./pages/Explore";
import Client from "./pages/client_listing";
import Talent from "./pages/talent_listing";
import Services from "./pages/Services";
import OurTeam from "./pages/OurTeam";
import Chat from "./pages/Chat";
import AdminPanel from "./pages/AdminPanel";
import StickyButton from "./components/StickyButton";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import AvailableWork from "./components/AvailableWork";
import ProtectedRoute from "./components/ProtectedRoute";
import CurrentWork from "./components/CurrentWork";
import TalentOnlyRoute from "./components/TalentOnlyRoute";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

const ADMIN_EMAIL = "admin@sewamandala.com";

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="auth-page">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate to={user?.email === ADMIN_EMAIL ? "/admin" : "/home"} replace />
    );
  }

  return children;
}

function SiteChrome({ children }) {
  const location = useLocation();
  const isAdminPage = location.pathname.toLowerCase() === "/admin";

  if (isAdminPage) {
    return children;
  }

  return (
    <>
      {children}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <SiteChrome>
          <Navbar />
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/home" element={<IndexPage />} />

            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/ourteam" element={<OurTeam />} />
            <Route path="/services" element={<Services />} />

            <Route path="/client" element={<Client />} />
            <Route path="/available-work" element={<AvailableWork />} />

            <Route
              path="/current-work"
              element={
                <ProtectedRoute>
                  <CurrentWork />
                </ProtectedRoute>
              }
            />

            <Route
              path="/talent"
              element={
                <TalentOnlyRoute>
                  <Talent />
                </TalentOnlyRoute>
              }
            />

            <Route
              path="/chat/:jobId"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />

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

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </SiteChrome>
        <StickyButton />
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;