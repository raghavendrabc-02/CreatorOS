import { useState } from 'react'
import StepProgress from '../../components/StepProgress.jsx'
import ExampleScript from './ExampleScript.jsx'
import GenerationSettings from './GenerationSettings.jsx'
import ScriptInput from './ScriptInput.jsx'
import VisualPlanPreview from './VisualPlanPreview.jsx'
import { EXAMPLE_SCRIPT } from './exampleData.js'
import { DEFAULT_SETTINGS } from './options.js'
import './VisualAssetGenerator.css'

const STEPS = [
  { title: 'Add script', description: 'Paste your script' },
  { title: 'AI analysis', description: 'Break into scenes' },
  { title: 'Review plan', description: 'Check prompts & edit' },
  { title: 'Generate images', description: 'Create and save assets' },
]

const NOT_CONNECTED_NOTICE =
  'AI analysis is not connected yet. It will start working once the backend is added. Your script and settings are kept on this page until you leave it.'

// Shared by Instagram and YouTube; each passes its usual aspect ratio.
function VisualAssetGenerator({ defaultAspectRatio = DEFAULT_SETTINGS.aspectRatio }) {
  const [script, setScript] = useState('')
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS, aspectRatio: defaultAspectRatio })
  const [notice, setNotice] = useState('')

  function handleScriptChange(value) {
    setScript(value)
    setNotice('')
  }

  return (
    <div className="vag">
      <StepProgress steps={STEPS} current={0} />

      <div className="vag__columns">
        <ScriptInput
          script={script}
          onChange={handleScriptChange}
          onAnalyse={() => setNotice(NOT_CONNECTED_NOTICE)}
          notice={notice}
        />
        <div className="vag__side">
          <ExampleScript onUse={() => handleScriptChange(EXAMPLE_SCRIPT)} />
          <GenerationSettings settings={settings} onChange={setSettings} />
        </div>
      </div>

      <VisualPlanPreview />
    </div>
  )
}

export default VisualAssetGenerator
