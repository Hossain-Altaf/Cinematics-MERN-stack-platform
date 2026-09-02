import { useState } from 'react';
import api from '../../api/axios';

const ImageUploadField = ({ label, value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onChange(data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-field">
      <label>{label}</label>
      {value && <img src={value} alt="preview" className="upload-preview" />}
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
      {uploading && <p className="upload-status">Uploading...</p>}
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Or paste an image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="url-fallback"
      />
    </div>
  );
};

export default ImageUploadField;