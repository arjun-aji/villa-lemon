"use client";

import React, { useState, useEffect } from "react";

interface ImageSlideshowProps {
  images?: string[];
  defaultImage: string;
  className?: string;
  alt?: string;
  interval?: number;
}

export const ImageSlideshow: React.FC<ImageSlideshowProps> = ({
  images = [],
  defaultImage,
  className = "w-full h-full object-cover",
  alt = "Image Slideshow",
  interval = 3000,
}) => {
  const allImages = React.useMemo(() => {
    const list = (images || []).filter(Boolean);
    if (list.length === 0 && defaultImage) {
      list.push(defaultImage);
    }
    return list;
  }, [images, defaultImage]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allImages.length);
    }, interval);

    return () => clearInterval(timer);
  }, [allImages, interval]);

  if (allImages.length === 0) {
    return null;
  }

  if (allImages.length === 1) {
    return <img src={allImages[0]} className={className} alt={alt} />;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {allImages.map((src, index) => {
        const isActive = index === currentIndex;
        return (
          <img
            key={src + index}
            src={src}
            className={`${className} absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            alt={`${alt} ${index + 1}`}
          />
        );
      })}
    </div>
  );
};
