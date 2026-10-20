import { FILTERS } from './commentTypes.js'

function CommentFilters({ active, counts, onChange }) {
  return (
    <div className="panel cm-filters" role="group" aria-label="Filter comments">
      {FILTERS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={id === active ? 'cm-filters__tab cm-filters__tab--active' : 'cm-filters__tab'}
          aria-pressed={id === active}
          onClick={() => onChange(id)}
        >
          {label}
          <span className="cm-filters__count">{counts[id]}</span>
        </button>
      ))}
    </div>
  )
}

export default CommentFilters
