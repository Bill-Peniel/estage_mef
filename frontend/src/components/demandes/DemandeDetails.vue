<template>
      <!-- Modal principal -->
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click.self="$emit('close')">
      <div class="relative top-16 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white justify-between items-center">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-2xl font-bold text-gray-900">Détails de la demande</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Informations du stagiaire -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold text-gray-800 mb-3">Informations du stagiaire</h4>
        
        <!-- Photo de profil -->
        <div class="flex items-center mb-4">
          <div class="mr-4">
            <img
              v-if="getPhotoUrl"
              :src="getPhotoUrl"
              alt="Photo du stagiaire"
              class="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-md cursor-pointer hover:opacity-80 transition-opacity"
              @error="$event.target.style.display='none'"
              @click="showPhotoModal = true"
            />
            <div
              v-if="!getPhotoUrl"
              class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300"
            >
              <i class="fas fa-user text-gray-400 text-2xl"></i>
            </div>
          </div>
          <div class="flex-1">
            <h5 class="text-lg font-medium text-gray-900">
              {{ demande.nom || `${demande.prenom || ''} ${demande.nom || ''}`.trim() }}
            </h5>
            <p class="text-sm text-gray-500">{{ demande.email }}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-600">Nom complet</p>
            <p class="font-medium break-words">{{ demande.nom }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Email</p>
            <p class="font-medium break-words">{{ demande.email }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Téléphone</p>
            <p class="font-medium break-words">{{ demande.telephone || demande.stagiaire?.profile?.telephone || 'Non spécifié' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Code de suivi</p>
            <p class="font-medium break-words">{{ demande.code_suivi }}</p>
          </div>
        </div>
      </div>

      <!-- Informations du stage -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold text-gray-800 mb-3">Informations du stage</h4>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-600">Type de stage</p>
            <p class="font-medium">{{ demande.typeStage }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Département</p>
            <p class="font-medium">{{ getDepartmentName(demande.departement) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Université</p>
            <p class="font-medium">{{ demande.universite }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Domaine d'études</p>
            <p class="font-medium">{{ demande.domaineEtude }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Date de début</p>
            <p class="font-medium">{{ formatDate(demande.dateDebut) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Date de fin</p>
            <p class="font-medium">{{ formatDate(demande.dateFin) }}</p>
          </div>
        </div>
      </div>

      <!-- Documents -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold text-gray-800 mb-3">Documents</h4>
        <div class="grid grid-cols-1 gap-4">
          <!-- CV -->
          <div v-if="demande.cv" class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p class="font-medium">CV</p>
              <p class="text-sm text-gray-500">Curriculum Vitae</p>
            </div>
            <a :href="getDocumentUrl(demande.cv)" target="_blank" class="btn-primary">
              <i class="fas fa-eye mr-2"></i>
              Voir
            </a>
          </div>

          <!-- Lettre de motivation -->
          <div v-if="demande.lettreMotivation" class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p class="font-medium">Lettre de motivation</p>
              <p class="text-sm text-gray-500">Lettre de motivation</p>
            </div>
            <a :href="getDocumentUrl(demande.lettreMotivation)" target="_blank" class="btn-primary">
              <i class="fas fa-eye mr-2"></i>
              Voir
            </a>
          </div>

          <!-- Carte d'identité -->
          <div v-if="demande.carteIdentite" class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p class="font-medium">Carte d'identité</p>
              <p class="text-sm text-gray-500">Pièce d'identité</p>
            </div>
            <a :href="getDocumentUrl(demande.carteIdentite)" target="_blank" class="btn-primary">
              <i class="fas fa-eye mr-2"></i>
              Voir
            </a>
          </div>

          <!-- Inscription universitaire -->
          <div v-if="demande.inscriptionUniversitaire" class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p class="font-medium">Inscription universitaire</p>
              <p class="text-sm text-gray-500">Certificat d'inscription</p>
            </div>
            <a :href="getDocumentUrl(demande.inscriptionUniversitaire)" target="_blank" class="btn-primary">
              <i class="fas fa-eye mr-2"></i>
              Voir
            </a>
          </div>

          <!-- Lettre de recommandation -->
          <div v-if="demande.recommandation" class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p class="font-medium">Lettre de recommandation</p>
              <p class="text-sm text-gray-500">Lettre de recommandation</p>
            </div>
            <a :href="getDocumentUrl(demande.recommandation)" target="_blank" class="btn-primary">
              <i class="fas fa-eye mr-2"></i>
              Voir
            </a>
          </div>

          <!-- Autres documents -->
          <div v-if="demande.autresDocuments && demande.autresDocuments.length > 0" class="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p class="font-medium">Autres documents</p>
              <p class="text-sm text-gray-500">Documents supplémentaires</p>
            </div>
            <div class="space-y-2">
              <a v-for="(doc, index) in demande.autresDocuments" 
                 :key="index" 
                 :href="getDocumentUrl(doc)" 
                 target="_blank" 
                 class="btn-primary block">
                <i class="fas fa-eye mr-2"></i>
                Voir document {{ index + 1 }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 mt-6">
        <button 
          @click="showRejectModal = true"
          :disabled="isLoading"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
        >
          <i class="fas fa-times mr-2"></i>Refuser
        </button>
        <button 
          @click="handleApprove"
          :disabled="isLoading"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          <i class="fas fa-check mr-2"></i>Approuver
        </button>
      </div>
    </div>

    <!-- Modal de refus -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Motif du refus</h3>
          <button @click="showRejectModal = false" class="text-gray-400 hover:text-gray-500">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Motif du refus
          </label>
          <textarea
            v-model="rejectMotif"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Veuillez indiquer le motif du refus..."
          ></textarea>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="showRejectModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            @click="handleReject"
            :disabled="isLoading"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            Confirmer le refus
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal pour afficher la photo en grand -->
  <div v-if="showPhotoModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]" @click.self="showPhotoModal = false">
    <div class="relative max-w-4xl mx-auto p-4">
      <button @click="showPhotoModal = false" class="absolute top-0 right-0 -mt-10 -mr-10 text-white hover:text-gray-300">
        <i class="fas fa-times text-2xl"></i>
      </button>
      <img
        :src="getPhotoUrl"
        alt="Photo du stagiaire en grand format"
        class="max-h-[80vh] max-w-full object-contain rounded-lg shadow-xl"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import api from '@/services/api';
import { tuteurService } from '@/services/api';

const FILES_URL = 'http://localhost:3002'; // URL dédiée pour les fichiers

export default {
  name: 'DemandeDetails',
  props: {
    demande: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const toast = useToast();
    const isLoading = ref(false);
    const showRejectModal = ref(false);
    const showPhotoModal = ref(false);
    const rejectMotif = ref('');
    const structures = ref([]);

    // Fusionne les champs de documents dans demande si un objet documents existe
    onMounted(async () => {
      // Charger les structures
      await loadStructures();
      
      // Si props.demande.documents existe, fusionne ses champs dans demande
      if (props.demande && props.demande.documents) {
        Object.assign(props.demande, props.demande.documents);
      }
      console.log('DemandeDetails - Données reçues:', {
        demande: props.demande,
        photo: props.demande.photo,
        telephone: props.demande.telephone,
        stagiaireTelephone: props.demande.stagiaire?.profile?.telephone,
        documents: {
          cv: props.demande.cv,
          lettreMotivation: props.demande.lettreMotivation,
          carteIdentite: props.demande.carteIdentite,
          inscriptionUniversitaire: props.demande.inscriptionUniversitaire,
          recommandation: props.demande.recommandation,
          autresDocuments: props.demande.autresDocuments
        }
      });
    });

    const formatDate = (date) => {
      if (!date) return 'Non spécifiée'
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Ajoute une fonction utilitaire pour générer l'URL complète
    // Fonction pour obtenir l'URL de la photo
    const getPhotoUrl = computed(() => {
      const photo = props.demande.photo || props.demande.profilePhoto;
      if (!photo) return null;
      return getDocumentUrl(photo);
    });

    // Fonction pour charger les structures
    const loadStructures = async () => {
      try {
        const response = await tuteurService.getStructures();
        if (Array.isArray(response)) {
          structures.value = response.map(structure => ({
            id: structure.id,
            nom: structure.nomStructure || structure.nom
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des structures:', error);
      }
    };

    // Fonction pour obtenir le nom du département
    const getDepartmentName = (departmentId) => {
      if (!departmentId) return 'Non spécifié';
      const structure = structures.value.find(s => s.id == departmentId);
      return structure ? structure.nom : `Département ${departmentId}`;
    };

    // Ajoute une fonction utilitaire pour générer l'URL complète
    const getDocumentUrl = (path) => {
      if (!path) return '#';
      if (path.startsWith('http')) return path;
      if (path.startsWith('/uploads')) return `${FILES_URL}${path}`;
      return `${FILES_URL}/uploads/${path.replace(/^\/+/,'')}`;
    };

    const handleApprove = async () => {
      try {
        isLoading.value = true;
        const response = await fetch(`/api/stage-request/${props.demande.id}/approve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Erreur lors de l\'approbation de la demande');
        }

        const result = await response.json();
        toast.success('La demande a été approuvée avec succès');
        emit('update');
        emit('close');
      } catch (error) {
        console.error('Erreur:', error);
        toast.error(error.message || 'Une erreur est survenue lors de l\'approbation de la demande');
      } finally {
        isLoading.value = false;
      }
    }

    const handleReject = async () => {
      if (!rejectMotif.value) {
        toast.error('Veuillez indiquer le motif du refus');
        return;
      }

      try {
        isLoading.value = true;
        const response = await api.post(`/stage-request/${props.demande.id}/reject`, {
          motif: rejectMotif.value
        }, {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data) {
          toast.success('La demande a été refusée avec succès');
          showRejectModal.value = false;
          emit('close');
          emit('refresh');
        } else {
          throw new Error('Réponse invalide du serveur');
        }
      } catch (error) {
        console.error('Erreur lors du refus:', error);
        if (error.code === 'ECONNABORTED') {
          toast.error('Le serveur met trop de temps à répondre. Veuillez réessayer.');
        } else if (error.response) {
          toast.error(error.response.data?.message || 'Une erreur est survenue lors du refus');
        } else {
          toast.error('Une erreur est survenue lors du refus. Veuillez réessayer.');
        }
      } finally {
        isLoading.value = false;
      }
    }

    return {
      formatDate,
      handleApprove,
      handleReject,
      isLoading,
      showRejectModal,
      rejectMotif,
      getDocumentUrl,
      getPhotoUrl,
      showPhotoModal,
      getDepartmentName
    }
  }
}
</script>

<style scoped>
.fixed {
  position: fixed;
  z-index: 9999;
}
</style>
