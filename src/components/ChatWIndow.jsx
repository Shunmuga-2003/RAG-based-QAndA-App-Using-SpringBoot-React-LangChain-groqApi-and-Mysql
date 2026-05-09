import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Typography, IconButton, Chip, Avatar, Tooltip, Fade, Paper
} from '@mui/material';
import { Send, ContentCopy, Done, SmartToy, QuestionAnswer } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../store/slices/chatSlice';
import ReactMarkdown from 'react-markdown';

/* ── Google Fonts injection — Sans-Serif only ── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap';
document.head.appendChild(fontLink);

const FONT_DISPLAY = "'Outfit', sans-serif";
const FONT_BODY    = "'Plus Jakarta Sans', sans-serif";
const FONT_MONO    = "'IBM Plex Mono', monospace";

const SUGGESTIONS = [
  '📋 What is this document about?',
  '✨ Summarize the key points',
  '🎯 What are the main conclusions?',
  '📌 List the important details',
  '💡 What problems does this solve?',
];

/* ── Same color palette ── */
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
  aiGlow:     'rgba(16,185,129,0.25)',
  textPri:    '#f1f2f9',
  textSec:    '#8b8fa8',
  textMuted:  '#4f5168',
  userBubble: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)',
};

/* ── Typing dots ── */
function TypingIndicator() {
  return (
    <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', py: 0.5, px: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 7, height: 7, borderRadius: '50%',
            background: C.ai,
            animation: 'tdot 1.3s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
            '@keyframes tdot': {
              '0%,60%,100%': { transform: 'translateY(0)', opacity: 0.3 },
              '30%': { transform: 'translateY(-8px)', opacity: 1 },
            },
          }}
        />
      ))}
    </Box>
  );
}

