'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import { UserRoles } from '../lib/constants/role';
import apiService from '@/app/lib/services/apiService';

const Reports = () => {
  const { user, userDetails } = useUser();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const token = user?.token;
        const response = await apiService.orders.getUserOrders({ token });
        if (response && response.success) {
          setOrders(response.data);
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
  }, [user]);

  const filteredOrders = selectedMonth
    ? orders.filter(order => order.date.startsWith(selectedMonth))
    : orders;

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
  const totalOrders = filteredOrders.length;

  return (
    <div className="reports flex flex-col flex-grow w-full">
      <div className="container mx-auto py-4 px-4 sm:py-8">
        <h1 className="text-xl font-semibold mb-4 text-center">Sales Report</h1>
        <div className="mb-4">
          <label className="font-medium">Filter by Date:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input input-bordered ml-2"
          />
        </div>
        {loading ? (
          <p>Loading report data...</p>
        ) : (
          <div>
            <h2 className="text-lg font-bold mb-2">Summary</h2>
            <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
            <p>Total Orders: {totalOrders}</p>
            <h2 className="text-lg font-bold mt-4">Order Details</h2>
            <table className="table-zebra-zebra table-lg w-full">
              <thead>
                <tr>
                  <th className="text-center">Order ID</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Customer</th>
                  <th className="text-center">Technician</th>
                  <th className="text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="text-center">{order.id}</td>
                    <td className="text-center">{order.date}</td>
                    <td className="text-center">{}</td>
                    <td className="text-center">{order.servicePerson.name}</td>
                    <td className="text-center">${order.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
