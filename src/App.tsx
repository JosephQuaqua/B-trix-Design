import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProtectedRoute } from '@/components/routes/ProtectedRoute'
import { Spinner } from '@/components/ui/Spinner'
import { NotFoundPage, UnauthorizedPage } from '@/pages/NotFoundPage'

const HomePage = lazy(() => import('@/features/public/home/HomePage'))
const AboutPage = lazy(() => import('@/features/public/about/AboutPage'))
const CollectionsPage = lazy(() => import('@/features/public/collections/CollectionsPage'))
const CollectionDetailPage = lazy(() => import('@/features/public/collections/CollectionDetailPage'))
const ServicesPage = lazy(() => import('@/features/public/services/ServicesPage'))
const ServiceDetailPage = lazy(() => import('@/features/public/services/ServiceDetailPage'))
const TestimonialsPage = lazy(() => import('@/features/public/testimonials/TestimonialsPage'))
const FAQPage = lazy(() => import('@/features/public/faq/FAQPage'))
const ContactPage = lazy(() => import('@/features/public/contact/ContactPage'))
const BookingPage = lazy(() => import('@/features/public/booking/BookingPage'))
const BookingSuccessPage = lazy(() => import('@/features/public/booking/BookingSuccessPage'))
const PrivacyPolicyPage = lazy(() => import('@/features/public/legal/PrivacyPolicyPage'))
const TermsPage = lazy(() => import('@/features/public/legal/TermsPage'))

const LoginPage = lazy(() => import('@/features/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/features/auth/ResetPasswordPage'))

const CustomerOverview = lazy(() => import('@/features/customer/OverviewPage'))
const AppointmentsPage = lazy(() => import('@/features/customer/AppointmentsPage'))
const AppointmentDetailPage = lazy(() => import('@/features/customer/AppointmentDetailPage'))
const FavoritesPage = lazy(() => import('@/features/customer/FavoritesPage'))
const MeasurementsPage = lazy(() => import('@/features/customer/MeasurementsPage'))
const MessagesPage = lazy(() => import('@/features/customer/MessagesPage'))
const ProfilePage = lazy(() => import('@/features/customer/ProfilePage'))
const SettingsPage = lazy(() => import('@/features/customer/SettingsPage'))

const AdminOverview = lazy(() => import('@/features/admin/OverviewPage'))
const GalleryPage = lazy(() => import('@/features/admin/GalleryPage'))
const CollectionsAdminPage = lazy(() => import('@/features/admin/CollectionsAdminPage'))
const ServicesAdminPage = lazy(() => import('@/features/admin/ServicesAdminPage'))
const AppointmentsAdminPage = lazy(() => import('@/features/admin/AppointmentsAdminPage'))
const CustomersPage = lazy(() => import('@/features/admin/CustomersPage'))
const ReviewsPage = lazy(() => import('@/features/admin/ReviewsPage'))
const MessagesAdminPage = lazy(() => import('@/features/admin/MessagesAdminPage'))
const StaffPage = lazy(() => import('@/features/admin/StaffPage'))
const ReportsPage = lazy(() => import('@/features/admin/ReportsPage'))
const SettingsAdminPage = lazy(() => import('@/features/admin/SettingsAdminPage'))
const RolesPage = lazy(() => import('@/features/admin/RolesPage'))
const AnalyticsPage = lazy(() => import('@/features/admin/AnalyticsPage'))
const AuditLogsPage = lazy(() => import('@/features/admin/AuditLogsPage'))
const SystemConfigPage = lazy(() => import('@/features/admin/SystemConfigPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, refetchOnWindowFocus: false },
  },
})

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory-50">
      <Spinner size={32} />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/:slug" element={<CollectionDetailPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/book-appointment" element={<BookingPage />} />
              <Route path="/book-appointment/success" element={<BookingSuccessPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            <Route element={<ProtectedRoute allow={['customer', 'staff', 'admin', 'super_admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<CustomerOverview />} />
                <Route path="/dashboard/appointments" element={<AppointmentsPage />} />
                <Route path="/dashboard/appointments/:id" element={<AppointmentDetailPage />} />
                <Route path="/dashboard/favorites" element={<FavoritesPage />} />
                <Route path="/dashboard/measurements" element={<MeasurementsPage />} />
                <Route path="/dashboard/messages" element={<MessagesPage />} />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
                <Route path="/dashboard/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute allow={['admin', 'super_admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminOverview />} />
                <Route path="/admin/gallery" element={<GalleryPage />} />
                <Route path="/admin/collections" element={<CollectionsAdminPage />} />
                <Route path="/admin/services" element={<ServicesAdminPage />} />
                <Route path="/admin/appointments" element={<AppointmentsAdminPage />} />
                <Route path="/admin/customers" element={<CustomersPage />} />
                <Route path="/admin/reviews" element={<ReviewsPage />} />
                <Route path="/admin/messages" element={<MessagesAdminPage />} />
                <Route path="/admin/staff" element={<StaffPage />} />
                <Route path="/admin/reports" element={<ReportsPage />} />
                <Route path="/admin/settings" element={<SettingsAdminPage />} />
                <Route element={<ProtectedRoute allow={['super_admin']} />}>
                  <Route path="/admin/roles" element={<RolesPage />} />
                  <Route path="/admin/analytics" element={<AnalyticsPage />} />
                  <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
                  <Route path="/admin/system-config" element={<SystemConfigPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  )
}
