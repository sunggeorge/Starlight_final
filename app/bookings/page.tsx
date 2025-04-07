'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/app/context/UserContext';
import { UserRoles } from '../lib/constants/role';
import { FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import apiService from '@/app/lib/services/apiService';
import toast from 'react-hot-toast';
import { OrderStatus } from '@/app/lib/constants/orders';
import OrderDetailsActionButtons from '../components/order/OrderSummaryActionButtons';
import { getSession } from '../lib/utils/authUtils';

const Bookings = () => {
  const { user, userDetails } = useUser();
  const isCustomer = userDetails?.role === UserRoles.customer;
  const isStaff = userDetails?.role === UserRoles.staff;
  const isManager = userDetails?.role === UserRoles.manager;

  const [orders, setOrders] = useState<any[]>([]);
  const [persons, setPersons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Define fetchOrders as a function so it can be triggered later
  const fetchOrders = useCallback(async () => {
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
  }, [isCustomer, isManager, isStaff, user, userDetails]);

  // Initial fetch when component mounts
  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  // Fetch persons for displaying technician names
  useEffect(() => {
    async function fetchPersons() {
      const personResponse = await apiService.services.get();
      if (personResponse && personResponse.success) {
        setPersons([...personResponse.data]);
      }  
    }
    fetchPersons();
  }, []);

  // Function to display update booking notification and refresh orders
  const updateBookingNotification = async (orderID:number ) => {
    // console.log("update notification function running...", orderID);
    fetchOrders();
    toast.success(`Booking #${orderID} updated successfully`);
  };

  const handleStatusChange = async (orderId: any, newStatus: string) => {
    try {
      const session = await getSession();
      const token = session?.access_token;
      const response = await apiService.orders.update({ id: orderId, status: newStatus, token });
      if (response && response.success) {
        toast.success(`Order #${orderId} status updated`);
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
        );
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating order status");
    }
  };

  // Function to handle deletion of an order, which updates orders state
  const handleDeleteOrder = async (orderId: number) => {
    try {
      const token = user?.token;
      const response = await apiService.orders.delete({ id: Number(orderId), token });
      if (response && response.success) {
        toast.success(`Order #${orderId} deleted successfully`);
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== Number(orderId)));
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting order");
    }
  };

  return (
    <div className="bookings flex flex-col flex-grow w-full">
      <div className="container mx-auto py-4 px-4 sm:py-8">
        {isCustomer && <h1 className="text-xl font-semibold mb-4 text-center">Your Booking History</h1>}
        {isStaff && <h1 className="text-xl font-semibold mb-4 text-center">Manage Your Customer Bookings</h1>}
        {isManager && <h1 className="text-xl font-semibold mb-4 text-center">Manager All Customer Bookings</h1>}
        <div>
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
                  <th className="text-center">{isCustomer? "Status" : "Customer / Status"}</th>
                  {isCustomer && <th className="text-center">Review</th>}
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id}>
                    <th className="text-center"># {order.id}</th>
                    <td className="text-center">{order.date}</td>
                    <td className="text-center">{order.time}</td>
                    <td className="text-center">{order.servicePerson.name}</td>
                    <td className="text-center">${order.amount}</td>
                    <td className="text-center">
                      {(isManager && order.status !== OrderStatus.paid_online && order.status !== OrderStatus.paid_store) ? (
                        <div>
                          <span>
                            {order.user.first_name} {order.user.last_name}
                          </span>
                          <br />
                          <select
                            defaultValue={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            aria-label="Order status"
                          >
                            <option value={OrderStatus.created}>{OrderStatus.created}</option>
                            <option value={OrderStatus.completed} className="text-secondary">{OrderStatus.completed}</option>
                            <option value={OrderStatus.noShow} className="text-error">{OrderStatus.noShow}</option>
                            <option value={OrderStatus.paid_store} className="text-success">{OrderStatus.paid_store}</option>
                          </select>
                        </div>
                      ) : (
                        isCustomer? <span className="text-secondary">{order.status}</span> :
                        <span className="text-secondary">{order.user.first_name} {order.user.last_name}<br/>{order.status}</span>
                        
                      )
                      } 
                    </td>
                    {isCustomer && (
                      <td className="text-center">
                        {order.reviews && order.reviews.length > 0 ? (
                          <div className="flex items-center justify-center">
                            <FaStar className="text-yellow-400" />
                            <span className="ml-1">{Math.round(order.reviews[0].rating)}</span>
                          </div>
                        ) : (order.status === OrderStatus.completed || order.status === OrderStatus.paid_store|| order.status === OrderStatus.paid_online ) &&
                            (
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
                      <OrderDetailsActionButtons
                        person={persons.find((p) => p.id === order.servicePerson.id)}
                        user={user}
                        order={order}
                        handleDeleteOrder={handleDeleteOrder}
                        updateBookingNotification={updateBookingNotification}
                      />
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
