import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ImperialChatbot } from './components/ImperialChatbot';
import { SiteSettingsModal } from './components/SiteSettingsModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesOverviewPage } from './pages/ServicesOverviewPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const timer = window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SiteConfigProvider>
        <BrowserRouter>
          <ScrollManager />
          <div className="min-h-screen flex flex-col bg-white text-[#101C35]">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<ServicesOverviewPage />} />
                <Route
                  path="/services/aluminium-works"
                  element={<ServiceDetailPage slug="aluminium-works" />}
                />
                <Route
                  path="/services/glass-works"
                  element={<ServiceDetailPage slug="glass-works" />}
                />
                <Route
                  path="/services/upvc-windows-doors"
                  element={<ServiceDetailPage slug="upvc-windows-doors" />}
                />
                <Route
                  path="/services/interior-ceiling-works"
                  element={<ServiceDetailPage slug="interior-ceiling-works" />}
                />
                <Route
                  path="/services/railings-metal-works"
                  element={<ServiceDetailPage slug="railings-metal-works" />}
                />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </main>
            <Footer />
            <ImperialChatbot />
            <FloatingWhatsApp />
            <SiteSettingsModal />
          </div>
        </BrowserRouter>
      </SiteConfigProvider>
    </MotionConfig>
  );
}