/* ── Single message ── */
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Fade in timeout={400}>
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mb: 3,
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            width: 34, height: 34, flexShrink: 0,
            fontSize: '0.78rem',
            fontFamily: FONT_BODY,
            fontWeight: 700,
            background: isUser ? C.userBubble : C.aiSoft,
            color: isUser ? '#fff' : C.ai,
            border: `1.5px solid ${isUser ? 'rgba(139,92,246,0.4)' : 'rgba(16,185,129,0.3)'}`,
            boxShadow: isUser
              ? `0 0 14px ${C.accentGlow}`
              : `0 0 14px ${C.aiGlow}`,
          }}
        >
          {isUser ? 'U' : <SmartToy sx={{ fontSize: 16 }} />}
        </Avatar>

        {/* Bubble */}
        <Box
          sx={{
            maxWidth: '74%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isUser ? 'flex-end' : 'flex-start',
            gap: 0.5,
          }}
        >
          {/* Role label */}
          <Typography
            sx={{
              fontSize: '0.68rem',
              fontFamily: FONT_BODY,
              fontWeight: 600,
              color: isUser ? C.accent : C.ai,
              letterSpacing: '0.1em',
              px: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {isUser ? 'You' : 'RAG Assistant'}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              px: 2.2, py: 1.6,
              position: 'relative',
              borderRadius: isUser
                ? '16px 16px 4px 16px'
                : '16px 16px 16px 4px',
              background: isUser ? C.userBubble : C.panel,
              border: `1px solid ${isUser ? 'rgba(139,92,246,0.35)' : C.border}`,
              color: isUser ? '#fff' : C.textPri,
              boxShadow: isUser
                ? `0 8px 24px ${C.accentGlow}`
                : `0 4px 16px rgba(0,0,0,0.3)`,
              transition: 'box-shadow 0.2s',
              '&:hover': {
                boxShadow: isUser
                  ? `0 10px 32px rgba(99,102,241,0.4)`
                  : `0 6px 22px rgba(0,0,0,0.4)`,
              },
              '&:hover .copy-btn': { opacity: 1 },
            }}
          >
            {isUser ? (
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  fontFamily: FONT_BODY,
                  fontWeight: 400,
                  lineHeight: 1.75,
                  color: '#fff',
                  letterSpacing: '0.01em',
                }}
              >
                {msg.content}
              </Typography>
            ) : (
              <Box
                sx={{
                  fontSize: '0.9rem',
                  fontFamily: FONT_BODY,
                  fontWeight: 400,
                  lineHeight: 1.85,
                  color: C.textPri,
                  letterSpacing: '0.01em',
                  '& p': { m: 0, mb: 1 },
                  '& p:last-child': { mb: 0 },
                  '& code': {
                    fontFamily: FONT_MONO,
                    fontSize: '0.8rem',
                    background: 'rgba(99,102,241,0.15)',
                    px: 0.8, py: 0.2,
                    borderRadius: '4px',
                    color: '#a5b4fc',
                    fontWeight: 500,
                    border: '1px solid rgba(99,102,241,0.2)',
                  },
                  '& pre': {
                    background: '#0d0e1a',
                    border: `1px solid ${C.border}`,
                    borderRadius: '8px',
                    p: 1.5,
                    overflowX: 'auto',
                    '& code': { background: 'transparent', border: 'none', p: 0 },
                  },
                  '& ul, & ol': { pl: 2.5, mb: 1 },
                  '& li': { mb: 0.4, fontWeight: 400 },
                  '& strong': {
                    fontWeight: 600,
                    color: '#a5b4fc',
                    fontFamily: FONT_BODY,
                  },
                  '& h1,& h2,& h3': {
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    color: C.textPri,
                    mb: 0.5,
                    letterSpacing: '-0.01em',
                  },
                  '& blockquote': {
                    borderLeft: `3px solid ${C.accent}`,
                    pl: 1.5,
                    ml: 0,
                    color: C.textSec,
                    fontStyle: 'normal',
                    fontWeight: 300,
                  },
                }}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </Box>
            )}

            {/* Copy button */}
            {!isUser && (
              <Tooltip title={copied ? 'Copied!' : 'Copy response'} placement="top">
                <IconButton
                  className="copy-btn"
                  size="small"
                  onClick={handleCopy}
                  sx={{
                    position: 'absolute', top: 8, right: 8,
                    opacity: 0,
                    transition: 'opacity 0.2s, transform 0.2s',
                    width: 26, height: 26,
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    '&:hover': {
                      background: C.accentSoft,
                      borderColor: C.accent,
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {copied
                    ? <Done sx={{ fontSize: 12, color: C.ai }} />
                    : <ContentCopy sx={{ fontSize: 12, color: C.accent }} />}
                </IconButton>
              </Tooltip>
            )}
          </Paper>

          {/* Timestamp */}
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontFamily: FONT_BODY,
              fontWeight: 400,
              color: C.textMuted,
              px: 0.5,
              letterSpacing: '0.03em',
            }}
          >
            {msg.time}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
}

