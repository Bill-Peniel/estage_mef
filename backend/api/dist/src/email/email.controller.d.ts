import { EmailService } from './email.service';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    sendTestEmail(body: {
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
        details: any;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        details?: undefined;
    }>;
}
