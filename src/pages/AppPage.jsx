import React, { useEffect } from 'react';
import { Box, Typography, IconButton, Chip, Tooltip } from '@mui/material';
import { LightMode, DarkMode, DeleteSweep } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDocuments } from '../store/slices/documentSlice';
import { clearMessages } from '../store/slices/chatSlice';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

export default function AppPage({ toggleTheme, mode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((s) => s.auth);
  const { activeDoc } = useSelector((s) => s.documents);
  const { messages } = useSelector((s) => s.chat);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    dispatch(fetchDocuments());
  }, [token, navigate, dispatch]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* TOPBAR */}
        <Box
          sx={{
            height: 62,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            borderBottom: '1.5px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            flexShrink: 0,
          }}
        >
          {/* Left */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography sx={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.3px' }}>
              Chat
            </Typography>

            {activeDoc ? (
              <Chip
                label={`📄 ${activeDoc.filename}`}
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  maxWidth: 220,
                  background: 'linear-gradient(135deg, rgba(102,126,234,0.12), rgba(118,75,162,0.12))',
                  color: '#667eea',
                  border: '1.5px solid rgba(102,126,234,0.3)',
                  '& .MuiChip-label': { fontFamily: 'monospace' },
                }}
              />
            ) : (
              <Chip
                label="No document selected"
                size="small"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  color: '#bbb',
                  border: '1.5px solid #e0e0e0',
                  bgcolor: 'transparent',
                  '& .MuiChip-label': { fontFamily: 'monospace' },
                }}
              />
            )}

            {activeDoc && (
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e', boxShadow: '0 0 0 2px rgba(34,197,94,0.3)', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { boxShadow: '0 0 0 2px rgba(34,197,94,0.3)' }, '50%': { boxShadow: '0 0 0 5px rgba(34,197,94,0.1)' } } }} />
            )}
          </Box>

          {/* Right */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {messages.length > 0 && (
              <Tooltip title="Clear chat">
                <IconButton
                  size="small"
                  onClick={() => dispatch(clearMessages())}
                  sx={{
                    color: '#999',
                    '&:hover': { color: '#ef4444', transform: 'translateY(-3px)', bgcolor: 'rgba(239,68,68,0.08)' },
                    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  }}
                >
                  <DeleteSweep fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton
                size="small"
                onClick={toggleTheme}
                sx={{
                  width: 36, height: 36,
                  background: 'linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1))',
                  border: '1.5px solid rgba(102,126,234,0.25)',
                  color: '#667eea',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102,126,234,0.18), rgba(118,75,162,0.18))',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 16px rgba(102,126,234,0.2)',
                  },
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                {mode === 'dark'
                  ? <LightMode fontSize="small" />
                  : <DarkMode fontSize="small" />
                }
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <ChatWindow />
      </Box>
    </Box>
  );
}
