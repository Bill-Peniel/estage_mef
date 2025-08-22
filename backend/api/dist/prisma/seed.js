"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const structure = await prisma.structure.create({
        data: {
            nomStructure: 'Structure Test',
            sigle: 'ST'
        }
    });
    console.log('Structure créée');
    const adminUser = await prisma.user.create({
        data: {
            email: 'adminestagefinances@gmail.com',
            passwordHash: await bcrypt.hash('Myadmin2025', 10),
            role: client_1.UserRole.admin,
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
    console.log('Admin créé');
    const dpafUser = await prisma.user.create({
        data: {
            email: 'dpaf@mystage.com',
            passwordHash: await bcrypt.hash('dpaf123', 10),
            role: client_1.UserRole.dpaf,
            isActive: true,
            profile: {
                create: {
                    nom: 'DPAF',
                    prenom: 'User',
                    telephone: '+229 00000001'
                }
            }
        }
    });
    console.log('DPAF créé');
    const structureUser = await prisma.user.create({
        data: {
            email: 'structure@mystage.com',
            passwordHash: await bcrypt.hash('structure123', 10),
            role: client_1.UserRole.structure,
            isActive: true,
            structure: {
                connect: { id: structure.id }
            },
            profile: {
                create: {
                    nom: 'Structure',
                    prenom: 'Test',
                    telephone: '+229 00000002'
                }
            }
        }
    });
    console.log('Utilisateur structure créé');
    const tuteurUser = await prisma.user.create({
        data: {
            email: 'tuteur@mystage.com',
            passwordHash: await bcrypt.hash('tuteur123', 10),
            role: client_1.UserRole.tuteur,
            isActive: true,
            profile: {
                create: {
                    nom: 'Tuteur',
                    prenom: 'Test',
                    telephone: '+229 00000003'
                }
            }
        }
    });
    const tuteur = await prisma.tuteur.create({
        data: {
            userId: tuteurUser.id,
            structureId: structure.id
        }
    });
    console.log('Tuteur créé');
    const stagiaireUser = await prisma.user.create({
        data: {
            email: 'stagiaire@mystage.com',
            passwordHash: await bcrypt.hash('stagiaire123', 10),
            role: client_1.UserRole.stagiaire,
            isActive: true,
            profile: {
                create: {
                    nom: 'Stagiaire',
                    prenom: 'Test',
                    telephone: '+229 00000004'
                }
            }
        }
    });
    await prisma.stagiaire.create({
        data: {
            userId: stagiaireUser.id,
            structureAffecteeId: structure.id,
            tuteurId: tuteur.userId
        }
    });
    console.log('Stagiaire créé');
    console.log('Base de données initialisée avec succès !');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map