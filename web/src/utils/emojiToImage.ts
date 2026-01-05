/**
 * 이모지를 이미지 URL로 변환하는 유틸리티
 * Canvas를 사용하여 이모지를 이미지로 변환
 */
export function emojiToImageUrl(emoji: string, size: number = 40): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    // 배경 원 그리기 (흰색)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 테두리
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 이모지 텍스트 그리기
    ctx.font = `${size * 0.65}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2);
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error creating emoji image:', error);
    return '';
  }
}

/**
 * 캐시된 이미지 URL 관리
 */
const imageCache: Map<string, string> = new Map();

export function getEmojiImageUrl(emoji: string, size: number = 40): string {
  const cacheKey = `${emoji}-${size}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }
  
  const url = emojiToImageUrl(emoji, size);
  if (url) {
    imageCache.set(cacheKey, url);
  }
  return url;
}