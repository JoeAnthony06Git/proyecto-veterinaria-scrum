import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Loading } from '../modules/shared/components/Loading'
import { Layout } from '../modules/shared/components/Layout'
import { RoleGuard } from '../modules/shared/guards/RoleGuard'
import { LoginPage } from '../modules/auth/pages/LoginPage'
import { RegisterPage } from '../modules/auth/pages/RegisterPage'
import { DashboardPage } from '../modules/tutor/pages/DashboardPage'
import { MyPetsPage } from '../modules/tutor/pages/MyPetsPage'
import { PetDetailPage } from '../modules/tutor/pages/PetDetailPage'
import { AppointmentsPage } from '../modules/tutor/pages/AppointmentsPage'
import { NewAppointmentPage } from '../modules/tutor/pages/NewAppointmentPage'
import { ShopPage } from '../modules/tutor/pages/ShopPage'
import { CartPage } from '../modules/tutor/pages/CartPage'
import { TriagePage } from '../modules/tutor/pages/TriagePage'
import { PrescriptionDetailPage } from '../modules/tutor/pages/PrescriptionDetailPage'
import { DoctorDashboardPage } from '../modules/doctor/pages/DoctorDashboardPage'
import { PatientsPage } from '../modules/doctor/pages/PatientsPage'
import { PatientDetailPage } from '../modules/doctor/pages/PatientDetailPage'
import { DoctorAppointmentsPage } from '../modules/doctor/pages/DoctorAppointmentsPage'
import { AnamnesisPage } from '../modules/doctor/pages/AnamnesisPage'
import { PrescriptionsPage } from '../modules/doctor/pages/PrescriptionsPage'
import { DoctorConsultationPage } from '../modules/doctor/pages/DoctorConsultationPage'
import { PrescriptionPreviewPage } from '../modules/doctor/pages/PrescriptionPreviewPage'
import { ConsultationDetailPage } from '../modules/tutor/pages/ConsultationDetailPage'

function RootRedirect() {
  const { token, user, sessionLoading } = useAuthStore()
  if (sessionLoading) return <Loading />
  if (!token) return <Navigate to="/login" replace />
  const dashboard = user?.role === 'DOCTOR' ? '/doctor/dashboard' : '/tutor/dashboard'
  return <Navigate to={dashboard} replace />
}

const TutorLayout = ({ children }: { children: React.ReactNode }) => (
  <Layout role="tutor">{children}</Layout>
)

const DoctorLayout = ({ children }: { children: React.ReactNode }) => (
  <Layout role="doctor">{children}</Layout>
)

function ProtectedTutor({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="TUTOR">
      <TutorLayout>{children}</TutorLayout>
    </RoleGuard>
  )
}

function ProtectedDoctor({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard role="DOCTOR">
      <DoctorLayout>{children}</DoctorLayout>
    </RoleGuard>
  )
}

export function AppRouter() {
  const initSession = useAuthStore((s) => s.initSession);

  useEffect(() => {
    initSession();
  }, [initSession]);

  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/tutor" element={<ProtectedTutor><DashboardPage /></ProtectedTutor>} />
      <Route path="/tutor/dashboard" element={<ProtectedTutor><DashboardPage /></ProtectedTutor>} />
      <Route path="/tutor/pets" element={<ProtectedTutor><MyPetsPage /></ProtectedTutor>} />
      <Route path="/tutor/pets/:id" element={<ProtectedTutor><PetDetailPage /></ProtectedTutor>} />
      <Route path="/tutor/appointments" element={<ProtectedTutor><AppointmentsPage /></ProtectedTutor>} />
      <Route path="/tutor/appointments/new" element={<ProtectedTutor><NewAppointmentPage /></ProtectedTutor>} />
      <Route path="/tutor/shop" element={<ProtectedTutor><ShopPage /></ProtectedTutor>} />
      <Route path="/tutor/cart" element={<ProtectedTutor><CartPage /></ProtectedTutor>} />
      <Route path="/tutor/triage" element={<ProtectedTutor><TriagePage /></ProtectedTutor>} />
      <Route path="/tutor/prescriptions/:id" element={<ProtectedTutor><PrescriptionDetailPage /></ProtectedTutor>} />

      <Route path="/doctor" element={<ProtectedDoctor><DoctorDashboardPage /></ProtectedDoctor>} />
      <Route path="/doctor/dashboard" element={<ProtectedDoctor><DoctorDashboardPage /></ProtectedDoctor>} />
      <Route path="/doctor/patients" element={<ProtectedDoctor><PatientsPage /></ProtectedDoctor>} />
      <Route path="/doctor/patients/:id" element={<ProtectedDoctor><PatientDetailPage /></ProtectedDoctor>} />
      <Route path="/doctor/appointments" element={<ProtectedDoctor><DoctorAppointmentsPage /></ProtectedDoctor>} />
      <Route path="/doctor/appointments/:appointmentId/consultation" element={<ProtectedDoctor><DoctorConsultationPage /></ProtectedDoctor>} />
      <Route path="/doctor/anamnesis" element={<ProtectedDoctor><AnamnesisPage /></ProtectedDoctor>} />
      <Route path="/doctor/prescriptions" element={<ProtectedDoctor><PrescriptionsPage /></ProtectedDoctor>} />
      <Route path="/doctor/prescriptions/:id/preview" element={<RoleGuard role="DOCTOR"><PrescriptionPreviewPage /></RoleGuard>} />
      <Route path="/tutor/consultations/:id" element={<ProtectedTutor><ConsultationDetailPage /></ProtectedTutor>} />
    </Routes>
  )
}
