import React from "react";

const UserProfileClient = ({ user }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md text-center">
        <h2 className="text-xl font-bold mb-2">User Profile</h2>
        <img src={user.imageUrl || "/default-avatar.png"} alt="Profile" className="w-24 h-24 rounded-full mx-auto mt-2" />
        <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role === "M" ? "Manager" : "Client"}</p>
      </div>
    </div>
  );
};

export default UserProfileClient;