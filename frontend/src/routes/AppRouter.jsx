import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ProtectedRoute from './protectedRoute';


import LoginPage from '../features/auth/pages/LoginPage/LoginPage';
import RegisterPage from '../features/auth/pages/Register/RegisterPage';
import ForgotPassword from '../features/auth/pages/ForgotPassword/ForgotPassword';
import OTPVerification from '../features/auth/pages/OTPVerification/OTPVerification';
import VerifyEmail from '../features/auth/pages/VerifyEmail/VerifyEmail';
import VerifyResetPassword from '../features/auth/pages/VerifyResetPassword/VerifyResetPassword';
import OAuthSuccess from '../features/auth/pages/OAuthSuccess';




import ProfilePage from '../features/profile/pages/ProfilePage';

import { ExperiencesPage, ExperiencesDetail } from '@/features/Experiences';


import { ExploreVietnamPage, TourDetailPage } from '@/features/explore';


import { AdminDashboard, UsersPage, SupportPage } from '@/features/admin';


import { ArtisanDetailPage, ArtisansListPage } from '@/features/artisan';

import { HotelDetailPage, HotelListPage } from '@/features/hotel';


import CheckoutPage from '../features/checkout/pages/CheckoutPage';
import PaymentProcessingPage from '../features/checkout/pages/PaymentProcessingPage';
import PaymentResultPage from '../features/checkout/pages/PaymentResultPage';
import PaymentSuccessPage from '../features/checkout/pages/PaymentSuccessPage';


import { MyBookingsPage } from '@/features/booking';


import { MainLayout, AdminLayout } from '@/shared/components/layout';


import NotFound from '../pages/NotFound';
import HomePage from '@/features/home/pages/HomePage';
import AITestPage from '../pages/AITestPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {}
        {}
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

        {}
        {}
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

        {}
        {}
        <Route
          path="/artisans"
          element={
            <MainLayout>
              <ArtisansListPage />
            </MainLayout>
          }
        />

        {}
        <Route
          path="/artisan/:id"
          element={
            <MainLayout>
              <ArtisanDetailPage />
            </MainLayout>
          }
        />

        {}
        <Route
          path="/hotels"
          element={
            <MainLayout>
              <HotelListPage />
            </MainLayout>
          }
        />

        {}
        <Route
          path="/hotels/:id"
          element={
            <MainLayout>
              <HotelDetailPage />
            </MainLayout>
          }
        />

        {}
        {}
        <Route
          path="/explore-vietnam"
          element={
            <MainLayout>
              <ExploreVietnamPage />
            </MainLayout>
          }
        />

        {}
        <Route
          path="/tours/:id"
          element={
            <MainLayout>
              <TourDetailPage />
            </MainLayout>
          }
        />

        {}
        {}
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

        {}
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

        {}
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

        {}
        {}
        {}

        {}
        {}
        {}

        {}
        {}
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

        {}
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

        {}
        {}
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

        {}
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

        {}
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

        {}
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

        {}
        {}
        <Route path="/home" element={<Navigate to="/" replace />} />

        {}
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />

        {}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
