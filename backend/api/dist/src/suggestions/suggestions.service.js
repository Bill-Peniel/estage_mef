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
exports.SuggestionsService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const prisma_service_1 = require("../prisma/prisma.service");
let SuggestionsService = class SuggestionsService {
    prisma;
    openai;
    constructor(prisma) {
        this.prisma = prisma;
        this.openai = new openai_1.default({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: 'https://api.groq.com/openai/v1',
        });
    }
    async suggestDepartmentsForUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true },
        });
        if (!user || !user.profile)
            throw new common_1.NotFoundException('Profil non trouvé');
        const filiere = (user.profile.major || '').trim();
        if (!filiere)
            return [];
        const prompt = `Voici la filière d'un étudiant : "${filiere}". Sur la base de cette filière, propose une liste de départements d'accueil pertinents dans une administration publique. Réponds uniquement par une liste de noms de départements, séparés par des virgules. Si aucun département n'est pertinent, réponds "Aucune suggestion".`;
        try {
            const response = await this.openai.chat.completions.create({
                model: 'llama3-8b-8192',
                messages: [
                    { role: 'system', content: "Tu es un assistant qui aide à orienter les étudiants vers les bons départements d'accueil pour leur stage, selon leur filière." },
                    { role: 'user', content: prompt },
                ],
                max_tokens: 200,
                temperature: 0.2,
                user: userId,
            });
            const firstChoice = response.choices[0];
            if (firstChoice && firstChoice.message && firstChoice.message.content) {
                const content = firstChoice.message.content.trim();
                if (content.toLowerCase().includes('aucune suggestion'))
                    return [];
                return content.split(',').map(dep => dep.trim()).filter(Boolean);
            }
            return [];
        }
        catch (error) {
            console.error('Erreur Groq suggestion:', error);
            return [];
        }
    }
};
exports.SuggestionsService = SuggestionsService;
exports.SuggestionsService = SuggestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuggestionsService);
//# sourceMappingURL=suggestions.service.js.map