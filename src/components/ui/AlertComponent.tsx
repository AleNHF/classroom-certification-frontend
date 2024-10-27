import { useState, useEffect } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type?: AlertType;
  message: string;
  className?: string;
  duration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
}

type AlertStyles = {
  wrapper: string;
  icon: string;
  text: string;
  closeButton: string;
}

/* type AlertStylesMap = {
  [K in AlertType]: AlertStyles;
} */

const Alert = ({
  type = 'info',
  message,
  className = '',
  duration,
  dismissible = true,
  onDismiss
}: AlertProps): JSX.Element => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  };

  //if (!isVisible) return null;

  const alertStyles = {
    success: {
      wrapper: 'bg-green-50 border-green-200',
      icon: 'bg-green-100 text-green-600',
      text: 'text-green-800',
      closeButton: 'hover:bg-green-100'
    },
    error: {
      wrapper: 'bg-red-50 border-red-200',
      icon: 'bg-red-100 text-red-600',
      text: 'text-red-800',
      closeButton: 'hover:bg-red-100'
    },
    warning: {
      wrapper: 'bg-yellow-50 border-yellow-200',
      icon: 'bg-yellow-100 text-yellow-600',
      text: 'text-yellow-800',
      closeButton: 'hover:bg-yellow-100'
    },
    info: {
      wrapper: 'bg-blue-50 border-blue-200',
      icon: 'bg-blue-100 text-blue-600',
      text: 'text-blue-800',
      closeButton: 'hover:bg-blue-100'
    }
  } as const;

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  } as const;

  const closeIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const currentStyles = alertStyles[type];
  const currentIcon = icons[type];

  return (
    <div
      role="alert"
      className={`
        relative flex items-center p-4 mb-4 border rounded-lg shadow-sm
        transition-all duration-300 ease-in-out
        ${currentStyles.wrapper}
        ${isLeaving ? 'opacity-0 -translate-y-2' : 'opacity-100'}
        ${className}
      `}
    >
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3
        ${currentStyles.icon}
      `}>
        {currentIcon}
      </div>

      <div className={`flex-1 text-sm font-medium ${currentStyles.text}`}>
        {message}
      </div>

      {dismissible && (
        <button
          onClick={handleDismiss}
          className={`
            ml-4 p-1.5 rounded-lg opacity-75 hover:opacity-100
            transition-colors duration-200 focus:outline-none focus:ring-2
            ${currentStyles.closeButton}
          `}
          aria-label="Cerrar alerta"
        >
          {closeIcon}
        </button>
      )}
    </div>
  );
};

export default Alert;