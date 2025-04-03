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
import { servicePersonExtended } from '@/app/lib/interfaces/service';
import { order } from '@prisma/client';
import logService from '@/app/lib/services/logService';

interface NailModalProps {
  person: servicePersonExtended;
  user: Record<string, any> | null;
  order?: order | null;
  onClose?: () => void;
}



const NailModal: React.FC<NailModalProps> = ({ person, user, onClose = () => {} }) => {
  const [state, dispatch] = useReducer(nailReducer, {
    person: person,
    step: 1,
    services: nailServices.filter((item) => item.categoryID === person.categoryId)
                          .map((item) => ({ ...item, quantity: 0 })),
    totalPrice: 10,
    // date: format(new Date(), 'yyyy-MM-dd'),
    date: format(new Date('2025-06-15'), 'yyyy-MM-dd'),
    time: '09:00 AM',
    promoCode: '',
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
  // console.log("Person - CategoryID: ",person.categoryId);
  const contextValue = useMemo(
    () => ({
      person,
      state,
      dispatch,
    }),
    [person, state],
  );

  const isDisabledNextButton = useMemo(() => {
    return (
      state.totalPrice === 0 ||
      // (state.location.value === '' && state.step === 3) ||
      state.proceedCheckout ||
      ((!state.isPaymentInformationComplete || !state.isPaymentEmailAddressComplete) && state.step === 4)
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

  const onClickNextButton = () => {
    if (state.step < 4) {
      if (state.step === 2) {
        dispatch({ type: 'skipMapStep' });
      } else {
        dispatch({ type: 'incrementStep' });
      }
    } else {
      dispatch({ type: 'setProceedCheckout', payload: true });
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
          <h2 className="text-lg font-semibold text-base-100">Nail Services</h2>
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
            {state.step < 4 ? `Continue - ${formatPrice(state.totalPrice)}` : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default NailModal;
