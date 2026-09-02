import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import CommentThread from '../../components/common/CommentThread';
import { buildCommentTree } from '../../utils/buildCommentTree';

const DiscussionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDiscussion = async () => {
    try {
      const { data } = await api.get(`/discussions/${id}`);
      setDiscussion(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/comments/discussion/${id}`);
      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDiscussion(), fetchComments()]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleTopLevelSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/comments', { discussion: id, text: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (text, parentComment) => {
    await api.post('/comments', { discussion: id, text, parentComment });
    fetchComments();
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpvote = async () => {
    try {
      await api.put(`/discussions/${id}/upvote`);
      fetchDiscussion();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="page-status">Loading...</p>;
  if (!discussion) return <p className="page-status">Discussion not found.</p>;

  const commentTree = buildCommentTree(comments);

  return (
    <div className="discussion-detail-page">
      <Link to={`/${discussion.itemType.toLowerCase()}/${discussion.itemId}`} className="back-link">
        ← Back
      </Link>

      <div className="discussion-detail-header">
        <h1>{discussion.title} {discussion.containsSpoilers && <span className="spoiler-tag">SPOILER</span>}</h1>
        <p className="discussion-meta">by {discussion.user?.name} · {new Date(discussion.createdAt).toLocaleDateString()}</p>
        <p className="discussion-body">{discussion.body}</p>
        <button onClick={handleUpvote}>👍 Upvote ({discussion.upvotes?.length || 0})</button>
      </div>

      <div className="comments-section">
        <h2>Comments ({comments.length})</h2>

        {user && (
          <form onSubmit={handleTopLevelSubmit} className="comment-form">
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        )}

        <div className="comment-list">
          {commentTree.length === 0 && <p>No comments yet.</p>}
          {commentTree.map((comment) => (
            <CommentThread
              key={comment._id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscussionDetail;