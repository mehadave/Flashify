import * as React from 'react';
import {
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  Alert,
  IconButton,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTheme } from '@mui/material/styles';

export const providers = [{ id: 'credentials', name: 'Email and Password' }];

export function Title() {
  return <h2 style={{ marginBottom: 8 }}>Login</h2>;
}

export function Subtitle() {
  return (
    <Alert severity="info" sx={{ mb: 2 }}>
      Welcome back! Please log in to continue.
    </Alert>
  );
}

export function CustomEmailField() {
  return (
    <TextField
      label="Email"
      name="email"
      type="email"
      required
      fullWidth
      size="small"
      autoComplete="email"
      variant="outlined"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export function CustomPasswordField() {
  const [show, setShow] = React.useState(false);

  return (
    <FormControl fullWidth variant="outlined" size="small" sx={{ my: 2 }}>
      <InputLabel>Password</InputLabel>
      <OutlinedInput
        name="password"
        type={show ? 'text' : 'password'}
        autoComplete="current-password"
        endAdornment={
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => setShow(!show)}>
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  );
}

export function CustomButton() {
  return (
    <Button
      type="submit"
      variant="contained"
      color="success"
      size="small"
      fullWidth
      sx={{ my: 2 }}
    >
      Log In
    </Button>
  );
}

export function RememberMeCheckbox() {
  const theme = useTheme();

  return (
    <FormControlLabel
      label="Remember me"
      control={<Checkbox name="remember" value="true" size="small" />}
      slotProps={{
        typography: {
          fontSize: theme.typography.pxToRem(14),
          color: 'text.secondary',
        },
      }}
    />
  );
}

export function SignUpLink() {
  return (
    <Link href="/signup" variant="body2">
      Sign up
    </Link>
  );
}

export function LoginLink() {
  return (
    <Link href="/login" variant="body2">
      Already have an account? Log in
    </Link>
  );
}

export function ForgotPasswordLink() {
  return (
    <Link href="/forgot-password" variant="body2">
      Forgot password?
    </Link>
  );
}
