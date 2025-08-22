import { PrismaClient, Prisma } from '@prisma/client';
import { Logger } from '@nestjs/common';

const prisma = new PrismaClient();
const logger = new Logger('CleanupStageRequests');

async function cleanupStageRequests() {
  try {
    logger.log('Début du nettoyage des demandes de stage...');

    // 1. Archiver les anciennes demandes
    logger.log('Archivage des anciennes demandes...');
    const oldRequests = await prisma.demandeStage.findMany({
      where: {
        dateFin: {
          lt: new Date()
        }
      }
    });

    if (oldRequests.length > 0) {
      await prisma.$transaction(
        oldRequests.map(request =>
          prisma.demandeStage.update({
            where: { id: request.id },
            data: { statut: 'rejete' }
          })
        )
      );
      logger.log(`${oldRequests.length} anciennes demandes archivées`);
    }

    // 2. Supprimer les demandes en double
    logger.log('Suppression des demandes en double...');
    const duplicates = await prisma.$queryRaw<{ id: string }[]>`
      DELETE FROM demandes_stages a
      USING demandes_stages b
      WHERE a.id > b.id
      AND a.stagiaire_id = b.stagiaire_id
      AND a.date_debut = b.date_debut
      RETURNING a.id;
    `;
    logger.log(`${duplicates.length} demandes en double supprimées`);

    // 3. Supprimer les demandes sans stagiaire associé
    logger.log('Suppression des demandes sans stagiaire...');
    const invalidStagiaire = await prisma.demandeStage.deleteMany({
      where: {
        stagiaireId: {
          notIn: await prisma.stagiaire.findMany({
            select: { userId: true }
          }).then(stagiaires => stagiaires.map(s => s.userId))
        }
      }
    });
    logger.log(`${invalidStagiaire.count} demandes sans stagiaire supprimées`);

    // 4. Supprimer les demandes sans structure cible
    logger.log('Suppression des demandes sans structure cible...');
    const invalidStructure = await prisma.demandeStage.deleteMany({
      where: {
        structureCibleId: {
          notIn: await prisma.structure.findMany({
            select: { id: true }
          }).then(structures => structures.map(s => s.id))
        }
      }
    });
    logger.log(`${invalidStructure.count} demandes sans structure cible supprimées`);

    // 5. Supprimer les demandes avec des dates invalides
    logger.log('Suppression des demandes avec dates invalides...');
    const invalidDates = await prisma.demandeStage.deleteMany({
      where: {
        dateDebut: {
          gte: prisma.demandeStage.fields.dateFin
        }
      }
    });
    logger.log(`${invalidDates.count} demandes avec dates invalides supprimées`);

    logger.log('Nettoyage terminé avec succès');
  } catch (error) {
    logger.error('Erreur lors du nettoyage:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupStageRequests()
  .catch(error => {
    console.error('Erreur:', error);
    process.exit(1);
  }); 