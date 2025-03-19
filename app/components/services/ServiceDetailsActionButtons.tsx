"use client"; // Ensures that this component runs in the browser

import React, { useCallback, useEffect, useState } from 'react';
import NailModal from '@/app/components/modals/nail/NailModal'; // Import the modal for booking services
import { servicePersonExtended } from '@/app/lib/interfaces/service'; // Interface for the service provider
import { useRouter } from 'next/navigation'; // Next.js router for navigation
import logService from '@/app/lib/services/logService'; // Logging service for tracking user actions

interface ServiceDetailsActionButtonsProps {
  person: servicePersonExtended; // The service provider details
  user: Record<string, any> | null; // Logged-in user details (null if not logged in)
}

const ServiceDetailsActionButtons: React.FC<ServiceDetailsActionButtonsProps> = ({ person, user }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null); // Tracks the currently active modal
  const router = useRouter(); // Next.js router instance for navigation

  // Function to show the booking modal
  const showModal = useCallback(() => {
    const modalElement = document.querySelector(`.salon-nail-modal`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal(); // Show the modal if it exists
      return;
    }
    console.error(`${person.category.title} modal not found.`); // Log an error if modal is missing
  }, [person.category.title]);

  // Function to handle "Book Now" button click
  const onBookNow = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!user) {
        router.push('/login'); // Redirect to login page if the user is not logged in
        return;
      }
      console.log('Book Now:', person);
      setActiveModal(person.category.title); // Open the corresponding service modal
    },
    [person.category.title, router, user],
  );

  // Function to handle "Write a Review" button click
  const onWriteAReview = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!user) {
        router.push('/login'); // Redirect to login page if user is not logged in
        return;
      }

      logService.log('Write a review'); // Log the action for analytics
      router.push(`/review/${person.id}`); // Redirect to the review page for this service provider
    },
    [router, user, person.id],
  );

  // Function to close the active modal
  const onCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Show modal when `activeModal` is set
  useEffect(() => {
    if (activeModal) {
      showModal();
    }
  }, [activeModal, showModal]);

  return (
    <div className="service-details-action-buttons fixed bottom-0 left-0 w-full rounded-t-badge bg-white flex justify-center gap-2 py-4 border-t-[1px] border-solid border-gray-200 sm:py-8">
      {/* Button to navigate to the review page */}
      <button
        className="btn bg-primary/10 font-normal text-primary hover:bg-primary/25 hover:border-primary/5"
        onClick={onWriteAReview}
      >
        Write a Review
      </button>
      
      {/* Button to open the booking modal */}
      <button className="btn btn-primary font-normal" onClick={onBookNow}>
        Book Now
      </button>

      {/* Conditionally render the booking modal */}
      {activeModal && <NailModal person={person} onClose={onCloseModal} user={user} />}
    </div>
  );
};

export default ServiceDetailsActionButtons;
