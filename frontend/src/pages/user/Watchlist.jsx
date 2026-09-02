import { useState, useEffect } from 'react';
import api from '../../api/axios';
import MediaCard from '../../components/common/MediaCard';

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/watchlist');
      setItems(data);
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/users/watchlist/${itemId}`);
      setItems((prev) => prev.filter((entry) => entry.itemId?._id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="page-status">Loading...</p>;

  return (
    <div className="list-page">
      <h1>My Watchlist</h1>
      {items.length === 0 && <p>Nothing saved yet. Browse movies and series to add some!</p>}
      <div className="media-grid">
        {items.map((entry) => (
          entry.itemId && (
            <div key={entry.itemId._id} className="list-card-wrapper">
              <MediaCard item={entry.itemId} type={entry.itemType.toLowerCase()} />
              <button className="remove-btn" onClick={() => handleRemove(entry.itemId._id)}>
                Remove
              </button>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Watchlist;