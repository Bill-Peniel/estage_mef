import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Vérifier si l'admin existe déjà
  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: UserRole.admin
    }
  });

  if (existingAdmin) {
    console.log('Un administrateur existe déjà');
    return;
  }

  // Créer l'admin
  const admin = await prisma.user.create({
    data: {
      email: 'adminestagefinances@gmail.com',
      passwordHash: await bcrypt.hash('Myadmin2025', 10),
      role: UserRole.admin,
      isActive: true,
      profile: {
        create: {
          nom: 'Admin',
          prenom: 'System',
          telephone: '+229 00000000'
        }
      }
    }
  });

  console.log('Administrateur créé avec succès:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 