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
import VerifyResetPassword from '../features/auth/pages/VerifyResetPassword/VerifyResetPassword';
import OAuthSuccess from '../features/auth/pages/OAuthSuccess';

// Home Pages

// Profile Pages
import ProfilePage from '../features/profile/pages/ProfilePage';

import { ExperiencesPage, ExperiencesDetail } from '@/features/Experiences';

// Explore Pages (Tours)
import { ExploreVietnamPage, TourDetailPage } from '@/features/explore';

// Admin Pages
import { AdminDashboard, UsersPage, SupportPage } from '@/features/admin';

// Artisan Pages
import { ArtisanDetailPage, ArtisansListPage } from '@/features/artisan';

import { HotelDetailPage, HotelListPage } from '@/features/hotel';

// Checkout Pages
import CheckoutPage from '../features/checkout/pages/CheckoutPage';
import PaymentProcessingPage from '../features/checkout/pages/PaymentProcessingPage';
import PaymentResultPage from '../features/checkout/pages/PaymentResultPage';
import PaymentSuccessPage from '../features/checkout/pages/PaymentSuccessPage';

// Booking Pages
import { MyBookingsPage } from '@/features/booking';

// Layouts
import { MainLayout, AdminLayout } from '@/shared/components/layout';

// Error Pages
import NotFound from '../pages/NotFound';
import HomePage from '@/features/home/pages/HomePage';
import AITestPage from '../pages/AITestPage';
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
        <Route
          path="/verify-reset-password"
          element={<VerifyResetPassword />}
        />
        <Route path="/auth/oauth-success" element={<OAuthSuccess />} />

        {/* ==================== PUBLIC ROUTES (Main) ==================== */}
        {/* AI Test Page */}
        <Route path="/ai-test" element={<AITestPage />} />

        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        <Route
          path="/experiences"
          element={
            <MainLayout>
              <ExperiencesPage />
            </MainLayout>
          }
        />

        <Route
          path="/experiences/:id"
          element={
            <MainLayout>
              <ExperiencesDetail />
            </MainLayout>
          }
        />

        <Route
          path="/artisans"
          element={
            <MainLayout>
              <ArtisansListPage />
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

        {/* Artisans List Page */}
        <Route
          path="/hotels"
          element={
            <MainLayout>
              <HotelListPage />
            </MainLayout>
          }
        />

        {/* Artisan Detail Page */}
        <Route
          path="/hotels/:id"
          element={
            <MainLayout>
              <HotelDetailPage />
            </MainLayout>
          }
        />

        {/* ==================== PUBLIC ROUTES (Tour) ==================== */}
        {/* Explore Vietnam List Page */}
        <Route
          path="/explore-vietnam"
          element={
            <MainLayout>
              <ExploreVietnamPage />
            </MainLayout>
          }
        />

        {/* Tour Detail Page */}
        <Route
          path="/tours/:id"
          element={
            <MainLayout>
              <TourDetailPage />
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

        {/* My Bookings */}
        <Route
          path="/bookings"
          element={
            <ProtectedRoute requiredRoles={['customer', 'artisan', 'admin']}>
              <MainLayout>
                <MyBookingsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== CHECKOUT ROUTES ==================== */}
        {/* Checkout Page */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute requiredRoles={['customer', 'artisan', 'admin']}>
              <MainLayout>
                <CheckoutPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Payment Processing */}
        <Route
          path="/checkout/payment-processing"
          element={
            <ProtectedRoute requiredRoles={['customer', 'artisan', 'admin']}>
              <MainLayout>
                <PaymentProcessingPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Payment Result */}
        <Route
          path="/checkout/payment-result"
          element={
            <ProtectedRoute requiredRoles={['customer', 'artisan', 'admin']}>
              <MainLayout>
                <PaymentResultPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Payment Success */}
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute requiredRoles={['customer', 'artisan', 'admin']}>
              <MainLayout>
                <PaymentSuccessPage />
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
