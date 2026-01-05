export interface Place {
  id: number;
  latitude: number;
  longitude: number;
  emoji: string;
  note: string;
  folderName?: string;
  createdAt: Date;
}

export function createPlace(
  latitude: number,
  longitude: number,
  emoji: string,
  note: string,
  folderName?: string
): Omit<Place, 'id' | 'createdAt'> {
  return {
    latitude,
    longitude,
    emoji,
    note,
    folderName,
  };
}