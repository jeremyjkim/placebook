import { useEffect, useState } from 'react'
import { MapView } from '../features/map/MapView'
import { PlaceForm } from '../features/places/PlaceForm'
import { PlaceList } from '../features/places/PlaceList'
import { usePlaceStore } from '../store/placeStore'
import { BottomSheet } from '../ui/BottomSheet'
import { Fab } from '../ui/Fab'
import { Modal } from '../ui/Modal'

export default function App() {
  const tempLocation = usePlaceStore((s) => s.tempLocation)
  const setTempLocation = usePlaceStore((s) => s.setTempLocation)
  const placesCount = usePlaceStore((s) => s.places.length)
  const [formOpen, setFormOpen] = useState(false)
  const [hint, setHint] = useState<string>('Tap on the map to drop a pin, then press + to save')

  useEffect(() => {
    if (!tempLocation) return
    setHint('Nice drop! Press + to add details.')
  }, [tempLocation])

  const handleFabClick = () => {
    if (!tempLocation) {
      setHint('Pick a spot on the map first.')
      return
    }
    setFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto w-full max-w-5xl px-4 pt-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Placebook</p>
            <h1 className="text-2xl font-bold text-slate-900">Save the places you love</h1>
            <p className="text-sm text-slate-600">Kakao map powered, Journi-inspired web bookmarking.</p>
          </div>
          <div className="hidden rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-500 shadow-card md:block">
            {placesCount} saved spot{placesCount === 1 ? '' : 's'}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pb-24 pt-4">
        <div className="overflow-hidden rounded-3xl bg-white/80 p-3 shadow-card">
          <MapView />
        </div>

        <BottomSheet title="Saved places" subtitle={hint}>
          <PlaceList />
        </BottomSheet>
      </main>

      <Fab onClick={handleFabClick} label="Add place" />

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Add place">
        <PlaceForm lat={tempLocation?.lat} lng={tempLocation?.lng} onClose={() => setFormOpen(false)} />
        <div className="mt-3 text-xs text-slate-500">
          Location: {tempLocation?.lat.toFixed(4)}, {tempLocation?.lng.toFixed(4)}
        </div>
        <button
          className="mt-3 text-xs text-slate-500 underline"
          onClick={() => {
            setFormOpen(false)
            setTempLocation(undefined)
          }}
        >
          Clear temporary marker
        </button>
      </Modal>
    </div>
  )
}
