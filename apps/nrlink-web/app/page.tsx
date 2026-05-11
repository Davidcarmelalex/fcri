import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';
import TrustSection from '../components/TrustSection';
import Countdown from '../components/Countdown';
import WaitlistForm from '../components/WaitlistForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeatureCards />
      <TrustSection />
      <Countdown />
      <WaitlistForm />
      <Footer />
    </main>
  );
}
