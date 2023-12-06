import { useEffect } from 'react';
import { useState, useCallback } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log(isOpen);
      if (e.code === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keyup', handleKeyDown);
    }

    return () => document.removeEventListener('keyup', handleKeyDown);
  });

  return { handleOpen, handleClose, isOpen };
};

export default useModal;
