import { createClient } from "@/app/lib/utils/supabase/server";
import UserProfileClient from "./UserProfileClient";

const UserProfileServer = async () => {
  const supabase = createClient();
  const { data: user, error } = await supabase.auth.getUser();

  if (error || !user) {
    return <p>Error fetching user data.</p>;
  }

  return <UserProfileClient user={user} />;
};

export default UserProfileServer;
