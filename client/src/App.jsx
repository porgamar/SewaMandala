import Navbar from "./pages/navbar";
import Footer from "./pages/footer";

import IndexPage from "./pages/home";
import UserProfile from "./pages/profile";
import ExplorePage from "./pages/Explore";
import Client from "./pages/client_listing";
import Talent from "./pages/talent_listing";
import Services from "./pages/Services";
import OurTeam from "./pages/OurTeam";
import Chat from "./pages/Chat";
import AdminPanel from "./pages/AdminPanel";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
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

// Admin panel is a standalone page — no site Navbar/Footer around it.
function SiteChrome({ children }) {
  const location = useLocation();
  const isAdminPage = location.pathname.toLowerCase() === "/admin";

  if (isAdminPage) {
    return children;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <SiteChrome>
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
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/client" element={<Client />} />
          <Route path="/talent" element={<Talent />} />

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
      </Router>
    </AuthProvider>
  );
}

export default App;