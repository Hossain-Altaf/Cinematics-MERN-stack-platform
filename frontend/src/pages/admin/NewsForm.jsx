import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const emptyForm = {
  title: '',
  content: '',
  category: 'movie',
  coverImage: '',
  relatedItemType: '',
  relatedItemId: ''
};

const NewsForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetchNews = async () => {
      try {
        const { data } = await api.get(`/news/${id}`);
        setForm({
          title: data.title || '',
          content: data.content || '',
          category: data.category || 'movie',
          coverImage: data.coverImage || '',
          relatedItemType: data.relatedItem?.itemType || '',
          relatedItemId: data.relatedItem?.itemId || ''
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      title: form.title,
      content: form.content,
      category: form.category,
      coverImage: form.coverImage,
      relatedItem:
        form.relatedItemType && form.relatedItemId
          ? { itemType: form.relatedItemType, itemId: form.relatedItemId }
          : undefined
    };

    try {
      if (isEdit) {
        await api.put(`/news/${id}`, payload);
      } else {
        await api.post('/news', payload);
      }
      navigate('/admin/news');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save article');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>{isEdit ? 'Edit Article' : 'Add Article'}</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>Category
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="actor">Actor</option>
            <option value="director">Director</option>
            <option value="industry">Industry</option>
          </select>
        </label>
       <ImageUploadField
          label="Cover Image"
          value={form.coverImage}
          onChange={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
        />
        <label>Content
          <textarea name="content" rows={10} value={form.content} onChange={handleChange} required />
        </label>
        <label>Related Item Type (optional)
          <select name="relatedItemType" value={form.relatedItemType} onChange={handleChange}>
            <option value="">None</option>
            <option value="Movie">Movie</option>
            <option value="Series">Series</option>
          </select>
        </label>
        <label>Related Item ID (optional)
          <input
            name="relatedItemId"
            value={form.relatedItemId}
            onChange={handleChange}
            placeholder="Paste the movie/series ID"
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
        </button>
      </form>
    </div>
  );
};

export default NewsForm;