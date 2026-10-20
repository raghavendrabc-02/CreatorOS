import { ArrowRightIcon, FileTextIcon, SparkleIcon, TrashIcon } from '../../components/icons.jsx'

export const MAX_SCRIPT_LENGTH = 50000

function ScriptInput({ script, onChange, onAnalyse, notice }) {
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

      <label htmlFor="script-input" className="visually-hidden">Script</label>
      <textarea
        id="script-input"
        className="vag-script__input"
        value={script}
        onChange={(event) => onChange(event.target.value)}
        maxLength={MAX_SCRIPT_LENGTH}
        placeholder="Paste your full script here…"
        rows={8}
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
          disabled={script.length === 0}
        >
          <TrashIcon />
          Clear
        </button>
      </div>

      <button
        type="button"
        className="button button--primary vag-script__submit"
        onClick={onAnalyse}
        disabled={isEmpty}
      >
        <SparkleIcon />
        Analyse Script &amp; Create Visual Plan
        <ArrowRightIcon />
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
