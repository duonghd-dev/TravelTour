import Header from './Header/Header';
import Footer from './Footer/Footer';

// Client layout wrapper for user-facing pages
const ClientLayout = ({ children }) => {
  return (
    <div className="client-layout">
      <Header />
      <main className="client-content">{children}</main>
      <Footer />
    </div>
  );
};

export default ClientLayout;
