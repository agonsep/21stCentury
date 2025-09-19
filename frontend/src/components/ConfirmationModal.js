import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '⚠️',
          confirmBtnClass: 'confirm-btn danger',
          headerClass: 'modal-header danger'
        };
      case 'warning':
        return {
          icon: '⚠️',
          confirmBtnClass: 'confirm-btn warning',
          headerClass: 'modal-header warning'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          confirmBtnClass: 'confirm-btn info',
          headerClass: 'modal-header info'
        };
      default:
        return {
          icon: '❓',
          confirmBtnClass: 'confirm-btn',
          headerClass: 'modal-header'
        };
    }
  };

  const { icon, confirmBtnClass, headerClass } = getTypeStyles();

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={headerClass}>
          <div className="modal-icon">{icon}</div>
          <h3 className="modal-title">{title}</h3>
        </div>
        
        <div className="modal-body">
          <p>{message}</p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-btn" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={confirmBtnClass}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;