export interface Folder {
  id: string;
  name: string;
  emoji: string;
  createdAt: Date;
}

export function createFolder(name: string, emoji: string = '📁'): Omit<Folder, 'id' | 'createdAt'> {
  return {
    name,
    emoji,
  };
}