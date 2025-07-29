import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useThemeStore } from '../store/themeStore';
import { Button } from './Button';
import { Container, Flex } from './Layout';
import { useMirimOAuth } from 'mirim-oauth-react';

const HeaderWrapper = styled.header`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} 0;
  box-shadow: 0 2px 4px ${({ theme }) => theme.colors.shadow};
`;

const Logo = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  font-weight: 700;
`;

const LogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary : theme.colors.text};
  background-color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.surface : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
    text-decoration: none;
  }
`;

const UserInfo = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

export const Header: React.FC = () => {
  const { currentUser, logOut, isLoggedIn } = useMirimOAuth();
  const { isDark, toggleTheme } = useThemeStore();
  const location = useLocation();

  const ADMIN_NAMES = import.meta.env.VITE_ADMIN_NAMES?.split(',') || ['test1', 'test'];
  const isAdmin = ADMIN_NAMES.includes(currentUser?.nickname) || false;

  return (
    <HeaderWrapper>
      <Container>
        <Flex justify="space-between" align="center">
          <LogoLink to="/">
            <Logo>실시간 건의함</Logo>
          </LogoLink>
          
          <Flex align="center" gap="1rem">
            {isLoggedIn && (
              <Nav>
                <NavLink to="/" $isActive={location.pathname === '/'}>
                  건의제출
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" $isActive={location.pathname === '/admin'}>
                    관리자
                  </NavLink>
                )}
              </Nav>
            )}
            
            <ThemeToggle onClick={toggleTheme}>
              {isDark ? '☀️' : '🌙'}
            </ThemeToggle>
            
            {isLoggedIn ? (
              <>
                <UserInfo>
                  {currentUser?.nickname} {isAdmin && '(관리자)'}
                </UserInfo>
                <Button variant="outline" size="sm" onClick={logOut}>
                  로그아웃
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/login'}>
                로그인
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </HeaderWrapper>
  );
};
