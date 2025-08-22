import api from '../api'

export async function getStructureOverview(structureId) {
  const { data } = await api.get(`/stage-request/statistics/overview/${structureId}`)
  return data
}

export async function getTuteursStats(structureId) {
  const { data } = await api.get(`/stage-request/statistics/tuteurs/${structureId}`)
  return data
}

export async function getTuteurOverview(tuteurId) {
  const { data } = await api.get(`/statistics/tuteur/${tuteurId}`)
  return data
}

export async function getTuteurActivities(tuteurId) {
  const { data } = await api.get(`/statistics/tuteur/${tuteurId}/activities`)
  return data
} 