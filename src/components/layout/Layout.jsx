import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full">
        <div className="min-h-[calc(100vh-theme(spacing.32))]">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;