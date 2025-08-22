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
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
let ChatbotService = class ChatbotService {
    openai;
    constructor() {
        this.openai = new openai_1.default({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: 'https://api.groq.com/openai/v1',
        });
    }
    async getAnswer(message, userId) {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'llama3-8b-8192',
                messages: [
                    {
                        role: 'system',
                        content: "Tu es l'assistant intelligent de la plateforme de gestion de stages. Tu dois répondre uniquement aux questions en rapport avec la plateforme, ses fonctionnalités, ou le contexte universitaire des stages. Si la question n'a aucun rapport avec la plateforme ou les stages, réponds clairement : 'Je suis désolé, je ne peux répondre qu’aux questions concernant la plateforme de gestion de stages.' Si tu ne sais pas, invite l'utilisateur à contacter le support.",
                    },
                    { role: 'user', content: message },
                ],
                max_tokens: 300,
                temperature: 0.7,
                user: userId,
            });
            const firstChoice = response.choices[0];
            if (firstChoice && firstChoice.message && firstChoice.message.content) {
                return firstChoice.message.content.trim();
            }
            return "Je n'ai pas compris votre question. Essayez de la reformuler.";
        }
        catch (error) {
            console.error('Erreur Groq:', error);
            return "Je rencontre un problème pour répondre actuellement. Merci de réessayer plus tard.";
        }
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ChatbotService);
//# sourceMappingURL=chatbot.service.js.map