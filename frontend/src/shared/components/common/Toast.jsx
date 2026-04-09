import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faCircleXmark,
  faTriangleExclamation,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import './Toast.scss';

export const Toast = ({
  id,
  message,
  type = 'success',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type} toast-enter`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'success' && <FontAwesomeIcon icon={faCheckCircle} />}
          {type === 'error' && <FontAwesomeIcon icon={faCircleXmark} />}
          {type === 'warning' && (
            <FontAwesomeIcon icon={faTriangleExclamation} />
          )}
          {type === 'info' && <FontAwesomeIcon icon={faInfoCircle} />}
        </span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
