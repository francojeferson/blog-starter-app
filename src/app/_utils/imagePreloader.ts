"use client ";
import React, { useEffect } from "react";

const ImagePreloader = ({ imageUrls }: { imageUrls: string[] }) => {
  useEffect(() => {
    const preloadImage = (url: string) => {
      const img = new Image();
      img.src = url;
    };

    imageUrls.forEach((url) => {
      preloadImage(url);
    });
  }, [imageUrls]);

  return null; // This component does not render anything
};

export default ImagePreloader;
