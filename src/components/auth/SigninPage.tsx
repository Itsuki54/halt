import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import Layout from "../layout";
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';

import { Card, AuthContainer } from './common';


export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (!response || response.error) {
        setError(response?.error || 'An error occurred');
      }
      else {
        toast.success('ログインしました！');
        router.push('/');
      }
    }
    catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError('An error occurred');
    }
  };

  return (
    <Layout>
      <AuthContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Sign in
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailErrorMessage}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordErrorMessage}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'gray',
                },
              }}
            >
              Sign in
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Don't have an account?{' '}
              <span>
                <Link href="/signup" variant="body2" sx={{ alignSelf: 'center' }}>
                  Sign up
                </Link>
              </span>
            </Typography>
          </Box>
        </Card>
      </AuthContainer>
    </Layout>
  );
}
