'use server';

import { createClient } from '@/app/lib/utils/supabase/server';
import prisma from '@/app/lib/utils/prisma/database';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { userExtended } from '@/app/lib/interfaces/service';

/**
 *  User Login
 */
export const login = async (data: { email: string; password: string }, redirectUrl?: string) => {
  const supabase = createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error("🚨 Login Error:", error.message);
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(redirectUrl ? redirectUrl : '/');
};

/**
 *  User Registration
 */
export const register = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const supabase = createClient();
  const origin = headers().get('origin');

  //  Prevent duplicate registration
  const isAlreadyRegistered = await prisma.user.findFirst({
    where: { email: data.email },
  });

  if (isAlreadyRegistered) {
    return { error: `User with email ${data.email} already exists.` };
  }

  //  Sign up the user in Supabase
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: { emailRedirectTo: `${origin}/auth/callback?next=${origin}` },
  });

  if (error) {
    console.error("🚨 Registration Error:", error.message);
    return { error: error.message };
  }

  //  Create user record in Prisma
  const newUser = await prisma.user.create({
    data: {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      uuid: authData.user?.id,
    },
  });

  return newUser;
};

/**
 *  Forgot Password
 */
export const forgotPassword = async (data: { email: string }) => {
  const supabase = createClient();
  const origin = headers().get('origin');

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${origin}/update-password`,
  });

  if (error) {
    console.error("🚨 Forgot Password Error:", error.message);
    return { error: error.message };
  }

  return { message: "Password reset email sent successfully!" };
};

/**
 * Reset Password with Token
 */
export const resetPassword = async (data: { password: string }, code: string) => {
  const supabase = createClient();

  try {
    //  Exchange the code for a session
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    if (sessionError) throw new Error(sessionError.message);

    //  Update password
    const { error: updateError } = await supabase.auth.updateUser({ password: data.password });
    if (updateError) throw new Error(updateError.message);

    return { message: "Password successfully updated!" };
  } catch (error) {
    console.error("🚨 Reset Password Error:", error);
    return { error: error.message };
  }
};

/**
 *  Update Password for Logged-In Users
 */
export const updatePassword = async (data: { password: string }) => {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: data.password });

  if (error) {
    console.error("🚨 Update Password Error:", error.message);
    return { error: error.message };
  }

  return { message: "Password updated successfully!" };
};

/**
 *  Logout User
 */
export const logout = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("🚨 Logout Error:", error.message);
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
};

/**
 * Get Current User and Match with Prisma Database
 */
export const getUser = async () => {
  const supabase = createClient();

  //  Ensure the session is refreshed
  await supabase.auth.refreshSession();

  const { data: authData, error } = await supabase.auth.getUser();
  if (error || !authData?.user) {
    console.error("🚨 No active user session found!", error?.message);
    return null;
  }

  //  Find matching user in Prisma database
  const matchedUser = await prisma.user.findFirst({
    where: { uuid: authData.user.id },
    select: { id: true, email: true, first_name: true, last_name: true, imageUrl: true },
  });

  if (!matchedUser) {
    console.error("🚨 No matching user found in Prisma for UUID:", authData.user.id);
    return null;
  }

  return {
    ...authData.user,
    email: matchedUser.email,
    uuid: authData.user.id,
    imageUrl: matchedUser.imageUrl || '',
    first_name: matchedUser.first_name || '',
    last_name: matchedUser.last_name || '',
    userId: matchedUser.id, // ✅ Use database `id` as `userId`
    id: matchedUser.id, // ✅ This is the correct user ID
    created_at: new Date(authData.user.created_at),
    role: authData.user.role || '',
  };
};

/**
 *  Get User Session
 */
export const getSession = async () => {
  const supabase = createClient();
  const { data: sessionData, error } = await supabase.auth.getSession();

  if (error) {
    console.error("🚨 Get Session Error:", error.message);
    return null;
  }

  return sessionData.session;
};
