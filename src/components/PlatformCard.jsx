import { Link } from 'react-router'
import { ArrowRightIcon } from './icons.jsx'
import './PlatformCard.css'

function PlatformCard({ id, name, description, tileIcon: TileIcon }) {
  return (
    <article className={`platform-card platform-theme--${id}`}>
      <span className="platform-tile">
        <TileIcon className="platform-tile__icon" />
      </span>
      <span className="platform-badge">{name}</span>
      <h2 className="platform-card__name">{name}</h2>
      <p className="platform-card__description">
        {description.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>
      <Link to={`/${id}`} className="platform-card__button">
        Open {name} tools
        <ArrowRightIcon className="platform-card__button-icon" />
      </Link>
    </article>
  )
}

export default PlatformCard
