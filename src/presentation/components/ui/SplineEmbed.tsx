'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplineEmbedProps {
  url: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * SplineEmbed - Full viewport Spline 3D embed wrapper
 *
 * Features:
 * - Full viewport (100vw x 100vh)
 * - Responsive with aspect ratio maintained
 * - Scroll interaction preserved
 * - Loading state with skeleton
 */
export function SplineEmbed({ url, className = '', fallback }: SplineEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-screen h-screen overflow-hidden ${className}`}
      style={{
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-[#f2f8fc] to-white"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-full border-2 border-[#7fa8c9]/30 border-t-[#7fa8c9]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-[#1a1a1a]/40 text-sm">Loading 3D Experience...</p>
          </div>
        </motion.div>
      )}

      {/* Spline iframe */}
      <iframe
        src={url}
        frameBorder="0"
        width="100%"
        height="100%"
        title="Spline 3D Scene"
        className="absolute inset-0 w-full h-full"
        style={{
          border: 'none',
          pointerEvents: 'auto',
        }}
        onLoad={handleLoad}
        onError={handleError}
        allow="autoplay; fullscreen"
        loading="eager"
      />
    </div>
  );
}

export default SplineEmbed;
