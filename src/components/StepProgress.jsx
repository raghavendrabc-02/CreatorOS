import './StepProgress.css'

// Horizontal list of numbered steps. Steps before `current` are done, `current` is active.
function StepProgress({ steps, current }) {
  return (
    <ol className="steps panel">
      {steps.map((step, index) => {
        const state = index < current ? 'done' : index === current ? 'active' : 'upcoming'
        return (
          <li
            key={step.title}
            className={`steps__item steps__item--${state}`}
            aria-current={state === 'active' ? 'step' : undefined}
          >
            <span className="steps__number">{index + 1}</span>
            <span className="steps__text">
              <span className="steps__title">{step.title}</span>
              <span className="steps__description">{step.description}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default StepProgress
