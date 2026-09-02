import { useState, useEffect } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ movies: 0, series: 0, news: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [movies, series, news] = await Promise.all([
          api.get('/movies?limit=1'),
          api.get('/series?limit=1'),
          api.get('/news?limit=1')
        ]);
        setCounts({
          movies: movies.data.totalResults,
          series: series.data.totalResults,
          news: news.data.totalResults
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-number">{counts.movies}</span>
          <span>Movies</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{counts.series}</span>
          <span>Series</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{counts.news}</span>
          <span>News Articles</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;