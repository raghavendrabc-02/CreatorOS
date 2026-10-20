import { ArchiveIcon, BuildingIcon, CheckIcon, SparkleIcon, StarIcon } from '../../../components/icons.jsx'
import { BrandLogo } from './DmList.jsx'

function BrandPanel({ dm, note, onNoteChange, isReplied, onToggleReplied, isSaved, onToggleSaved, isArchived, onToggleArchived }) {
  if (!dm) return null
  const { brand, intent } = dm

  return (
    <div className="dm-side">
      <section className="panel" aria-labelledby="brand-heading">
        <h2 id="brand-heading" className="dm-section-title">
          <BuildingIcon />
          Brand details
        </h2>
        <div className="dm-brand">
          <BrandLogo brand={brand} size="lg" />
          <div>
            <p className="dm-convo__name">{brand.name}</p>
            <p className="dm-convo__type">Business account</p>
          </div>
        </div>
        <dl className="dm-details">
          <dt>Category</dt>
          <dd>{brand.category}</dd>
          <dt>Followers</dt>
          <dd>{brand.followers}</dd>
          <dt>Website</dt>
          <dd className="dm-details__link">{brand.website}</dd>
          <dt>Past collaborations</dt>
          <dd>{brand.pastCollaborations}</dd>
        </dl>
        <label htmlFor="brand-notes" className="dm-notes__label">Notes</label>
        <textarea
          id="brand-notes"
          className="dm-notes"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Add your notes about this brand…"
          rows={2}
        />
      </section>

      <section className="panel" aria-labelledby="intent-heading">
        <h2 id="intent-heading" className="dm-section-title dm-section-title--accent">
          <SparkleIcon />
          AI intent detection
        </h2>
        <div className="dm-intent">
          <span className="dm-intent__label">
            <CheckIcon />
            {intent.label}
          </span>
          <span className="dm-intent__score">{intent.confidence}% match</span>
        </div>
        <div className="dm-intent__bar" aria-hidden="true">
          <span style={{ width: `${intent.confidence}%` }} />
        </div>
        <p className="dm-intent__summary">{intent.summary}</p>
        <ul className="dm-tags">
          {intent.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </section>

      <section className="panel" aria-labelledby="dm-actions-heading">
        <h2 id="dm-actions-heading" className="dm-section-title">Actions</h2>
        <button
          type="button"
          className={isReplied ? 'button dm-action-main dm-action-main--done' : 'button button--primary dm-action-main'}
          aria-pressed={isReplied}
          onClick={onToggleReplied}
        >
          <CheckIcon />
          {isReplied ? 'Marked as replied' : 'Mark as replied'}
        </button>
        <div className="dm-actions">
          <button
            type="button"
            className={isSaved ? 'dm-action dm-action--on' : 'dm-action'}
            aria-pressed={isSaved}
            onClick={onToggleSaved}
          >
            <StarIcon />
            {isSaved ? 'In brands list' : 'Add to brands list'}
          </button>
          <button
            type="button"
            className={isArchived ? 'dm-action dm-action--on' : 'dm-action'}
            aria-pressed={isArchived}
            onClick={onToggleArchived}
          >
            <ArchiveIcon />
            {isArchived ? 'Unarchive' : 'Archive'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default BrandPanel
