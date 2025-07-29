import React from 'react';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { Container, Flex } from '../components/Layout';

const NotFoundWrapper = styled.div`
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

const NotFoundCard = styled(Card)`
  width: 100%;
  max-width: 520px;
  margin: 0;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    max-width: 100%;
    margin: ${({ theme }) => theme.spacing.md};
  }
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.1em;
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 6rem;
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.xl};
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primaryLight}10, ${({ theme }) => theme.colors.primaryLight}05);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const IconWrapper = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.7;
  
  &::before {
    content: '🔍';
  }
`;

export const NotFoundPage: React.FC = () => {
  const goHome = () => {
    window.location.href = '/';
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <NotFoundWrapper>
      <Container>
        <Flex justify="center">
          <NotFoundCard>
            <CardContent>
              <IconWrapper />
              <ErrorCode>404</ErrorCode>
              <Title>페이지를 찾을 수 없습니다</Title>
              <Description>
                요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                <br />
                URL을 다시 확인해 주세요.
              </Description>
              
              <ButtonGroup>
                <Button onClick={goHome}>
                  홈으로 돌아가기
                </Button>
                <Button variant="outline" onClick={goBack}>
                  이전 페이지
                </Button>
              </ButtonGroup>
            </CardContent>
          </NotFoundCard>
        </Flex>
      </Container>
    </NotFoundWrapper>
  );
};
