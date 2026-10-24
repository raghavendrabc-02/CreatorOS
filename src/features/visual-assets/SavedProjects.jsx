import { useEffect, useState } from 'react'
import { FolderIcon, PlusIcon, RefreshIcon, TrashIcon } from '../../components/icons.jsx'
import { formatTimeAgo } from '../../utils/formatTimeAgo.js'
import { listProjects } from './visualProjectsApi.js'
import { ASPECT_RATIOS, VISUAL_STYLES } from './options.js'

function labelFor(options, value) {
  return options.find((option) => option.value === value)?.label.split(' (')[0] ?? value
}

function projectName(project) {
  return project.title || 'Untitled project'
}

// Adds how long ago each project was edited. Worked out when the list loads, not on every render.
function withMinutesAgo(projects) {
  const now = Date.now()
  return projects.map((project) => ({
    ...project,
    minutesAgo: Math.max(0, Math.floor((now - Date.parse(project.updated_at)) / 60_000)),
  }))
}

// Lists this platform's saved projects so one can be reopened or deleted.
// `refreshKey` changes whenever a save finishes, which reloads the list.
function SavedProjects({ platform, currentId, refreshKey, onOpen, onNew, onDelete }) {
  const [projects, setProjects] = useState(null)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let ignore = false
    listProjects(platform)
      .then((list) => {
        if (ignore) return
        setProjects(withMinutesAgo(list))
        setError('')
      })
      .catch((listError) => {
        if (!ignore) setError(listError.message)
      })
    return () => {
      ignore = true
    }
  }, [platform, refreshKey, retryCount])

  return (
    <section className="panel vag-saved" aria-labelledby="saved-heading">
      <div className="vag-saved__top">
        <h2 id="saved-heading" className="vag-settings__title">
          <FolderIcon />
          Saved projects
        </h2>
        <button type="button" className="button button--soft" onClick={onNew} disabled={currentId == null}>
          <PlusIcon />
          New
        </button>
      </div>

      {error ? (
        <div className="notice vag-saved__error" role="alert">
          <span>{error}</span>
          <button type="button" className="button button--text" onClick={() => setRetryCount((n) => n + 1)}>
            <RefreshIcon />
            Retry
          </button>
        </div>
      ) : projects === null ? (
        <p className="vag-saved__empty">Loading…</p>
      ) : projects.length === 0 ? (
        <p className="vag-saved__empty">Nothing saved yet. Your script saves automatically as you type.</p>
      ) : (
        <ul className="vag-saved__list">
          {projects.map((project) => {
            const isCurrent = project.id === currentId
            return (
              <li key={project.id} className={`vag-saved__item${isCurrent ? ' vag-saved__item--current' : ''}`}>
                <button
                  type="button"
                  className="vag-saved__open"
                  onClick={() => onOpen(project.id)}
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  <span className="vag-saved__name">{projectName(project)}</span>
                  <span className="vag-saved__meta">
                    {labelFor(VISUAL_STYLES, project.style)} · {labelFor(ASPECT_RATIOS, project.aspect_ratio)} ·{' '}
                    {project.scene_count} {project.scene_count === 1 ? 'scene' : 'scenes'} ·{' '}
                    {project.minutesAgo < 1 ? 'just now' : formatTimeAgo(project.minutesAgo)}
                  </span>
                </button>
                <button
                  type="button"
                  className="icon-button icon-button--small"
                  aria-label={`Delete ${projectName(project)}`}
                  title="Delete project"
                  onClick={() => onDelete(project)}
                >
                  <TrashIcon />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default SavedProjects
