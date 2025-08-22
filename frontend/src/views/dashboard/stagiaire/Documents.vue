<template>
  <div class="p-6 px-60">
    <h1 class="text-2xl font-semibold mb-6">Mes Documents personnels</h1>
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <form @submit.prevent="uploadDocument" class="mb-8 flex flex-col md:flex-row md:items-end gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Type de document</label>
            <select v-model="newDoc.type" class="border rounded px-2 py-1">
              <option disabled value="">Choisir un type</option>
              <option v-for="type in documentTypes" :key="type.key" :value="type.key">{{ type.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Fichier</label>
            <input type="file" ref="fileInput" @change="onFileChange" />
            <div v-if="newDoc.file" class="text-xs text-gray-600 mt-1">Fichier sélectionné : {{ newDoc.file.name }}</div>
          </div>
          <button class="btn-primary h-10 px-6 flex items-center justify-center gap-2" :disabled="uploading || !newDoc.type || !newDoc.file">
            <span v-if="uploading">
              <svg class="animate-spin h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            </span>
            <span>{{ uploading ? 'Téléversement...' : 'Téléverser' }}</span>
          </button>
        </form>
        <div v-if="uploading" class="text-center text-gray-500 mb-2">Téléversement en cours...</div>
        <div v-if="error" class="text-center text-red-500 mb-2 bg-red-50 border border-red-200 rounded p-2">{{ error }}</div>
        <div v-if="success" class="text-center text-green-600 mb-2 bg-green-50 border border-green-200 rounded p-2">{{ success }}</div>
        <h3 class="text-lg font-medium mb-4">Mes documents sauvegardés</h3>
        <div v-if="loading" class="text-center py-10">Chargement...</div>
        <div v-else-if="documents.length === 0" class="text-center py-10 text-gray-500">Aucun document sauvegardé.</div>
        <table v-else class="w-full text-left border text-sm md:text-base">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2">Type</th>
              <th class="p-2">Nom</th>
              <th class="p-2">Date</th>
              <th class="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="doc in documents" :key="doc.id" class="border-t hover:bg-gray-50 transition">
              <td class="p-2">{{ getTypeLabel(doc.type) }}</td>
              <td class="p-2 break-all max-w-xs">{{ doc.name }}</td>
              <td class="p-2">{{ formatDate(doc.uploadedAt) }}</td>
              <td class="p-2 flex gap-2 items-center flex-wrap">
                <a :href="getDocumentUrl(doc.path)" target="_blank" class="text-blue-600 underline">Télécharger</a>
                <button class="text-red-500 hover:underline" @click="deleteDocument(doc.id)"><i class="fas fa-trash"></i> Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Documents',
  data() {
    return {
      loading: true,
      uploading: false,
      error: '',
      success: '',
      documents: [],
      newDoc: {
        type: '',
        file: null
      },
      documentTypes: [
        { key: 'cv', label: 'CV' },
        { key: 'lettre_motivation', label: 'Lettre de motivation' },
        { key: 'carte_identite', label: 'Carte d\'identité' },
        { key: 'inscription_universitaire', label: 'Inscription universitaire' },
        { key: 'recommandation', label: 'Lettre de recommandation' },
        { key: 'autre', label: 'Autre' },
      ],
    }
  },
  methods: {
    async fetchDocuments() {
      this.loading = true;
      this.error = '';
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/documents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.documents = res.data;
      } catch (e) {
        this.error = "Erreur lors du chargement des documents.";
      } finally {
        this.loading = false;
      }
    },
    onFileChange(e) {
      this.newDoc.file = e.target.files[0];
      this.success = '';
      this.error = '';
    },
    async uploadDocument() {
      if (!this.newDoc.type || !this.newDoc.file) {
        this.error = 'Veuillez choisir un type et un fichier.';
        return;
      }
      this.uploading = true;
      this.error = '';
      this.success = '';
      try {
        const formData = new FormData();
        formData.append('type', this.newDoc.type);
        formData.append('file', this.newDoc.file);
        const token = localStorage.getItem('token');
        await axios.post('/api/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        this.success = 'Document téléversé avec succès !';
        this.newDoc = { type: '', file: null };
        // Réinitialiser le champ fichier
        if (this.$refs.fileInput) this.$refs.fileInput.value = '';
        await this.fetchDocuments();
      } catch (e) {
        this.error = "Erreur lors du téléversement.";
      } finally {
        this.uploading = false;
      }
    },
    async deleteDocument(id) {
      if (!confirm('Supprimer ce document ?')) return;
      this.error = '';
      this.success = '';
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/documents/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.success = 'Document supprimé.';
        await this.fetchDocuments();
      } catch (e) {
        this.error = "Erreur lors de la suppression.";
      }
    },
    getDocumentUrl(path) {
      if (!path) return '#';
      // Adapter selon la config backend
      return `/api/uploads/${path}`;
    },
    getTypeLabel(key) {
      const found = this.documentTypes.find(t => t.key === key);
      return found ? found.label : key;
    },
    formatDate(dateStr) {
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    }
  },
  async mounted() {
    await this.fetchDocuments();
  }
}
</script>
