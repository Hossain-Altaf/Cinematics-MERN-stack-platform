import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ImageUploadField from '../../components/admin/ImageUploadField';

const emptyForm = {
  title: '',
  description: '',
  genre: '',
  releaseDate: '',
  runtime: '',
  director: '',
  cast: '',
  language: '',
  poster: '',
  banner: '',
  trailerUrl: ''
};

const MovieForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    const fetchMovie = async () => {
      try {
        const { data } = await api.get(`/movies/${id}`);
        setForm({
          title: data.title || '',
          description: data.description || '',
          genre: (data.genre || []).join(', '),
          releaseDate: data.releaseDate ? data.releaseDate.slice(0, 10) : '',
          runtime: data.runtime || '',
          director: data.director || '',
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
    fetchMovie();
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
      cast: form.cast.split(',').map((c) => c.trim()).filter(Boolean),
      runtime: form.runtime ? Number(form.runtime) : undefined
    };

    try {
      if (isEdit) {
        await api.put(`/movies/${id}`, payload);
      } else {
        await api.post('/movies', payload);
      }
      navigate('/admin/movies');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save movie');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>{isEdit ? 'Edit Movie' : 'Add Movie'}</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="admin-form">
        <label>Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>Description
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </label>
        <label>Genre (comma-separated)
          <input name="genre" value={form.genre} onChange={handleChange} placeholder="Action, Sci-Fi" />
        </label>
        <label>Release Date
          <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} required />
        </label>
        <label>Runtime (minutes)
          <input type="number" name="runtime" value={form.runtime} onChange={handleChange} />
        </label>
        <label>Director
          <input name="director" value={form.director} onChange={handleChange} />
        </label>
        <label>Cast (comma-separated)
          <input name="cast" value={form.cast} onChange={handleChange} placeholder="Actor One, Actor Two" />
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
          {submitting ? 'Saving...' : isEdit ? 'Update Movie' : 'Create Movie'}
        </button>
      </form>
    </div>
  );
};

export default MovieForm;