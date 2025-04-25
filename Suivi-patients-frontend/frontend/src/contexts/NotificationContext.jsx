import { createContext, useContext, useState, useCallback } from 'react';

// Types de notifications
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Création du contexte
const NotificationContext = createContext({
  notifications: [],
  showNotification: () => {},
  hideNotification: () => {},
  clearNotifications: () => {},
});

// Durée par défaut d'affichage d'une notification (en ms)
const DEFAULT_NOTIFICATION_DURATION = 5000;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Fonction pour afficher une nouvelle notification
  const showNotification = useCallback(({
    type = NOTIFICATION_TYPES.INFO,
    message,
    title,
    duration = DEFAULT_NOTIFICATION_DURATION,
    persistent = false,
  }) => {
    const id = Date.now().toString();
    
    setNotifications(prevNotifications => [
      ...prevNotifications,
      {
        id,
        type,
        message,
        title,
        persistent,
      },
    ]);

    // Si la notification n'est pas persistante, on la supprime après la durée spécifiée
    if (!persistent && duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, duration);
    }

    return id;
  }, []);

  // Fonction pour masquer une notification par son ID
  const hideNotification = useCallback((id) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  }, []);

  // Fonction pour supprimer toutes les notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Fonctions utilitaires pour chaque type de notification
  const success = useCallback((message, options = {}) => {
    return showNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message,
      ...options,
    });
  }, [showNotification]);

  const error = useCallback((message, options = {}) => {
    return showNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message,
      ...options,
    });
  }, [showNotification]);

  const warning = useCallback((message, options = {}) => {
    return showNotification({
      type: NOTIFICATION_TYPES.WARNING,
      message,
      ...options,
    });
  }, [showNotification]);

  const info = useCallback((message, options = {}) => {
    return showNotification({
      type: NOTIFICATION_TYPES.INFO,
      message,
      ...options,
    });
  }, [showNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        hideNotification,
        clearNotifications,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification doit être utilisé dans un NotificationProvider');
  }
  
  return context;
};

export default NotificationContext;