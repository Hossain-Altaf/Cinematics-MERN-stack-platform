import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminSeries = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSeries = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/series?limit=100');
      setSeries(data.series);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this series? This cannot be undone.')) return;
    try {
      await api.delete(`/series/${id}`);
      setSeries((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Series</h1>
        <Link to="/admin/series/new" className="btn-primary">+ Add Series</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {series.map((s) => (
              <tr key={s._id}>
                <td><img src={s.poster} alt={s.title} className="table-thumb" /></td>
                <td>{s.title}</td>
                <td>{s.status}</td>
                <td>⭐ {s.avgRating?.toFixed(1) || 'N/A'}</td>
                <td>
                  <Link to={`/admin/series/${s._id}/edit`}>Edit</Link>
                  {' · '}
                  <button className="link-btn" onClick={() => handleDelete(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSeries;