import UserProfileClient from "./UserProfileClient";

type UserProfileServerProps = {
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

const UserProfileServer = ({ userData }: UserProfileServerProps) => {
  if (!userData) {
    return <p className="text-center text-red-500">Error fetching user data.</p>;
  }

  return <UserProfileClient userData={userData} />;
};

export default UserProfileServer;
