import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import MediaDetail from './pages/user/MediaDetail';
import DiscussionDetail from './pages/user/DiscussionDetail';
import Watchlist from './pages/user/Watchlist';
import Watched from './pages/user/Watched';
import ProtectedRoute from './components/common/ProtectedRoute';
import News from './pages/user/News';
import NewsDetail from './pages/user/NewsDetail';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import MovieForm from './pages/admin/MovieForm';
import AdminSeries from './pages/admin/AdminSeries';
import SeriesForm from './pages/admin/SeriesForm';
import AdminNews from './pages/admin/AdminNews';
import NewsForm from './pages/admin/NewsForm';
import AdminRegister from './pages/user/AdminRegister';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/news" element={<News />} />
  <Route path="/news/:id" element={<NewsDetail />} />
  <Route path="/discussion/:id" element={<DiscussionDetail />} />
  <Route path="/admin-register" element={<AdminRegister />} />
  <Route
    path="/watchlist"
    element={
      <ProtectedRoute>
        <Watchlist />
      </ProtectedRoute>
    }
  />
  <Route
    path="/watched"
    element={
      <ProtectedRoute>
        <Watched />
      </ProtectedRoute>
    }
  />

  <Route
    path="/admin"
    element={
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<AdminDashboard />} />
    <Route path="movies" element={<AdminMovies />} />
    <Route path="movies/new" element={<MovieForm />} />
    <Route path="movies/:id/edit" element={<MovieForm />} />
    <Route path="series" element={<AdminSeries />} />
    <Route path="series/new" element={<SeriesForm />} />
    <Route path="series/:id/edit" element={<SeriesForm />} />
    <Route path="news" element={<AdminNews />} />
    <Route path="news/new" element={<NewsForm />} />
    <Route path="news/:id/edit" element={<NewsForm />} />
  </Route>

  <Route path="/:type/:id" element={<MediaDetail />} />
</Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;