import React, { useState } from 'react';
import { Box, Button, Input, Typography } from '@mui/joy';
import { Alert } from '@mui/material';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      setError('Please fill in both username and password');
    } else {
      try {
        // Call API to authenticate user
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (data.success) {
          setSuccess(true);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('Error authenticating user');
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 4,
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        boxShadow: '2 8px 9px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      <Typography variant="h5" component="h5">
        Sign In
      </Typography>
      <Input
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Username"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        required
      />
      <Button type="submit" variant="soft" color="primary">
        Sign In
      </Button>
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 2 }}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          severity="success"
          sx={{ mt: 2 }}
        >
          You have successfully signed in!
        </Alert>
      )}
    </Box>
  );
}

export default SignIn;