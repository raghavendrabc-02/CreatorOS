import { ArrowRightIcon, CopyIcon, ImageIcon, SparkleIcon } from '../../components/icons.jsx'
import PreviewLines from '../../components/PreviewLines.jsx'
import './ToolPreviews.css'

// Decorative illustrations for the Instagram tool cards.
// Grey bars stand in for text on purpose: these are not real comments or messages.

export function VisualAssetPreview() {
  return (
    <div className="preview preview--visual" aria-hidden="true">
      <span className="preview__chip">
        Script <ArrowRightIcon /> Visuals
      </span>
      <div className="preview__frame preview__frame--back" />
      <div className="preview__frame preview__frame--side" />
      <div className="preview__frame preview__frame--front">
        <ImageIcon />
      </div>
    </div>
  )
}

export function CommentManagerPreview() {
  return (
    <div className="preview preview--comment" aria-hidden="true">
      <div className="preview__card preview__card--comment">
        <span className="preview__avatar" />
        <PreviewLines widths={['75%', '50%']} />
      </div>
      <div className="preview__card preview__card--reply">
        <span className="preview__label">
          <SparkleIcon /> AI reply suggestion
        </span>
        <PreviewLines widths={['90%', '60%']} />
        <span className="preview__pill">Use reply</span>
      </div>
    </div>
  )
}

const DM_CATEGORIES = ['Brand collaboration', 'General', 'Other']

export function DmAlertsPreview() {
  return (
    <div className="preview preview--dm" aria-hidden="true">
      <div className="preview__card preview__list">
        {DM_CATEGORIES.map((category, index) => (
          <div
            key={category}
            className={index === 0 ? 'preview__row preview__row--highlight' : 'preview__row'}
          >
            <span className="preview__avatar" />
            <div className="preview__row-text">
              <span className="preview__row-label">{category}</span>
              <PreviewLines widths={['70%']} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function InstagramPostingKitPreview() {
  return (
    <div className="preview preview--kit" aria-hidden="true">
      <div className="preview__cover">
        <span className="preview__cover-text">
          <span />
          <span />
        </span>
        <ImageIcon />
      </div>
      <div className="preview__card preview__caption">
        <span className="preview__caption-label">
          Caption + hashtags
          <CopyIcon />
        </span>
        <PreviewLines widths={['92%', '80%', '60%']} />
        <span className="preview__hashtags">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  )
}
