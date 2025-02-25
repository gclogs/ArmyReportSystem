import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Approvals from './pages/Approvals';
// import Profile from './pages/Profile';
// import Settings from './pages/Settings';
import './App.css'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/approvals" element={<Approvals />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
