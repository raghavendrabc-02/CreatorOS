import { apiRequest } from '../../api/client.js'

// Backend calls for Visual Asset Generator projects (backend/app/routers/visual_projects.py).
// The page keeps settings as { style, aspectRatio, quality }; the API uses snake_case names.

// Converts what the page edits into the fields the API expects. A blank title is saved as no title.
function toApiFields({ title, script, settings }) {
  return {
    title: title.trim() || null,
    script,
    style: settings.style,
    aspect_ratio: settings.aspectRatio,
    quality: settings.quality,
  }
}

// Converts an API project into what the page edits and shows.
export function fromApiProject(project) {
  return {
    id: project.id,
    title: project.title ?? '',
    script: project.script,
    settings: { style: project.style, aspectRatio: project.aspect_ratio, quality: project.quality },
    scenes: project.scenes,
  }
}

export function listProjects(platform) {
  return apiRequest(`/visual-projects?platform=${encodeURIComponent(platform)}`)
}

export async function getProject(id) {
  return fromApiProject(await apiRequest(`/visual-projects/${id}`))
}

export async function createProject(platform, draft) {
  return fromApiProject(
    await apiRequest('/visual-projects', { method: 'POST', body: { platform, ...toApiFields(draft) } }),
  )
}

export function updateProject(id, draft) {
  return apiRequest(`/visual-projects/${id}`, { method: 'PATCH', body: toApiFields(draft) })
}

export function deleteProject(id) {
  return apiRequest(`/visual-projects/${id}`, { method: 'DELETE' })
}
