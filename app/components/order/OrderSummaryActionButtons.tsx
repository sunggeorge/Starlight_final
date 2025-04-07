"use client"; // Ensures that this component runs in the browser

import React, { useCallback, useEffect, useState } from "react";
import NailModal from "@/app/components/modals/nail/NailModal"; // Import the modal for booking services
import { servicePersonExtended, orderExtended } from "@/app/lib/interfaces/service"; // Interface for the service provider
// import { order } from '@prisma/client'; // Import order type from Prisma client
import { useRouter } from "next/navigation"; // Next.js router for navigation
import { ActionMode } from "@/app/lib/constants/actionMode";
import { OrderStatus } from "@/app/lib/constants/orders"; // Order status constants
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";

interface OrderDetailsActionButtonsProps {
  person: servicePersonExtended; // The service provider details
  user: Record<string, any> | null; // Logged-in user details (null if not logged in)
  order: orderExtended | null; // Order details (optional)
  handleDeleteOrder: (orderId: number) => void; // Function to handle order deletion
  updateBookingNotification: (orderId: number) => void; // Function to update booking notification
}


const OrderDetailsActionButtons: React.FC<OrderDetailsActionButtonsProps> = ({
  person,
  user,
  order,
  handleDeleteOrder,
  updateBookingNotification,
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null); // Tracks the currently active modal
  const router = useRouter(); // Next.js router instance for navigation

  // Function to show the booking modal
  const showModal = useCallback(() => {
    const modalElement = document.querySelector(`.salon-nail-modal`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal(); // Show the modal if it exists
      return;
    }
    console.error(`Update Modal not found.`); // Log an error if modal is missing
  }, [order?.id]);

  // Function to handle "Book Now" button click
  const onUpdateBooking = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!user) {
        router.push("/login"); // Redirect to login page if the user is not logged in
        return;
      }
      // console.log("Update booking:", person, order);
      setActiveModal(`Update booking #${order?.id}`); // Open the corresponding service modal
    },
    [order?.id, router, user]
  );

  // Function to handle "Book Now" button click
  const onCheckoutBooking = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!user) {
        router.push("/login"); // Redirect to login page if the user is not logged in
        return;
      }
      // console.log("Checkout booking:", person, order);
      setActiveModal(`Checkout booking #${order?.id}`); // Open the corresponding service modal
    },
    [order?.id, router, user]
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
    // <div className="service-details-action-buttons fixed bottom-0 left-0 w-full rounded-t-badge bg-white flex justify-center gap-2 py-4 border-t-[1px] border-solid border-gray-200 sm:py-8">
    <div className="w-full flex justify-center gap-2 py-4 border-solid sm:py-8">
      {/* Order not completed and paid */}
      {(order?.status !== OrderStatus.completed && 
      order?.status !== OrderStatus.paid_online &&
      order?.status !== OrderStatus.paid_store) && (
        <>
      <button className="btn btn-secondary font-normal" onClick={onUpdateBooking} title="Update Booking">

        <FaEdit size={20}/>
      </button>
      <button className="btn btn-primary font-normal" onClick={() => (handleDeleteOrder(Number(order?.id)))} title="Delete Booking">
        <MdDeleteForever size={20}/>
      </button>
      {activeModal && <NailModal person={person} onClose={onCloseModal} user={user} order={order} actionMode={ActionMode.Update} updateBookingNotification={updateBookingNotification}/>}
      </>
      )
      }
      {/* Completed Order */}
      {order?.status === OrderStatus.completed && (
        <>
      <button className="btn btn-success font-normal" onClick={onCheckoutBooking} title="Update Booking">

        <MdOutlineShoppingCartCheckout size={20}/>
      </button>
      {activeModal && <NailModal person={person} onClose={onCloseModal} user={user} order={order} actionMode={ActionMode.Checkout} updateBookingNotification={updateBookingNotification}/>}
      </>
      )
      }
      
    </div>
  );
};

export default OrderDetailsActionButtons;
