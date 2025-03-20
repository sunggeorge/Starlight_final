"use client";

import React, { useMemo } from "react";

interface ReviewsProps {
  reviews: number;
  className?: string;
}

const Reviews: React.FC<ReviewsProps> = ({ reviews = 0, className = "" }) => {
  const formattedReviews = useMemo(() => {
    const formattedNumber = Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(reviews);
    return `${formattedNumber} ${reviews === 1 ? "Review" : "Reviews"}`;
  }, [reviews]);

  return <div className={`text-xs text-gray-600 ${className}`}>{formattedReviews}</div>;
};

export default Reviews;
