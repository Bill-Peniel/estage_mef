const saveTuteur = async () => {
  try {
    loading.value = true
    error.value = null

    // Préparer les données du tuteur
    const tuteurData = {
      email: form.value.email,
      password: form.value.password,
      nom: form.value.nom,
      prenom: form.value.prenom,
      telephone: form.value.telephone,
      role: form.value.role,
      structureId: Number(form.value.structureId)
    }

    // Si c'est un agent, ajouter le sousStructureId
    if (form.value.role === 'agent') {
      tuteurData.sousStructureId = Number(form.value.structureId)
    }

    console.log('Données envoyées pour création:', tuteurData)

    if (editingTuteur.value) {
      // Mise à jour
      await api.put(`/tuteurs/${editingTuteur.value.id}`, tuteurData)
      toast.success('Tuteur mis à jour avec succès')
    } else {
      // Création
      const response = await api.post('/tuteurs', tuteurData)
      console.log('Réponse du serveur:', response.data)
      toast.success('Tuteur créé avec succès')
    }

    // Fermer le modal et réinitialiser le formulaire
    closeModal()
    await fetchTuteurs()
  } catch (err) {
    console.error('Erreur lors de la sauvegarde du tuteur:', err)
    if (err.response?.data?.message) {
      error.value = Array.isArray(err.response.data.message) 
        ? err.response.data.message.join(', ')
        : err.response.data.message
    } else {
      error.value = 'Erreur lors de la sauvegarde du tuteur'
    }
    toast.error(error.value)
  } finally {
    loading.value = false
  }
} 