import { useRef, useState } from 'react'
import { ImageIcon, XIcon } from '../../components/icons.jsx'

export const MAX_REFERENCE_IMAGES = 10
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

// Lets the creator pick or drop reference images. Images stay in the browser (object URLs);
// nothing is uploaded.
function ReferenceImages({ images, onAdd, onRemove }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const remaining = MAX_REFERENCE_IMAGES - images.length

  function handleFiles(fileList) {
    onAdd([...fileList].filter((file) => ACCEPTED_TYPES.includes(file.type)), fileList.length)
  }

  return (
    <div className="pk-field">
      <p className="pk-label">
        Reference images <span className="pk-label__hint">(Optional)</span>
      </p>
      <p className="pk-help">Add images for style reference or visual ideas.</p>

      <button
        type="button"
        className={isDragging ? 'pk-dropzone pk-dropzone--active' : 'pk-dropzone'}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          handleFiles(event.dataTransfer.files)
        }}
        disabled={remaining === 0}
      >
        <ImageIcon />
        <span>{remaining === 0 ? 'Image limit reached' : 'Click to choose or drag and drop'}</span>
        <span className="pk-dropzone__hint">
          PNG, JPG, WEBP (max {MAX_REFERENCE_IMAGES} images)
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        hidden
        onChange={(event) => {
          handleFiles(event.target.files)
          event.target.value = ''
        }}
      />

      {images.length > 0 && (
        <ul className="pk-thumbs">
          {images.map((image) => (
            <li key={image.id} className="pk-thumb">
              <img src={image.url} alt={image.name} />
              <button
                type="button"
                className="pk-thumb__remove"
                onClick={() => onRemove(image.id)}
                aria-label={`Remove ${image.name}`}
              >
                <XIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ReferenceImages