/* ── Main component ── */
export default function ChatWindow() {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((s) => s.chat);
  const { activeDoc } = useSelector((s) => s.documents);
  const [input, setInput] = useState('');
  const bottomRef = useRef();
  const inputRef  = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    const q = input.trim();
    if (!q || loading || !activeDoc) return;
    dispatch(sendMessage(q));
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: C.bg,
        fontFamily: FONT_BODY,
      }}
    >
      {/* ── MESSAGES AREA ── */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 2, md: 3.5 },
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': { width: '3px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: C.accent,
            borderRadius: '2px',
          },
        }}
      >
        {/* ── Empty state ── */}
        {messages.length === 0 && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              py: 6,
            }}
          >
            {/* Icon orb */}
            <Box
              sx={{
                width: 96, height: 96,
                borderRadius: '24px',
                background: C.panel,
                border: `1.5px solid ${C.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 40px ${C.accentGlow}, inset 0 0 20px rgba(99,102,241,0.05)`,
                animation: 'floatOrb 4s ease-in-out infinite',
                '@keyframes floatOrb': {
                  '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
                  '50%':     { transform: 'translateY(-14px) rotate(3deg)' },
                },
              }}
            >
              <QuestionAnswer sx={{ fontSize: 44, color: C.accent }} />
            </Box>

            <Box sx={{ textAlign: 'center', px: 2 }}>
              <Typography
                sx={{
                  fontSize: '2rem',
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  mb: 0.8,
                  color: C.textPri,
                  lineHeight: 1.15,
                }}
              >
                {activeDoc ? 'Ask anything' : 'Select a document'}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.85rem',
                  fontFamily: FONT_BODY,
                  fontWeight: 400,
                  color: C.textMuted,
                  letterSpacing: '0.02em',
                }}
              >
                {activeDoc
                  ? `Querying: ${activeDoc.filename}`
                  : 'Upload a PDF from the sidebar to begin'}
              </Typography>
            </Box>

            {/* Suggestion chips */}
            {activeDoc && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: 'center',
                  maxWidth: 540,
                  mt: 0.5,
                }}
              >
                {SUGGESTIONS.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    variant="outlined"
                    onClick={() => {
                      setInput(s.replace(/^[^\s]+\s/, ''));
                      inputRef.current?.focus();
                    }}
                    sx={{
                      fontFamily: FONT_BODY,
                      fontWeight: 500,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      borderColor: C.border,
                      color: C.textSec,
                      background: C.panel,
                      letterSpacing: '0.01em',
                      transition: 'all 0.22s ease',
                      '&:hover': {
                        background: C.accentSoft,
                        borderColor: C.accent,
                        color: '#a5b4fc',
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 18px ${C.accentGlow}`,
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* ── Message list ── */}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {/* ── Typing indicator ── */}
        {loading && (
          <Fade in timeout={200}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 2.5 }}>
              <Avatar
                sx={{
                  width: 34, height: 34,
                  background: C.aiSoft,
                  color: C.ai,
                  border: '1.5px solid rgba(16,185,129,0.3)',
                  boxShadow: `0 0 14px ${C.aiGlow}`,
                }}
              >
                <SmartToy sx={{ fontSize: 16 }} />
              </Avatar>
              <Paper
                elevation={0}
                sx={{
                  px: 2, py: 1.5,
                  borderRadius: '16px 16px 16px 4px',
                  background: C.panel,
                  border: `1px solid ${C.border}`,
                }}
              >
                <TypingIndicator />
              </Paper>
            </Box>
          </Fade>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* ── INPUT AREA ── */}
      <Box
        sx={{
          p: 2.5,
          borderTop: `1px solid ${C.border}`,
          background: C.surface,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-end',
            background: C.panel,
            border: `1.5px solid ${C.border}`,
            borderRadius: '14px',
            p: '10px 10px 10px 16px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&:focus-within': {
              borderColor: C.accent,
              boxShadow: `0 0 0 3px ${C.accentGlow}`,
            },
          }}
        >
          <Box
            component="textarea"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeDoc
                ? 'Ask a question about your document...'
                : 'Select a document first...'
            }
            disabled={!activeDoc || loading}
            rows={1}
            sx={{
              flex: 1,
              border: 'none',
              outline: 'none',
              resize: 'none',
              background: 'transparent',
              fontFamily: FONT_BODY,
              fontSize: '0.9rem',
              fontWeight: 400,
              lineHeight: 1.7,
              letterSpacing: '0.01em',
              color: C.textPri,
              p: 0,
              maxHeight: 130,
              overflowY: 'auto',
              caretColor: C.accent,
              '&::placeholder': {
                color: C.textMuted,
                fontFamily: FONT_BODY,
                fontWeight: 400,
              },
              '&:disabled': { cursor: 'not-allowed', opacity: 0.35 },
              '&::-webkit-scrollbar': { width: '2px' },
              '&::-webkit-scrollbar-thumb': { background: C.accent },
            }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 130) + 'px';
            }}
          />

          <Tooltip title="Send (Enter)" placement="top">
            <span>
              <IconButton
                onClick={handleSend}
                disabled={!input.trim() || !activeDoc || loading}
                sx={{
                  width: 40, height: 40,
                  background: `linear-gradient(135deg, ${C.accent} 0%, #8b5cf6 100%)`,
                  color: '#fff',
                  borderRadius: '10px',
                  flexShrink: 0,
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
                    border: `1px solid ${C.border}`,
                  },
                }}
              >
                <Send sx={{ fontSize: 17 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Footer hint */}
        <Typography
          sx={{
            fontSize: '0.68rem',
            fontFamily: FONT_BODY,
            fontWeight: 400,
            color: C.textMuted,
            textAlign: 'center',
            mt: 1.2,
            letterSpacing: '0.04em',
          }}
        >
          Enter to send · Shift+Enter for new line
        </Typography>
      </Box>
    </Box>
  );
}