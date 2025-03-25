"use client";

import React from "react";
import Image from "next/image";
import Price from "@/app/components/misc/Price";
import Rating from "@/app/components/misc/Rating";
import { FaMapMarkerAlt } from "react-icons/fa";
import { servicePersonExtended } from "@/app/lib/interfaces/service";

interface ServiceDetailsPersonCardProps {
  person: servicePersonExtended;
}

const ServiceDetailsPersonCard: React.FC<ServiceDetailsPersonCardProps> = ({ person }) => {
  return (
    <div className="service-details-person-card grid grid-cols-1 gap-6 px-4 pt-4 sm:p-4 md:grid-cols-2">
      {/* Service Provider Image */}
      <div className="relative h-[300px] sm:h-[450px]">
        <Image
          src={person.imageUrl as string}
          alt={person.name as string}
          width={500}
          height={500}
          className="rounded-badge absolute w-full h-full object-cover object-center"
        />
      </div>

      {/* Service Provider Details */}
      <div>
        <h1 className="text-xl font-semibold mb-6 sm:text-2xl">{person.name}</h1>

        {/* Category Badge & Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="badge bg-primary/10 text-primary p-4 text-xs">{person.category.title}</div>
          <div className="flex items-center">
            <Rating rating={person.rating as number} className="mr-2" />
          </div>
        </div>

        {/* Location */}
        <div className="flex justify-between mb-4 gap-2">
          <div className="flex items-center ml-auto">
            <FaMapMarkerAlt className="text-primary w-[30px] h-[30px] mr-2" />
            <span className="text-base-100 text-xs font-normal sm:text-sm">{person.location}</span>
          </div>
        </div>

        {/* Price */}
        {/* <div className="flex items-center justify-end gap-2">
          <Price className="my-auto" price={person.price as number} size="large" />
          <span className="text-gray-500 text-sm font-normal">/ hour</span>
        </div> */}

        {/* Divider */}
        <div className="divider"></div>

        {/* About Section */}
        <div className="flex flex-col">
          <h5 className="text-md font-semibold text-base-100 mb-2 sm:text-lg">About Me</h5>
          <p className="text-xs font-light text-gray-600 sm:text-sm">{person.about}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPersonCard;
