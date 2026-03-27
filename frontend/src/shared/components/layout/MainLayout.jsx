import Header from './Header/Header';
import Footer from './Footer/Footer';

// Main layout wrapper for public pages
const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
