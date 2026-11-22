import React, { createContext, useContext, useEffect, useState } from 'react';

export interface VideoSlotConfig {
  home: string;
  about: string;
  services: string;
  gallery: string;
  contact: string;
}

interface SiteConfigContextValue {
  businessEmail: string;
  setBusinessEmail: (email: string) => void;
  videos: VideoSlotConfig;
  setVideoUrl: (slot: keyof VideoSlotConfig, url: string) => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const STORAGE_EMAIL_KEY = 'nie_business_email_v1';
const STORAGE_VIDEOS_KEY = 'nie_video_slots_v1';

const DEFAULT_VIDEOS: VideoSlotConfig = {
  home: '',
  about: '',
  services: '',
  gallery: '',
  contact: '',
};

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) && trimmed.length <= 160;
}

export function isSafeVideoUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('/videos/') || trimmed.startsWith('/assets/')) {
    return !trimmed.includes('..');
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

const SiteConfigContext = createContext<SiteConfigContextValue | null>(null);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const [businessEmail, setBusinessEmailState] = useState<string>('');
  const [videos, setVideos] = useState<VideoSlotConfig>(DEFAULT_VIDEOS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(STORAGE_EMAIL_KEY);
      if (savedEmail && isValidEmail(savedEmail)) {
        setBusinessEmailState(savedEmail);
      } else {
        fetch('/api/site-config')
          .then((res) => (res.ok ? res.json() : null))
          .then((data: { defaultEmail?: string } | null) => {
            if (data?.defaultEmail && isValidEmail(data.defaultEmail)) {
              setBusinessEmailState(data.defaultEmail);
            }
          })
          .catch(() => {
            // Keep unconfigured placeholder state if offline
          });
      }

      const savedVideos = localStorage.getItem(STORAGE_VIDEOS_KEY);
      if (savedVideos) {
        const parsed = JSON.parse(savedVideos) as Partial<VideoSlotConfig>;
        setVideos({
          home: typeof parsed.home === 'string' && isSafeVideoUrl(parsed.home) ? parsed.home : '',
          about: typeof parsed.about === 'string' && isSafeVideoUrl(parsed.about) ? parsed.about : '',
          services: typeof parsed.services === 'string' && isSafeVideoUrl(parsed.services) ? parsed.services : '',
          gallery: typeof parsed.gallery === 'string' && isSafeVideoUrl(parsed.gallery) ? parsed.gallery : '',
          contact: typeof parsed.contact === 'string' && isSafeVideoUrl(parsed.contact) ? parsed.contact : '',
        });
      }
    } catch {
      // Ignore storage access errors in restricted iframes
    }
  }, []);

  const setBusinessEmail = (email: string) => {
    const trimmed = email.trim();
    if (!trimmed) {
      setBusinessEmailState('');
      try {
        localStorage.removeItem(STORAGE_EMAIL_KEY);
      } catch {
        // Ignore
      }
      return;
    }
    if (isValidEmail(trimmed)) {
      setBusinessEmailState(trimmed);
      try {
        localStorage.setItem(STORAGE_EMAIL_KEY, trimmed);
      } catch {
        // Ignore
      }
    }
  };

  const setVideoUrl = (slot: keyof VideoSlotConfig, url: string) => {
    const trimmed = url.trim();
    if (!isSafeVideoUrl(trimmed)) return;
    setVideos((prev) => {
      const updated = { ...prev, [slot]: trimmed };
      try {
        localStorage.setItem(STORAGE_VIDEOS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  return (
    <SiteConfigContext.Provider
      value={{
        businessEmail,
        setBusinessEmail,
        videos,
        setVideoUrl,
        isSettingsOpen,
        openSettings: () => setIsSettingsOpen(true),
        closeSettings: () => setIsSettingsOpen(false),
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfigContextValue {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error('useSiteConfig must be used inside SiteConfigProvider');
  }
  return ctx;
}
