'use client';
import React from 'react';
import { useUser } from '@/app/context/UserContext';
import { UserRoles } from '../lib/constants/role';

// export const metadata = {
//   title: 'Nail Shop Online System - Bookings',
//   description: 'Nail Shop Online System about description',
//   keywords: 'next, next.js, react, app, booking',
// };
const Bookings = () => {
  const context = useUser();
  const { user, userDetails } = context;
  const isCustomer = userDetails?.role === UserRoles.customer;
  const isStaff = userDetails?.role === UserRoles.staff;
  const isManager = userDetails?.role === UserRoles.manager;

  return (
    <div className="about flex flex-col flex-grow w-full">
      <h1 className="text-xl font-semibold my-2 mx-auto">Bookings</h1>
      <div className="text-center">
        <p>Logged in as: {userDetails?.email}</p>
        <p>User ID: {user?.id}</p>
        {isCustomer && (
          <p>
            You are a <b>Customer</b>
          </p>
        )}
        {isStaff && (
          <p>
            You are a <b>Staff</b>
          </p>
        )}
        {isManager && (
          <p>
            You are a <b>Manager</b>
          </p>
        )}
      </div>
    </div>
  );
};

export default Bookings;
