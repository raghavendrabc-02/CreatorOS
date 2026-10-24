import {
  DownloadIcon,
  EyeIcon,
  FilmIcon,
  ImageIcon,
  MoreIcon,
} from '../../components/icons.jsx'
import { EXAMPLE_PLAN } from './exampleData.js'

const COLUMNS = ['#', 'Scene & script', 'Visual prompt', 'Generated image', 'Editing notes', 'Actions']

// Per-scene actions. They stay unavailable until a scene has a real generated image.
const ACTIONS = [
  { label: 'View image', icon: EyeIcon },
  { label: 'Download image', icon: DownloadIcon },
  { label: 'More options', icon: MoreIcon },
]

const UNAVAILABLE_HINT = 'Available after images are generated'

// The example plan, in the same shape as scenes saved by the backend.
const EXAMPLE_SCENES = EXAMPLE_PLAN.map(({ time, ...scene }) => ({ id: scene.title, time_range: time, ...scene }))

// Shows the project's saved scenes, or the example plan while it has none.
function VisualPlanPreview({ scenes = [] }) {
  const isExample = scenes.length === 0
  const rows = isExample ? EXAMPLE_SCENES : scenes

  return (
    <section className="panel vag-plan" aria-labelledby="plan-heading">
      <div className="vag-heading">
        <FilmIcon className="vag-heading__icon vag-heading__icon--dark" />
        <div>
          <h2 id="plan-heading" className="vag-heading__title">
            Generated visual plan {isExample && <span className="vag-plan__badge">Example</span>}
          </h2>
          <p className="vag-heading__text">
            {isExample
              ? 'Sample layout only. Your own scenes, prompts, images and editing notes will appear here after analysis.'
              : 'The saved scene-by-scene plan for this project.'}
          </p>
        </div>
      </div>

      <div className="vag-plan__table" role="table" aria-label={isExample ? 'Example visual plan' : 'Visual plan'}>
        <div className="vag-plan__row vag-plan__row--head" role="row">
          {COLUMNS.map((column) => (
            <span key={column} role="columnheader">{column}</span>
          ))}
        </div>

        {rows.map((scene, index) => (
          <div key={scene.id} className="vag-plan__row" role="row">
            <span role="cell" className="vag-plan__number">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div role="cell" className="vag-plan__scene">
              <p className="vag-plan__scene-title">{scene.title}</p>
              {scene.time_range && <p className="vag-plan__time">{scene.time_range}</p>}
              <p className="vag-plan__line">“{scene.line}”</p>
            </div>
            <p role="cell" className="vag-plan__prompt">
              <span className="vag-plan__mobile-label">Visual prompt</span>
              {scene.prompt}
            </p>
            <div role="cell" className="vag-plan__image">
              <ImageIcon />
              <span>Image appears here</span>
            </div>
            <div role="cell">
              {scene.notes.length > 0 && (
                <>
                  <span className="vag-plan__mobile-label">Editing notes</span>
                  <ul className="vag-plan__notes">
                    {scene.notes.map((note, noteIndex) => (
                      <li key={noteIndex}>{note}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div role="cell" className="vag-plan__actions">
              {ACTIONS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  className="icon-button"
                  aria-label={`${label} (${UNAVAILABLE_HINT.toLowerCase()})`}
                  aria-disabled="true"
                  title={UNAVAILABLE_HINT}
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default VisualPlanPreview
