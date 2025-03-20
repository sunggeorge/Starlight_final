"use client";

import React from "react";

interface RatingProps {
  rating: number;  // Rating value (e.g., 4.5)
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ rating = 0, className = "" }) => {
  const fullStars = Math.floor(rating);  // Get full stars (e.g., 4 in 4.5)
  const hasHalfStar = rating % 1 !== 0;  // Check if there's a half-star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);  // Calculate remaining empty stars

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Full Stars (⭐) */}
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400 text-lg">⭐</span>
        ))}

      {/* Half Star (⭐️ ½) */}
      {hasHalfStar && <span className="text-yellow-400 text-lg">⭐️</span>}

      {/* Empty Stars (☆) */}
      {Array(emptyStars)
        .fill(0)
        .map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-400 text-lg">☆</span>
        ))}

      {/* Show numeric rating (e.g., 4.5) */}
      <span className="text-xs text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

export default Rating;
