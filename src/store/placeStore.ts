import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { nanoid } from '../utils/nanoid'

type Place = {
  id: string
  name: string
  memo?: string
  emoji?: string
  lat: number
  lng: number
  createdAt: string
}

type PlaceState = {
  places: Place[]
  selectedId?: string
  tempLocation?: { lat: number; lng: number }
}

type PlaceActions = {
  addPlace: (input: Omit<Place, 'id' | 'createdAt'>) => Place
  removePlace: (id: string) => void
  selectPlace: (id?: string) => void
  setTempLocation: (coords?: { lat: number; lng: number }) => void
  upsertPlace: (place: Place) => void
}

export const usePlaceStore = create<PlaceState & PlaceActions>()(
  devtools(
    persist(
      (set, get) => ({
        places: [],
        selectedId: undefined,
        tempLocation: undefined,
        addPlace: (input) => {
          const place: Place = {
            ...input,
            id: nanoid(),
            createdAt: new Date().toISOString(),
          }
          set((state) => ({ places: [place, ...state.places], selectedId: place.id }))
          set(() => ({ tempLocation: undefined }))
          return place
        },
        removePlace: (id) => set((state) => ({ places: state.places.filter((p) => p.id !== id) })),
        selectPlace: (id) => set(() => ({ selectedId: id })),
        setTempLocation: (coords) => set(() => ({ tempLocation: coords })),
        upsertPlace: (place) => {
          const exists = get().places.some((p) => p.id === place.id)
          set((state) => ({
            places: exists
              ? state.places.map((p) => (p.id === place.id ? place : p))
              : [place, ...state.places],
          }))
        },
      }),
      { name: 'placebook-store' }
    )
  )
)

export type { Place }
