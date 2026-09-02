import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/news?limit=100');
      setNews(data.news);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    try {
      await api.delete(`/news/${id}`);
      setNews((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>News</h1>
        <Link to="/admin/news/new" className="btn-primary">+ Add Article</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Category</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item._id}>
                <td><img src={item.coverImage} alt={item.title} className="table-thumb" /></td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/admin/news/${item._id}/edit`}>Edit</Link>
                  {' · '}
                  <button className="link-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminNews;