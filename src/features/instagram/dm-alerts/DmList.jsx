import { ChevronRightIcon, SearchIcon, StarIcon } from '../../../components/icons.jsx'
import { formatTimeAgo } from '../../../utils/formatTimeAgo.js'
import { TABS } from './dmStatus.js'

export function BrandLogo({ brand, size = 'md' }) {
  return (
    <span className={`dm-logo dm-logo--${size}`} style={{ background: brand.colour }} aria-hidden="true">
      {brand.initials}
    </span>
  )
}

export function StatusBadge({ status }) {
  return <span className={`dm-badge dm-badge--${status.id}`}>{status.label}</span>
}

function DmList({ dms, tab, counts, onTabChange, query, onQueryChange, selectedId, onSelect, getStatus, saved }) {
  return (
    <section className="panel dm-list" aria-label="Brand DMs">
      <div className="dm-tabs" role="group" aria-label="Filter DMs">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={id === tab ? 'dm-tabs__tab dm-tabs__tab--active' : 'dm-tabs__tab'}
            aria-pressed={id === tab}
            onClick={() => onTabChange(id)}
          >
            {label}
            <span className="dm-tabs__count">{counts[id]}</span>
          </button>
        ))}
      </div>

      <div className="dm-search">
        <SearchIcon />
        <label htmlFor="dm-search" className="visually-hidden">Search DMs</label>
        <input
          id="dm-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search DMs…"
        />
      </div>

      {dms.length === 0 ? (
        <p className="dm-empty">No DMs found.</p>
      ) : (
        <ul className="dm-list__items">
          {dms.map((dm) => {
            const isSelected = dm.id === selectedId
            const status = getStatus(dm.id)
            return (
              <li key={dm.id}>
                <button
                  type="button"
                  className={isSelected ? 'dm-item dm-item--selected' : 'dm-item'}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(dm.id)}
                >
                  <BrandLogo brand={dm.brand} />
                  <span className="dm-item__body">
                    <span className="dm-item__top">
                      <span className={status.id === 'new' ? 'dm-item__name dm-item__name--unread' : 'dm-item__name'}>
                        {dm.brand.name}
                      </span>
                      {saved.has(dm.id) && <StarIcon className="dm-item__saved" aria-label="In brands list" />}
                      <span className="dm-item__time">{formatTimeAgo(dm.minutesAgo)}</span>
                    </span>
                    <span className="dm-item__preview">{dm.preview}</span>
                    <StatusBadge status={status} />
                  </span>
                  <ChevronRightIcon className="dm-item__chevron" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default DmList
