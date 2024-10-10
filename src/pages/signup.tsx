import { SignupPage } from '@/components/auth';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/layout';

export default function SignUp() {
  return <SignupPage />;
}
