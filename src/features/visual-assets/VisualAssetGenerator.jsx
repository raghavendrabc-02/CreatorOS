import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import StepProgress from '../../components/StepProgress.jsx'
import ExampleScript from './ExampleScript.jsx'
import GenerationSettings from './GenerationSettings.jsx'
import SavedProjects from './SavedProjects.jsx'
import ScriptInput from './ScriptInput.jsx'
import VisualPlanPreview from './VisualPlanPreview.jsx'
import { EXAMPLE_SCRIPT } from './exampleData.js'
import { DEFAULT_SETTINGS } from './options.js'
import { useProjectAutosave } from './useProjectAutosave.js'
import { deleteProject, getProject } from './visualProjectsApi.js'
import './VisualAssetGenerator.css'

const STEPS = [
  { title: 'Add script', description: 'Paste your script' },
  { title: 'AI analysis', description: 'Break into scenes' },
  { title: 'Review plan', description: 'Check prompts & edit' },
  { title: 'Generate images', description: 'Create and save assets' },
]

const NOT_CONNECTED_NOTICE =
  'AI analysis is not connected yet. Your script and settings are saved automatically, so you can come back to them any time.'

// The open project's id is kept in the URL (?project=12), so reloading the page reopens it.
function parseProjectId(value) {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

// Shared by Instagram and YouTube; each passes its platform and usual aspect ratio.
function VisualAssetGenerator({ platform, defaultAspectRatio = DEFAULT_SETTINGS.aspectRatio }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [initialProjectId] = useState(() => parseProjectId(searchParams.get('project')))
  const defaultSettings = { ...DEFAULT_SETTINGS, aspectRatio: defaultAspectRatio }

  const [title, setTitle] = useState('')
  const [script, setScript] = useState('')
  const [settings, setSettings] = useState(defaultSettings)
  const [scenes, setScenes] = useState([])
  const [loading, setLoading] = useState(initialProjectId != null)
  const [notice, setNotice] = useState('')
  // Goes up when a project is deleted, so the saved projects list reloads.
  const [deleteCount, setDeleteCount] = useState(0)

  const autosave = useProjectAutosave(platform, initialProjectId)
  const { projectId, setCurrentProject } = autosave

  function showProject(project) {
    setTitle(project.title)
    setScript(project.script)
    setSettings(project.settings)
    setScenes(project.scenes)
  }

  function showNewProject() {
    setTitle('')
    setScript('')
    setSettings(defaultSettings)
    setScenes([])
  }

  // Opens the project named in the URL when the page first loads.
  useEffect(() => {
    if (initialProjectId == null) return
    let ignore = false
    getProject(initialProjectId)
      .then((project) => {
        if (ignore) return
        setTitle(project.title)
        setScript(project.script)
        setSettings(project.settings)
        setScenes(project.scenes)
      })
      .catch((loadError) => {
        if (ignore) return
        // Start a new project instead, so nothing typed now can overwrite the one that failed to load.
        setCurrentProject(null)
        setNotice(
          loadError.status === 404
            ? 'That project no longer exists. You are working on a new project.'
            : `Couldn't open the saved project: ${loadError.message}`,
        )
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [initialProjectId, setCurrentProject])

  // Keeps ?project= in the URL in step with the open project.
  useEffect(() => {
    const wanted = projectId == null ? null : String(projectId)
    if (searchParams.get('project') === wanted) return
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params)
        if (wanted) next.set('project', wanted)
        else next.delete('project')
        return next
      },
      { replace: true },
    )
  }, [projectId, searchParams, setSearchParams])

  // Every edit queues an autosave of the whole draft, using the value that just changed.
  function saveDraft(changes) {
    autosave.queue({ title, script, settings, ...changes })
  }

  function handleTitleChange(value) {
    setTitle(value)
    saveDraft({ title: value })
  }

  function handleScriptChange(value) {
    setScript(value)
    setNotice('')
    saveDraft({ script: value })
  }

  function handleSettingsChange(value) {
    setSettings(value)
    saveDraft({ settings: value })
  }

  async function openProject(id) {
    if (id === projectId) return
    await autosave.flush()
    setLoading(true)
    setNotice('')
    try {
      const project = await getProject(id)
      setCurrentProject(project.id)
      showProject(project)
    } catch (openError) {
      setNotice(`Couldn't open that project: ${openError.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function startNewProject() {
    await autosave.flush()
    setCurrentProject(null)
    showNewProject()
    setNotice('')
  }

  async function removeProject(project) {
    const name = project.title || 'this untitled project'
    if (!window.confirm(`Delete "${name}"? Its scenes are deleted too. This can't be undone.`)) return
    const isCurrent = project.id === projectId
    // Let any save for this project finish first, so it can't fail after the project is gone.
    if (isCurrent) await autosave.flush()
    try {
      await deleteProject(project.id)
      if (isCurrent) {
        setCurrentProject(null)
        showNewProject()
      }
      setDeleteCount((count) => count + 1)
    } catch (deleteError) {
      setNotice(`Couldn't delete that project: ${deleteError.message}`)
    }
  }

  return (
    <div className="vag">
      <StepProgress steps={STEPS} current={scenes.length > 0 ? 2 : 0} />

      <div className="vag__columns">
        <ScriptInput
          title={title}
          onTitleChange={handleTitleChange}
          script={script}
          onChange={handleScriptChange}
          onAnalyse={() => setNotice(NOT_CONNECTED_NOTICE)}
          notice={notice}
          disabled={loading}
          saveStatus={{
            loading,
            projectId,
            status: autosave.status,
            error: autosave.error,
            onRetry: autosave.flush,
          }}
        />
        <div className="vag__side">
          <SavedProjects
            platform={platform}
            currentId={projectId}
            refreshKey={`${autosave.saveCount}-${deleteCount}`}
            onOpen={openProject}
            onNew={startNewProject}
            onDelete={removeProject}
          />
          <ExampleScript onUse={() => handleScriptChange(EXAMPLE_SCRIPT)} />
          <GenerationSettings settings={settings} onChange={handleSettingsChange} />
        </div>
      </div>

      <VisualPlanPreview scenes={scenes} />
    </div>
  )
}

export default VisualAssetGenerator
