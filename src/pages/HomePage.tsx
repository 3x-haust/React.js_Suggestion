import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSuggestionStore } from '../store/suggestionStore';
import { Button } from '../components/Button';
import { Input, Textarea, FormGroup, Label } from '../components/Form';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Container } from '../components/Layout';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';
import { useMirimOAuth } from 'mirim-oauth-react';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  background-image: 
    radial-gradient(circle at 25% 25%, ${({ theme }) => theme.colors.primary}08 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, ${({ theme }) => theme.colors.primaryHover}08 0%, transparent 50%);
  display: flex;
  flex-direction: column;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}03, ${({ theme }) => theme.colors.primaryHover}03);
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing['2xl']} 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CharCount = styled.div`
  text-align: right;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-weight: 500;
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

const AdminLinkWrapper = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const AdminLink = styled.div`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.primary}, transparent);
  }
`;

const AdminLinkText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin: 0;
  font-weight: 500;
`;

const MainCard = styled(Card)`
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  }
`;

export const HomePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { addSuggestion, refreshSuggestions } = useSuggestionStore();
  const { currentUser, accessToken } = useMirimOAuth();

  useEffect(() => {
    if (currentUser?.nickname) {
      refreshSuggestions(currentUser.nickname, accessToken);
    }
  }, [refreshSuggestions, currentUser?.nickname, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const fullContent = `제목: ${title.trim()}\n\n${content.trim()}`;
    await addSuggestion(fullContent);

    setTitle('');
    setContent('');
    setShowModal(true);
  };

  return (
    <PageWrapper>
      <Header />
      <Container>
        <MainContent>
          <MainCard>
            <CardHeader>
              <CardTitle>건의사항 제출</CardTitle>
            </CardHeader>
            <CardContent>
              <InfoText>
                학교생활에서 개선이 필요한 부분이나 새로운 아이디어가 있다면 언제든지 제출해주세요!
                <br />
                제출된 모든 건의사항은 익명으로 처리됩니다.
              </InfoText>
              
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="건의사항 제목을 입력해주세요"
                    maxLength={100}
                    required
                  />
                  <CharCount>{title.length}/100</CharCount>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="content">내용</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="구체적인 건의 내용을 작성해주세요"
                    rows={8}
                    maxLength={1000}
                    required
                  />
                  <CharCount>{content.length}/1000</CharCount>
                </FormGroup>

                <Button 
                  type="submit" 
                  disabled={!title.trim() || !content.trim()}
                  style={{ width: '100%' }}
                >
                  건의사항 제출하기
                </Button>
              </form>
            </CardContent>
          </MainCard>

          <AdminLinkWrapper to="/admin">
            <AdminLink>
              <AdminLinkText>
                🔒 관리자 페이지
              </AdminLinkText>
            </AdminLink>
          </AdminLinkWrapper>
        </MainContent>
      </Container>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        type="success"
        title="제출 완료!"
      >
        건의사항이 성공적으로 제출되었습니다.
      </Modal>
    </PageWrapper>
  );
};
