import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { MirimOAuthProvider, useMirimOAuth } from 'mirim-oauth-react';
import { useThemeStore } from './store/themeStore';
import { lightTheme, darkTheme } from './utils/theme';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { GlobalStyles } from './styles/GlobalStyles.ts';

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useMirimOAuth();
  const ADMIN_NAMES = import.meta.env.VITE_ADMIN_NAMES?.split(',') || [
    'test1',
    'test',
  ];
  const isAdmin = ADMIN_NAMES.includes(currentUser?.nickname) || false;
  return isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  const { isDark } = useThemeStore();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <MirimOAuthProvider
        clientId={import.meta.env.VITE_AUTH_CLIENT_ID}
        clientSecret={import.meta.env.VITE_AUTH_CLIENT_SECRET}
        redirectUri={import.meta.env.VITE_AUTH_REDIRECT_URI}
        scopes={import.meta.env.VITE_AUTH_SCOPES}
      >
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminPage />
                </AdminProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </MirimOAuthProvider>
    </ThemeProvider>
  );
}
