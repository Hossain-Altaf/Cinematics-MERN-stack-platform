import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/news/${id}`);
        setNews(data);
      } catch (error) {
        console.error(error);
        setNews(null);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  if (loading) return <p className="page-status">Loading...</p>;
  if (!news) return <p className="page-status">Article not found.</p>;

  return (
    <div className="news-detail-page">
      <Link to="/news" className="back-link">← Back to News</Link>
      <img src={news.coverImage} alt={news.title} className="news-detail-cover" />
      <span className="news-category">{news.category}</span>
      <h1>{news.title}</h1>
      <p className="news-meta">
        By {news.postedBy?.name} · {new Date(news.createdAt).toLocaleDateString()}
      </p>

      {news.relatedItem?.itemId && (
        <p>
          Related:{' '}
          <Link to={`/${news.relatedItem.itemType.toLowerCase()}/${news.relatedItem.itemId}`}>
            View {news.relatedItem.itemType}
          </Link>
        </p>
      )}

      <div className="news-content">
        {news.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
};

export default NewsDetail;