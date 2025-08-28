import { Routes, Route } from 'react-router-dom'
import AdvancedPOS from './components/AdvancedPOS'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdvancedPOS />} />
      <Route path="*" element={<AdvancedPOS />} />
    </Routes>
  )
}
