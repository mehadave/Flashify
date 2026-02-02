import * as React from 'react';
import { Box, Alert, Button } from '@mui/material';
import { SignInPage, type AuthProvider, type AuthResponse } from '@toolpad/core/SignInPage';
import { useNavigate } from 'react-router-dom';
import groceryBg from '../assets/grocery-bg.jpg';

import {
  CustomEmailField,
  CustomPasswordField,
  RememberMeCheckbox,
  LoginLink,
  providers,
} from '../components/LoginUtilities';

import { signup, login } from '../services/api';

function Title() {
  return <h2 style={{ marginBottom: 8 }}>Sign up</h2>;
}

function Subtitle({ error }: { error: string | null }) {
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
        {error}
      </Alert>
    );
  }

  return (
    <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
      Create an account to continue.
    </Alert>
  );
}

function SubmitButton() {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Create account
    </Button>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  const SubtitleWithErrors = React.useCallback(() => {
    return <Subtitle error={error} />;
  }, [error]);

  const handleSignUp = React.useCallback(
    async (
      _provider: AuthProvider,
      formData?: any,
      _callbackUrl?: string,
    ): Promise<AuthResponse> => {
      setError(null);

      const fd: FormData | null = formData instanceof FormData ? formData : null;
      const email = (fd?.get('email') as string | null) ?? null;
      const password = (fd?.get('password') as string | null) ?? null;

      if (!email || !password) {
        const msg = 'Please enter both email and password.';
        setError(msg);
        return {};
      }

      try {
        // 1) create the account
        await signup(email, password);

        // 2) auto-login immediately (consistent UX)
        const res = await login(email, password);
        localStorage.setItem('token', res.token);

        // 3) go to Home
        navigate('/', { replace: true });

        return {};
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ??
          'Signup failed. Please try again.';
        setError(msg);
        return {};
      }
    },
    [navigate],
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

      {/* Signup card */}
      <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
        <SignInPage
          providers={providers}
          signIn={handleSignUp}
          slots={{
            title: Title,
            subtitle: SubtitleWithErrors,
            emailField: CustomEmailField,
            passwordField: CustomPasswordField,
            submitButton: SubmitButton,
            rememberMe: RememberMeCheckbox,
            signUpLink: LoginLink, // re-using the slot as "switch auth mode" link
          }}
          slotProps={{ form: { noValidate: true } }}
        />
      </Box>
    </Box>
  );
}
