export declare class CreateTuteurDto {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    telephone?: string;
    structureId: number;
    sousStructureId?: number | null;
    serviceId?: number | null;
    role: 'tuteur' | 'agent';
}
