'use client';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import Calendar from '@/app/components/date/Calendar';
import { NailModalContext } from '@/app/lib/utils/contextUtils';
import { startTime } from '@/app/lib/data';
import { getSession } from '@/app/lib/utils/authUtilsUI';
import apiService from '@/app/lib/services/apiService';
import { format, set } from 'date-fns';

// Type definition for booked time records
interface BookedTime {
  id: string;
  date: string;
  time: string;
}

const NailModalStep2 = () => {
  const { state, dispatch } = useContext(NailModalContext);
  const [bookedTimes, setBookedTimes] = useState<BookedTime[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(state.date);

  // Fetch booked times when component mounts or person changes
  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!state.person?.id) return;
      
      setIsLoading(true);
      try {
        const session = await getSession();
        const token = session?.access_token;        
        console.log('personId', state.person.id);
        const response = await apiService.orders.getServicePersonOrders({
          id: state.person.id,  
          token: token || "",
        });
        if (!response || !response.success) {
          console.error('Failed to fetch booked times:', response?.data);
          return;
        } else {
          // Properly type and transform the data to match our BookedTime interface
          let bookings = [...response.data];
          setBookedTimes(bookings);
          console.log('bookedTimes', bookings);
        }
      } catch (error) {
        console.error('Error fetching booked times:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookedTimes();
  }, [state.person]);

  // Check if a specific time slot is available
  const isTimeAvailable = useCallback(
    (date: string, time: string) => {
      return !bookedTimes.some(
        (booking) => booking.date === date && booking.time === time
      );
    },
    [bookedTimes]
  );

  const onDateChange = useCallback(
    (value: any) => {
      setSelectedDate(format(value as Date, 'yyyy-MM-dd'));
      dispatch({
        type: 'setDate',
        payload: format(value as Date, 'yyyy-MM-dd'),
      });
    },
    [dispatch],
  );

  const onSelectTime = useCallback(
    (value: string, e: React.MouseEvent<HTMLButtonElement>) => {
      dispatch({
        type: 'setTime',
        payload: value,
      });
    },
    [dispatch],
  );

  const onInputPromoCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'setPromoCode',
      payload: e.target.value,
    });
  };

  return (
    <div className="nail-modal-step-2 flex flex-col w-full h-full gap-4">
      <p className="text-md text-base-100 font-semibold my-2">Select Date</p>
      <Calendar onChange={onDateChange} defaultValue={new Date(`${state.date}T00:00:00`)}/>
      <p className="text-md text-base-100 font-semibold my-2">Choose Start Time</p>
      <div className="start-time-filter flex flex-wrap gap-2 mb-4 justify-center">
        {isLoading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          console.log('isTimeAvailable', bookedTimes),
          startTime.map((time) => {
            const isAvailable = isTimeAvailable(selectedDate, time.value);
            return (
              <button
                key={time.id}
                className={`btn ${isAvailable ? 'btn-primary' : 'btn-disabled'} btn-outline btn-sm rounded-badge ${
                  time.value === state.time ? 'btn-active' : ''
                }`}
                onClick={(e) => onSelectTime(time.value, e)}
                disabled={!isAvailable}
              >
                {time.value}
                {!isAvailable && <span className="ml-1 text-xs">(Booked)</span>}
              </button>
            );
          })
        )}
      </div>
      <p className="text-md text-base-100 font-semibold my-2">Promo Code</p>
      <input
        type="text"
        placeholder="Enter your promo code"
        className="input input-bordered min-h-[48px] input-primary input-md w-full max-w-full rounded-badge"
        value={state.promoCode}
        onInput={onInputPromoCode}
      />
    </div>
  );
};

export default NailModalStep2;
