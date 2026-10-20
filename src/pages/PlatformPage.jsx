import { Navigate, useParams } from 'react-router'
import ToolCard from '../components/ToolCard.jsx'
import { GridIcon } from '../components/icons.jsx'
import { PLATFORMS } from '../data/platforms.js'
import { getTools } from '../data/tools.js'
import './PlatformPage.css'

function PlatformPage() {
  const { platformId } = useParams()
  const platform = PLATFORMS.find((p) => p.id === platformId)

  if (!platform) {
    return <Navigate to="/" replace />
  }

  const { id, name, workspaceDescription, tileIcon: TileIcon } = platform
  const tools = getTools(id)

  return (
    <div className={`platform-page platform-theme--${id}`}>
      <header className="platform-page__header">
        <span className="platform-tile platform-page__tile">
          <TileIcon className="platform-tile__icon" />
        </span>
        <div className="platform-page__heading">
          <h1 className="platform-page__title">{name} Workspace</h1>
          <p className="platform-page__description">{workspaceDescription}</p>
        </div>
        {tools.length > 0 && (
          <span className="platform-page__count">
            <GridIcon />
            {tools.length} {tools.length === 1 ? 'Tool' : 'Tools'}
          </span>
        )}
      </header>

      {tools.length > 0 ? (
        <section className="platform-page__tools" aria-label={`${name} tools`}>
          {tools.map((tool) => (
            <ToolCard key={tool.id} platformId={id} tool={tool} />
          ))}
        </section>
      ) : (
        <p className="platform-page__empty">
          No tools yet. {name} tools will appear here as they are added.
        </p>
      )}
    </div>
  )
}

export default PlatformPage
