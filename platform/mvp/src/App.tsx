import React, { useState } from 'react'
import Mentor from './pages/Mentor'
import Student from './pages/Student'
import Entrepreneur from './pages/Entrepreneur'
import ProfileForm from './components/ProfileForm'
import PilotForm from './components/PilotForm'
import EvidenceViewer from './components/EvidenceViewer'

export default function App(){
  const [page, setPage] = useState<'mentor'|'student'|'entrepreneur'|'profile'|'pilot'|'evidence'>('mentor')
  return (
    <div className="app">
      <header className="top">
        <h1>Velocity Quantal — MVP</h1>
        <nav>
          <button onClick={()=>setPage('mentor')}>Mentor</button>
          <button onClick={()=>setPage('student')}>Student</button>
          <button onClick={()=>setPage('entrepreneur')}>Entrepreneur</button>
          <button onClick={()=>setPage('profile')}>Profile (Elicitation)</button>
          <button onClick={()=>setPage('pilot')}>Submit Pilot</button>
          <button onClick={()=>setPage('evidence')}>Evidence Viewer</button>
        </nav>
      </header>
      <main>
        {page==='mentor' && <Mentor />}
        {page==='student' && <Student />}
        {page==='entrepreneur' && <Entrepreneur />}
        {page==='profile' && <ProfileForm />}
        {page==='pilot' && <PilotForm />}
        {page==='evidence' && <EvidenceViewer />}
      </main>
    </div>
  )
}
