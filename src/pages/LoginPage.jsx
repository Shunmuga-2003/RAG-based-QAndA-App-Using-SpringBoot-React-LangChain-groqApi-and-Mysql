import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, Divider, CircularProgress, Link
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../store/slices/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => { if (token) navigate('/app'); }, [token, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(loginUser(form));
  };

  const darkInputSx = {
    mb: 2.5,
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5,
      fontWeight: 700,
      fontSize: '0.95rem',
      background: '#1e1e3a',
      color: '#f0f0ff',
      '& input': {
        color: '#f0f0ff',
      },
      '& input::placeholder': {
        color: 'rgba(255,255,255,0.35)',
        opacity: 1,
      },
      '& fieldset': {
        borderColor: '#7c3aed',
      },
      '&:hover fieldset': { borderColor: '#a78bfa' },
      '&.Mui-focused fieldset': { borderColor: '#a78bfa', borderWidth: 2.5 },
    },
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>

      {/* LEFT — branding */}
      <Box sx={{
        flex: 1,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 6,
        color: '#fff',
      }}>
        <Box sx={{ fontSize: 70, mb: 2 }}>📄</Box>
        <Typography sx={{
          fontSize: '3rem',
          fontWeight: 900,
          letterSpacing: '-2px',
          lineHeight: 1.1,
          mb: 2,
          textAlign: 'center',
          color: '#f0f0ff',
        }}>
          RAG Document<br />Q&A System
        </Typography>
        <Typography sx={{
          fontSize: '1.05rem',
          opacity: 0.75,
          textAlign: 'center',
          maxWidth: 320,
          lineHeight: 1.8,
          fontWeight: 500,
          color: '#c4b5fd',
        }}>
          Upload any PDF and ask questions. Get instant AI-powered answers from your documents.
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 4, justifyContent: 'center' }}>
          {['🤖 AI Powered', '🔒 Secure JWT', '⚡ Instant', '📊 Accurate'].map((f) => (
            <Box key={f} sx={{
              px: 2,
              py: 0.8,
              borderRadius: 20,
              background: 'rgba(124,58,237,0.25)',
              border: '1px solid rgba(167,139,250,0.4)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#c4b5fd',
            }}>
              {f}
            </Box>
          ))}
        </Box>
      </Box>

      {/* RIGHT — form */}
      <Box sx={{
        width: { xs: '100%', md: 480 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        background: '#0f0f23',
        borderRadius: { md: '32px 0 0 32px' },
        borderLeft: { md: '1px solid rgba(124,58,237,0.3)' },
      }}>
        <Box sx={{ width: '100%', maxWidth: 380 }}>

          {/* Mobile logo */}
          <Box sx={{ display: { md: 'none' }, textAlign: 'center', mb: 4 }}>
            <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: '#a78bfa' }}>RAG Q&A 📄</Typography>
          </Box>

          <Typography sx={{
            fontSize: '2.2rem',
            fontWeight: 900,
            letterSpacing: '-1.5px',
            color: '#f0f0ff',
            mb: 0.5,
          }}>
            Welcome back 👋
          </Typography>
          <Typography sx={{ color: '#7c6fa0', mb: 3.5, fontSize: '0.92rem', fontWeight: 600 }}>
            Sign in to your account
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: 2,
                fontWeight: 700,
                background: 'rgba(220,38,38,0.15)',
                color: '#fca5a5',
                border: '1px solid rgba(220,38,38,0.3)',
                '& .MuiAlert-icon': { color: '#fca5a5' },
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>

            <Typography sx={{
              fontSize: '0.72rem',
              fontWeight: 900,
              color: '#a78bfa',
              mb: 0.8,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}>
              Email Address
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              sx={darkInputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#a78bfa', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <Typography sx={{
              fontSize: '0.72rem',
              fontWeight: 900,
              color: '#a78bfa',
              mb: 0.8,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}>
              Password
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              sx={{ ...darkInputSx, mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#a78bfa', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end" sx={{ color: '#a78bfa' }}>
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.7,
                borderRadius: 2.5,
                fontSize: '1rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                color: '#fff',
                letterSpacing: 0.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #6d28d9 0%, #4338ca 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 14px 35px rgba(124,58,237,0.45)',
                },
                '&:active': { transform: 'translateY(0)' },
                '&.Mui-disabled': {
                  background: 'rgba(124,58,237,0.4)',
                  color: 'rgba(255,255,255,0.5)',
                },
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In →'}
            </Button>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(124,58,237,0.25)' }}>
            <Typography sx={{ fontSize: '0.75rem', color: '#7c6fa0', fontWeight: 900, px: 1 }}>OR</Typography>
          </Divider>

          <Button
            fullWidth
            onClick={() => setForm({ email: 'shunmuga@gmail.com', password: '123456' })}
            sx={{
              py: 1.5,
              borderRadius: 2.5,
              fontSize: '0.9rem',
              fontWeight: 900,
              border: '2px solid #7c3aed',
              color: '#a78bfa',
              background: 'transparent',
              '&:hover': {
                background: 'rgba(124,58,237,0.15)',
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 20px rgba(124,58,237,0.25)',
              },
              transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            🎯 Use Demo Credentials
          </Button>

          <Typography sx={{ textAlign: 'center', mt: 3, fontSize: '0.9rem', color: '#7c6fa0', fontWeight: 700 }}>
            No account?{' '}
            <Link
              component="button"
              onClick={() => navigate('/register')}
              sx={{
                fontWeight: 900,
                color: '#a78bfa',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline', color: '#c4b5fd' },
              }}
            >
              Create one free →
            </Link>
          </Typography>

        </Box>
      </Box>
    </Box>
  );
}