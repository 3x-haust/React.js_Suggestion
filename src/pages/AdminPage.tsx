import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSuggestionStore } from '../store/suggestionStore';
import { Button } from '../components/Button';
import { Card, CardContent, CardFooter } from '../components/Card';
import { Container, Flex } from '../components/Layout';
import { Header } from '../components/Header';
import type { Suggestion } from '../types';
import { FileStorage } from '../utils/fileStorage';
import { useMirimOAuth } from 'mirim-oauth-react';

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const StatsCard = styled(Card)`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const SuggestionCard = styled(Card)<{ isRead: boolean }>`
  opacity: ${({ isRead }) => isRead ? 0.7 : 1};
  border-left: 4px solid ${({ isRead, theme }) => 
    isRead ? theme.colors.success : theme.colors.primary};
`;

const SuggestionContent = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SuggestionMeta = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AccessDenied = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.danger};
`;

type FilterType = 'all' | 'unread' | 'read';

export const AdminPage: React.FC = () => {
  const { currentUser, accessToken } = useMirimOAuth();
  const { suggestions, markAsRead, deleteSuggestion, refreshSuggestions } = useSuggestionStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const ADMIN_NAMES = import.meta.env.VITE_ADMIN_NAMES?.split(',') || ['test1', 'test'];
  const isAdmin = ADMIN_NAMES.includes(currentUser?.nickname) || false;

  useEffect(() => {
    if (currentUser?.nickname) {
      refreshSuggestions(currentUser.nickname, accessToken);
    }
  }, [refreshSuggestions, currentUser?.nickname, accessToken]);

  if (!currentUser) {
    window.location.href = '/login';
    return null;
  }

  if (!isAdmin) {
    return (
      <PageWrapper>
        <Header />
        <MainContent>
          <Container>
            <AccessDenied>
              <h2>접근 권한이 없습니다</h2>
              <p>관리자만 이 페이지에 접근할 수 있습니다.</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                style={{ marginTop: '1rem' }}
              >
                홈으로 돌아가기
              </Button>
            </AccessDenied>
          </Container>
        </MainContent>
      </PageWrapper>
    );
  }

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filter === 'read') return suggestion.isRead;
    if (filter === 'unread') return !suggestion.isRead;
    return true;
  });

  const totalCount = suggestions.length;
  const readCount = suggestions.filter(s => s.isRead).length;
  const unreadCount = totalCount - readCount;

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 건의사항을 삭제하시겠습니까?')) {
      await deleteSuggestion(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  return (
    <PageWrapper>
      <Header />
      <MainContent>
        <Container>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <StatsCard>
              <CardContent>
                <Flex justify="space-around">
                  <div>
                    <StatNumber>{totalCount}</StatNumber>
                    <StatLabel>전체 건의</StatLabel>
                  </div>
                  <div>
                    <StatNumber>{unreadCount}</StatNumber>
                    <StatLabel>미확인</StatLabel>
                  </div>
                  <div>
                    <StatNumber>{readCount}</StatNumber>
                    <StatLabel>확인완료</StatLabel>
                  </div>
                </Flex>
              </CardContent>
            </StatsCard>

            <FilterButtons>
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilter('all')}
              >
                전체 ({totalCount})
              </Button>
              <Button
                variant={filter === 'unread' ? 'primary' : 'outline'}
                onClick={() => setFilter('unread')}
              >
                미확인 ({unreadCount})
              </Button>
              <Button
                variant={filter === 'read' ? 'primary' : 'outline'}
                onClick={() => setFilter('read')}
              >
                확인완료 ({readCount})
              </Button>
              <Button
                variant="outline"
                onClick={() => FileStorage.downloadBackup()}
                style={{ marginLeft: 'auto' }}
              >
                JSON 다운로드
              </Button>
              <Button
                variant="outline"
                onClick={() => FileStorage.downloadExcel()}
              >
                엑셀 다운로드
              </Button>
            </FilterButtons>

            {filteredSuggestions.length === 0 ? (
              <EmptyState>
                <p>건의사항이 없습니다.</p>
              </EmptyState>
            ) : (
              filteredSuggestions
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((suggestion: Suggestion) => (
                  <SuggestionCard key={suggestion.id} isRead={suggestion.isRead}>
                    <CardContent>
                      <SuggestionMeta>
                        제출일: {formatDate(suggestion.createdAt)}
                        {suggestion.isRead && ' • 확인완료'}
                      </SuggestionMeta>
                      <SuggestionContent>{suggestion.content}</SuggestionContent>
                    </CardContent>
                    <CardFooter>
                      <div />
                      <Flex gap="0.5rem">
                        {!suggestion.isRead && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsRead(suggestion.id)}
                          >
                            확인완료
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(suggestion.id)}
                        >
                          삭제
                        </Button>
                      </Flex>
                    </CardFooter>
                  </SuggestionCard>
                ))
            )}
          </div>
        </Container>
      </MainContent>
    </PageWrapper>
  );
};
