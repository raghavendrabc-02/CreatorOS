import { BellIcon, ImageIcon, LayersIcon, MessageIcon } from '../components/icons.jsx'
import {
  CommentManagerPreview,
  DmAlertsPreview,
  InstagramPostingKitPreview,
  VisualAssetPreview,
} from '../features/instagram/ToolPreviews.jsx'
import CommentManager from '../features/instagram/comment-manager/CommentManager.jsx'
import DmAlerts from '../features/instagram/dm-alerts/DmAlerts.jsx'
import VisualAssetGenerator from '../features/visual-assets/VisualAssetGenerator.jsx'
import PostingKitGenerator from '../features/posting-kit/PostingKitGenerator.jsx'
import { PostingKitPreview, YouTubeVisualAssetPreview } from '../features/youtube/ToolPreviews.jsx'

// Tools available inside each platform workspace. Each tool gets a page at /<platform>/<tool>.
// `theme` picks a colour set defined in index.css (tool-theme--<theme>).
// `component` is the tool's working UI (rendered with `props`); tools without one show a
// "Not built yet" notice.
export const TOOLS_BY_PLATFORM = {
  instagram: [
    {
      id: 'visual-assets',
      name: 'Visual Asset Generator',
      description:
        'Turn your script into complete visual assets for your Reels. Get scene-by-scene prompts and AI-generated images ready for editing.',
      features: [
        'Paste your script',
        'AI analyses and creates visual flow',
        'Generate images for each scene',
        'Download and use in editing',
      ],
      icon: ImageIcon,
      theme: 'violet',
      preview: VisualAssetPreview,
      component: VisualAssetGenerator,
      props: { platform: 'instagram', defaultAspectRatio: '9:16' },
    },
    {
      id: 'comment-manager',
      name: 'AI Comment Manager',
      description:
        'Analyse your Instagram comments and get smart reply suggestions in your style. Save time and stay engaged.',
      features: [
        'Analyse comments with AI',
        'Get relevant reply suggestions',
        'Maintain your tone and style',
        'Reply faster and stay consistent',
      ],
      icon: MessageIcon,
      theme: 'rose',
      preview: CommentManagerPreview,
      component: CommentManager,
    },
    {
      id: 'dm-alerts',
      name: 'Brand DM Alerts',
      description:
        'Get notified when potential brand collaborations arrive in your Instagram DMs. Never miss an opportunity.',
      features: [
        'Identify brand collaboration messages',
        'Get instant alerts',
        'View message preview',
        'Keep track of important DMs',
      ],
      icon: BellIcon,
      theme: 'amber',
      preview: DmAlertsPreview,
      component: DmAlerts,
    },
    {
      id: 'posting-kit',
      name: 'Posting Kit Generator',
      description:
        'Generate Reel cover images, captions and hashtags for your post. All in one place.',
      features: [
        'Generate custom Reel covers using reference images',
        'Get engaging captions in your style',
        'Add relevant hashtags for better reach',
        'Copy everything, ready to post',
      ],
      icon: LayersIcon,
      theme: 'fuchsia',
      preview: InstagramPostingKitPreview,
      component: PostingKitGenerator,
      props: { platform: 'instagram' },
    },
  ],
  youtube: [
    {
      id: 'visual-assets',
      name: 'Visual Asset Generator',
      description:
        'Turn your YouTube script into complete visual assets for editing. Get scene-by-scene prompts and AI-generated images ready to use.',
      features: [
        'Paste your script',
        'AI analyses and creates visual flow',
        'Generate images for each scene',
        'Download and use in editing',
      ],
      icon: ImageIcon,
      theme: 'violet',
      preview: YouTubeVisualAssetPreview,
      component: VisualAssetGenerator,
      props: { platform: 'youtube', defaultAspectRatio: '16:9' },
    },
    {
      id: 'posting-kit',
      name: 'Posting Kit Generator',
      description:
        'Generate YouTube thumbnails, titles, descriptions, hashtags and tags for your video. All in one place.',
      features: [
        'Generate custom thumbnails using reference images',
        'Get engaging YouTube titles',
        'Create detailed video description with hashtags',
        'Generate relevant tags for better reach',
      ],
      icon: LayersIcon,
      theme: 'rose',
      preview: PostingKitPreview,
      component: PostingKitGenerator,
      props: { platform: 'youtube' },
    },
  ],
}

export function getTools(platformId) {
  return TOOLS_BY_PLATFORM[platformId] ?? []
}
