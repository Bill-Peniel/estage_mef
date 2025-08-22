interface Message {
    id: string;
    from: string;
    to: string;
    content: string;
    role: 'tuteur' | 'stagiaire';
    time: string;
}
export declare class MessagesService {
    private messages;
    getConversation(tuteurId: string, stagiaireId: string): Message[];
    sendMessage({ from, to, content, role }: {
        from: string;
        to: string;
        content: string;
        role: 'tuteur' | 'stagiaire';
    }): Message;
}
export {};
