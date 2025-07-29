import React from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  confirmText?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContent = styled.div<{ $type: string }>`
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 25px -5px ${({ theme }) => theme.colors.shadowLarge},
              0 10px 10px -5px ${({ theme }) => theme.colors.shadowMedium};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $type, theme }) => {
      switch ($type) {
        case 'success':
          return `linear-gradient(90deg, ${theme.colors.success}, ${theme.colors.successHover})`;
        case 'error':
          return `linear-gradient(90deg, ${theme.colors.danger}, ${theme.colors.dangerHover})`;
        case 'warning':
          return `linear-gradient(90deg, ${theme.colors.warning}, ${theme.colors.warningHover})`;
        default:
          return `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryHover})`;
      }
    }};
    border-radius: ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl} 0 0;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ModalIcon = styled.div<{ $type: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin-right: ${({ theme }) => theme.spacing.lg};
  background: ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return theme.colors.success + '15';
      case 'error':
        return theme.colors.danger + '15';
      case 'warning':
        return theme.colors.warning + '15';
      default:
        return theme.colors.primary + '15';
    }
  }};
  
  &::before {
    content: '${({ $type }) => {
      switch ($type) {
        case 'success':
          return '✅';
        case 'error':
          return '❌';
        case 'warning':
          return '⚠️';
        default:
          return 'ℹ️';
      }
    }}';
  }
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
`;

const ModalBody = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = '확인',
  type = 'info',
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalOverlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContent $type={type}>
        {title && (
          <ModalHeader>
            <ModalIcon $type={type} />
            <ModalTitle>{title}</ModalTitle>
          </ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variant="primary">
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};
