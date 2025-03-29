import UserProfileServer from "@/app/lib/utils/supabase/UserProfileServer";
import { getUser } from "@/app/lib/utils/authUtils";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/utils/prisma/database";

export const metadata = {
  title: 'HANNA Nail Shop - Profile',
  description: 'View and manage your profile',
  keywords: 'profile, account, settings',
};

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user data from prisma
  const userData = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });

  if (!userData) {
    redirect('/login');
  }

  return (
    <div className="flex flex-col items-center justify-center w-full py-8">
      <UserProfileServer userData={userData} />
    </div>
  );
}


