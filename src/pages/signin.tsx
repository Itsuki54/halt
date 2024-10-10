import SigninPage from '@/components/auth/SigninPage';
import Layout from '@/components/layout';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SignIn() {

  return (
    <SigninPage/>
  );
}
