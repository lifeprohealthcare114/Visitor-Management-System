import Header from '../../components/Header/Header';
import VisitorForm from '../../components/VisitorForm/VisitorForm';
import AnnouncementBanner from '../../components/AnnouncementBanner/AnnouncementBanner';
import './Home.css';

function Home({ onSubmitSuccess, onAdminLogin }) {
  return (
    <div className="app-container">
      <Header onAdminLogin={onAdminLogin} />
      <AnnouncementBanner />
      <main className="main-content">
        <div className="visitor-form-wrapper">
          <VisitorForm onSubmitSuccess={onSubmitSuccess} />
        </div>
      </main>
    </div>
  );
}

export default Home;