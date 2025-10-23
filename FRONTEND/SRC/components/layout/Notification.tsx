import React from 'react';
import styles from './Notification.module.css';

type NotificationType = 'success' | 'error' | 'info';

interface NotificationProps {
  message: string;
  type?: NotificationType | undefined; // explicitly allow undefined
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  onClose,
}) => {
  return (
    <div
      className={`${styles.notification} ${styles[type]}`}
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Notification;