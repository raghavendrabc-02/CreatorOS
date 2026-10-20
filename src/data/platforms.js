import { InstagramIcon, PlayIcon, YouTubeIcon } from '../components/icons.jsx'

// Platforms shown on the homepage and in the sidebar. Each one gets its own page at /<id>.
// `icon` is the outline icon used in navigation; `tileIcon` sits on the coloured tile.
export const PLATFORMS = [
  {
    id: 'instagram',
    name: 'Instagram',
    description: [
      'Manage your Instagram workflow tools.',
      'Create, analyse, engage and automate.',
    ],
    workspaceDescription: 'Tools to create, manage and grow your Instagram content.',
    icon: InstagramIcon,
    tileIcon: InstagramIcon,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: [
      'Manage your YouTube workflow tools.',
      'Plan, create, optimise and grow.',
    ],
    workspaceDescription: 'Tools to create, plan and publish your YouTube content.',
    icon: YouTubeIcon,
    tileIcon: PlayIcon,
  },
]
