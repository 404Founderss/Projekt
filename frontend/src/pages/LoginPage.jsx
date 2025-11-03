// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setError('');
    const result = await login(data);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 3,
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            {/* Logo/Icon */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: '0 auto',
                  mb: 2,
                  bgcolor: '#2e7d32',
                }}
              >
                <LoginIcon sx={{ fontSize: 40, color: '#fff' }} />
              </Avatar>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  color: '#2e7d32',
                  fontWeight: 700,
                }}
              >
                Raktárkezelés
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  fontWeight: 400,
                }}
              >
                Jelentkezz be a céges adataiddal
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
              >
                {error}
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Felhasználónév / Email"
                margin="normal"
                {...register('username', {
                  required: 'A felhasználónév kötelező'
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Jelszó"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                {...register('password', {
                  required: 'A jelszó kötelező'
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 4,
                  py: 1.5,
                  bgcolor: '#2e7d32',
                  '&:hover': {
                    bgcolor: '#1b5e20',
                  },
                }}
              >
                {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;