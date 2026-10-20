import { FileTextIcon, SparkleIcon, ArrowRightIcon } from '../../components/icons.jsx'
import ReferenceImages from './ReferenceImages.jsx'

export const MAX_SCRIPT_LENGTH = 50000
export const MAX_INSTRUCTIONS_LENGTH = 1000

function Counter({ value, max }) {
  return (
    <p className="pk-counter">
      {value.length.toLocaleString('en-IN')} / {max.toLocaleString('en-IN')}
    </p>
  )
}

function ContentInput({
  script,
  onScriptChange,
  instructions,
  onInstructionsChange,
  images,
  onAddImages,
  onRemoveImage,
  imageError,
  onGenerate,
  notice,
}) {
  return (
    <section className="panel pk-input" aria-labelledby="pk-input-heading">
      <h2 id="pk-input-heading" className="pk-heading">
        <FileTextIcon />
        1. Add your content
      </h2>

      <div className="pk-field">
        <label htmlFor="pk-script" className="pk-label">
          Video script <span className="pk-label__required">*</span>
        </label>
        <textarea
          id="pk-script"
          className="pk-textarea"
          value={script}
          onChange={(event) => onScriptChange(event.target.value)}
          maxLength={MAX_SCRIPT_LENGTH}
          placeholder="Paste your full video script here…"
          rows={7}
        />
        <Counter value={script} max={MAX_SCRIPT_LENGTH} />
      </div>

      <ReferenceImages images={images} onAdd={onAddImages} onRemove={onRemoveImage} />
      {imageError && <p className="pk-error" role="alert">{imageError}</p>}

      <div className="pk-field">
        <label htmlFor="pk-instructions" className="pk-label">
          Additional instructions <span className="pk-label__hint">(Optional)</span>
        </label>
        <textarea
          id="pk-instructions"
          className="pk-textarea pk-textarea--small"
          value={instructions}
          onChange={(event) => onInstructionsChange(event.target.value)}
          maxLength={MAX_INSTRUCTIONS_LENGTH}
          placeholder="e.g. Make it cinematic and bold. Focus on the founder, growth and the India angle. Use a red and dark theme."
          rows={3}
        />
        <Counter value={instructions} max={MAX_INSTRUCTIONS_LENGTH} />
      </div>

      <button
        type="button"
        className="button button--accent pk-generate"
        onClick={onGenerate}
        disabled={script.trim().length === 0}
      >
        <SparkleIcon />
        Generate Posting Kit
        <ArrowRightIcon />
      </button>

      {notice && (
        <p className="notice pk-notice" role="status">
          {notice}
        </p>
      )}
    </section>
  )
}

export default ContentInput
