"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
let MessagesService = class MessagesService {
    messages = [];
    getConversation(tuteurId, stagiaireId) {
        const conv = this.messages.filter(m => (m.from === tuteurId && m.to === stagiaireId) ||
            (m.from === stagiaireId && m.to === tuteurId));
        console.log('getConversation', { tuteurId, stagiaireId, conv, all: this.messages });
        return conv;
    }
    sendMessage({ from, to, content, role }) {
        const message = {
            id: Date.now().toString(),
            from,
            to,
            content,
            role,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.push(message);
        console.log('Message envoyé:', message);
        return message;
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)()
], MessagesService);
//# sourceMappingURL=messages.service.js.map