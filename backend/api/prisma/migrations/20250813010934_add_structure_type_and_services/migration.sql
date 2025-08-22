-- AlterTable
ALTER TABLE "stagiaires" ADD COLUMN     "service_affecte_id" INTEGER;

-- AlterTable
ALTER TABLE "structures" ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "tuteurs" ADD COLUMN     "service_id" INTEGER;

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "nomService" TEXT NOT NULL,
    "description" TEXT,
    "structure_id" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_nomService_key" ON "services"("nomService");

-- AddForeignKey
ALTER TABLE "tuteurs" ADD CONSTRAINT "tuteurs_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stagiaires" ADD CONSTRAINT "stagiaires_service_affecte_id_fkey" FOREIGN KEY ("service_affecte_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_structure_id_fkey" FOREIGN KEY ("structure_id") REFERENCES "structures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
