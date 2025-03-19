"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/app/lib/utils/authUtils";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ReviewPage = ({ params }: { params: { servicePersonId: string } }) => {
  const router = useRouter();
  const servicePersonId = parseInt(params.servicePersonId);

  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [showModal, setShowModal] = useState(false); //  Pop-up state

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setAuthError(false);

      const user = await getUser();

      if (!user || !user.userId) {
        console.error(" User session missing or userId not found!");
        setAuthError(true);
        setLoading(false);
        return;
      }

      setUserId(user.userId);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      {authError ? (
        <div className="text-red-500 text-center">
           You must be logged in to write a review.
          <button
            onClick={() => router.push("/login")}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Login Now
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Write a Review</h2>

          {/*  Rating Section */}
          <label className="block mb-2 text-lg font-semibold">Rating:</label>
          <div className="flex items-center">
            <input
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="p-2 border rounded text-lg w-16 text-center"
            />

            {/* Star Display */}
            <div className="flex space-x-1 ml-3">
              {[1, 2, 3, 4, 5].map((star) => {
                const fullStar = rating >= star;
                const halfStar = rating >= star - 0.5 && rating < star;

                return (
                  <span key={star} className="text-2xl text-yellow-400">
                    {fullStar ? <FaStar /> : halfStar ? <FaStarHalfAlt /> : <FaRegStar />}
                  </span>
                );
              })}
            </div>
          </div>

          <label className="block mt-2 mb-2 text-lg font-semibold">Comment:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border rounded-lg h-32 text-lg"
            placeholder="Write your experience here..."
          />

          {/* Submit Button */}
          <button
            onClick={async () => {
              if (!userId) {
                alert(" You must be logged in to submit a review.");
                return;
              }

              const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  servicePersonId,
                  userId,
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
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg text-lg"
          >
            Submit Review
          </button>

          {/*  Pop-up Confirmation */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <h3 className="text-lg font-bold">Review Submitted!</h3>
                <p>Your review has been successfully submitted.</p>
                <button
                  onClick={() => router.push(`/services/details/${servicePersonId}`)}
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
                >
                  OK
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
