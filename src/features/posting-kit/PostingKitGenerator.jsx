import { useEffect, useRef, useState } from 'react'
import StepProgress from '../../components/StepProgress.jsx'
import ContentInput from './ContentInput.jsx'
import GeneratedKit from './GeneratedKit.jsx'
import { MAX_REFERENCE_IMAGES } from './ReferenceImages.jsx'
import { EXAMPLE_KITS } from './exampleKit.js'
import { PLATFORM_CONFIG } from './platformConfig.js'
import './PostingKit.css'

function getSteps(config) {
  return [
    { title: 'Input content', description: 'Add script and references' },
    { title: 'Generate', description: config.generateStep },
    { title: 'Review', description: 'Check and edit' },
    { title: 'Download', description: 'Save and use' },
  ]
}

const NOT_CONNECTED =
  'AI generation is not connected yet. It will start working once the backend is added. Your script, images and instructions are kept on this page until you leave it.'

// Shared by YouTube and Instagram; `platform` decides what gets generated.
function PostingKitGenerator({ platform = 'youtube' }) {
  const config = PLATFORM_CONFIG[platform]
  const [script, setScript] = useState('')
  const [instructions, setInstructions] = useState('')
  const [images, setImages] = useState([])
  const [imageError, setImageError] = useState('')
  const [kit, setKit] = useState(EXAMPLE_KITS[platform])
  // Which section the "not connected" message belongs to: 'input', 'output' or none.
  const [noticeIn, setNoticeIn] = useState(null)

  // Object URLs created for previews; released on removal and when leaving the page.
  const urlsRef = useRef(new Set())
  useEffect(() => {
    const urls = urlsRef.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  function addImages(files, attempted) {
    const accepted = files.slice(0, MAX_REFERENCE_IMAGES - images.length)
    const added = accepted.map((file) => {
      const url = URL.createObjectURL(file)
      urlsRef.current.add(url)
      return { id: url, name: file.name, url }
    })
    setImages((current) => [...current, ...added])

    if (files.length < attempted) {
      setImageError('Some files were skipped. Only PNG, JPG and WEBP images are supported.')
    } else if (accepted.length < files.length) {
      setImageError(`You can add up to ${MAX_REFERENCE_IMAGES} images.`)
    } else {
      setImageError('')
    }
  }

  function removeImage(id) {
    URL.revokeObjectURL(id)
    urlsRef.current.delete(id)
    setImages((current) => current.filter((image) => image.id !== id))
    setImageError('')
  }

  return (
    <div className="pk">
      <StepProgress steps={getSteps(config)} current={0} />

      <div className="pk__columns">
        <ContentInput
          script={script}
          onScriptChange={(value) => {
            setScript(value)
            setNoticeIn(null)
          }}
          instructions={instructions}
          onInstructionsChange={setInstructions}
          images={images}
          onAddImages={addImages}
          onRemoveImage={removeImage}
          imageError={imageError}
          onGenerate={() => setNoticeIn('input')}
          notice={noticeIn === 'input' ? NOT_CONNECTED : ''}
        />
        <GeneratedKit
          platform={platform}
          config={config}
          kit={kit}
          onKitChange={setKit}
          onRegenerate={() => setNoticeIn('output')}
          notice={noticeIn === 'output' ? NOT_CONNECTED : ''}
        />
      </div>
    </div>
  )
}

export default PostingKitGenerator
