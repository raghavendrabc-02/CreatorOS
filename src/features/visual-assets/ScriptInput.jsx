import { ArrowRightIcon, FileTextIcon, RefreshIcon, SparkleIcon, TrashIcon } from '../../components/icons.jsx'

export const MAX_SCRIPT_LENGTH = 50000
const MAX_TITLE_LENGTH = 200

// One line telling where the autosave is at, with a retry button when it failed.
function SaveStatus({ loading, projectId, status, error, onRetry }) {
  const isNew = status === 'idle' && projectId == null
  let text
  if (loading) text = 'Loading project…'
  else if (status === 'pending' || status === 'saving') text = 'Saving…'
  else if (status === 'empty') text = 'Add a script to save this project.'
  else if (status === 'error') text = `Not saved. ${error}`
  else if (isNew) text = 'Saves automatically as you type.'
  else text = 'All changes saved.'

  const modifier = loading ? 'loading' : isNew ? 'new' : status
  return (
    <p className={`vag-save-status vag-save-status--${modifier}`} role="status">
      <span>{text}</span>
      {!loading && status === 'error' && (
        <button type="button" className="button button--text" onClick={onRetry}>
          <RefreshIcon />
          Retry
        </button>
      )}
    </p>
  )
}

function ScriptInput({ title, onTitleChange, script, onChange, onAnalyse, analysing, notice, disabled, saveStatus }) {
  const isEmpty = script.trim().length === 0

  return (
    <section className="panel vag-script" aria-labelledby="script-heading">
      <div className="vag-heading">
        <FileTextIcon className="vag-heading__icon" />
        <div>
          <h2 id="script-heading" className="vag-heading__title">1. Paste your script</h2>
          <p className="vag-heading__text">
            Paste your complete script below. The AI will analyse it and create a
            scene-by-scene visual plan.
          </p>
        </div>
      </div>

      <label htmlFor="project-title" className="visually-hidden">Project title</label>
      <input
        id="project-title"
        className="vag-script__title"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        maxLength={MAX_TITLE_LENGTH}
        placeholder="Project title (optional), e.g. The real story of Zomato"
        disabled={disabled}
      />

      <label htmlFor="script-input" className="visually-hidden">Script</label>
      <textarea
        id="script-input"
        className="vag-script__input"
        value={script}
        onChange={(event) => onChange(event.target.value)}
        maxLength={MAX_SCRIPT_LENGTH}
        placeholder="Paste your full script here…"
        rows={8}
        disabled={disabled}
      />

      <div className="vag-script__meta">
        <span>
          Characters: {script.length.toLocaleString('en-IN')} /{' '}
          {MAX_SCRIPT_LENGTH.toLocaleString('en-IN')}
        </span>
        <button
          type="button"
          className="button button--text"
          onClick={() => onChange('')}
          disabled={disabled || script.length === 0}
        >
          <TrashIcon />
          Clear
        </button>
      </div>

      <SaveStatus {...saveStatus} />

      <button
        type="button"
        className="button button--primary vag-script__submit"
        onClick={onAnalyse}
        // Disabled while running, so a double click can't send a second (paid) AI request.
        disabled={disabled || isEmpty || analysing}
        aria-busy={analysing}
      >
        <SparkleIcon />
        {analysing ? 'Analysing script… this can take up to a minute' : 'Analyse Script & Create Visual Plan'}
        {!analysing && <ArrowRightIcon />}
      </button>

      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}
    </section>
  )
}

export default ScriptInput
