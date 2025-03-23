import React from 'react';
import apiService from '@/app/lib/services/apiService';
import PopularServicesPersonCard from '@/app/components/services/PopularServicesPersonCard';
import { servicePersonExtended } from '@/app/lib/interfaces/service';

export const metadata = {
  title: 'Nail Shop Online System - Services',
  description: 'Nail Shop Online System services description',
  keywords: 'next, next.js, react, app, booking',
};
const Services = async ({ searchParams }: { searchParams: any }) => {
  let services = [];
  const responseServices = await apiService.services.get({ categoryName: searchParams.category });

  if (responseServices.success) {
    services = responseServices.data;
  }

  return (
    <div className="services flex flex-col flex-grow w-full">
      <div className="container mx-auto py-4 px-4 sm:py-8">
        <h1 className="text-xl text-center font-semibold mb-4 mx-auto">Choose a technician</h1>
        {services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((item: servicePersonExtended) => (
              <PopularServicesPersonCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
