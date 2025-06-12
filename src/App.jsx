import Navbar from './components/Navbar';
import { useState } from 'react'
import './index.css'
import "tailwindcss";

function App() {
  const [count, setCount] = useState(0)

  return (
      <>
        <Navbar className="h-full" />
        <p>Hello, man!</p>
      </>
      )
}

export default App
