import { FileTextIcon, SparkleIcon } from '../../../components/icons.jsx'
import { Avatar, ReelThumb, TypeBadge } from './CommentList.jsx'
import { formatTimeAgo } from '../../../utils/formatTimeAgo.js'
import { COMMENT_TYPES } from './commentTypes.js'

function CommentAnalysis({ comment, onUseReply, onRegenerate }) {
  if (!comment) {
    return (
      <section className="panel cm-analysis">
        <p className="cm-empty">Select a comment to see its analysis.</p>
      </section>
    )
  }

  return (
    <section className="panel cm-analysis" aria-labelledby="analysis-heading">
      <h2 id="analysis-heading" className="cm-panel-title">
        <FileTextIcon />
        Comment analysis
      </h2>

      <div className="cm-selected">
        <Avatar name={comment.username} />
        <div className="cm-selected__body">
          <p className="cm-item__user">{comment.username}</p>
          <p className="cm-item__time">{formatTimeAgo(comment.minutesAgo)}</p>
          <p className="cm-selected__text">{comment.text}</p>
        </div>
        <ReelThumb reel={comment.reel} />
      </div>

      <dl className="cm-facts">
        <div>
          <dt>Comment type</dt>
          <dd>
            <TypeBadge type={comment.type} />
            <span>{COMMENT_TYPES[comment.type].description}</span>
          </dd>
        </div>
        <div>
          <dt>Intent</dt>
          <dd>{comment.analysis.intent}</dd>
        </div>
        <div>
          <dt>Key points</dt>
          <dd>
            <ul className="cm-facts__points">
              {comment.analysis.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <div className="cm-suggestions">
        <div className="cm-suggestions__header">
          <h3 className="cm-panel-title cm-panel-title--small">
            <SparkleIcon />
            AI reply suggestions
          </h3>
          <button type="button" className="button button--soft" onClick={onRegenerate}>
            Regenerate
          </button>
        </div>

        {comment.suggestions.map((suggestion) => (
          <div key={suggestion} className="cm-suggestion">
            <p>{suggestion}</p>
            <button
              type="button"
              className="button button--primary cm-suggestion__use"
              onClick={() => onUseReply(suggestion)}
            >
              Use reply
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CommentAnalysis
