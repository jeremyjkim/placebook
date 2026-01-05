import { useMemo } from 'react'
import { usePlaceStore } from '../../store/placeStore'

export function PlaceList() {
  const places = usePlaceStore((s) => s.places)
  const removePlace = usePlaceStore((s) => s.removePlace)
  const selectedId = usePlaceStore((s) => s.selectedId)
  const selectPlace = usePlaceStore((s) => s.selectPlace)

  const sorted = useMemo(
    () => [...places].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [places]
  )

  if (!places.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        Tap anywhere on the map to drop a marker, then press "+" to save it.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sorted.map((place) => (
        <article
          key={place.id}
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-sm transition hover:-translate-y-[1px] hover:shadow-card ${
            selectedId === place.id ? 'border-primary/50 bg-primary/5' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl">{place.emoji || '📍'}</div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">{place.name}</h3>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                {new Date(place.createdAt).toLocaleDateString()}
              </div>
            </div>
            {place.memo && <p className="text-sm text-slate-600">{place.memo}</p>}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Lat: {place.lat.toFixed(4)}</span>
              <span>Lng: {place.lng.toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
                onClick={() => selectPlace(place.id)}
              >
                View on map
              </button>
              <button
                className="rounded-lg px-3 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100"
                onClick={() => removePlace(place.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
