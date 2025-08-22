export declare class ChatbotService {
    private openai;
    constructor();
    getAnswer(message: string, userId?: string): Promise<string>;
}
