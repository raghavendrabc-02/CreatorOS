import { useState } from 'react'
import CommentAnalysis from './CommentAnalysis.jsx'
import CommentFilters from './CommentFilters.jsx'
import CommentList from './CommentList.jsx'
import ReplyPanel from './ReplyPanel.jsx'
import { FILTERS, SORTS } from './commentTypes.js'
import { EXAMPLE_COMMENTS } from './exampleComments.js'
import './CommentManager.css'

const NOT_CONNECTED = {
  send: 'Sending replies is not connected yet. It needs your Instagram account, which comes with the backend.',
  regenerate: 'AI suggestions are not connected yet. They will be generated once the backend is added.',
}

function toggle(set, id) {
  const next = new Set(set)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

function CommentManager() {
  const comments = EXAMPLE_COMMENTS
  const [filterId, setFilterId] = useState('all')
  const [sort, setSort] = useState('latest')
  const [selectedId, setSelectedId] = useState(comments[0]?.id)
  const [drafts, setDrafts] = useState({})
  const [replied, setReplied] = useState(() => new Set())
  const [favourites, setFavourites] = useState(() => new Set())
  const [notice, setNotice] = useState('')

  const counts = Object.fromEntries(
    FILTERS.map(({ id, matches }) => [id, comments.filter((c) => matches(c, replied)).length]),
  )
  const filter = FILTERS.find((f) => f.id === filterId)
  const { compare } = SORTS.find((s) => s.value === sort)
  const visible = comments.filter((c) => filter.matches(c, replied)).sort(compare)

  // Keep the selection inside the visible list; fall back to the first visible comment.
  const selected = visible.find((c) => c.id === selectedId) ?? visible[0]
  const draft = selected ? drafts[selected.id] ?? '' : ''

  function setDraft(text) {
    setDrafts((current) => ({ ...current, [selected.id]: text }))
    setNotice('')
  }

  function selectComment(id) {
    setSelectedId(id)
    setNotice('')
  }

  return (
    <div className="cm">
      <p className="example-banner">
        <strong>Example data.</strong> These are sample comments that preview how the tool will work.
        Your real Instagram comments will appear here once your account is connected through the
        backend.
      </p>

      <CommentFilters active={filterId} counts={counts} onChange={setFilterId} />

      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      <div className="cm__layout">
        <div className="cm__list">
          <CommentList
            comments={visible}
            selectedId={selected?.id}
            onSelect={selectComment}
            sort={sort}
            onSortChange={setSort}
            replied={replied}
            favourites={favourites}
          />
        </div>
        <div className="cm__analysis">
          <CommentAnalysis
            comment={selected}
            onUseReply={setDraft}
            onRegenerate={() => setNotice(NOT_CONNECTED.regenerate)}
          />
        </div>
        <div className="cm__reply">
          <ReplyPanel
            comment={selected}
            draft={draft}
            onDraftChange={setDraft}
            onSend={() => setNotice(NOT_CONNECTED.send)}
            isReplied={selected ? replied.has(selected.id) : false}
            onToggleReplied={() => setReplied((current) => toggle(current, selected.id))}
            isFavourite={selected ? favourites.has(selected.id) : false}
            onToggleFavourite={() => setFavourites((current) => toggle(current, selected.id))}
          />
        </div>
      </div>
    </div>
  )
}

export default CommentManager
