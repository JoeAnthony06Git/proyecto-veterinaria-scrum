# 📜 setup-directories.ps1 - Crea la estructura completa del proyecto veterinaria

Write-Host "🚀 Creando estructura del proyecto..." -ForegroundColor Cyan
Write-Host ""

# ============================================
# BACKEND - Arquitectura Hexagonal
# ============================================
$backendDirs = @(
    "backend/src/domain/entities",
    "backend/src/domain/value-objects",
    "backend/src/domain/ports/in",
    "backend/src/domain/ports/out/database",
    "backend/src/domain/ports/out/ai",
    "backend/src/domain/ports/out/messaging",
    "backend/src/application/use-cases/anamnesis",
    "backend/src/application/use-cases/triage",
    "backend/src/application/use-cases/scheduling",
    "backend/src/application/use-cases/clinical",
    "backend/src/application/use-cases/notifications",
    "backend/src/application/use-cases/shop",
    "backend/src/application/services",
    "backend/src/infrastructure/adapters/in/http/auth",
    "backend/src/infrastructure/adapters/in/http/doctor",
    "backend/src/infrastructure/adapters/in/http/tutor",
    "backend/src/infrastructure/adapters/in/http/shop",
    "backend/src/infrastructure/adapters/in/webhooks",
    "backend/src/infrastructure/adapters/out/persistence/repositories",
    "backend/src/infrastructure/adapters/out/ai",
    "backend/src/infrastructure/adapters/out/messaging",
    "backend/src/infrastructure/jobs",
    "backend/src/infrastructure/config",
    "backend/prisma",
    "backend/test"
)

# ============================================
# FRONTEND - Módulos React
# ============================================
$frontendDirs = @(
    "frontend/src/modules/auth/components",
    "frontend/src/modules/auth/pages",
    "frontend/src/modules/tutor/components",
    "frontend/src/modules/tutor/pages",
    "frontend/src/modules/doctor/components",
    "frontend/src/modules/doctor/pages",
    "frontend/src/modules/shared/components",
    "frontend/src/modules/shared/guards",
    "frontend/src/services",
    "frontend/src/stores",
    "frontend/src/router",
    "frontend/src/lib",
    "frontend/public"
)

