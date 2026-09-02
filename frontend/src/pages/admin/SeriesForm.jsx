import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ImageUploadField from '../../components/admin/ImageUploadField';

const emptyForm = {
  title: '',
  description: '',
  genre: '',
  firstAirDate: '',
  status: 'ongoing',
  creator: '',
  cast: '',
  language: '',
  poster: '',
  banner: '',
  trailerUrl: ''
};

const SeriesForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetchSeries = async () => {
      try {
        const { data } = await api.get(`/series/${id}`);
        setForm({
          title: data.title || '',
          description: data.description || '',
          genre: (data.genre || []).join(', '),
          firstAirDate: data.firstAirDate ? data.firstAirDate.slice(0, 10) : '',
          status: data.status || 'ongoing',
          creator: data.creator || '',
          cast: (data.cast || []).join(', '),
          language: data.language || '',
          poster: data.poster || '',
          banner: data.banner || '',
          trailerUrl: data.trailerUrl || ''
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeries();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      ...form,
      genre: form.genre.split(',').map((g) => g.trim()).filter(Boolean),
      cast: form.cast.split(',').map((c) => c.trim()).filter(Boolean)
    };

    try {
      if (isEdit) {
        await api.put(`/series/${id}`, payload);
      } else {
        await api.post('/series', payload);
      }
      navigate('/admin/series');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save series');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>{isEdit ? 'Edit Series' : 'Add Series'}</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>Description
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </label>
        <label>Genre (comma-separated)
          <input name="genre" value={form.genre} onChange={handleChange} placeholder="Drama, Crime" />
        </label>
        <label>First Air Date
          <input type="date" name="firstAirDate" value={form.firstAirDate} onChange={handleChange} required />
        </label>
        <label>Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ongoing">Ongoing</option>
            <option value="ended">Ended</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </label>
        <label>Creator
          <input name="creator" value={form.creator} onChange={handleChange} />
        </label>
        <label>Cast (comma-separated)
          <input name="cast" value={form.cast} onChange={handleChange} />
        </label>
        <label>Language
          <input name="language" value={form.language} onChange={handleChange} />
        </label>
       <ImageUploadField
          label="Poster"
          value={form.poster}
          onChange={(url) => setForm((prev) => ({ ...prev, poster: url }))}
        />
        <ImageUploadField
          label="Banner"
          value={form.banner}
          onChange={(url) => setForm((prev) => ({ ...prev, banner: url }))}
        />
        <label>Trailer URL
          <input name="trailerUrl" value={form.trailerUrl} onChange={handleChange} />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Update Series' : 'Create Series'}
        </button>
      </form>
    </div>
  );
};

export default SeriesForm;