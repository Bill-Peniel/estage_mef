-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'dpaf', 'structure', 'tuteur', 'stagiaire');

-- CreateEnum
CREATE TYPE "StatutDemande" AS ENUM ('en_attente', 'confirme', 'rejete');

-- CreateEnum
CREATE TYPE "StatutStage" AS ENUM ('en_cours', 'termine', 'annule');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "structure_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT,
    "avatar" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dpaf" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,

    CONSTRAINT "dpaf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "structures" (
    "id" SERIAL NOT NULL,
    "nomStructure" TEXT NOT NULL,
    "sigle" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tuteurs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "structure_id" INTEGER,

    CONSTRAINT "tuteurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stagiaires" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "structure_affectee_id" INTEGER,
    "tuteur_id" UUID,

    CONSTRAINT "stagiaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demandes_stages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stagiaire_id" UUID NOT NULL,
    "structure_cible_id" INTEGER,
    "statut" "StatutDemande" NOT NULL DEFAULT 'en_attente',
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "details" JSONB,

    CONSTRAINT "demandes_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "demande_stage_id" UUID NOT NULL,
    "tuteur_id" UUID NOT NULL,
    "structure_id" INTEGER NOT NULL,
    "stagiaire_id" UUID NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "statut" "StatutStage" NOT NULL DEFAULT 'en_cours',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "expediteur_id" UUID NOT NULL,
    "destinataire_id" UUID NOT NULL,
    "contenu" TEXT NOT NULL,
    "lu" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "themes_tuteur" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tuteur_id" UUID NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "themes_tuteur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametres_systeme" (
    "id" SERIAL NOT NULL,
    "clé" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,

    CONSTRAINT "parametres_systeme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_actions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "cible" TEXT NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "demande_stage_id" UUID,

    CONSTRAINT "journal_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stage_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "type" TEXT NOT NULL,
    "departement" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "motivation" TEXT NOT NULL,
    "competences" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "universite" TEXT NOT NULL,
    "domaineEtude" TEXT NOT NULL,
    "anneeEtude" TEXT NOT NULL,
    "code_suivi" TEXT,
    "stagiaireId" UUID NOT NULL,
    "cv" TEXT,
    "lettreMotivation" TEXT,
    "carteIdentite" TEXT,
    "inscriptionUniversitaire" TEXT,
    "recommandation" TEXT,
    "autresDocuments" JSONB,

    CONSTRAINT "stage_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "user_id" UUID,
    "role" "UserRole",
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "stagiaireId" UUID NOT NULL,
    "tuteurId" UUID NOT NULL,
    "criteres" JSONB NOT NULL,
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "dpaf_user_id_key" ON "dpaf"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "structures_nomStructure_key" ON "structures"("nomStructure");

-- CreateIndex
CREATE UNIQUE INDEX "structures_sigle_key" ON "structures"("sigle");

-- CreateIndex
CREATE UNIQUE INDEX "tuteurs_user_id_key" ON "tuteurs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "stagiaires_user_id_key" ON "stagiaires"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "stages_demande_stage_id_key" ON "stages"("demande_stage_id");

-- CreateIndex
CREATE UNIQUE INDEX "parametres_systeme_clé_key" ON "parametres_systeme"("clé");

-- CreateIndex
CREATE UNIQUE INDEX "stage_requests_code_suivi_key" ON "stage_requests"("code_suivi");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dpaf" ADD CONSTRAINT "dpaf_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "structures" ADD CONSTRAINT "structures_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "structures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tuteurs" ADD CONSTRAINT "tuteurs_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tuteurs" ADD CONSTRAINT "tuteurs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stagiaires" ADD CONSTRAINT "stagiaires_structure_affectee_id_fkey" FOREIGN KEY ("structure_affectee_id") REFERENCES "structures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stagiaires" ADD CONSTRAINT "stagiaires_tuteur_id_fkey" FOREIGN KEY ("tuteur_id") REFERENCES "tuteurs"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stagiaires" ADD CONSTRAINT "stagiaires_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demandes_stages" ADD CONSTRAINT "demandes_stages_stagiaire_id_fkey" FOREIGN KEY ("stagiaire_id") REFERENCES "stagiaires"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demandes_stages" ADD CONSTRAINT "demandes_stages_structure_cible_id_fkey" FOREIGN KEY ("structure_cible_id") REFERENCES "structures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_demande_stage_id_fkey" FOREIGN KEY ("demande_stage_id") REFERENCES "demandes_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_stagiaire_id_fkey" FOREIGN KEY ("stagiaire_id") REFERENCES "stagiaires"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_tuteur_id_fkey" FOREIGN KEY ("tuteur_id") REFERENCES "tuteurs"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_destinataire_id_fkey" FOREIGN KEY ("destinataire_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_expediteur_id_fkey" FOREIGN KEY ("expediteur_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "themes_tuteur" ADD CONSTRAINT "themes_tuteur_tuteur_id_fkey" FOREIGN KEY ("tuteur_id") REFERENCES "tuteurs"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_actions" ADD CONSTRAINT "journal_actions_demande_stage_id_fkey" FOREIGN KEY ("demande_stage_id") REFERENCES "demandes_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_actions" ADD CONSTRAINT "journal_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_requests" ADD CONSTRAINT "stage_requests_stagiaireId_fkey" FOREIGN KEY ("stagiaireId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_stagiaireId_fkey" FOREIGN KEY ("stagiaireId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_tuteurId_fkey" FOREIGN KEY ("tuteurId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
