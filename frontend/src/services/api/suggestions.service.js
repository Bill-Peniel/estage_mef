import axios from 'axios';

export async function fetchSuggestedDepartments() {
  const token = localStorage.getItem('token');
  const res = await axios.get('/api/suggestions/departements', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
} 