"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageRequestModule = void 0;
const common_1 = require("@nestjs/common");
const stage_request_controller_1 = require("./stage-request.controller");
const stage_request_service_1 = require("./stage-request.service");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_module_1 = require("../auth/auth.module");
const email_module_1 = require("../email/email.module");
const notification_module_1 = require("../notification/notification.module");
let StageRequestModule = class StageRequestModule {
};
exports.StageRequestModule = StageRequestModule;
exports.StageRequestModule = StageRequestModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, email_module_1.EmailModule, notification_module_1.NotificationModule],
        controllers: [stage_request_controller_1.StageRequestController],
        providers: [stage_request_service_1.StageRequestService],
        exports: [stage_request_service_1.StageRequestService]
    })
], StageRequestModule);
//# sourceMappingURL=stage-request.module.js.map