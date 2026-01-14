export type Profile = {
  id: string
  name: string
  email: string
  availability: '0-5'|'6-10'|'11-20'|'21-40'|'40+'
  skills: {[k:string]: number}
  experienceYears: number
  certifications?: Array<{name:string, issuer:string, id?:string, expiry?:string, verified?:boolean}>
  willingToUpskill?: boolean
  willingToPartnerLicensed?: boolean
}

export type MatchResult = { score:number, fitLevel: 'High'|'Medium'|'Low', rationale: string[] }

let _profiles:{[id:string]:Profile} = {}
let _nextId = 1

function normalizeAvailability(a:string){
  switch(a){
    case '0-5': return 0
    case '6-10': return 25
    case '11-20': return 50
    case '21-40': return 75
    case '40+': return 100
    default: return 0
  }
}

function averageSkill(skills:{[k:string]:number}){
  const vals = Object.values(skills)
  if(vals.length===0) return 0
  return Math.round((vals.reduce((s,n)=>s+n,0)/vals.length)*20)
}

export async function postProfile(payload:Omit<Profile,'id'>){
  const id = `p${_nextId++}`
  const p:Profile = {id, ...payload}
  _profiles[id]=p
  return { profileId: id }
}

export async function postMatch(profileId:string):Promise<MatchResult>{
  const p = _profiles[profileId]
  if(!p) return {score:0, fitLevel:'Low', rationale:['profile not found']}
  const weights = { availability:0.2, skills:0.3, certifications:0.25, experience:0.15, upskill:0.1 }
  const availability = normalizeAvailability(p.availability)
  const skills = averageSkill(p.skills)
  const certScore = (p.certifications && p.certifications.some(c=>c.verified)) ? 100 : ((p.certifications && p.certifications.length>0)?50:0)
  const experience = (()=>{
    const y = p.experienceYears||0
    if(y<=0) return 0
    if(y===1) return 20
    if(y===2) return 35
    if(y<=5) return 70
    return 100
  })()
  const upskill = p.willingToUpskill?100:0
  const score = Math.round(availability*weights.availability + skills*weights.skills + certScore*weights.certifications + experience*weights.experience + upskill*weights.upskill)
  const fitLevel = score>=75? 'High' : (score>=50? 'Medium':'Low')
  const rationale = [] as string[]
  if(availability>=75) rationale.push('High availability')
  if(skills>=70) rationale.push('Strong skills match')
  if(certScore>=100) rationale.push('Has verified certification')
  if(certScore===50) rationale.push('Has unverified certification')
  if(p.willingToPartnerLicensed) rationale.push('Willing to partner with licensed providers')
  if(p.willingToUpskill) rationale.push('Open to training/upskilling')
  return { score, fitLevel, rationale }
}

// simple cert verification mock
export async function verifyCert(issuer:string, id?:string){
  // deterministic mock: if id contains 'VER' => verified, if contains 'EXP' => expired
  if(id && id.includes('VER')) return { status:'verified', sourceUrl:'https://example.registry/'+id }
  if(id && id.includes('EXP')) return { status:'expired', sourceUrl:'https://example.registry/'+id }
  return { status:'not_found' }
}

// simple pilots / evidence store (in-memory)
let _pilots:{[id:string]: any} = {}
let _evidence:{[id:string]: any[]} = {}

export async function postPilot(payload:any){
  const id = `pilot${Object.keys(_pilots).length+1}`
  _pilots[id] = { id, ...payload }
  return { pilotId: id }
}

export async function uploadEvidence(pilotId:string, item:any){
  _evidence[pilotId] = _evidence[pilotId]||[]
  _evidence[pilotId].push(item)
  return { ok:true }
}

export async function getEvidence(pilotId:string){
  return _evidence[pilotId]||[]
}
