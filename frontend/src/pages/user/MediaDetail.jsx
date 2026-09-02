import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ReviewSection from '../../components/common/ReviewSection';
import DiscussionSection from '../../components/common/DiscussionSection';

const MediaDetail = () => {
  const { type, id } = useParams(); // type = "movie" or "series"
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inWatched, setInWatched] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  const endpoint = type === 'movie' ? '/movies' : '/series';
  const itemType = type === 'movie' ? 'Movie' : 'Series';

  const fetchItem = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`${endpoint}/${id}`);
      setItem(data);
    } catch (error) {
      console.error(error);
      setItem(null);
    } finally {
      setLoading(false);
    }
  };

  const checkLists = async () => {
    if (!user) return;
    try {
      const [wl, wd] = await Promise.all([
        api.get('/users/watchlist'),
        api.get('/users/watched')
      ]);
      setInWatchlist(wl.data.some((entry) => entry.itemId?._id === id));
      setInWatched(wd.data.some((entry) => entry.itemId?._id === id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItem();
    checkLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  const handleToggleWatchlist = async () => {
    setListLoading(true);
    try {
      if (inWatchlist) {
        await api.delete(`/users/watchlist/${id}`);
        setInWatchlist(false);
      } else {
        await api.post('/users/watchlist', { itemType, itemId: id });
        setInWatchlist(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setListLoading(false);
    }
  };

  const handleToggleWatched = async () => {
    setListLoading(true);
    try {
      if (inWatched) {
        await api.delete(`/users/watched/${id}`);
        setInWatched(false);
      } else {
        await api.post('/users/watched', { itemType, itemId: id });
        setInWatched(true);
        setInWatchlist(false); // backend removes it from watchlist too
      }
    } catch (error) {
      console.error(error);
    } finally {
      setListLoading(false);
    }
  };

  if (loading) return <p className="page-status">Loading...</p>;
  if (!item) return <p className="page-status">Item not found.</p>;

  return (
    <div className="detail-page">
      <div className="detail-header">
        <img src={item.poster} alt={item.title} className="detail-poster" />
        <div className="detail-info">
          <h1>{item.title}</h1>
          <p className="detail-rating">⭐ {item.avgRating?.toFixed(1) || 'N/A'} ({item.reviewCount || 0} reviews)</p>
          <p className="detail-genres">{item.genre?.join(', ')}</p>
          <p className="detail-description">{item.description}</p>

          {type === 'movie' ? (
            <p><strong>Director:</strong> {item.director} · <strong>Runtime:</strong> {item.runtime} min</p>
          ) : (
            <p><strong>Creator:</strong> {item.creator} · <strong>Status:</strong> {item.status}</p>
          )}
          {item.cast?.length > 0 && <p><strong>Cast:</strong> {item.cast.join(', ')}</p>}

          {user && (
            <div className="detail-actions">
              <button onClick={handleToggleWatchlist} disabled={listLoading}>
                {inWatchlist ? '− Remove from Watchlist' : '+ Add to Watchlist'}
              </button>
              <button onClick={handleToggleWatched} disabled={listLoading}>
                {inWatched ? '✓ Watched' : 'Mark as Watched'}
              </button>
            </div>
          )}
          {!user && <p><Link to="/login">Log in</Link> to save or review this.</p>}
        </div>
      </div>

      <ReviewSection itemType={itemType} itemId={id} onReviewChange={fetchItem} />
      <DiscussionSection itemType={itemType} itemId={id} />
    </div>
  );
};

export default MediaDetail;