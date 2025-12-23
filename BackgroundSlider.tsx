import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BackgroundSlider Component
 * Displays a rotating slideshow of healthcare-related images
 * with a dark overlay for text readability and loading skeleton
 */

// High-quality stock images of UK nurses and support workers in care settings
const images = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1920&q=80', // Diverse nurse smiling in scrubs
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1920&q=80', // Female nurse portrait
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1920&q=80', // Male nurse with patient
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1920&q=80', // Care home worker with elderly patient
  'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=1920&q=80', // Healthcare team in scrubs
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=80', // Support worker caring for patient
];

export function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Preload images
  useEffect(() => {
    let mounted = true;
    
    const preloadImages = () => {
      images.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          if (mounted) {
            setLoadedCount(prev => {
              const newCount = prev + 1;
              if (newCount >= 2) { // Show after first 2 images loaded
                setImagesLoaded(true);
              }
              return newCount;
            });
          }
        };
      });
    };

    preloadImages();
    return () => { mounted = false; };
  }, []);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!imagesLoaded) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imagesLoaded]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Loading Skeleton */}
      <AnimatePresence>
        {!imagesLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900"
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Slideshow */}
      <AnimatePresence mode="wait">
        {imagesLoaded && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={images[currentIndex]}
              alt="Healthcare professionals"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark purple/blue gradient overlay (70% opacity) */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.75) 0%, rgba(30, 58, 138, 0.75) 100%)',
        }}
      />

      {/* Subtle pattern overlay for texture */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
