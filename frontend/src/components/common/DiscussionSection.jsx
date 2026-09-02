import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const DiscussionSection = ({ itemType, itemId }) => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchDiscussions = async () => {
    try {
      const { data } = await api.get(`/discussions/item/${itemId}`);
      setDiscussions(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDiscussions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/discussions', { itemType, itemId, title, body, containsSpoilers });
      setTitle('');
      setBody('');
      setContainsSpoilers(false);
      setShowForm(false);
      fetchDiscussions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post discussion');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="discussion-section">
      <div className="section-header">
        <h2>Discussions ({discussions.length})</h2>
        {user && (
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Discussion'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="discussion-form">
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            placeholder="Discussion title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="What do you want to discuss?"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={containsSpoilers}
              onChange={(e) => setContainsSpoilers(e.target.checked)}
            />
            Contains spoilers
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Discussion'}
          </button>
        </form>
      )}

      <div className="discussion-list">
        {discussions.length === 0 && <p>No discussions yet.</p>}
        {discussions.map((d) => (
          <Link key={d._id} to={`/discussion/${d._id}`} className="discussion-card">
            <h4>{d.title} {d.containsSpoilers && <span className="spoiler-tag">SPOILER</span>}</h4>
            <p>by {d.user?.name} · 👍 {d.upvotes?.length || 0}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DiscussionSection;