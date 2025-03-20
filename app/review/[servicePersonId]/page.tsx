"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUser } from "@/app/lib/utils/authUtils";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ReviewPage = ({ params }: { params: { servicePersonId: string } }) => {
  const router = useRouter();
  const servicePersonId = parseInt(params.servicePersonId);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setAuthError(false);

      const user = await getUser();
      if (!user || !user.userId) {
        console.error("🚨 User session missing or userId not found!");
        setAuthError(true);
        setLoading(false);
        return;
      }

      setUserId(user.userId);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) return <p className="text-center text-lg text-gray-600">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 mb-6">
      {authError ? (
        <div className="text-red-500 text-center">
           You must be logged in to write a review.
          <button
            onClick={() => router.push("/login")}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            Login Now
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Write a Review</h2>

          {/*  Order ID Display */}
          <p className="text-lg font-semibold text-gray-700 mb-6 bg-blue-100 p-3 rounded-lg text-center">
             Order ID: <span className="font-bold text-blue-600">{orderId || "N/A"}</span>
          </p>

          {/*  Rating Section */}
          <label className="block text-lg font-semibold text-gray-800 mb-2">Rating:</label>
          <div className="flex items-center mb-6">
            <input
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="p-2 border rounded text-lg w-16 text-center"
            />

            {/*  Star Display */}
            <div className="flex space-x-1 ml-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const fullStar = rating >= star;
                const halfStar = rating >= star - 0.5 && rating < star;

                return (
                  <span key={star} className="text-3xl text-yellow-400">
                    {fullStar ? <FaStar /> : halfStar ? <FaStarHalfAlt /> : <FaRegStar />}
                  </span>
                );
              })}
            </div>
          </div>

          {/*  Comment Section */}
          <label className="block text-lg font-semibold text-gray-800 mb-2">Your Review:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-4 border rounded-lg h-48 text-lg resize-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Write about your experience..."
          />

          {/*  Submit Button */}
          <button
            onClick={async () => {
              if (!userId) {
                alert("🚨 You must be logged in to submit a review.");
                return;
              }
              if (!orderId) {
                alert("❌ Order ID is missing. Please go back and try again.");
                return;
              }

              //  Submit Review using API
              const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  servicePersonId,
                  userId,
                  orderId: Number(orderId), //  Save orderId in database
                  rating,
                  message,
                }),
              });

              if (res.ok) {
                setShowModal(true); //  Show modal pop-up
              } else {
                alert("❌ Failed to submit review. Please try again.");
              }
            }}
            className="mt-6 bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg w-full transition-all"
          >
            Submit Review
          </button>

          {/*  Pop-up Confirmation */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
                <h3 className="text-xl font-bold text-gray-800">🎉 Review Submitted!</h3>
                <p className="text-gray-600 mt-2">Thank you for sharing your experience.</p>
                <button
                  onClick={() => router.push(`/services/details/${servicePersonId}`)}
                  className="mt-6 bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
                >
                  ok
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReviewPage;
