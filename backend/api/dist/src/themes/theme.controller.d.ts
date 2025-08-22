import { ThemeService } from './theme.service';
export declare class ThemeController {
    private readonly themeService;
    constructor(themeService: ThemeService);
    getThemes(req: any): Promise<{
        id: string;
        tuteurId: string;
        description: string | null;
        titre: string;
        disponible: boolean;
    }[]>;
    createTheme(req: any, body: {
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
    updateTheme(req: any, id: string, body: {
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
    deleteTheme(req: any, id: string): Promise<{
        id: string;
        tuteurId: string;
        description: string | null;
        titre: string;
        disponible: boolean;
    }>;
    affecterTheme(req: any, id: string, body: {
        stagiaireId: string;
    }): Promise<{
        id: string;
        tuteurId: string;
        description: string | null;
        titre: string;
        disponible: boolean;
    }>;
}
