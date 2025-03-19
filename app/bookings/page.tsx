'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import { UserRoles } from '../lib/constants/role';
import { FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import apiService from '@/app/lib/services/apiService';

const Bookings = () => {
  const { user, userDetails } = useUser();
  const isCustomer = userDetails?.role === UserRoles.customer;
  const isStaff = userDetails?.role === UserRoles.staff;
  const isManager = userDetails?.role === UserRoles.manager;

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ Router for navigation

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const token = user?.token;
        let response;
        if (isCustomer && userDetails?.id) {
          response = await apiService.orders.getUserOrders({ id: userDetails.id, token });
        } else if (isStaff || isManager) {
          response = await apiService.orders.getUserOrders({ token });
        }
        if (response && response.success) {
          let ordersData = [...response.data];
          ordersData.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setOrders(ordersData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchOrders();
    }
  }, [user, isCustomer, isStaff, isManager, userDetails]);

  return (
    <div className="bookings flex flex-col flex-grow w-full">
      <div className="container mx-auto py-4 px-4 sm:py-8">
        <h1 className="text-xl font-semibold mb-4 text-center">Bookings</h1>
        <div className="text-center mb-4">
          <p>Logged in as: {userDetails?.email}</p>
          <p>User ID: {user?.id}</p>
          {isCustomer && <p>You are a <b>Customer</b></p>}
          {isStaff && <p>You are a <b>Staff</b></p>}
          {isManager && <p>You are a <b>Manager</b></p>}
        </div>
        <div>
          <h2 className="text-lg font-bold mb-2">Your Orders</h2>
          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length > 0 ? (
            <table className="table-zebra-zebra table-lg w-full">
              <thead>
                <tr>
                  <th className="text-center">Order ID</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Time</th>
                  <th className="text-center">Technician</th>
                  <th className="text-center">Amount</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Review</th>
                  <th className="text-center">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id}>
                    <td className="text-center">{order.id}</td>
                    <td className="text-center">{order.date}</td>
                    <td className="text-center">{order.time}</td>
                    <td className="text-center">{order.servicePerson.name}</td>
                    <td className="text-center">${order.amount}</td>
                    <td className="text-center">{order.status}</td>
                    {isCustomer && (
                      <td className="text-center">
                        {order.reviews && order.reviews.length > 0 ? (
                          <div className="flex items-center justify-center">
                            <FaStar className="text-yellow-400" />
                            <span className="ml-1">{Math.round(order.reviews[0].rating)}</span>
                          </div>
                        ) : (
                          <button
                            className="btn bg-primary/10 font-normal text-primary hover:bg-primary/25 hover:border-primary/5"
                            onClick={() =>
                              router.push(`/review/${order.servicePerson.id}?orderId=${order.id}`)
                            }
                          >
                            Review
                          </button>
                        )}
                      </td>
                    )}
                    <td className="text-center">
                      <button className="btn btn-primary font-normal">Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
