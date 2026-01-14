import React, { useState } from 'react'
import Mentor from './pages/Mentor'
import Student from './pages/Student'
import Entrepreneur from './pages/Entrepreneur'

export default function App(){
  const [page, setPage] = useState<'mentor'|'student'|'entrepreneur'>('mentor')
  return (
    <div className="app">
      <header className="top">
        <h1>Velocity Quantal — MVP</h1>
        <nav>
          <button onClick={()=>setPage('mentor')}>Mentor</button>
          <button onClick={()=>setPage('student')}>Student</button>
          <button onClick={()=>setPage('entrepreneur')}>Entrepreneur</button>
        </nav>
      </header>
      <main>
        {page==='mentor' && <Mentor />}
        {page==='student' && <Student />}
        {page==='entrepreneur' && <Entrepreneur />}
      </main>
    </div>
  )
}
