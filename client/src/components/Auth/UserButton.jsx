import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function UserButton({ onAuthOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function closeOnOutside(event) {
      if (buttonRef.current?.contains(event.target)) return;
      if (menuRef.current?.contains(event.target)) return;
      setOpen(false);
    }

    window.addEventListener('pointerdown', closeOnOutside);
    return () => window.removeEventListener('pointerdown', closeOnOutside);
  }, [open]);

  if (!user) {
    return (
      <button type="button" className="ui-pill" onClick={onAuthOpen}>
        登录
      </button>
    );
  }

  const menu = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          className="fixed right-6 top-20 z-[55] w-40 rounded-[18px] border border-white/60 bg-[rgba(255,249,241,.9)] p-2 shadow-[0_18px_50px_rgba(93,70,49,.16)] backdrop-blur-2xl"
          initial={{ opacity: 0, x: 12, filter: 'blur(3px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: 12, filter: 'blur(3px)' }}
          transition={{ duration: 0.28, ease: [0.25, 0.1, 0.1, 1] }}
        >
          {user.role === 'admin' && (
            <button
              type="button"
              className="mb-1 w-full rounded-xl px-3 py-2 text-left text-sm text-[var(--ink)] hover:bg-white/42"
              onClick={() => {
                setOpen(false);
                navigate('/admin');
              }}
            >
              管理后台
            </button>
          )}
          <button
            type="button"
            className="w-full rounded-xl px-3 py-2 text-left text-sm text-[var(--ink)] hover:bg-white/42"
            onClick={() => {
              logout();
              setOpen(false);
            }}
          >
            退出登录
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={`ui-pill max-w-[136px] overflow-hidden text-ellipsis ${open ? 'active' : ''}`}
        onClick={() => setOpen((value) => !value)}
        title={user.username}
      >
        {user.username}
      </button>
      {createPortal(menu, document.body)}
    </>
  );
}
