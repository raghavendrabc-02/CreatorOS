import { EditIcon, SendIcon, SparkleIcon } from '../../../components/icons.jsx'
import { BrandLogo } from './DmList.jsx'

function DmConversation({ dm, draft, onDraftChange, onSend, onRegenerate }) {
  if (!dm) {
    return (
      <section className="panel dm-convo">
        <p className="dm-empty">Select a DM to read it.</p>
      </section>
    )
  }

  return (
    <section className="panel dm-convo" aria-label={`Conversation with ${dm.brand.name}`}>
      <header className="dm-convo__header">
        <BrandLogo brand={dm.brand} size="lg" />
        <div>
          <h2 className="dm-convo__name">{dm.brand.name}</h2>
          <p className="dm-convo__type">Business account</p>
        </div>
      </header>

      <div className="dm-convo__body">
        <p className="dm-convo__time">{dm.sentAt}</p>
        <div className="dm-message">
          <BrandLogo brand={dm.brand} size="sm" />
          <p className="dm-message__bubble">{dm.text}</p>
        </div>

        <div className="dm-analysis">
          <h3 className="dm-section-title dm-section-title--accent">
            <SparkleIcon />
            AI analysis
          </h3>
          <ul>
            {dm.analysis.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        <div className="dm-replies">
          <div className="dm-replies__header">
            <h3 className="dm-section-title">
              <EditIcon />
              Quick reply suggestions
            </h3>
            <button type="button" className="button button--soft" onClick={onRegenerate}>
              Regenerate
            </button>
          </div>
          {dm.suggestions.map((suggestion) => (
            <div key={suggestion} className="dm-reply">
              <p>{suggestion}</p>
              <button type="button" className="button button--soft" onClick={() => onDraftChange(suggestion)}>
                Use
              </button>
            </div>
          ))}
        </div>
      </div>

      <form
        className="dm-compose"
        onSubmit={(event) => {
          event.preventDefault()
          onSend()
        }}
      >
        <label htmlFor="dm-message" className="visually-hidden">Message</label>
        <input
          id="dm-message"
          type="text"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Type a message…"
        />
        <button
          type="submit"
          className="button button--primary dm-compose__send"
          aria-label="Send message"
          disabled={draft.trim().length === 0}
        >
          <SendIcon />
        </button>
      </form>
    </section>
  )
}

export default DmConversation
