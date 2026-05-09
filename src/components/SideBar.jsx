import React, { useRef } from 'react';
import {
  Box, Typography, Button, List, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Avatar,
  Tooltip, LinearProgress, Divider
} from '@mui/material';
import { PictureAsPdf, Delete, CloudUpload, Logout, SmartToy } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { uploadDocument, deleteDocument, setActiveDoc } from '../store/slices/documentSlice';
import { logout } from '../store/slices/authSlice';
import { clearMessages } from '../store/slices/chatSlice';
import { useNavigate } from 'react-router-dom';

/* ── Google Fonts injection — Sans-Serif only ── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';
if (!document.querySelector('link[href*="Plus+Jakarta+Sans"]')) {
  document.head.appendChild(fontLink);
}

const FONT_DISPLAY = "'Outfit', sans-serif";
const FONT_BODY    = "'Plus Jakarta Sans', sans-serif";
const FONT_MONO    = "'IBM Plex Mono', monospace";

/* ── Same color palette as ChatWindow ── */
const C = {
  bg:         '#0b0c14',
  surface:    '#13141f',
  panel:      '#1a1b2e',
  border:     'rgba(99,102,241,0.18)',
  borderHov:  'rgba(99,102,241,0.45)',
  accent:     '#6366f1',
  accentSoft: 'rgba(99,102,241,0.12)',
  accentGlow: 'rgba(99,102,241,0.28)',
  ai:         '#10b981',
  aiSoft:     'rgba(16,185,129,0.12)',
  textPri:    '#f1f2f9',
  textSec:    '#8b8fa8',
  textMuted:  '#4f5168',
  userBubble: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',
  danger:     '#ef4444',
  dangerSoft: 'rgba(239,68,68,0.1)',
};

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef();
  const { list, activeDoc, uploading } = useSelector((s) => s.documents);
  const { user } = useSelector((s) => s.auth);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) dispatch(uploadDocument(file));
    e.target.value = '';
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteDocument(id));
  };

  const handleSelectDoc = (doc) => {
    dispatch(setActiveDoc(doc));
    dispatch(clearMessages());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <Box
      sx={{
        width: 285,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${C.border}`,
        background: C.surface,
        flexShrink: 0,
        fontFamily: FONT_BODY,
      }}
    >

      {/* ── LOGO ── */}
      <Box
        sx={{
          p: 2.5,
          background: C.panel,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40, height: 40,
              borderRadius: '10px',
              background: C.accentSoft,
              border: `1.5px solid ${C.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 18px ${C.accentGlow}`,
            }}
          >
            <SmartToy sx={{ color: C.accent, fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: '1.1rem',
                color: C.textPri,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              RAG Q&A
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_BODY,
                fontSize: '0.68rem',
                fontWeight: 500,
                color: C.textMuted,
                letterSpacing: '0.04em',
              }}
            >
              Document Intelligence
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── UPLOAD ── */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <input
          type="file"
          accept=".pdf"
          ref={fileRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Button
          fullWidth
          startIcon={<CloudUpload sx={{ fontSize: 18 }} />}
          onClick={() => fileRef.current.click()}
          disabled={uploading}
          sx={{
            py: 1.3,
            borderRadius: '10px',
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: '0.88rem',
            letterSpacing: '0.01em',
            background: uploading
              ? C.panel
              : `linear-gradient(135deg, ${C.accent} 0%, #8b5cf6 100%)`,
            color: uploading ? C.textMuted : '#fff',
            border: uploading ? `1px solid ${C.border}` : 'none',
            transition: 'all 0.22s ease',
            '&:hover': {
              background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)',
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 22px ${C.accentGlow}`,
            },
            '&:active': { transform: 'translateY(0)' },
            '&.Mui-disabled': {
              background: C.panel,
              color: C.textMuted,
            },
          }}
        >
          {uploading ? 'Processing PDF...' : 'Upload PDF'}
        </Button>

        {uploading && (
          <LinearProgress
            sx={{
              mt: 1.5,
              borderRadius: 2,
              height: 4,
              bgcolor: C.panel,
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${C.accent}, #8b5cf6)`,
                borderRadius: 2,
              },
            }}
          />
        )}
      </Box>

      {/* ── DOC LIST ── */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1.5,
        '&::-webkit-scrollbar': { width: '3px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: C.accent, borderRadius: '2px' },
      }}>
        <Typography
          sx={{
            fontSize: '0.65rem',
            fontFamily: FONT_BODY,
            fontWeight: 600,
            color: C.textMuted,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            px: 1,
            display: 'block',
            mb: 1.5,
          }}
        >
          My Documents ({list.length})
        </Typography>

        {list.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 5, px: 2,
              border: `1.5px dashed ${C.border}`,
              borderRadius: '12px',
              mt: 1,
              background: C.panel,
            }}
          >
            <Box sx={{ fontSize: 40, mb: 1 }}>📁</Box>
            <Typography
              sx={{
                fontFamily: FONT_BODY,
                fontWeight: 600,
                fontSize: '0.85rem',
                color: C.textSec,
                mb: 0.5,
              }}
            >
              No documents yet
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT_BODY,
                fontSize: '0.75rem',
                fontWeight: 400,
                color: C.textMuted,
              }}
            >
              Upload a PDF to get started
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {list.map((doc) => {
              const isActive = activeDoc?.id === doc.id;
              return (
                <ListItemButton
                  key={doc.id}
                  onClick={() => handleSelectDoc(doc)}
                  sx={{
                    borderRadius: '10px',
                    mb: 0.8,
                    border: `1px solid`,
                    borderColor: isActive ? C.accent : 'transparent',
                    background: isActive ? C.accentSoft : 'transparent',
                    transition: 'all 0.22s ease',
                    '&:hover': {
                      background: C.accentSoft,
                      borderColor: C.accent,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 14px ${C.accentGlow}`,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 34 }}>
                    <PictureAsPdf
                      fontSize="small"
                      sx={{ color: isActive ? C.accent : C.textMuted, fontSize: 18 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontFamily: FONT_BODY,
                          fontSize: '0.82rem',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? C.accent : C.textPri,
                          letterSpacing: '0.01em',
                        }}
                        noWrap
                      >
                        {doc.filename}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        sx={{
                          fontFamily: FONT_BODY,
                          fontSize: '0.68rem',
                          fontWeight: 400,
                          color: isActive ? '#a5b4fc' : C.textMuted,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {doc.chunkCount || 0} chunks
                      </Typography>
                    }
                  />
                  <Tooltip title="Delete" placement="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleDelete(e, doc.id)}
                      sx={{
                        opacity: 0,
                        width: 26, height: 26,
                        '.MuiListItemButton-root:hover &': { opacity: 1 },
                        color: C.textMuted,
                        transition: 'all 0.2s',
                        '&:hover': {
                          color: C.danger,
                          transform: 'scale(1.15)',
                          bgcolor: C.dangerSoft,
                        },
                      }}
                    >
                      <Delete sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Box>

      {/* ── DIVIDER ── */}
      <Divider sx={{ borderColor: C.border }} />

      {/* ── USER FOOTER ── */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          background: C.panel,
        }}
      >
        <Avatar
          sx={{
            width: 36, height: 36,
            flexShrink: 0,
            fontFamily: FONT_BODY,
            fontWeight: 700,
            fontSize: '0.82rem',
            background: C.userBubble,
            color: '#fff',
            border: `1.5px solid rgba(139,92,246,0.35)`,
            boxShadow: `0 0 12px ${C.accentGlow}`,
          }}
        >
          {initials}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: '0.85rem',
              color: C.textPri,
              letterSpacing: '0.01em',
            }}
            noWrap
          >
            {user?.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONT_BODY,
              fontSize: '0.7rem',
              fontWeight: 400,
              color: C.textMuted,
              letterSpacing: '0.02em',
            }}
            noWrap
          >
            {user?.email}
          </Typography>
        </Box>

        <Tooltip title="Logout" placement="top">
          <IconButton
            size="small"
            onClick={handleLogout}
            sx={{
              color: C.textMuted,
              transition: 'all 0.22s ease',
              '&:hover': {
                color: C.danger,
                transform: 'translateY(-2px)',
                bgcolor: C.dangerSoft,
              },
            }}
          >
            <Logout fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}