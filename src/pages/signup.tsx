import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Layout from '../components/layout';
import { SignupPage } from '@/components/auth';

export default function SignUp() {
  return (
    <SignupPage/>
  );
}
