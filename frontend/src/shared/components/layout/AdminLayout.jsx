import { useState } from 'react';
import AdminHeader from './Header/AdminHeader';
import Footer from './Footer/Footer';
import Sidebar from './Sidebar/Sidebar';
import './AdminLayout.scss';

// Admin layout wrapper for protected/admin pages
const AdminLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar onCollapseChange={setIsSidebarCollapsed} />
      <main
        className={`admin-content ${isSidebarCollapsed ? 'collapsed' : ''}`}
      >
        <AdminHeader />
        <section className="admin-main">{children}</section>
        <Footer />
      </main>
    </div>
  );
};

export default AdminLayout;
