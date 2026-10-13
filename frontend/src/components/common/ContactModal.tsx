import React, { useEffect } from 'react';
import { ContactForm } from './ContactForm';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultNeed?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultNeed,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 my-8 max-w-xl w-full">
        <ContactForm onClose={onClose} defaultNeed={defaultNeed} />
      </div>
    </div>
  );
};

export default ContactModal;
