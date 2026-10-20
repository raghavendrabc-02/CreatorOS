// DM statuses and the tabs built from them. Archiving is tracked separately so a DM
// keeps its reply status when it is unarchived.

export const STATUS_LABELS = {
  new: 'New',
  awaiting: 'Awaiting reply',
  replied: 'Replied',
  archived: 'Archived',
}

export const TABS = [
  { id: 'all', label: 'All', matches: () => true },
  { id: 'unread', label: 'Unread', matches: (status, isArchived) => status === 'new' && !isArchived },
  { id: 'replied', label: 'Replied', matches: (status, isArchived) => status === 'replied' && !isArchived },
  { id: 'archived', label: 'Archived', matches: (status, isArchived) => isArchived },
]
