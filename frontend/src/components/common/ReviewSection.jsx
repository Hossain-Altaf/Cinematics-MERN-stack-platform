import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ReviewSection = ({ itemType, itemId, onReviewChange }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(8);
  const [text, setText] = useState('');
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/item/${itemId}`);
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/reviews', { itemType, itemId, rating: Number(rating), text, containsSpoilers });
      setText('');
      setRating(8);
      setContainsSpoilers(false);
      fetchReviews();
      onReviewChange?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      fetchReviews();
      onReviewChange?.();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async (reviewId) => {
    try {
      await api.put(`/reviews/${reviewId}/like`);
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="review-section">
      <h2>Reviews ({reviews.length})</h2>

      {user && (
        <form onSubmit={handleSubmit} className="review-form">
          {error && <p className="error">{error}</p>}
          <label>
            Rating:
            <input
              type="number"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </label>
          <textarea
            placeholder="Write your review..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={containsSpoilers}
              onChange={(e) => setContainsSpoilers(e.target.checked)}
            />
            Contains spoilers
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Review'}
          </button>
        </form>
      )}

      <div className="review-list">
        {reviews.length === 0 && <p>No reviews yet. Be the first!</p>}
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-head">
              <strong>{review.user?.name}</strong>
              <span className="rating">⭐ {review.rating}/10</span>
            </div>
            {review.containsSpoilers && <span className="spoiler-tag">SPOILER</span>}
            <p>{review.text}</p>
            <div className="review-actions">
              <button onClick={() => handleLike(review._id)}>
                👍 {review.likes?.length || 0}
              </button>
              {user?._id === review.user?._id && (
                <button onClick={() => handleDelete(review._id)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;