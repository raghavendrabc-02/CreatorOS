import { Outlet } from 'react-router'
import Sidebar from './Sidebar.jsx'
import './AppLayout.css'

// Shared frame for every page: sidebar navigation plus the page content.
function AppLayout() {
  return (
    <div className="app">
      <Sidebar />
      <main className="app__content">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
