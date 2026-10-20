import CopyButton from '../../components/CopyButton.jsx'
import {
  DownloadIcon,
  EditIcon,
  FileTextIcon,
  ImageIcon,
  InstagramIcon,
  MoreIcon,
  RefreshIcon,
  YouTubeIcon,
} from '../../components/icons.jsx'
import { LIMITS } from './platformConfig.js'

function ImagePlaceholder({ label, small = false, portrait = false }) {
  const classes = ['pk-thumbnail', small && 'pk-thumbnail--small', portrait && 'pk-thumbnail--portrait']
  return (
    <div className={classes.filter(Boolean).join(' ')}>
      <ImageIcon />
      {label && <span>{label}</span>}
    </div>
  )
}

function ImageSection({ image, onRegenerate }) {
  const hint = `Available after ${image.name}s are generated`

  return (
    <div className="pk-block">
      <h3 className="pk-subheading">{image.label}</h3>
      <p className="pk-help">AI-generated {image.name} based on your script and reference images.</p>
      <div className={image.portrait ? 'pk-thumbnails pk-thumbnails--portrait' : 'pk-thumbnails'}>
        <ImagePlaceholder label={`${image.label} appears here`} portrait={image.portrait} />
        <div className="pk-variations">
          <p className="pk-variations__label">More variations</p>
          {[1, 2, 3].map((number) => (
            <ImagePlaceholder key={number} small portrait={image.portrait} />
          ))}
        </div>
        <div className="pk-thumbnail-actions">
          <button type="button" className="button button--outline" aria-disabled="true" title={hint}>
            <DownloadIcon />
            Download
          </button>
          <button type="button" className="button button--outline" aria-disabled="true" title={hint}>
            <EditIcon />
            Edit prompt
          </button>
          <button type="button" className="button button--outline" onClick={onRegenerate}>
            <RefreshIcon />
            Regenerate
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label={`More options (${hint.toLowerCase()})`}
            aria-disabled="true"
            title={hint}
          >
            <MoreIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function YouTubeDetails({ kit, onKitChange }) {
  return (
    <div className="pk-details">
      <div className="pk-details__column">
        <div className="pk-block pk-block--boxed">
          <div className="pk-block__header">
            <label htmlFor="pk-title" className="pk-subheading">
              <YouTubeIcon className="pk-subheading__icon" />
              YouTube title
            </label>
            <span className="pk-block__count">
              {kit.title.length}/{LIMITS.youtubeTitle}
            </span>
            <CopyButton text={kit.title} label="title" />
          </div>
          <textarea
            id="pk-title"
            className="pk-textarea pk-textarea--plain"
            value={kit.title}
            onChange={(event) => onKitChange({ ...kit, title: event.target.value })}
            maxLength={LIMITS.youtubeTitle}
            rows={3}
          />
        </div>

        <div className="pk-block pk-block--boxed">
          <div className="pk-block__header">
            <h3 className="pk-subheading">
              <YouTubeIcon className="pk-subheading__icon" />
              Tags
            </h3>
            <CopyButton text={kit.tags.join(', ')} label="tags" />
          </div>
          <ul className="pk-tags">
            {kit.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pk-block pk-block--boxed pk-details__description">
        <div className="pk-block__header">
          <label htmlFor="pk-description" className="pk-subheading">
            <FileTextIcon className="pk-subheading__icon" />
            Description + hashtags
          </label>
          <span className="pk-block__count">
            {kit.description.length.toLocaleString('en-IN')}/{LIMITS.youtubeDescription.toLocaleString('en-IN')}
          </span>
          <CopyButton text={kit.description} label="description" />
        </div>
        <textarea
          id="pk-description"
          className="pk-textarea pk-textarea--plain pk-textarea--grow"
          value={kit.description}
          onChange={(event) => onKitChange({ ...kit, description: event.target.value })}
          maxLength={LIMITS.youtubeDescription}
          rows={12}
        />
      </div>
    </div>
  )
}

function countHashtags(text) {
  return (text.match(/#[\p{L}\p{N}_]+/gu) ?? []).length
}

function InstagramDetails({ kit, onKitChange }) {
  const hashtags = countHashtags(kit.caption)
  const tooManyHashtags = hashtags > LIMITS.instagramHashtags

  return (
    <div className="pk-block pk-block--boxed">
      <div className="pk-block__header">
        <label htmlFor="pk-caption" className="pk-subheading">
          <InstagramIcon className="pk-subheading__icon" />
          Caption + hashtags
        </label>
        <span className={tooManyHashtags ? 'pk-block__count pk-block__count--over' : 'pk-block__count'}>
          {hashtags}/{LIMITS.instagramHashtags} hashtags
        </span>
        <span className="pk-block__count">
          {kit.caption.length.toLocaleString('en-IN')}/{LIMITS.instagramCaption.toLocaleString('en-IN')}
        </span>
        <CopyButton text={kit.caption} label="caption" />
      </div>
      <textarea
        id="pk-caption"
        className="pk-textarea pk-textarea--plain"
        value={kit.caption}
        onChange={(event) => onKitChange({ ...kit, caption: event.target.value })}
        maxLength={LIMITS.instagramCaption}
        rows={11}
      />
      {tooManyHashtags && (
        <p className="pk-error pk-error--inline" role="alert">
          Instagram allows up to {LIMITS.instagramHashtags} hashtags per post.
        </p>
      )}
    </div>
  )
}

function GeneratedKit({ platform, config, kit, onKitChange, onRegenerate, notice }) {
  return (
    <section className="panel pk-output" aria-labelledby="pk-output-heading">
      <div className="pk-output__header">
        <h2 id="pk-output-heading" className="pk-heading">
          <ImageIcon />
          2. Generated posting kit
          <span className="pk-badge">Example</span>
        </h2>
        <button type="button" className="button button--outline pk-regenerate" onClick={onRegenerate}>
          <RefreshIcon />
          Regenerate all
        </button>
      </div>
      <p className="pk-help pk-output__note">Sample content only. {config.outputNote}</p>

      {notice && (
        <p className="notice pk-notice" role="status">
          {notice}
        </p>
      )}

      <ImageSection image={config.image} onRegenerate={onRegenerate} />

      {platform === 'instagram' ? (
        <InstagramDetails kit={kit} onKitChange={onKitChange} />
      ) : (
        <YouTubeDetails kit={kit} onKitChange={onKitChange} />
      )}
    </section>
  )
}

export default GeneratedKit
