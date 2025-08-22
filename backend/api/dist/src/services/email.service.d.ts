export declare class EmailService {
    private readonly logger;
    private transporter;
    private readonly maxRetries;
    private readonly retryDelay;
    constructor();
    private initializeTransporter;
    sendEmail(to: string, subject: string, text: string, html?: string): Promise<any>;
}
