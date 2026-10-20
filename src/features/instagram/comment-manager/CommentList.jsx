import {
  CheckIcon,
  ChevronDownIcon,
  HeartIcon,
  SortIcon,
  StarIcon,
  UserIcon,
} from '../../../components/icons.jsx'
import { formatTimeAgo } from '../../../utils/formatTimeAgo.js'
import { COMMENT_TYPES, SORTS } from './commentTypes.js'

const AVATAR_COLOURS = ['#a78bfa', '#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#fb7185', '#2dd4bf']

// Generic avatar; the colour is picked from the username so each person stays consistent.
export function Avatar({ name }) {
  const hash = [...name].reduce((total, char) => total + char.charCodeAt(0), 0)
  return (
    <span
      className="cm-avatar"
      style={{ background: AVATAR_COLOURS[hash % AVATAR_COLOURS.length] }}
      aria-hidden="true"
    >
      <UserIcon />
    </span>
  )
}

export function ReelThumb({ reel }) {
  return (
    <span className={`cm-reel cm-reel--${reel.theme}`} title={`Reel: ${reel.title}`}>
      {reel.title}
    </span>
  )
}

export function TypeBadge({ type }) {
  return <span className={`cm-badge cm-badge--${type}`}>{COMMENT_TYPES[type].label}</span>
}

function CommentList({ comments, selectedId, onSelect, sort, onSortChange, replied, favourites }) {
  return (
    <section className="panel cm-list" aria-label="Comments">
      <div className="cm-list__toolbar">
        <span className="cm-list__total">
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
        <div className="select cm-list__sort">
          <SortIcon className="cm-list__sort-icon" />
          <label htmlFor="comment-sort" className="visually-hidden">Sort comments</label>
          <select id="comment-sort" value={sort} onChange={(event) => onSortChange(event.target.value)}>
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>
      </div>

      {comments.length === 0 ? (
        <p className="cm-empty">No comments in this category.</p>
      ) : (
        <ul className="cm-list__items">
          {comments.map((comment) => {
            const isSelected = comment.id === selectedId
            return (
              <li key={comment.id}>
                <button
                  type="button"
                  className={isSelected ? 'cm-item cm-item--selected' : 'cm-item'}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(comment.id)}
                >
                  <Avatar name={comment.username} />
                  <span className="cm-item__body">
                    <span className="cm-item__meta">
                      <span className="cm-item__user">{comment.username}</span>
                      <span className="cm-item__time">{formatTimeAgo(comment.minutesAgo)}</span>
                      {replied.has(comment.id) && (
                        <CheckIcon className="cm-item__flag cm-item__flag--replied" aria-label="Replied" />
                      )}
                      {favourites.has(comment.id) && (
                        <StarIcon className="cm-item__flag cm-item__flag--favourite" aria-label="Favourite" />
                      )}
                    </span>
                    <span className="cm-item__text">{comment.text}</span>
                    <TypeBadge type={comment.type} />
                  </span>
                  <span className="cm-item__likes">
                    <HeartIcon />
                    {comment.likes}
                  </span>
                  <ReelThumb reel={comment.reel} />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default CommentList
