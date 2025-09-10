import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectError, selectHasError, clearError } from '../../store/errorSlice';
import './ErrorNotification.css';

const ErrorNotification = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const hasError = useSelector(selectHasError);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (hasError) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [hasError, dispatch]);

  const handleClose = () => {
    dispatch(clearError());
  };

  if (!hasError || !error) {
    return null;
  }

  return (
    <div className="error-notification">
      <div className="error-notification-content">
        <div className="error-notification-icon">
          ⚠️
        </div>
        <div className="error-notification-message">
          {error}
        </div>
        <button 
          className="error-notification-close"
          onClick={handleClose}
          aria-label="Close error notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ErrorNotification;
