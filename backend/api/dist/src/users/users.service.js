"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const promises_1 = require("fs/promises");
const path_1 = require("path");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        return {
            id: user.id,
            email: user.email,
            firstName: user.profile?.prenom || '',
            lastName: user.profile?.nom || '',
            telephone: user.profile?.telephone || '',
            avatar: user.profile?.avatar || '',
            birthDate: user.profile?.birthDate || '',
            school: user.profile?.school || '',
            major: user.profile?.major || '',
            notifMessages: user.notifMessages,
            notifEvaluation: user.notifEvaluation,
            notifRapports: user.notifRapports,
        };
    }
    async updateMe(userId, body, avatar) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        let avatarPath = user.profile?.avatar;
        if (avatar) {
            if (avatarPath) {
                try {
                    await (0, promises_1.unlink)((0, path_1.join)('uploads', avatarPath));
                }
                catch { }
            }
            avatarPath = avatar.filename;
        }
        await this.prisma.profile.update({
            where: { userId },
            data: {
                prenom: body.firstName,
                nom: body.lastName,
                telephone: body.telephone,
                avatar: avatarPath,
                birthDate: body.birthDate ? new Date(body.birthDate) : null,
                school: body.school,
                major: body.major,
            },
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                email: body.email,
                notifMessages: body.notifMessages === 'true' || body.notifMessages === true,
                notifEvaluation: body.notifEvaluation === 'true' || body.notifEvaluation === true,
                notifRapports: body.notifRapports === 'true' || body.notifRapports === true,
            },
        });
        return { message: 'Profil mis à jour' };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid)
            throw new common_1.ForbiddenException('Mot de passe actuel incorrect');
        const hash = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({ where: { id: userId }, data: { passwordHash: hash } });
        return { message: 'Mot de passe modifié' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map