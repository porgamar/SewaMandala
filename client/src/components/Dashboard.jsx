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

const expertiseOptions = [
  'Web Development',
  'UI/UX Design',
  'Mobile Apps',
  'Data Science',
  'Digital Marketing',
  'Content Writing',
  'SEO',
  'Project Management',
  'Brand Strategy',
];

function formatRating(rating) {
  const value = Number(rating || 0);
  return value.toFixed(1);
}

function renderStars(rating) {
  const filled = Math.round(Number(rating) || 0);
  return Array.from({ length: 5 }, (_, index) => (
    <span key={index} className={index < filled ? 'star filled' : 'star'}>
      ★
    </span>
  ));
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draftBio, setDraftBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [saveStatus, setSaveStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [modified, setModified] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile/me');
        setProfile(data);
        setDraftBio(data.bio || '');
        setSelectedSkills(Array.isArray(data.skills) ? data.skills : []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const toggleSkill = (skill) => {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
    setModified(true);
    setSaveStatus('Unsaved changes');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('Saving…');
    try {
      const { data } = await api.patch('/profile/me', {
        bio: draftBio,
        skills: selectedSkills,
      });
      setProfile(data);
      setModified(false);
      setSaveStatus('Saved successfully');
    } catch (err) {
      setSaveStatus('Save failed');
    } finally {
      setSaving(false);
    }
  };

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
  const skillsCount = selectedSkills.length;
  const handle = profile.username || profile.full_name?.toLowerCase().replace(/\s+/g, '') || profile.email?.split('@')[0] || 'profile';

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <div className="profile-grid">
          <div className="profile-summary-card">
            <div className="profile-avatar-row">
              <div className="profile-avatar">{profile.full_name?.charAt(0).toUpperCase() || 'U'}</div>
              <div>
                <p className="profile-label">Talent Profile</p>
                <h1 className="profile-name">{profile.full_name || profile.email}</h1>
                <p className="profile-handle">@{handle}</p>
              </div>
            </div>

            <div className="profile-meta">
              <span className={`badge-pill badge-${profile.user_type}`}>
                {isClient ? 'Client' : 'Talent'}
              </span>
              <span className="meta-item">Joined {formatDate(profile.created_at)}</span>
              <span className="meta-item">{profile.email}</span>
            </div>

            <div className="profile-actions">
              <button type="button" className="action-btn action-primary">
                Message
              </button>
              <button
                type="button"
                className="action-btn action-primary save-btn"
                onClick={handleSave}
                disabled={saving || !modified}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
            <div className="save-status-row">
              <p className="save-status-text">{saveStatus}</p>
            </div>

            <div className="profile-stats-row">
              <div className="profile-stat">
                <p className="stat-number">{profile.profile_views ?? 0}</p>
                <p className="stat-label">Profile views</p>
              </div>
              <div className="profile-stat">
                <p className="stat-number">{profile.applications_sent ?? 0}</p>
                <p className="stat-label">Applications</p>
              </div>
              <div className="profile-stat">
                <p className="stat-number">{profile.projects_posted ?? 0}</p>
                <p className="stat-label">Projects posted</p>
              </div>
            </div>

            <div className="bio-block editable-bio-block">
              <div className="bio-header-row">
                <h3>About</h3>
                <span className="bio-status">{saving ? 'Saving…' : saveStatus}</span>
              </div>
              <textarea
                className="profile-description-input"
                rows={5}
                value={draftBio}
                onChange={(e) => {
                  setDraftBio(e.target.value);
                  setSaveStatus('Unsaved changes');
                }}
                placeholder="Add a short description of your expertise, experience, and what you offer."
              />
            </div>

            <div className="expertise-block">
              <h3>Expertise</h3>
              <div className="expertise-tags">
                {expertiseOptions.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    className={`expertise-tag ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="profile-details-card">
            <div className="rating-summary">
              <div>
                <p className="rating-score">{formatRating(profile.rating)}</p>
                <div className="rating-stars">{renderStars(profile.rating)}</div>
                <p className="rating-text">Client rating</p>
              </div>
              <div className="rating-chart">
                <div className="rating-bar-group">
                  {[5, 4, 3, 2, 1].map((value) => {
                    const count = profile.rating_breakdown?.[value] ?? (value === 5 ? Math.round(profile.rating || 0) : 0);
                    return (
                      <div key={value} className="rating-bar-row">
                        <span>{value}</span>
                        <div className="rating-bar-bg">
                          <div className="rating-bar-fill" style={{ width: `${Math.min(100, count * 20)}%` }} />
                        </div>
                        <span>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="stats-grid compact-grid">
              <StatCard label="Rating" value={formatRating(profile.rating)} icon="⭐" />
              <StatCard label="Views" value={profile.profile_views ?? 0} icon="👁️" />
              <StatCard label="Applications" value={profile.applications_sent ?? 0} icon="📤" />
              <StatCard label="Skills" value={skillsCount} icon="🛠️" />
            </div>

            <div className="review-card">
              <div className="review-header">
                <p className="review-title">Feedback highlight</p>
                <span className="review-badge">Top review</span>
              </div>
              <p className="review-text">
                {profile.bio || 'No review available yet. Keep your profile updated to receive more feedback.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
