import { DocumentService } from './document.service';
import { Response } from 'express';
import { File as MulterFile } from 'multer';
export declare class DocumentController {
    private readonly documentService;
    constructor(documentService: DocumentService);
    getDocuments(req: any): Promise<{
        id: string;
        type: string;
        name: string;
        userId: string;
        path: string;
        uploadedAt: Date;
    }[]>;
    uploadDocument(file: MulterFile, type: string, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteDocument(id: string, req: any): Promise<{
        id: string;
        type: string;
        name: string;
        userId: string;
        path: string;
        uploadedAt: Date;
    }>;
}
