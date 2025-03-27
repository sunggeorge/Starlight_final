// // 'use client';

// // import React from 'react';
// // import { FaUserCircle } from 'react-icons/fa';
// // import { MdEmail } from 'react-icons/md';
// // import { useRouter } from 'next/navigation';

// // type UserProfileProps = {
// //   firstName: string;
// //   lastName: string;
// //   email: string;
// // };

// // const UserProfile: React.FC<UserProfileProps> = ({ firstName, lastName, email }) => {
// //   const router = useRouter();

// //   const handleLogout = () => {
// //     // Add logout logic here (e.g., clear session, redirect to login)
// //     router.push('/login');
// //   };

// //   return (
// //     <div className="flex flex-col items-center justify-center w-full max-w-lg p-8 bg-white rounded-badge shadow-md border border-gray-200">
// //       <div className="flex items-center justify-center p-6 border-[3px] border-solid border-primary/15 rounded-full">
// //         <FaUserCircle className="w-[80px] h-[80px] text-primary" />
// //       </div>
// //       <h2 className="text-2xl font-semibold mt-4">Welcome, {firstName} {lastName}!</h2>

// //       <div className="flex flex-col gap-4 mt-6 w-full">
// //         <div className="flex items-center gap-2">
// //           <MdEmail className="text-primary" />
// //           <p className="text-sm">{email}</p>
// //         </div>
// //       </div>

// //       <button
// //         onClick={handleLogout}
// //         className="btn btn-error font-normal mt-8"
// //       >
// //         Logout
// //       </button>
// //     </div>
// //   );
// // };

// // export default UserProfile;


// // "use client";

// // import React, { useState, useEffect } from "react";

// // const UserProfile = () => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     fetch("https://jsonplaceholder.typicode.com/users/1")
// //       .then((response) => {
// //         if (!response.ok) {
// //           throw new Error("Network response was not ok");
// //         }
// //         return response.json();
// //       })
// //       .then((data) => {
// //         setUser(data);
// //         setLoading(false);
// //       })
// //       .catch((error) => {
// //         setError(error.message);
// //         setLoading(false);
// //       });
// //   }, []);

// //   if (loading) return <p>Loading...</p>;
// //   if (error) return <p>Error: {error}</p>;

// //   return (
// //     <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
// //       <h2 className="text-xl font-bold mb-2">User Profile</h2>
// //       <p><strong>Name:</strong> {user.name}</p>
// //       <p><strong>Username:</strong> {user.username}</p>
// //       <p><strong>Email:</strong> {user.email}</p>
// //       <p><strong>Phone:</strong> {user.phone}</p>
// //       <p><strong>Website:</strong> <a href={`https://${user.website}`} className="text-blue-500">{user.website}</a></p>
// //       <p><strong>Address:</strong> {user.address.street}, {user.address.city}, {user.address.zipcode}</p>
// //       <p><strong>Company:</strong> {user.company.name}</p>
// //       <p><strong>Company Catchphrase:</strong> {user.company.catchPhrase}</p>
// //     </div>
// //   );
// // };

// // export default UserProfile;


// import UserProfileServer from "@/app/lib/utils/supabase/UserProfileServer";

// export default function ProfilePage() {
//   return (
//     <div>
//       <h1 className="text-2xl font-bold">Profile</h1>
//       <UserProfileServer />
//     </div>
//   );
// }

