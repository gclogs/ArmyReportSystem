import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Approvals from './pages/Approvals';
import Login from './pages/Login';
import Register from './pages/Register';
import GlobalStyle from './styles/GlobalStyle';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RequireAuth } from './components/auth/RequireAuth';
import './App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <GlobalStyle />
          <Routes>
            <Route path="/login" element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
              } />
            <Route path="/register" element={
              <AuthRedirect>
                <Register />
              </AuthRedirect>
            } />
            <Route path="/" element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }>
              <Route index element={<Dashboard />} />
              <Route path="reports" element={<Reports />} />
              <Route path="reports/:id" element={<Reports />} />
              <Route path="approvals" element={<Approvals />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
