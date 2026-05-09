import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, CircularProgress, Link
} from '@mui/material';
import { Email, Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../store/slices/authSlice';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => { if (token) navigate('/app'); }, [token, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(registerUser(form));
  };

  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5, fontWeight: 700, fontSize: '0.95rem',
      '&:hover fieldset': { borderColor: '#11998e' },
      '&.Mui-focused fieldset': { borderColor: '#11998e', borderWidth: 2.5 },
    },
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>

      {/* LEFT */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 6, color: '#fff' }}>
        <Box sx={{ fontSize: 70, mb: 2 }}>🚀</Box>
        <Typography sx={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, mb: 2, textAlign: 'center' }}>
          Start your AI<br />journey today
        </Typography>
        <Typography sx={{ fontSize: '1.05rem', opacity: 0.9, textAlign: 'center', maxWidth: 320, lineHeight: 1.8, fontWeight: 600 }}>
          Join thousands of users who use RAG Q&A to instantly understand their documents.
        </Typography>

        {/* Steps */}
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 320 }}>
          {[
            { step: '01', text: 'Create your free account' },
            { step: '02', text: 'Upload any PDF document' },
            { step: '03', text: 'Ask questions, get answers' },
          ].map(({ step, text }) => (
            <Box key={step} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, color: '#fff', flexShrink: 0 }}>
                {step}
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* RIGHT */}
      <Box sx={{ width: { xs: '100%', md: 480 }, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, background: '#fff', borderRadius: { md: '32px 0 0 32px' } }}>
        <Box sx={{ width: '100%', maxWidth: 380 }}>

          <Box sx={{ display: { md: 'none' }, textAlign: 'center', mb: 4 }}>
            <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: '#11998e' }}>RAG Q&A 🚀</Typography>
          </Box>

          <Typography sx={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1.5px', color: '#1a1a2e', mb: 0.5 }}>
            Create account ✨
          </Typography>
          <Typography sx={{ color: '#999', mb: 3.5, fontSize: '0.92rem', fontWeight: 700 }}>
            Get started for free today
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontWeight: 700 }}>{error}</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 900, color: '#11998e', mb: 0.8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Full Name
            </Typography>
            <TextField
              fullWidth name="name" placeholder="Shunmuga Kumar"
              value={form.name} onChange={handleChange} required
              sx={{ mb: 2.5, ...fieldStyle }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ color: '#11998e', fontSize: 20 }} /></InputAdornment> }}
            />

            <Typography sx={{ fontSize: '0.72rem', fontWeight: 900, color: '#11998e', mb: 0.8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Email Address
            </Typography>
            <TextField
              fullWidth name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required
              sx={{ mb: 2.5, ...fieldStyle }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#11998e', fontSize: 20 }} /></InputAdornment> }}
            />

            <Typography sx={{ fontSize: '0.72rem', fontWeight: 900, color: '#11998e', mb: 0.8, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Password
            </Typography>
            <TextField
              fullWidth name="password"
              type={showPass ? 'text' : 'password'}
              placeholder="Create a password"
              value={form.password} onChange={handleChange} required
              sx={{ mb: 3, ...fieldStyle }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#11998e', fontSize: 20 }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit" fullWidth disabled={loading}
              sx={{
                py: 1.7, borderRadius: 2.5, fontSize: '1rem', fontWeight: 900,
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                color: '#fff', letterSpacing: 0.5,
                '&:hover': { background: 'linear-gradient(135deg, #0d7f77 0%, #2fd16b 100%)', transform: 'translateY(-3px)', boxShadow: '0 14px 35px rgba(17,153,142,0.45)' },
                '&:active': { transform: 'translateY(0)' },
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Create Account →'}
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 3, fontSize: '0.9rem', color: '#999', fontWeight: 700 }}>
            Already have an account?{' '}
            <Link component="button" onClick={() => navigate('/login')}
              sx={{ fontWeight: 900, color: '#11998e', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign in →
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
