import { useCallback, useEffect, useRef, useState } from 'react'
import { createProject, updateProject } from './visualProjectsApi.js'

// Wait this long after the last edit before saving, so typing doesn't send a request per key.
const SAVE_DELAY_MS = 800

// Saves the project being edited in the background.
// The first save creates the project; later saves update it. Saves run one at a time, in order,
// and always send the latest edits, so a slow request can't overwrite newer text.
//
// status: 'idle' (nothing to save), 'pending' (edits waiting), 'saving', 'saved',
//         'empty' (script is blank, which the backend doesn't accept) or 'error'.
export function useProjectAutosave(platform, initialProjectId) {
  const [projectId, setProjectId] = useState(initialProjectId)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  // Goes up after every successful save, so the saved projects list knows to refresh.
  const [saveCount, setSaveCount] = useState(0)

  const projectIdRef = useRef(initialProjectId)
  const draftRef = useRef(null) // latest edits not yet sent, or null
  const timerRef = useRef(null)
  const queueRef = useRef(Promise.resolve()) // the save currently running, if any

  const saveLatest = useCallback(async () => {
    const draft = draftRef.current
    if (!draft) return
    draftRef.current = null

    if (!draft.script.trim()) {
      setStatus('empty')
      return
    }

    setStatus('saving')
    try {
      if (projectIdRef.current == null) {
        const project = await createProject(platform, draft)
        projectIdRef.current = project.id
        setProjectId(project.id)
      } else {
        await updateProject(projectIdRef.current, draft)
      }
      setSaveCount((count) => count + 1)
      // Newer edits may have arrived while this request was running; they have their own save queued.
      if (!draftRef.current) setStatus('saved')
    } catch (saveError) {
      // Keep the edits so a retry or the next change still saves them.
      draftRef.current ??= draft
      setError(saveError.message)
      setStatus('error')
    }
  }, [platform])

  // Saves any waiting edits now. Resolves once they are saved (or the save failed).
  const flush = useCallback(() => {
    clearTimeout(timerRef.current)
    queueRef.current = queueRef.current.then(saveLatest)
    return queueRef.current
  }, [saveLatest])

  // Call after every edit with the full current draft: { title, script, settings }.
  const queue = useCallback(
    (draft) => {
      draftRef.current = draft
      setStatus('pending')
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(flush, SAVE_DELAY_MS)
    },
    [flush],
  )

  // Switches to another project (or to a new, unsaved one with null) and drops any waiting edits.
  // Call flush() first to keep them.
  const setCurrentProject = useCallback((id) => {
    clearTimeout(timerRef.current)
    draftRef.current = null
    projectIdRef.current = id
    setProjectId(id)
    setStatus('idle')
    setError('')
  }, [])

  // Leaving the tool: save what's left. Closing the tab: ask first if edits haven't reached the backend.
  useEffect(() => {
    function warnIfUnsaved(event) {
      if (draftRef.current) event.preventDefault()
    }
    window.addEventListener('beforeunload', warnIfUnsaved)
    return () => {
      window.removeEventListener('beforeunload', warnIfUnsaved)
      flush()
    }
  }, [flush])

  return { projectId, status, error, saveCount, queue, flush, setCurrentProject }
}
