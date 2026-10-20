import { Link, Navigate, useParams } from 'react-router'
import { ArrowLeftIcon } from '../components/icons.jsx'
import { PLATFORMS } from '../data/platforms.js'
import { getTools } from '../data/tools.js'
import './ToolPage.css'

// Shared frame for every tool: back link and header, then the tool's own UI.
function ToolPage() {
  const { platformId, toolId } = useParams()
  const platform = PLATFORMS.find((p) => p.id === platformId)
  const tool = getTools(platformId).find((t) => t.id === toolId)

  if (!platform) {
    return <Navigate to="/" replace />
  }
  if (!tool) {
    return <Navigate to={`/${platformId}`} replace />
  }

  const { name, description, icon: Icon, theme, component: ToolComponent, props } = tool

  return (
    <div className={`tool-page tool-theme--${theme}`}>
      <Link to={`/${platformId}`} className="tool-page__back">
        <ArrowLeftIcon />
        Back to {platform.name} Tools
      </Link>

      <header className="tool-page__header">
        <span className="tool-page__icon">
          <Icon />
        </span>
        <div>
          <h1 className="tool-page__title">{name}</h1>
          <p className="tool-page__description">{description}</p>
        </div>
      </header>

      {ToolComponent ? (
        // The key gives each platform's copy of a shared tool its own fresh state.
        <ToolComponent key={`${platformId}/${toolId}`} {...props} />
      ) : (
        <div className="tool-page__notice">
          <p className="tool-page__notice-title">Not built yet</p>
          <p className="tool-page__notice-text">
            This tool will be designed and built in an upcoming step.
          </p>
        </div>
      )}
    </div>
  )
}

export default ToolPage
