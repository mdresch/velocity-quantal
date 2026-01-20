export interface Pilot {
  id: string;
  title: string;
  opportunityId?: number | string;
  owner?: string;
  team?: string[];
  startDate?: string;
  endDate?: string;
  status?: string;
  createdAt: string;
}

const STORAGE_KEY = 'vq:pilots'

function readStore(): Pilot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (e) {
    return []
  }
}

function writeStore(items: Pilot[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export async function createPilot(payload: Omit<Pilot, 'id' | 'createdAt'>) {
  const id = `pilot-${Date.now()}`
  const pilot: Pilot = {
    id,
    ...payload,
    status: payload.status || 'draft',
    createdAt: new Date().toISOString(),
  }
  const items = readStore()
  items.push(pilot)
  writeStore(items)
  return { pilotId: id }
}

export async function getPilot(id: string) {
  const items = readStore()
  return items.find((p) => p.id === id) || null
}

export async function getPilots() {
  return readStore()
}
