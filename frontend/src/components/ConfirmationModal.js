import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const ConfirmationModal = ({ show, title = 'Conferma', message = 'Sei sicuro?', onConfirm = () => {}, onCancel = () => {}, confirmText = 'Conferma', cancelText = 'Annulla', confirmClass = 'btn-outline-danger', cancelClass = 'btn-outline-primary' }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    if (show) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [show, onCancel]);

  if (!show) return null;

  const modal = (
    <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.45)', zIndex:9999}} onClick={onCancel}>
      <div className="d-flex align-items-center justify-content-center" style={{height:'100%'}}>
        <div className="card" role="dialog" aria-modal="true" aria-label={title} onClick={e => e.stopPropagation()} style={{maxWidth:520, width:'90%', transform: 'scale(1)', animation: 'modalIn 180ms ease-out'}}>
          <style>{`@keyframes modalIn { from { transform: translateY(-8px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
            @keyframes overlayFade { from { opacity: 0 } to { opacity: 1 } }
          `}</style>
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{message}</p>
            <div className="d-flex justify-content-end">
              <button className={cancelClass} onClick={onCancel} style={{marginRight:8}}>{cancelText}</button>
              <button className={confirmClass} onClick={onConfirm}>{confirmText}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default ConfirmationModal;
