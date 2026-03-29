import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ProtectedRoute from './protectedRoute';

// Auth Pages
import LoginPage from '../features/auth/pages/LoginPage/LoginPage';
import RegisterPage from '../features/auth/pages/Register/RegisterPage';
import ForgotPassword from '../features/auth/pages/ForgotPassword/ForgotPassword';
import OTPVerification from '../features/auth/pages/OTPVerification/OTPVerification';
import VerifyEmail from '../features/auth/pages/VerifyEmail/VerifyEmail';
import OAuthSuccess from '../features/auth/pages/OAuthSuccess';

// Home Pages
import HomePage from '../features/home/pages/HomePage';

// Profile Pages
import ProfilePage from '../features/profile/pages/ProfilePage';

// Admin Pages
import { AdminDashboard, UsersPage, SupportPage } from '@/features/admin';

// Artisan Pages
import { ArtisanDetailPage, ArtisansListPage } from '@/features/artisan';

// Layouts
import {
  MainLayout,
  AdminLayout,
  ClientLayout,
} from '@/shared/components/layout';

// Error Pages
import NotFound from '../pages/NotFound';

/**
 * App Router
 * Centralized routing component with role-based access control
 * Routes are organized by feature and access level
 */
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* ==================== PUBLIC ROUTES (Auth) ==================== */}
        {/* Login & Registration */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/oauth-success" element={<OAuthSuccess />} />

        {/* ==================== PUBLIC ROUTES (Main) ==================== */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        {/* ==================== PUBLIC ROUTES (Artisan) ==================== */}
        {/* Artisans List Page */}
        <Route
          path="/artisans"
          element={
            <MainLayout>
              <ArtisansListPage />
            </MainLayout>
          }
        />

        {/* Artisan Detail Page */}
        <Route
          path="/artisan/:id"
          element={
            <MainLayout>
              <ArtisanDetailPage />
            </MainLayout>
          }
        />

        {/* ==================== PROTECTED ROUTES (Admin) ==================== */}
        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Users Management */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRoles={['admin']}>
              <AdminLayout>
                <UsersPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Support */}
        <Route
          path="/admin/support"
          element={
            <ProtectedRoute requiredRoles={['admin', 'staff']}>
              <AdminLayout>
                <SupportPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== PROTECTED ROUTES (Artisan) ==================== */}
        {/* Artisan Dashboard - To be implemented */}
        {/* <Route
          path="/artisan"
          element={
            <ProtectedRoute requiredRoles={['artisan']}>
              <AdminLayout>
                <ArtisanDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        /> */}

        {/* ==================== PROTECTED ROUTES (Staff) ==================== */}
        {/* Staff Dashboard - To be implemented */}
        {/* <Route
          path="/staff"
          element={
            <ProtectedRoute requiredRoles={['staff']}>
              <AdminLayout>
                <StaffDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        /> */}

        {/* ==================== PROTECTED ROUTES (User) ==================== */}
        {/* User Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRoles={['customer', 'artisan', 'admin']}>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== FALLBACK ROUTES ==================== */}
        {/* Redirect /home to / */}
        <Route path="/home" element={<Navigate to="/" replace />} />

        {/* Redirect /dashboard to /admin */}
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

        {/* 404 - Page Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
