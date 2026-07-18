import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <span className="stat-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

function formatRating(rating) {
  const value = Number(rating || 0);
  return `${value.toFixed(1)} / 5`;
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile/me');
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <p className="error">{error}</p>
          <button type="button" onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    );
  }

  const isClient = profile.user_type === 'client';
  const skillsCount = Array.isArray(profile.skills) ? profile.skills.length : 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <header className="dashboard-header">
          <div>
            <h1>Profile Dashboard</h1>
            <p className="user-email">{profile.email}</p>
            <span className={`badge badge-${profile.user_type}`}>
              {isClient ? 'Client' : 'Talent'}
            </span>
          </div>
          <button type="button" onClick={logout} className="logout-btn">
            Logout
          </button>
        </header>

        <section className="stats-grid">
          {isClient ? (
            <>
              <StatCard
                label="Projects Posted"
                value={profile.projects_posted ?? 0}
                icon="📋"
              />
              <StatCard label="Hires Made" value={profile.hires_made ?? 0} icon="🤝" />
              <StatCard
                label="Member Since"
                value={formatDate(profile.created_at)}
                icon="📅"
              />
            </>
          ) : (
            <>
              <StatCard
                label="Profile Views"
                value={profile.profile_views ?? 0}
                icon="👁️"
              />
              <StatCard
                label="Applications Sent"
                value={profile.applications_sent ?? 0}
                icon="📤"
              />
              <StatCard
                label="Rating"
                value={formatRating(profile.rating)}
                icon="⭐"
              />
              <StatCard label="Skills Listed" value={skillsCount} icon="🛠️" />
            </>
          )}
        </section>

        <section className="profile-section">
          <h2>Account details</h2>
          <dl className="details-list">
            <div>
              <dt>Account type</dt>
              <dd>{isClient ? 'Client' : 'Talent'}</dd>
            </div>
            <div>
              <dt>User ID</dt>
              <dd>{profile.id}</dd>
            </div>
            <div>
              <dt>Joined</dt>
              <dd>{formatDate(profile.created_at)}</dd>
            </div>
            {profile.full_name && (
              <div>
                <dt>Name</dt>
                <dd>{profile.full_name}</dd>
              </div>
            )}
          </dl>
          {profile.bio && (
            <div className="bio-block">
              <h3>About</h3>
              <p>{profile.bio}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
