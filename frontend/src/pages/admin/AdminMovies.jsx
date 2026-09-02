import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/movies?limit=100');
      setMovies(data.movies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this movie? This cannot be undone.')) return;
    try {
      await api.delete(`/movies/${id}`);
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <h1>Movies</h1>
        <Link to="/admin/movies/new" className="btn-primary">+ Add Movie</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Poster</th>
              <th>Title</th>
              <th>Release Date</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie._id}>
                <td><img src={movie.poster} alt={movie.title} className="table-thumb" /></td>
                <td>{movie.title}</td>
                <td>{new Date(movie.releaseDate).toLocaleDateString()}</td>
                <td>⭐ {movie.avgRating?.toFixed(1) || 'N/A'}</td>
                <td>
                  <Link to={`/admin/movies/${movie._id}/edit`}>Edit</Link>
                  {' · '}
                  <button className="link-btn" onClick={() => handleDelete(movie._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMovies;