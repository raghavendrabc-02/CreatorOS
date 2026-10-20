import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import AppLayout from './components/AppLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import PlatformPage from './pages/PlatformPage.jsx'
import ToolPage from './pages/ToolPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path=":platformId" element={<PlatformPage />} />
          <Route path=":platformId/:toolId" element={<ToolPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
