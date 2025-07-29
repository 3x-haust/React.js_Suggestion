import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMirimOAuth } from 'mirim-oauth-react';
import { Button } from '../components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Container, Flex } from '../components/Layout';

const LoginWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}15 0%, 
    ${({ theme }) => theme.colors.primaryHover}10 50%, 
    ${({ theme }) => theme.colors.background} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 25% 25%, ${({ theme }) => theme.colors.primary}15 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, ${({ theme }) => theme.colors.primaryHover}10 0%, transparent 50%);
    pointer-events: none;
  }
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 440px;
  margin: 0;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 100%;
    margin: ${({ theme }) => theme.spacing.md};
  }
`;

const Title = styled.h1`
  text-align: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: 800;
  letter-spacing: -0.05em;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.7;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryLight}15, ${({ theme }) => theme.colors.primaryLight}08);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.primaryLight}30;
  position: relative;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '🔐';
    display: block;
    font-size: ${({ theme }) => theme.fontSizes['2xl']};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
    border-radius: ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl} 0 0;
  }
`;

const AdminLink = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.primary}, transparent);
  }
`;

const AdminLinkText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-weight: 500;
`;

export const LoginPage: React.FC = () => {
  const { logIn, isLoading, isLoggedIn, currentUser } = useMirimOAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      console.log('이미 로그인된 상태, 관리자 페이지로 리다이렉트');
      navigate('/admin');
    }
  }, [isLoggedIn, currentUser, navigate]);

  const handleOAuthLogin = async () => {    
    console.log('OAuth 로그인 시도 시작');
    try {
      const user = await logIn();
      console.log('OAuth 로그인 성공:', user);
      // navigate('/admin');
    } catch (error) {
      console.error('OAuth 로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <LoginWrapper>
      <Container>
        <Flex justify="center">
          <LoginCard>
            <Title>실시간 건의함</Title>
            
            <CardHeader>
              <CardTitle>관리자 로그인</CardTitle>
            </CardHeader>
            
            <CardContent>
              <InfoText>
                학생회 관계자만 로그인하여 건의사항을 확인할 수 있습니다.
              </InfoText>
              
              <Button 
                fullWidth 
                onClick={() => {handleOAuthLogin()}}
                disabled={isLoading}
                style={{ marginBottom: '1rem' }}
              >
                {isLoading ? '로그인 중...' : '미림마고 계정으로 로그인'}
              </Button>
              
              <AdminLink>
                <AdminLinkText>
                  일반 사용자이신가요?
                </AdminLinkText>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = '/'}
                >
                  건의사항 제출하기
                </Button>
              </AdminLink>
            </CardContent>
          </LoginCard>
        </Flex>
      </Container>
    </LoginWrapper>
  );
};
