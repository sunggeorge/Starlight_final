'use client';

import React, { useEffect, useMemo, useReducer } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import NailModalStep1 from './NailModalStep1';
import NailModalStep2 from './NailModalStep2';
import NailModalStep3 from './NailModalStep3';
import NailModalStep4 from './NailModalStep4';
import { nailServices } from '@/app/lib/data';
import { formatPrice } from '@/app/lib/utils/priceUtils';
import { NailModalContext } from '@/app/lib/utils/contextUtils';
import { nailReducer } from '@/app/lib/utils/reducerUtils';
import { format } from 'date-fns';
import { servicePersonExtended, orderExtended} from '@/app/lib/interfaces/service';
// import { order } from '@prisma/client';
import logService from '@/app/lib/services/logService';
import {ActionMode} from '@/app/lib/constants/actionMode';
import apiService from '@/app/lib/services/apiService';
import { getSession } from '@/app/lib/utils/authUtilsUI';
import { OrderStatus } from '@/app/lib/constants/orders';
import toast from 'react-hot-toast';

interface NailModalProps {
  actionMode: ActionMode;
  person: servicePersonExtended;
  user: Record<string, any> | null;
  order?: orderExtended | null;
  onClose?: () => void;
  updateBookingNotification?: (orderId: number) => void; // Function to update booking notification
}


