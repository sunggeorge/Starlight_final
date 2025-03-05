// import { createContext, useContext } from 'react';

// export const useUser = () => useContext(UserContext);

// interface UserContextType {
//   user: Record<string, any> | null;
//   userDetails: Record<string, any> | null;
// }

// export const UserContext = createContext<UserContextType | null>(null);

'use client';

import { createContext, useContext } from 'react';

interface IUserContext {
  user: any | null;
  userDetails: any | null;
}

export const UserContext = createContext<IUserContext>({ user: null, userDetails: null });

export const useUser = () => useContext(UserContext);
