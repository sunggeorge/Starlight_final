'use client';

import React, { useCallback, useContext } from 'react';
import ServiceIncrementCard from '@/app/components/services/ServiceIncrementCard';
import { NailModalContext } from '@/app/lib/utils/contextUtils';

const NailModalStep1 = () => {
  const { person, state, dispatch } = useContext(NailModalContext);
  const onChangeQuantity = useCallback(
    (item: Record<string, any>, newQuantity: number) => {
      dispatch({
        type: 'setServiceQuantity',
        payload: {
          id: item.id,
          quantity: newQuantity,
        },
      });
      dispatch({
        type: 'setTotalPrice',
        payload: state.services.reduce((acc: number, serviceItem: { quantity: number; id: number; price: number }) => {
          if (serviceItem.id === item.id) {
            // return acc + newQuantity * person.price;
            return acc + newQuantity * serviceItem.price;
          }

          // return acc + serviceItem.quantity * person.price;
          return acc + serviceItem.quantity * serviceItem.price;
        }, 0),
      });
    },
    [dispatch, person.price, state.services],
  );

  return (
    <div className="nail-modal-step-1 flex flex-col w-full gap-4">
      <p className="text-sm text-gray-600 font-light my-2">Enter the number of items to be cleared.</p>
      {state.services.map((item: Record<string, any>) => (
        <ServiceIncrementCard
          quantity={item.quantity}
          key={item.id}
          label={item.title}
          price={item.price}
          onChangeQuantity={(newQuantity) => onChangeQuantity(item, newQuantity)}
        />
      ))}
    </div>
  );
};

export default NailModalStep1;
