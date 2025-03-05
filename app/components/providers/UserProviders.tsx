'use client';
import React from 'react';
import { UserContext } from '@/app/context/UserContext';

interface UserProviderProps {
  user: any;
  userDetails: any;
  children: React.ReactNode;
}

export default function UserProvider({ user, userDetails, children }: UserProviderProps) {
  return <UserContext.Provider value={{ user, userDetails }}>{children}</UserContext.Provider>;
}
