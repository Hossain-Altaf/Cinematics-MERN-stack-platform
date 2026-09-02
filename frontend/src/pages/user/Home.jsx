import { useState, useEffect } from 'react';
import api from '../../api/axios';
import MediaCard from '../../components/common/MediaCard';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async (searchTerm = '') => {
    setLoading(true);
    try {
      const [movieRes, seriesRes] = await Promise.all([
        api.get(`/movies?search=${searchTerm}&limit=12`),
        api.get(`/series?search=${searchTerm}&limit=12`)
      ]);
      setMovies(movieRes.data.movies);
      setSeries(seriesRes.data.series);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(search);
  };

  return (
    <div className="home-page">
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search movies and series..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <section>
            <h2>Movies</h2>
            <div className="media-grid">
              {movies.length === 0 && <p>No movies found.</p>}
              {movies.map((movie) => (
                <MediaCard key={movie._id} item={movie} type="movie" />
              ))}
            </div>
          </section>

          <section>
            <h2>Series</h2>
            <div className="media-grid">
              {series.length === 0 && <p>No series found.</p>}
              {series.map((s) => (
                <MediaCard key={s._id} item={s} type="series" />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;