Write-Host "📁 Creating backend directories..." -ForegroundColor Cyan
foreach ($dir in $backendDirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Write-Host "📁 Creating frontend directories..." -ForegroundColor Cyan
foreach ($dir in $frontendDirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

# ============================================
# BACKEND FILES - Placeholders
# ============================================
Write-Host "📄 Creating backend placeholder files..." -ForegroundColor Green

$domainEntities = @(
    "User.ts", "Pet.ts", "Appointment.ts", "Consultation.ts",
    "Cartilla.ts", "Vaccine.ts", "Product.ts", "CartItem.ts",
    "Prescription.ts", "TriageReport.ts"
)
foreach ($f in $domainEntities) { "// Entidad de dominio - $f" | Out-File "backend/src/domain/entities/$f" -Encoding UTF8 }

$valueObjects = @("Money.ts", "EmergencyLevel.ts", "AppointmentStatus.ts", "ServiceType.ts")
foreach ($f in $valueObjects) { "// Value Object - $f" | Out-File "backend/src/domain/value-objects/$f" -Encoding UTF8 }

$portsIn = @(
    "IManageAppointments.ts", "IManagePets.ts", "IProcessAnamnesis.ts",
    "IRunTriage.ts", "IInterpretPrescription.ts", "IManageCartilla.ts", "IProcessShop.ts"
)
foreach ($f in $portsIn) { "// Puerto de entrada - $f" | Out-File "backend/src/domain/ports/in/$f" -Encoding UTF8 }

$portsOutDb = @(
    "IUserRepository.ts", "IPetRepository.ts", "IAppointmentRepository.ts",
    "IConsultationRepository.ts", "ICartillaRepository.ts", "IProductRepository.ts"
)
foreach ($f in $portsOutDb) { "// Puerto de salida (DB) - $f" | Out-File "backend/src/domain/ports/out/database/$f" -Encoding UTF8 }

"// Puerto de salida (AI) - IAiService.ts" | Out-File "backend/src/domain/ports/out/ai/IAiService.ts" -Encoding UTF8
"// Puerto de salida (AI) - ISpeechToText.ts" | Out-File "backend/src/domain/ports/out/ai/ISpeechToText.ts" -Encoding UTF8
"// Puerto de salida (Messaging) - INotification.ts" | Out-File "backend/src/domain/ports/out/messaging/INotification.ts" -Encoding UTF8

$useCases = @(
    "anamnesis/ProcessVoiceAnamnesisUseCase.ts",
    "triage/AnalyzeTriageAnswersUseCase.ts",
    "triage/AlertEmergencyUseCase.ts",
    "scheduling/ScheduleAppointmentUseCase.ts",
    "scheduling/GetAppointmentsUseCase.ts",
    "clinical/TranslatePrescriptionUseCase.ts",
    "clinical/ManageCartillaUseCase.ts",
    "notifications/DispatchCronAlertsUseCase.ts",
    "shop/AddToCartUseCase.ts",
    "shop/CheckoutUseCase.ts"
)
foreach ($f in $useCases) { "// Caso de uso - $f" | Out-File "backend/src/application/use-cases/$f" -Encoding UTF8 }

"// Servicio - NotificationDispatcher.ts" | Out-File "backend/src/application/services/NotificationDispatcher.ts" -Encoding UTF8
"// Servicio - ReminderChecker.ts" | Out-File "backend/src/application/services/ReminderChecker.ts" -Encoding UTF8

$controllers = @(
    "http/auth/AuthController.ts",
    "http/doctor/DoctorController.ts",
    "http/tutor/TutorController.ts",
    "http/shop/ShopController.ts",
    "webhooks/WhatsAppBotController.ts"
)
foreach ($f in $controllers) { "// Controlador HTTP - $f" | Out-File "backend/src/infrastructure/adapters/in/$f" -Encoding UTF8 }

"// Servicio Prisma - PrismaService.ts" | Out-File "backend/src/infrastructure/adapters/out/persistence/PrismaService.ts" -Encoding UTF8
$repos = @(
    "PrismaUserRepository.ts", "PrismaPetRepository.ts", "PrismaAppointmentRepository.ts",
    "PrismaConsultationRepository.ts", "PrismaCartillaRepository.ts", "PrismaProductRepository.ts"
)
foreach ($f in $repos) { "// Repositorio - $f" | Out-File "backend/src/infrastructure/adapters/out/persistence/repositories/$f" -Encoding UTF8 }

"// Adaptador IA - OllamaAdapter.ts" | Out-File "backend/src/infrastructure/adapters/out/ai/OllamaAdapter.ts" -Encoding UTF8
"// Adaptador IA - WhisperAdapter.ts" | Out-File "backend/src/infrastructure/adapters/out/ai/WhisperAdapter.ts" -Encoding UTF8
"// Adaptador Mensajería - WhatsAppApiAdapter.ts" | Out-File "backend/src/infrastructure/adapters/out/messaging/WhatsAppApiAdapter.ts" -Encoding UTF8

$jobs = @("CronScheduler.ts", "VaccineReminderJob.ts", "AppointmentReminderJob.ts", "ProcedureReminderJob.ts")
foreach ($f in $jobs) { "// Job programado - $f" | Out-File "backend/src/infrastructure/jobs/$f" -Encoding UTF8 }

$configs = @("database.config.ts", "ai.config.ts", "whatsapp.config.ts")
foreach ($f in $configs) { "// Configuración - $f" | Out-File "backend/src/infrastructure/config/$f" -Encoding UTF8 }

"// Punto de entrada de la aplicación NestJS" | Out-File "backend/src/main.ts" -Encoding UTF8
"// Schema Prisma - Modelo de datos" | Out-File "backend/prisma/schema.prisma" -Encoding UTF8
"// Seed de datos iniciales" | Out-File "backend/prisma/seed.ts" -Encoding UTF8

Write-Host "✅ Backend structure created (133 placeholder files)!" -ForegroundColor Green
Write-Host "📄 Frontend directories ready for components!" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Structure:" -ForegroundColor Yellow
Write-Host "  backend/" -ForegroundColor Cyan
Write-Host "    ├── src/domain/     → Entities, Value Objects, Ports"
Write-Host "    ├── src/application/ → Use Cases, Services"  
Write-Host "    └── src/infrastructure/ → Adapters, Config, Jobs"
Write-Host "  frontend/" -ForegroundColor Cyan
Write-Host "    └── src/modules/   → auth/, tutor/, doctor/, shared/"
