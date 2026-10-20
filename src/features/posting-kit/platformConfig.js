// What the Posting Kit generates on each platform.

export const PLATFORM_CONFIG = {
  youtube: {
    image: { name: 'thumbnail', label: 'Thumbnail', portrait: false },
    outputNote: 'Your generated thumbnail, title, description and tags will appear here.',
    generateStep: 'Create thumbnail and details',
  },
  instagram: {
    image: { name: 'Reel cover', label: 'Reel cover', portrait: true },
    outputNote: 'Your generated Reel cover, caption and hashtags will appear here.',
    generateStep: 'Create cover and caption',
  },
}

// Platform limits.
export const LIMITS = {
  youtubeTitle: 100,
  youtubeDescription: 5000,
  instagramCaption: 2200,
  instagramHashtags: 30,
}
