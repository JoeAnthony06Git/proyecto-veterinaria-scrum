import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.doctorInfo.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany({ where: { email: 'doctor@veterinaria.com' } });

  const servicios = [
    { code: 'CONSULTA', label: 'Consulta General', description: 'Revisión médica completa.' },
    { code: 'VACUNA', label: 'Vacunación', description: 'Refuerzos y vacunas.' },
    { code: 'SPA', label: 'Spa y Estética', description: 'Baño y corte.' },
    { code: 'CIRUGIA', label: 'Cirugía', description: 'Intervenciones quirúrgicas.' },
  ];

  for (const s of servicios) {
    await prisma.service.create({ data: s });
  }

  const hashedPassword = await bcrypt.hash('123456', 10);
  
  await prisma.user.create({
    data: {
      email: 'doctor@veterinaria.com',
      password: hashedPassword,
      name: 'Carlos',
      lastName: 'López',
      phone: '999888777',
      role: 'DOCTOR',
      doctorInfo: {
        create: {
          specialty: 'Medicina General y Cirugía',
          rating: 4.9
        }
      }
    }
  });

  const productos = [
    { name: 'Royal Canin Perro Adulto', price: 85.50, category: 'Alimentos', stock: 20 },
    { name: 'Whiskas Gato Adulto', price: 42.00, category: 'Alimentos', stock: 15 },
    { name: 'Collar Antipulgas', price: 25.00, category: 'Accesorios', stock: 50 },
    { name: 'Shampoo Medicado', price: 35.00, category: 'Higiene', stock: 10 },
    { name: 'Cama acolchada Grande', price: 120.00, category: 'Accesorios', stock: 5 },
  ];

  for (const p of productos) {
    await prisma.product.create({ data: p });
  }

  console.log('Seed completado correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

