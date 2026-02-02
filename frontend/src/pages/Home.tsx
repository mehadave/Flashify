import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { getHealth } from '../services/api';

function Home() {
  const [status, setStatus] = useState('loading...');
  const navigate = useNavigate();

  useEffect(() => {
    getHealth()
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('backend not reachable'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Frontend ↔ Backend Test</Typography>

        <Button variant="outlined" color="inherit" onClick={handleLogout}>
          Log out
        </Button>
      </Box>

      <Typography variant="body1">Backend status: {status}</Typography>
    </Box>
  );
}

export default Home;

