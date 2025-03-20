'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import { UserRoles } from '../lib/constants/role';
import apiService from '@/app/lib/services/apiService';
import { useSort } from '@/app/lib/utils/useSort';

const Reports = () => {
  const { user, userDetails } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

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

  const { sortedItems: sortedOrders, requestSort, sortConfig } = useSort(filteredOrders, 'id');
  
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
            defaultValue={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            lang="en"
            className="border border-gray-400 rounded px-3 py-1 ml-2"
          />
        </div>

        {/* Tabs for switching views */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('table')}
          >
            Table View
          </button>
          <button
            className={`px-4 py-2 rounded ${viewMode === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setViewMode('chart')}
          >
            Chart View
          </button>
        </div>

        {loading ? (
          <p>Loading report data...</p>
        ) : (
          <div>
            {viewMode === 'chart' && (
              <div>
                <h2 className="text-lg font-bold mb-2">Chart View</h2>
                <p>Chart will be displayed here.</p>
              </div>
            )}

            {viewMode === 'table' && (
              <div>                
                <h2 className="text-lg font-bold mb-2">Summary</h2>
                <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
                <p>Total Orders: {totalOrders}</p>
                <h2 className="text-lg font-bold mt-4">Order Details</h2>
                <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 border cursor-pointer" onClick={() => requestSort('id')}>
                        Order ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th className="px-4 py-2 border cursor-pointer" onClick={() => requestSort('date')}>
                        Date {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th className="px-4 py-2 border cursor-pointer" onClick={() => requestSort('customer')}>
                        Customer {sortConfig.key === 'customer' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th className="px-4 py-2 border cursor-pointer" onClick={() => requestSort('servicePerson.name')}>
                        Technician {sortConfig.key === 'servicePerson.name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </th>
                      <th className="px-4 py-2 border cursor-pointer" onClick={() => requestSort('amount')}>
                        Amount {sortConfig.key === 'amount' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sortedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-100 transition">
                        <td className="px-4 py-2 border text-center">{order.id}</td>
                        <td className="px-4 py-2 border text-center">{order.date}</td>
                        <td className="px-4 py-2 border text-center">{order.user? `${order.user.first_name} ${order.user.last_name}` : 'N/A'}</td>
                        <td className="px-4 py-2 border text-center">{order.servicePerson.name}</td>
                        <td className="px-4 py-2 border text-center font-semibold">${order.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
