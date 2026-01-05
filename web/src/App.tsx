import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { usePlaceStore } from './store/placeStore';
import { MapScreen } from './features/map/MapScreen';
import { PlacesListScreen } from './features/places/PlacesListScreen';
import { PlaceDetailScreen } from './features/place_detail/PlaceDetailScreen';

function App() {
  const init = usePlaceStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapScreen />} />
        <Route path="/places" element={<PlacesListScreen />} />
        <Route path="/places/:id" element={<PlaceDetailScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;