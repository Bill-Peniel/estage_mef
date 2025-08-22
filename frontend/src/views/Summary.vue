const submitApplication = async () => {
  try {
    // Tester d'abord la connexion au serveur
    await stageRequestService.testConnection();
    
    // Si le test réussit, soumettre la demande
    await store.dispatch('submitApplication');
    
    // Rediriger vers la page de confirmation
    router.push('/confirmation');
  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
    // Afficher un message d'erreur à l'utilisateur
    alert(error.message || 'Une erreur est survenue lors de la soumission de votre demande.');
  }
}; 