const NailModal: React.FC<NailModalProps> = ({ person, user, order, actionMode, onClose = () => {},updateBookingNotification = () =>{} }) => {
  
  const defaultDate = format(new Date(), 'yyyy-MM-dd');
  const defaultTime = '09:00 AM';
  let isUpdateOrCheckoutMode = (actionMode === ActionMode.Update || actionMode === ActionMode.Checkout)
  const [state, dispatch] = useReducer(nailReducer, {
    actionMode: actionMode,
    person: person,
    step: actionMode === ActionMode.Checkout? 4 : 1,
    services: nailServices.filter((item) => item.categoryID === person.categoryId)
      .map((item) => {
        let quantity = 0;
        if (isUpdateOrCheckoutMode && order && order.services) {
          const foundService = order.services.find(service => service.title === item.title);
          if (foundService) {
            quantity = foundService.quantity ?? 0;
          }
        }
        return { ...item, quantity };
      }),
    totalPrice: isUpdateOrCheckoutMode? order?.amount || 0 : 0,
    date: isUpdateOrCheckoutMode? order?.date||defaultDate : defaultDate,
    time: isUpdateOrCheckoutMode? order?.time||defaultTime : defaultTime,
    promoCode: '',
    uuid: isUpdateOrCheckoutMode? order?.uuid||'' : '',
    orderId: isUpdateOrCheckoutMode? order?.id||0 : 0,
    location: {
      value: '',
      latitude: 0,
      longitude: 0,
    },
    isPaymentInformationComplete: false,
    isPaymentEmailAddressComplete: false,
    proceedCheckout: false,
    user: user,
  });

  const contextValue = useMemo(
    () => ({
      person,
      state,
      dispatch,
    }),
    [person, state],
  );

  const buttonTextMap: Record<ActionMode, string> = {
    [ActionMode.Update]: 'Save Update',
    [ActionMode.Create]: 'Create Booking',
    [ActionMode.Delete]: 'NA',
    [ActionMode.Checkout]: 'Confirm Payment',
  };
  // console.log('actionMode: ', actionMode);
  const buttonText = buttonTextMap[actionMode]
  const isDisabledNextButton = useMemo(() => {
    return (
      state.totalPrice === 0 ||
      // (state.location.value === '' && state.step === 3) ||

      // Checkout mode date check
      (state.actionMode === ActionMode.Checkout && state.step > 3 && (
      state.proceedCheckout ||
      ((!state.isPaymentInformationComplete || !state.isPaymentEmailAddressComplete) && state.step === 4)
      )) ||
      // Update mode data check
      (state.actionMode === ActionMode.Update && state.step > 3 &&
      state.date === order?.date && state.time === order?.time && state.totalPrice === order?.amount)
    );
  }, [
    state.isPaymentEmailAddressComplete,
    state.isPaymentInformationComplete,
    // state.location.value,
    state.proceedCheckout,
    state.step,
    state.totalPrice,
  ]);

  const isDisabledBackButton = useMemo(() => {
    return state.proceedCheckout;
  }, [state.proceedCheckout]);

  const preventCloseOnEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
    }
  };

  const handleBookingUpdate = async () => {
    try {
      const session = await getSession();
      const token = session?.access_token;
      let updatePayload = null;
      let response = null;
      // console.log('update info: ', user, order, state);
      if (state.actionMode === ActionMode.Update) {
        updatePayload = { data: { 
          id: order?.id,
          date: state.date, 
          time: state.time, 
          amount: state.totalPrice, 
          services: state.services.filter((service: any) => Number(service.quantity) !== 0),
          token: token,
        }}
        response = await apiService.orders.update(updatePayload);
      } else if(state.actionMode === ActionMode.Create) {
        updatePayload = { 
          data: {
            date: state.date,
            time: state.time,
            location: state.location.value,
            personId: state.person.id,
            categoryId: state.person.categoryId,
            amount: state.totalPrice,
            status: OrderStatus.created,
            services: state.services.filter((item: Record<string, any>) => item.quantity > 0),
            userId: state.user?.userId,
            paymentIntendId: "",
          },
          token,          
        }
        response = await apiService.orders.post(updatePayload);
      }
      

      if (response && response.success) {
        // console.log('Response: ', response);
        if (state.actionMode === ActionMode.Create) {
          // console.log(`${response.data.id} booking created!`);
          toast.success(`Booking #${response.data.id} created!`); // Call the notification function with the order ID
        }else if (state.actionMode === ActionMode.Update) {
          // console.log(`${order?.id} booking updated!`);
          updateBookingNotification?.(order?.id || 0); // Call the notification function with the order ID
        }
        // toast.success("Order status updated");
        // setOrders((prevOrders) =>
        //   prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
        // );
      } else {
        // toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      // toast.error("Error updating order status");
    }
  }


  const onClickNextButton = () => {
    if (state.step < 4) {
      if (state.step === 2) {
        dispatch({ type: 'skipMapStep' });
      } else {
        dispatch({ type: 'incrementStep' });
      }
    } else if (state.actionMode === ActionMode.Checkout) {
      dispatch({ type: 'setProceedCheckout', payload: true });
    } else if (state.actionMode === ActionMode.Update || state.actionMode === ActionMode.Create) {
      handleBookingUpdate();
      onClose();
    } 
  };

  useEffect(() => {
    document.addEventListener('keydown', preventCloseOnEscape, true);

    return () => {
      document.removeEventListener('keydown', preventCloseOnEscape, true);
    };
  }, []);

  useEffect(() => {
    logService.log('updated state', state);
  }, [state]);

  return (
    <dialog className="salon-nail-modal modal" onClose={onClose}>
      <div className="modal-box flex flex-col w-[750px] max-w-[90vw] p-0 bg-gray-100 overflow-hidden">
        <div className="modal-header flex justify-between p-4 border-b-[1px] border-solid border-gray-200">
          {state.actionMode===ActionMode.Update && <h2 className="text-lg font-semibold text-base-100">Update Booking #{order?.id} with {person.name}</h2>}
          {state.actionMode===ActionMode.Create && <h2 className="text-lg font-semibold text-base-100">Create Booking with {person.name}</h2>}
          {state.actionMode===ActionMode.Checkout && <h2 className="text-lg font-semibold text-base-100">Checkout Booking #{order?.id} with {person.name}</h2>}
          <button className="btn btn-sm btn-circle bg-base-100/10" onClick={onClose}>
            <MdOutlineClose className="w-[16px]" />
          </button>
        </div>
        <div className="modal-body flex w-full h-full overflow-auto py-2 mb-2 px-4">
          <NailModalContext.Provider value={contextValue}>
            {state.step === 1 && <NailModalStep1 />}
            {state.step === 2 && <NailModalStep2 />}
            {state.step === 3 && <NailModalStep3 />}
            {state.step === 4 && <NailModalStep4 />}
          </NailModalContext.Provider>
        </div>
        <div className="modal-action py-2 px-4 m-0 border-t-[1px] border-solid border-gray-200">
          {state.step > 1 && (
            <button
              className="btn bg-primary/10 font-normal text-primary hover:bg-primary/25 hover:border-primary/5 mr-auto"
              onClick={() => dispatch({ type: 'decrementStep' })}
              disabled={isDisabledBackButton}
            >
              Back
            </button>
          )}
          <button className="btn btn-primary ml-auto" onClick={onClickNextButton} disabled={isDisabledNextButton}>
            {state.step < 4 ? `Continue - ${formatPrice(state.totalPrice)}` : buttonText}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default NailModal;
