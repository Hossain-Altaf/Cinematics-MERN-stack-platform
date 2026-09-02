import { Link } from 'react-router-dom';

const MediaCard = ({ item, type }) => {
  return (
    <Link to={`/${type}/${item._id}`} className="media-card">
      <img src={item.poster} alt={item.title} />
      <h4>{item.title}</h4>
      <span className="rating">⭐ {item.avgRating?.toFixed(1) || 'N/A'}</span>
    </Link>
  );
};

export default MediaCard;