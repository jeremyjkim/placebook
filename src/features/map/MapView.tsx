import { useEffect, useRef, useState } from 'react'
import { useKakaoLoader } from '../../hooks/useKakaoLoader'
import { usePlaceStore } from '../../store/placeStore'

const containerStyle = 'relative h-[55vh] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-card'

function markerImage(color: string) {
  const svg =
    `<?xml version="1.0"?><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="10" fill="${color}"/></svg>`
  const url = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  return new kakao.maps.MarkerImage(url, new kakao.maps.Size(40, 40), { offset: new kakao.maps.Point(20, 20) })
}

export function MapView() {
  const { status, error } = useKakaoLoader()
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<kakao.maps.Map | null>(null)
  const placeMarkers = useRef<Map<string, kakao.maps.Marker>>(new Map())
  const tempMarkerRef = useRef<kakao.maps.Marker | null>(null)
  const [info, setInfo] = useState<string>('Tap on the map to drop a pin')

  const places = usePlaceStore((s) => s.places)
  const selectedId = usePlaceStore((s) => s.selectedId)
  const selectPlace = usePlaceStore((s) => s.selectPlace)
  const setTempLocation = usePlaceStore((s) => s.setTempLocation)
  const tempLocation = usePlaceStore((s) => s.tempLocation)

  useEffect(() => {
    if (status !== 'ready' || !mapRef.current) return

    const center = new kakao.maps.LatLng(37.5665, 126.978)
    const map = new kakao.maps.Map(mapRef.current, {
      center,
      level: 5,
    })
    map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT)
    mapInstance.current = map

    const clickHandler = (mouseEvent: kakao.maps.event.MouseEvent) => {
      const latlng = mouseEvent.latLng
      setTempLocation({ lat: latlng.getLat(), lng: latlng.getLng() })
      setInfo('Drop captured. Hit "+" to save it.')
    }

    kakao.maps.event.addListener(map, 'click', clickHandler)

    return () => {
      kakao.maps.event.removeListener(map, 'click', clickHandler)
    }
  }, [status, setTempLocation])

  useEffect(() => {
    if (!mapInstance.current) return

    placeMarkers.current.forEach((marker, id) => {
      if (!places.find((p) => p.id === id)) {
        marker.setMap(null)
        placeMarkers.current.delete(id)
      }
    })

    places.forEach((place) => {
      const map = mapInstance.current
      if (!map) return

      const position = new kakao.maps.LatLng(place.lat, place.lng)
      let marker = placeMarkers.current.get(place.id)

      if (!marker) {
        marker = new kakao.maps.Marker({
          position,
          clickable: true,
          image: markerImage('#0f172a'),
        })
        marker.setMap(map)
        kakao.maps.event.addListener(marker, 'click', () => {
          selectPlace(place.id)
          map.panTo(position)
        })
        placeMarkers.current.set(place.id, marker)
      } else {
        marker.setPosition(position)
      }

      marker.setImage(markerImage(selectedId === place.id ? '#3b82f6' : '#0f172a'))
      marker.setZIndex(selectedId === place.id ? 2 : 1)
    })
  }, [places, selectedId, selectPlace])

  useEffect(() => {
    if (!mapInstance.current) return
    const map = mapInstance.current

    if (tempLocation) {
      const position = new kakao.maps.LatLng(tempLocation.lat, tempLocation.lng)
      if (!tempMarkerRef.current) {
        tempMarkerRef.current = new kakao.maps.Marker({
          position,
          zIndex: 3,
          image: markerImage('#f59e0b'),
        })
        tempMarkerRef.current.setMap(map)
      } else {
        tempMarkerRef.current.setPosition(position)
      }
      map.panTo(position)
    } else if (tempMarkerRef.current) {
      tempMarkerRef.current.setMap(null)
      tempMarkerRef.current = null
    }
  }, [tempLocation])

  useEffect(() => {
    if (!mapInstance.current || !selectedId) return
    const place = places.find((p) => p.id === selectedId)
    if (!place) return
    const target = new kakao.maps.LatLng(place.lat, place.lng)
    mapInstance.current.panTo(target)
  }, [selectedId, places])

  if (status === 'error') {
    return <div className={containerStyle}>⚠️ {error}</div>
  }

  if (status !== 'ready') {
    return (
      <div className={`${containerStyle} flex items-center justify-center text-sm text-slate-500`}>
        Loading Kakao map...
      </div>
    )
  }

  return (
    <div className={containerStyle}>
      <div ref={mapRef} className="h-full w-full" />
      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-card">
        {info}
      </div>
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 transform rounded-full bg-white/80 px-3 py-2 text-[11px] text-slate-600 shadow-card">
        Map powered by Kakao · Tap to place marker
      </div>
    </div>
  )
}
