import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconCheck, IconAlertTriangle, IconX } from '../../../components/Icons';
import { cn } from '../../utils/cn';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastVariants = {
  success: 'bg-success-900/90 border-success-500/50 text-success-50',
  error: 'bg-error-900/90 border-error-500/50 text-error-50',
  warning: 'bg-warning-900/90 border-warning-500/50 text-warning-50',
  info: 'bg-primary-900/90 border-primary-500/50 text-primary-50',
};

const iconMap = {
  success: IconCheck,
  error: IconX,
  warning: IconAlertTriangle,
  info: IconCheck,
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  description,
  onClose,
}) => {
  const Icon = iconMap[type];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        'relative flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg max-w-sm',
        toastVariants[type]
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        {description && (
          <p className="mt-1 text-sm opacity-90">{description}</p>
        )}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors"
        aria-label="Close notification"
      >
        <IconX className="w-4 h-4" />
      </button>
    </motion.div>
  );
};