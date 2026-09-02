import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const CommentThread = ({ comment, onReply, onDelete, depth = 0 }) => {
  const { user } = useAuth();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onReply(replyText, comment._id);
      setReplyText('');
      setReplying(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-thread" style={{ marginLeft: depth > 0 ? 24 : 0 }}>
      <div className="comment-card">
        <div className="comment-head">
          <strong>{comment.user?.name}</strong>
          <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p>{comment.text}</p>
        <div className="comment-actions">
          {user && (
            <button onClick={() => setReplying(!replying)}>
              {replying ? 'Cancel' : 'Reply'}
            </button>
          )}
          {user?._id === comment.user?._id && (
            <button onClick={() => onDelete(comment._id)}>Delete</button>
          )}
        </div>

        {replying && (
          <form onSubmit={handleReply} className="reply-form">
            <textarea
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Reply'}
            </button>
          </form>
        )}
      </div>

      {comment.children?.length > 0 && (
        <div className="comment-children">
          {comment.children.map((child) => (
            <CommentThread
              key={child._id}
              comment={child}
              onReply={onReply}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;