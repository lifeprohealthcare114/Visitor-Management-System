import Header from '../../components/Header/Header';
import VisitorForm from '../../components/VisitorForm/VisitorForm';
import './Home.css';

function Home({ onSubmitSuccess, onAdminLogin }) {
  return (
    <div className="app-container">
      <Header onAdminLogin={onAdminLogin} />
      <main className="main-content">
        {/* Welcome Section moved here */}
        <section className="welcome-section fade-in">
          <div className="welcome-content">
            <img
              src="lifepro-logo.png"
              alt="LifePro Logo"
              className="welcome-logo"
            />
            <div>
      <h1 className="welcome-title">Welcome — we're glad to have you here.</h1>
<p className="subline">Your visit is important to us. Please complete the form below to check in.</p>

            </div>
          </div>
        </section>

        {/* Form stays below */}
        <div className="visitor-form-wrapper">
          <VisitorForm onSubmitSuccess={onSubmitSuccess} />
        </div>
      </main>
    </div>
  );
}

export default Home;
