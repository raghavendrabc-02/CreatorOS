import { NavLink, useLocation } from 'react-router'
import { HomeIcon, LogoIcon } from './icons.jsx'
import { PLATFORMS } from '../data/platforms.js'
import { getTools } from '../data/tools.js'
import { USER } from '../data/user.js'
import './Sidebar.css'

function linkClass({ isActive }) {
  return isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
}

function subLinkClass({ isActive }) {
  return isActive ? 'sidebar__sublink sidebar__sublink--active' : 'sidebar__sublink'
}

function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="sidebar">
      <NavLink to="/" className="sidebar__brand">
        <LogoIcon className="sidebar__logo" />
        <span>CreatorOS</span>
      </NavLink>

      <nav className="sidebar__nav" aria-label="Main">
        <NavLink to="/" end className={linkClass}>
          <HomeIcon className="sidebar__link-icon" />
          Home
        </NavLink>

        {PLATFORMS.map(({ id, name, icon: Icon }) => {
          const tools = getTools(id)
          // Show a platform's tools underneath it while you are inside that platform.
          const isOpen = pathname === `/${id}` || pathname.startsWith(`/${id}/`)

          return (
            <div key={id} className="sidebar__group">
              <NavLink to={`/${id}`} className={linkClass}>
                <Icon className="sidebar__link-icon" />
                {name}
              </NavLink>

              {isOpen && tools.length > 0 && (
                <div className="sidebar__subnav">
                  {tools.map(({ id: toolId, name: toolName, icon: ToolIcon }) => (
                    <NavLink key={toolId} to={`/${id}/${toolId}`} className={subLinkClass}>
                      <ToolIcon className="sidebar__sublink-icon" />
                      {toolName}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="sidebar__user">
        <span className="sidebar__avatar" aria-hidden="true">
          {USER.name.charAt(0)}
        </span>
        <div>
          <p className="sidebar__user-name">{USER.name}</p>
          <p className="sidebar__user-role">{USER.role}</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
