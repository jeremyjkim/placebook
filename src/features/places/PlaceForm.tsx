import { FormEvent, useState } from 'react'
import { usePlaceStore } from '../../store/placeStore'

interface PlaceFormProps {
  lat?: number
  lng?: number
  onClose: () => void
}

const emojiPalette = ['📍', '🏕️', '☕️', '🍜', '🏖️', '🌆', '🚶‍♂️', '🧭']

export function PlaceForm({ lat, lng, onClose }: PlaceFormProps) {
  const addPlace = usePlaceStore((s) => s.addPlace)
  const [name, setName] = useState('')
  const [memo, setMemo] = useState('')
  const [emoji, setEmoji] = useState<string>(emojiPalette[0])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (lat === undefined || lng === undefined) return
    addPlace({ name, memo, emoji, lat, lng })
    setName('')
    setMemo('')
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Cafe 0, hidden gallery..."
          className="w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Memo</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Why is this place special?"
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Emoji</label>
        <div className="flex flex-wrap gap-2">
          {emojiPalette.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setEmoji(item)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-xl transition ${emoji === item ? 'border-primary bg-primary/10' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01]"
      >
        Save place
      </button>
    </form>
  )
}
