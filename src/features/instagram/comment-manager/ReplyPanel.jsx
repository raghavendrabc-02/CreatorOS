import {
  CheckIcon,
  ClockIcon,
  EditIcon,
  MessageIcon,
  SendIcon,
  StarIcon,
} from '../../../components/icons.jsx'

// Instagram's maximum comment length.
export const MAX_REPLY_LENGTH = 2200

function ReplyPanel({ comment, draft, onDraftChange, onSend, isReplied, onToggleReplied, isFavourite, onToggleFavourite }) {
  const disabled = !comment

  return (
    <div className="cm-reply">
      <section className="panel" aria-labelledby="reply-heading">
        <h2 id="reply-heading" className="cm-panel-title">
          <EditIcon />
          Reply editor
        </h2>
        <label htmlFor="reply-input" className="visually-hidden">Your reply</label>
        <textarea
          id="reply-input"
          className="cm-reply__input"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          maxLength={MAX_REPLY_LENGTH}
          placeholder={disabled ? 'Select a comment to reply.' : 'Write a reply or pick a suggestion…'}
          disabled={disabled}
          rows={6}
        />
        <p className="cm-reply__count">
          {draft.length.toLocaleString('en-IN')} / {MAX_REPLY_LENGTH.toLocaleString('en-IN')}
        </p>
        <button
          type="button"
          className="button button--primary cm-reply__send"
          onClick={onSend}
          disabled={disabled || draft.trim().length === 0}
        >
          <SendIcon />
          Send reply
        </button>
      </section>

      <section className="panel" aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="cm-panel-title">Quick actions</h2>
        <div className="cm-actions">
          <button
            type="button"
            className={isReplied ? 'cm-action cm-action--on-green' : 'cm-action'}
            aria-pressed={isReplied}
            onClick={onToggleReplied}
            disabled={disabled}
          >
            <CheckIcon />
            {isReplied ? 'Marked as replied' : 'Mark as replied'}
          </button>
          <button
            type="button"
            className={isFavourite ? 'cm-action cm-action--on-amber' : 'cm-action'}
            aria-pressed={isFavourite}
            onClick={onToggleFavourite}
            disabled={disabled}
          >
            <StarIcon />
            {isFavourite ? 'Favourite' : 'Add to favourites'}
          </button>
        </div>
      </section>

      <section className="panel" aria-labelledby="history-heading">
        <h2 id="history-heading" className="cm-panel-title">
          <ClockIcon />
          Comment history
        </h2>
        <div className="cm-history">
          <MessageIcon />
          <p>No previous replies for this comment.</p>
          <p>Your reply history will appear here.</p>
        </div>
      </section>
    </div>
  )
}

export default ReplyPanel
