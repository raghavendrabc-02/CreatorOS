import { Link } from 'react-router'
import { ArrowRightIcon, CheckIcon } from './icons.jsx'
import './ToolCard.css'

function ToolCard({ platformId, tool }) {
  const { id, name, description, features, icon: Icon, theme, preview: Preview } = tool

  return (
    <article className={`tool-card tool-theme--${theme}`}>
      <div className="tool-card__media">
        <Preview />
        <span className="tool-card__icon">
          <Icon />
        </span>
      </div>

      <div className="tool-card__body">
        <h2 className="tool-card__name">{name}</h2>
        <p className="tool-card__description">{description}</p>

        <ul className="tool-card__features">
          {features.map((feature) => (
            <li key={feature}>
              <span className="tool-card__check">
                <CheckIcon />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <Link to={`/${platformId}/${id}`} className="tool-card__button">
          Open {name}
          <ArrowRightIcon className="tool-card__button-icon" />
        </Link>
      </div>
    </article>
  )
}

export default ToolCard
