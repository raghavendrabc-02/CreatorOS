import { CopyIcon, ImageIcon } from '../../components/icons.jsx'
import PreviewLines from '../../components/PreviewLines.jsx'
import './ToolPreviews.css'

// Decorative illustrations for the YouTube tool cards. Grey bars stand in for text on purpose.

export function YouTubeVisualAssetPreview() {
  return (
    <div className="preview yt-preview--visual" aria-hidden="true">
      <div className="yt-preview__dark yt-preview__dark--script">
        <span className="yt-preview__dark-label">Script</span>
        <PreviewLines widths={['90%', '75%', '55%']} />
      </div>
      <div className="yt-preview__dark yt-preview__dark--scenes">
        <span className="yt-preview__dark-label">Scene breakdown</span>
        {[1, 2, 3].map((number) => (
          <span key={number} className="yt-preview__scene">
            {number}
            <PreviewLines widths={[`${85 - number * 10}%`]} />
          </span>
        ))}
      </div>
      <div className="yt-preview__frames">
        <span className="yt-preview__frame yt-preview__frame--3" />
        <span className="yt-preview__frame yt-preview__frame--2" />
        <span className="yt-preview__frame yt-preview__frame--1">
          <ImageIcon />
        </span>
      </div>
    </div>
  )
}

const KIT_FIELDS = [
  { label: 'YouTube title', lines: ['85%', '60%'] },
  { label: 'Description + hashtags', lines: ['90%', '70%'] },
  { label: 'Tags', lines: ['80%'] },
]

export function PostingKitPreview() {
  return (
    <div className="preview yt-preview--kit" aria-hidden="true">
      <div className="yt-preview__thumb">
        <span className="yt-preview__thumb-text">
          <span />
          <span />
        </span>
        <ImageIcon />
      </div>
      <div className="yt-preview__fields">
        {KIT_FIELDS.map(({ label, lines }) => (
          <div key={label} className="yt-preview__field">
            <span className="yt-preview__field-label">
              <span className="yt-preview__field-name">{label}</span>
              <CopyIcon />
            </span>
            <PreviewLines widths={lines} />
          </div>
        ))}
      </div>
    </div>
  )
}
