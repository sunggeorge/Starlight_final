'use client';

import React from "react";
import { FaUserCircle } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import Image from 'next/image';

type UserProfileClientProps = {
  userData: {
    id: number;
    email: string | null; // Allow null
    first_name: string | null; // Allow null
    last_name: string | null; // Allow null
    role: string;
    created_at: Date;
    imageUrl?: string | null;
  };
};

const UserProfileClient = ({ userData }: UserProfileClientProps) => {
  const getRoleName = (role: string) => {
    switch (role) {
      case 'M':
        return 'Manager';
      case 'S':
        return 'Staff';
      case 'C':
        return 'Client';
      default:
        return role;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg p-8 bg-white rounded-badge shadow-md border border-gray-200">
      <div className="flex items-center justify-center p-6 border-[3px] border-solid border-primary/15 rounded-full">
        {userData.imageUrl ? (
          <Image 
            src={userData.imageUrl} 
            alt="Profile" 
            width={80} 
            height={80} 
            className="rounded-full"
          />
        ) : (
          <FaUserCircle className="w-[80px] h-[80px] text-primary" />
        )}
      </div>
      
      <h2 className="text-2xl font-semibold mt-4">
        {userData.first_name} {userData.last_name}
      </h2>

      <div className="flex flex-col gap-4 mt-6 w-full">
        <div className="flex items-center gap-2">
          <MdEmail className="text-primary" />
          <p className="text-sm">{userData.email}</p>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Role: {getRoleName(userData.role)}</p>
          <p>Member since: {new Date(userData.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileClient;
