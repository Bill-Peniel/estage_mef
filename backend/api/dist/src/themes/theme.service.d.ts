import { PrismaService } from '../prisma/prisma.service';
export declare class ThemeService {
    private prisma;
    constructor(prisma: PrismaService);
    getThemesByTuteur(tuteurId: string): Promise<{
        id: string;
        tuteurId: string;
        description: string | null;
        titre: string;
        disponible: boolean;
    }[]>;
    createTheme(tuteurId: string, data: {
        titre: string;
        description?: string;
        disponible?: boolean;
    }): Promise<{
        id: string;
        tuteurId: string;
        description: string | null;
        titre: string;
        disponible: boolean;
    }>;
    updateTheme(tuteurId: string, id: string, data: {
        titre: string;
        description?: string;
        disponible?: boolean;
    }): Promise<{
        id: string;
        tuteurId: string;
        description: string | null;
        titre: string;
        disponible: boolean;
    }>;
    deleteTheme(tuteurId: string, id: string): Promise<{
        id: string;
        tuteurId: string;
        description: string | null;
        titre: string;
        disponible: boolean;
    }>;
    affecterTheme(tuteurId: string, id: string, stagiaireId: string): Promise<{
        id: string;
        tuteurId: string;
        description: string | null;
        titre: string;
        disponible: boolean;
    }>;
}
