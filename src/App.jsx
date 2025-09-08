import { useState } from 'react'
import IconLibrary from './components/IconLibrary'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <h1>Icon Library</h1>
        <IconLibrary />
    </>
  )
}

export default App
