import Navbar from '../components/Navbar';
import HeroSection from '../components/landingPage/HeroSection';
import ProblemSection from '../components/landingPage/ProblemSection';
import HowItWorks from '../components/landingPage/HowItWorks';
import AvailableListings from '../components/landingPage/ListingCards';
import FinalCTA from '../components/landingPage/FinalCTA';
import ImpactStats from '../components/landingPage/ImpactStats';
import FeatureGrid from '../components/landingPage/FeatureGrid';
import QuoteHero from '../components/landingPage/QuoteHero';
import Footer from '../components/landingPage/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <HowItWorks/>
        <div id='listing'>

        <AvailableListings/>
        </div>
        <FeatureGrid/>
        <QuoteHero/>
        <ImpactStats/>
        <FinalCTA/>
        <Footer/>
      </main>
    </div>
  );
};

export default LandingPage;