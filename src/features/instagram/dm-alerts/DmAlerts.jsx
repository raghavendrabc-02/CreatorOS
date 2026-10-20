import { useState } from 'react'
import { USER } from '../../../data/user.js'
import BrandPanel from './BrandPanel.jsx'
import DmConversation from './DmConversation.jsx'
import DmList from './DmList.jsx'
import DmStats from './DmStats.jsx'
import { STATUS_LABELS, TABS } from './dmStatus.js'
import { EXAMPLE_DMS } from './exampleDms.js'
import './DmAlerts.css'

const NOT_CONNECTED = {
  send: 'Sending DMs is not connected yet. It needs your Instagram account, which comes with the backend.',
  regenerate: 'AI reply suggestions are not connected yet. They will be generated once the backend is added.',
}

// Fill in the creator's name and build a one-line preview for the list.
const DMS = EXAMPLE_DMS.map((dm) => {
  const text = dm.message.replaceAll('{name}', USER.name)
  const preview = text.split('\n').filter(Boolean).slice(1).join(' ')
  return { ...dm, text, preview }
})

function toggle(set, id) {
  const next = new Set(set)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

function DmAlerts() {
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(DMS[0]?.id)
  const [statuses, setStatuses] = useState(() => Object.fromEntries(DMS.map((dm) => [dm.id, dm.status])))
  const [archived, setArchived] = useState(() => new Set(DMS.filter((dm) => dm.archived).map((dm) => dm.id)))
  const [saved, setSaved] = useState(() => new Set())
  const [drafts, setDrafts] = useState({})
  const [notes, setNotes] = useState({})
  const [notice, setNotice] = useState('')

  const getStatus = (id) => {
    const statusId = archived.has(id) ? 'archived' : statuses[id]
    return { id: statusId, label: STATUS_LABELS[statusId] }
  }

  const counts = Object.fromEntries(
    TABS.map(({ id, matches }) => [id, DMS.filter((dm) => matches(statuses[dm.id], archived.has(dm.id))).length]),
  )
  const active = DMS.filter((dm) => !archived.has(dm.id))
  const stats = {
    new: active.filter((dm) => statuses[dm.id] === 'new').length,
    total: DMS.length,
    awaiting: active.filter((dm) => statuses[dm.id] === 'awaiting').length,
    replied: active.filter((dm) => statuses[dm.id] === 'replied').length,
  }

  const search = query.trim().toLowerCase()
  const { matches } = TABS.find((t) => t.id === tab)
  const visible = DMS.filter(
    (dm) =>
      matches(statuses[dm.id], archived.has(dm.id)) &&
      (!search || dm.brand.name.toLowerCase().includes(search) || dm.text.toLowerCase().includes(search)),
  )

  // Keep the selection inside the visible list; fall back to the first visible DM.
  const selected = visible.find((dm) => dm.id === selectedId) ?? visible[0]

  // Opening a new DM marks it as read.
  function selectDm(id) {
    setSelectedId(id)
    setStatuses((current) => (current[id] === 'new' ? { ...current, [id]: 'awaiting' } : current))
    setNotice('')
  }

  function setDraft(text) {
    setDrafts((current) => ({ ...current, [selected.id]: text }))
    setNotice('')
  }

  function toggleReplied() {
    setStatuses((current) => ({
      ...current,
      [selected.id]: current[selected.id] === 'replied' ? 'awaiting' : 'replied',
    }))
  }

  return (
    <div className="dm">
      <p className="example-banner">
        <strong>Example data.</strong> These are fictional brands and messages that preview how the
        tool will work. Your real Instagram DMs will appear here once your account is connected
        through the backend.
      </p>

      <DmStats stats={stats} />

      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      <div className="dm__layout">
        <div className="dm__list">
          <DmList
            dms={visible}
            tab={tab}
            counts={counts}
            onTabChange={setTab}
            query={query}
            onQueryChange={setQuery}
            selectedId={selected?.id}
            onSelect={selectDm}
            getStatus={getStatus}
            saved={saved}
          />
        </div>
        <div className="dm__convo">
          <DmConversation
            dm={selected}
            draft={selected ? drafts[selected.id] ?? '' : ''}
            onDraftChange={setDraft}
            onSend={() => setNotice(NOT_CONNECTED.send)}
            onRegenerate={() => setNotice(NOT_CONNECTED.regenerate)}
          />
        </div>
        <div className="dm__side">
          <BrandPanel
            dm={selected}
            note={selected ? notes[selected.id] ?? '' : ''}
            onNoteChange={(text) => setNotes((current) => ({ ...current, [selected.id]: text }))}
            isReplied={selected ? statuses[selected.id] === 'replied' : false}
            onToggleReplied={toggleReplied}
            isSaved={selected ? saved.has(selected.id) : false}
            onToggleSaved={() => setSaved((current) => toggle(current, selected.id))}
            isArchived={selected ? archived.has(selected.id) : false}
            onToggleArchived={() => setArchived((current) => toggle(current, selected.id))}
          />
        </div>
      </div>
    </div>
  )
}

export default DmAlerts
