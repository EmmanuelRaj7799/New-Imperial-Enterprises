import React, { useState } from 'react';
import { useSiteConfig, type VideoSlotConfig } from '../context/SiteConfigContext';

interface CinematicHeroProps {
  videoSlot: keyof VideoSlotConfig;
  posterSrc: string;
  posterAlt: string;
  minHeightClass?: string;
  hideDecorativeWireframe?: boolean;
  children: React.ReactNode;
}

export function CinematicHero({
  videoSlot,
  posterSrc,
  posterAlt,
  minHeightClass = 'min-h-[82vh]',
  hideDecorativeWireframe = false,
  children,
}: CinematicHeroProps) {
  const { videos } = useSiteConfig();
  const videoUrl = videos[videoSlot];
  const [videoFailed, setVideoFailed] = useState(false);

  const showActiveVideo = Boolean(videoUrl) && !videoFailed;

  return (
    <section
      className={`relative ${minHeightClass} w-full flex items-center overflow-hidden bg-[#080B12] text-white`}
    >
      {/* Background Video (when configured) OR High-Resolution Architectural Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {showActiveVideo ? (
          <video
            key={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc}
            onError={() => setVideoFailed(true)}
            className="w-full h-full object-cover scale-[1.01]"
          >
            <source src={videoUrl} type={videoUrl.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
          </video>
        ) : (
          <img
            src={posterSrc}
            alt={posterAlt}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover animate-ken-burns opacity-90"
          />
        )}

        {/* Measured architectural contrast scrim ensuring WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B12]/80 via-[#080B12]/62 to-[#080B12]/92" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B12]/85 via-[#101C35]/45 to-transparent" />

        {/* Subtle 3D floating architectural wireframe geometry (non-distracting) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-45">
          {!hideDecorativeWireframe && (
            <div className="hidden lg:block absolute right-[6%] top-[18%] w-[360px] h-[360px] perspective-1200">
              <div className="w-full h-full relative animate-arch-drift preserve-3d">
                <div className="absolute inset-0 border border-[#C8D0DA]/20 bg-gradient-to-br from-[#00CFFF]/6 to-transparent backdrop-blur-[1px]" />
                <div
                  className="absolute inset-8 border border-[#D6B36A]/25"
                  style={{ transform: 'translateZ(36px)' }}
                />
                <div
                  className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#00CFFF]/35 to-transparent"
                  style={{ transform: 'translateZ(18px)' }}
                />
                <div
                  className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[#C8D0DA]/25 to-transparent"
                  style={{ transform: 'translateZ(18px)' }}
                />
              </div>
            </div>
          )}

          {/* Fine architectural bottom hairline */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8D0DA]/25 to-transparent" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10 pt-28 pb-20 lg:pt-32 lg:pb-24">
        {children}
      </div>
    </section>
  );
}
