import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../store/toast';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
        maxWidth: '420px',
      }}
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          const bgColor = isSuccess
            ? 'linear-gradient(135deg, #0b7a4b, #075232)'
            : isError
            ? 'linear-gradient(135deg, #dc2626, #991b1b)'
            : isWarning
            ? 'linear-gradient(135deg, #d97706, #92400e)'
            : 'linear-gradient(135deg, #0b2545, #081a30)';

          const Icon = isSuccess
            ? CheckCircle2
            : isError
            ? AlertCircle
            : isWarning
            ? AlertTriangle
            : Info;

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              style={{
                background: bgColor,
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '14px',
                boxShadow: '0 12px 35px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                pointerEvents: 'auto',
                fontSize: '13px',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} />
              </div>

              <div style={{ flex: 1, lineHeight: 1.35 }}>{t.message}</div>

              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'transparent',
                  border: 0,
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}