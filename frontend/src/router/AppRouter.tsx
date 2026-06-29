import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '../modules/shared/components/Layout'
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

const TutorLayout = ({ children }: { children: React.ReactNode }) => (
  <Layout role="tutor">{children}</Layout>
)

const DoctorLayout = ({ children }: { children: React.ReactNode }) => (
  <Layout role="doctor">{children}</Layout>
)

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/tutor" element={<TutorLayout><DashboardPage /></TutorLayout>} />
      <Route path="/tutor/dashboard" element={<TutorLayout><DashboardPage /></TutorLayout>} />
      <Route path="/tutor/pets" element={<TutorLayout><MyPetsPage /></TutorLayout>} />
      <Route path="/tutor/pets/:id" element={<TutorLayout><PetDetailPage /></TutorLayout>} />
      <Route path="/tutor/appointments" element={<TutorLayout><AppointmentsPage /></TutorLayout>} />
      <Route path="/tutor/appointments/new" element={<TutorLayout><NewAppointmentPage /></TutorLayout>} />
      <Route path="/tutor/shop" element={<TutorLayout><ShopPage /></TutorLayout>} />
      <Route path="/tutor/cart" element={<TutorLayout><CartPage /></TutorLayout>} />
      <Route path="/tutor/triage" element={<TutorLayout><TriagePage /></TutorLayout>} />
      <Route path="/tutor/prescriptions/:id" element={<TutorLayout><PrescriptionDetailPage /></TutorLayout>} />

      <Route path="/doctor" element={<DoctorLayout><DoctorDashboardPage /></DoctorLayout>} />
      <Route path="/doctor/dashboard" element={<DoctorLayout><DoctorDashboardPage /></DoctorLayout>} />
      <Route path="/doctor/patients" element={<DoctorLayout><PatientsPage /></DoctorLayout>} />
      <Route path="/doctor/patients/:id" element={<DoctorLayout><PatientDetailPage /></DoctorLayout>} />
      <Route path="/doctor/appointments" element={<DoctorLayout><DoctorAppointmentsPage /></DoctorLayout>} />
      <Route path="/doctor/anamnesis" element={<DoctorLayout><AnamnesisPage /></DoctorLayout>} />
      <Route path="/doctor/prescriptions" element={<DoctorLayout><PrescriptionsPage /></DoctorLayout>} />
    </Routes>
  )
}
