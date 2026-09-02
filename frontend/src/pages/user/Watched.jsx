import { useState, useEffect } from 'react';
import api from '../../api/axios';
import MediaCard from '../../components/common/MediaCard';

const Watched = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWatched = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/watched');
      setItems(data);
    } catch (error) {
      console.error(error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatched();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/users/watched/${itemId}`);
      setItems((prev) => prev.filter((entry) => entry.itemId?._id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="page-status">Loading...</p>;

  return (
    <div className="list-page">
      <h1>Watched</h1>
      {items.length === 0 && <p>You haven't marked anything as watched yet.</p>}
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

export default Watched;