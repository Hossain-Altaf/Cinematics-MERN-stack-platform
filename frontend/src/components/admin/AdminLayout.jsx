import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/movies">Movies</Link>
          <Link to="/admin/series">Series</Link>
          <Link to="/admin/news">News</Link>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;