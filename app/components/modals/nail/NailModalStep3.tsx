'use client';

import React, { useContext } from 'react';
import { NailModalContext } from '@/app/lib/utils/contextUtils';
import Map from '@/app/components/location/Map';
import AddressLocationInput from '@/app/components/location/AddressLocationInput';

const NailModalStep3 = () => {
  const { state, dispatch } = useContext(NailModalContext);
  const setLocation = (payload: any) => {
    dispatch({
      type: 'setLocation',
      payload: payload,
    });
  };

  return (
    <div className="nail-modal-step-3 flex flex-col w-full gap-4">
      <div className="flex w-full relative z-10">
        <Map latitude={state.location.latitude} longitude={state.location.longitude} />
      </div>
      <p className="text-md text-base-100 font-semibold my-2">Adress Location</p>
      <AddressLocationInput
        value={state.location.value}
        onChangeLocation={setLocation}
        onGetCurrentLocation={setLocation}
      />
    </div>
  );
};

export default NailModalStep3;
