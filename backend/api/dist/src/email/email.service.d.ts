export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    sendStageRequestConfirmation(email: string, stageRequest: any): Promise<any>;
    sendStageRequestApproval(email: string, stageRequest: any): Promise<any>;
    sendStageRequestRejection(email: string, stageRequest: any, motif: string): Promise<any>;
    sendTestEmail(email: string): Promise<any>;
}
