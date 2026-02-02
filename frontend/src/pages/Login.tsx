import * as React from 'react';
import { Box, Alert } from '@mui/material';
import { SignInPage, type AuthProvider, type AuthResponse } from '@toolpad/core/SignInPage';
import groceryBg from '../assets/grocery-bg.jpg';
import { useNavigate } from 'react-router-dom';

import {
  Title,
  CustomEmailField,
  CustomPasswordField,
  CustomButton,
  RememberMeCheckbox,
  SignUpLink,
  ForgotPasswordLink,
  providers,
} from '../components/LoginUtilities';

import {api} from '../services/api';


export default function Login() {
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const SubtitleWithErrors = React.useCallback(() => {
    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
          {error}
        </Alert>
      );
    }
    return (
      <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
        Welcome back! Please log in to continue.
      </Alert>
    );
  }, [error]);

  const handleSignIn = React.useCallback(
    async (
      _provider: AuthProvider,
      formData?: any,
      _callbackUrl?: string,
    ): Promise<AuthResponse> => {
      setError(null);

      // Toolpad types formData as `any`, but it is FormData at runtime.
      const fd: FormData | null = formData instanceof FormData ? formData : null;

      const email = (fd?.get('email') as string | null) ?? null;
      const password = (fd?.get('password') as string | null) ?? null;

      if (!email || !password) {
        const msg = 'Please enter both email and password.';
        setError(msg);
        return {};
      }

      try {
        // ✅ CALL BACKEND
          // const res = await api.post('/auth/login', { email, password });
          // return res.data; // { token }
        
        const res = await api.post('/auth/login', { email, password });
        console.log('Login successful:', res);


        // ✅ STORE JWT
        localStorage.setItem('token', res?.data?.token);

        // Optional: go somewhere after login
        // window.location.href = '/';
        navigate('/', { replace: true })

        return {};
      } catch (err: any) {
        // ✅ Show backend message if present
        const msg =
          err?.response?.data?.message ??
          'Sign-in failed. Please check your credentials and try again.';
        setError(msg);
        return {};
      }
    },
    [],
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Blurred background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${groceryBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(14px)',
          transform: 'scale(1.05)',
          zIndex: 0,
        }}
      />

      {/* Dark overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          zIndex: 1,
        }}
      />

      {/* Login card */}
      <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <SignInPage
          providers={providers}
          signIn={handleSignIn}
          slots={{
            title: Title,
            subtitle: SubtitleWithErrors,
            emailField: CustomEmailField,
            passwordField: CustomPasswordField,
            submitButton: CustomButton,
            rememberMe: RememberMeCheckbox,
            signUpLink: SignUpLink,
            forgotPasswordLink: ForgotPasswordLink,
          }}
          slotProps={{ form: { noValidate: true } }}
        />
      </Box>
    </Box>
  );
}
