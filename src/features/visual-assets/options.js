// Choices for the generation settings. `value` is what will be sent to the backend later.

export const VISUAL_STYLES = [
  { value: 'cinematic', label: 'Cinematic (Realistic)' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'illustration', label: 'Illustration' },
  { value: '3d', label: '3D Render' },
  { value: 'minimal', label: 'Minimal / Flat' },
]

export const ASPECT_RATIOS = [
  { value: '9:16', label: '9:16 (Reels / Shorts)' },
  { value: '4:5', label: '4:5 (Portrait post)' },
  { value: '1:1', label: '1:1 (Square)' },
  { value: '16:9', label: '16:9 (Landscape)' },
]

export const IMAGE_QUALITIES = [
  { value: 'standard', label: 'Standard' },
  { value: 'high', label: 'High Quality' },
]

export const DEFAULT_SETTINGS = {
  style: 'cinematic',
  aspectRatio: '9:16',
  quality: 'high',
}
