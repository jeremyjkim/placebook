import { Place, createPlace } from '../model/Place';

const DB_NAME = 'placebook';
const STORE_NAME = 'places';
const DB_VERSION = 1;

class PlaceRepository {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true,
          });
          objectStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  private getStore(mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    const transaction = this.db.transaction([STORE_NAME], mode);
    return transaction.objectStore(STORE_NAME);
  }

  async addPlace(
    latitude: number,
    longitude: number,
    emoji: string,
    note: string,
    folderName?: string
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const placeData = createPlace(latitude, longitude, emoji, note, folderName);
      // id 필드를 제외 - IndexedDB의 autoIncrement가 자동으로 생성
      const place: Omit<Place, 'id'> & { createdAt: Date } = {
        ...placeData,
        createdAt: new Date(),
      };

      const request = store.add(place);

      request.onsuccess = () => {
        resolve(request.result as number);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPlaces(): Promise<Place[]> {
    return new Promise((resolve, reject) => {
      const store = this.getStore();
      const request = store.getAll();

      request.onsuccess = () => {
        const places = request.result as Place[];
        // Convert createdAt strings back to Date objects
        const placesWithDates = places.map((place) => ({
          ...place,
          createdAt: new Date(place.createdAt),
        }));
        // Sort by createdAt descending
        placesWithDates.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        resolve(placesWithDates);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getPlace(id: number): Promise<Place | null> {
    return new Promise((resolve, reject) => {
      const store = this.getStore();
      const request = store.get(id);

      request.onsuccess = () => {
        const place = request.result as Place | undefined;
        if (!place) {
          resolve(null);
          return;
        }
        // Convert createdAt string back to Date object
        resolve({
          ...place,
          createdAt: new Date(place.createdAt),
        });
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deletePlace(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updatePlace(place: Place): Promise<void> {
    return new Promise((resolve, reject) => {
      const store = this.getStore('readwrite');
      const request = store.put(place);

      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  subscribe(callback: (places: Place[]) => void): () => void {
    // For web, we'll poll or use a simple event system
    // Since IndexedDB doesn't have built-in change events,
    // we'll use a simple polling mechanism or event emitter
    let isSubscribed = true;

    const checkForUpdates = async () => {
      if (!isSubscribed) return;
      try {
        const places = await this.getAllPlaces();
        callback(places);
      } catch (error) {
        console.error('Error fetching places:', error);
      }
    };

    // Initial load
    checkForUpdates();

    // Poll every second for updates
    const intervalId = setInterval(() => {
      if (!isSubscribed) {
        clearInterval(intervalId);
        return;
      }
      checkForUpdates();
    }, 1000);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }
}

export const placeRepository = new PlaceRepository();