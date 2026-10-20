import { FileTextIcon } from '../../components/icons.jsx'
import { EXAMPLE_SCRIPT } from './exampleData.js'

const PREVIEW = EXAMPLE_SCRIPT.split('\n').filter(Boolean).slice(0, 2).join(' ')

function ExampleScript({ onUse }) {
  return (
    <section className="panel vag-example" aria-labelledby="example-heading">
      <div className="vag-example__top">
        <FileTextIcon className="vag-heading__icon" />
        <div className="vag-example__text">
          <h2 id="example-heading" className="vag-example__title">Example script</h2>
          <p className="vag-heading__text">Try the tool with a sample script.</p>
        </div>
        <button type="button" className="button button--soft" onClick={onUse}>
          Use example
        </button>
      </div>
      <blockquote className="vag-example__quote">“{PREVIEW}…”</blockquote>
    </section>
  )
}

export default ExampleScript
