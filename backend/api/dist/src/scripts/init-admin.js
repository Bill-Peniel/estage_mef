"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    const existingAdmin = await prisma.user.findFirst({
        where: {
            role: client_1.UserRole.admin
        }
    });
    if (existingAdmin) {
        console.log('Un administrateur existe déjà');
        return;
    }
    const admin = await prisma.user.create({
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
//# sourceMappingURL=init-admin.js.map