import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.sans};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left ${({ theme }) => theme.transitions.normal};
  }

  &:hover::before {
    left: 100%;
  }
  
  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.fontSizes.sm};
          min-height: 2.25rem;
        `;
      case 'lg':
        return `
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.fontSizes.lg};
          min-height: 3rem;
        `;
      default:
        return `
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.fontSizes.base};
          min-height: 2.5rem;
        `;
    }
  }}

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return `
          background: linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.secondaryHover});
          color: white;
          box-shadow: 0 4px 12px ${theme.colors.shadowMedium};
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.secondaryHover}, ${theme.colors.secondary});
            transform: translateY(-1px);
            box-shadow: 0 6px 20px ${theme.colors.shadowLarge};
          }
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 8px ${theme.colors.shadowMedium};
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, ${theme.colors.danger}, ${theme.colors.dangerHover});
          color: white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.dangerHover}, ${theme.colors.danger});
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover});
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(79, 70, 229, 0.3);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: ${theme.colors.text};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.surfaceHover};
            transform: translateY(-1px);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover});
          color: white;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, ${theme.colors.primaryHover}, ${theme.colors.primary});
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
          }
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
          }
        `;
    }
  }}

  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
    
    &::before {
      display: none;
    }
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;
