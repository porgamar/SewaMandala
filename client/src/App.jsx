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

// Redirect authenticated admins away from any non-admin route
function RedirectAdmin({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="auth-page">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated && user?.user_type === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

// Only allow admin user_type to access the admin page
function AdminOnlyRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="auth-page">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.user_type !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}

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
      <Navbar />
      {children}
      <StickyButton />
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
            <Route
              path="/"
              element={
                <RedirectAdmin>
                  <IndexPage />
                </RedirectAdmin>
              }
            />
            <Route
              path="/home"
              element={
                <RedirectAdmin>
                  <IndexPage />
                </RedirectAdmin>
              }
            />

            <Route
              path="/explore"
              element={
                <RedirectAdmin>
                  <ExplorePage />
                </RedirectAdmin>
              }
            />
            <Route
              path="/ourteam"
              element={
                <RedirectAdmin>
                  <OurTeam />
                </RedirectAdmin>
              }
            />
            <Route
              path="/services"
              element={
                <RedirectAdmin>
                  <Services />
                </RedirectAdmin>
              }
            />

            <Route
              path="/client"
              element={
                <RedirectAdmin>
                  <Client />
                </RedirectAdmin>
              }
            />
            <Route
              path="/available-work"
              element={
                <RedirectAdmin>
                  <AvailableWork />
                </RedirectAdmin>
              }
            />

<Route
              path="/current-work"
              element={
                <RedirectAdmin>
                  <ProtectedRoute>
                    <CurrentWork />
                  </ProtectedRoute>
                </RedirectAdmin>
              }
            />

            <Route
              path="/talent"
              element={
                <RedirectAdmin>
                  <TalentOnlyRoute>
                    <Talent />
                  </TalentOnlyRoute>
                </RedirectAdmin>
              }
            />

            <Route
              path="/chat"
              element={
                <RedirectAdmin>
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                </RedirectAdmin>
              }
            />

            <Route
              path="/chat/:jobId"
              element={
                <RedirectAdmin>
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                </RedirectAdmin>
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
                <RedirectAdmin>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </RedirectAdmin>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminOnlyRoute>
                  <AdminPanel />
                </AdminOnlyRoute>
              }
            />
</Routes>
        </SiteChrome>
      </Router>
    </AuthProvider>
  );
}

export default App;