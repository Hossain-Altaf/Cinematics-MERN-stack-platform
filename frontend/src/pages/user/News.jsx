import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const CATEGORIES = ['all', 'movie', 'series', 'actor', 'director', 'industry'];

const News = () => {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchNews = async (cat, pg) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: 9 };
      if (cat !== 'all') params.category = cat;
      const { data } = await api.get('/news', { params });
      setNews(data.news);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(category, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, page]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="news-page">
      <h1>News</h1>

      <div className="category-filter">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={category === cat ? 'active' : ''}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="page-status">Loading...</p>
      ) : (
        <>
          {news.length === 0 && <p>No news found in this category.</p>}
          <div className="news-grid">
            {news.map((item) => (
              <Link key={item._id} to={`/news/${item._id}`} className="news-card">
                <img src={item.coverImage} alt={item.title} />
                <div className="news-card-body">
                  <span className="news-category">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p className="news-date">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default News;