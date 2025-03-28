import UserProfileClient from "./UserProfileClient";

type UserProfileServerProps = {
  userData: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
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
