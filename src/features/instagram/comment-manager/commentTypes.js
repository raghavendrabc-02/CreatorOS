// Comment categories and the filter tabs built from them.

export const COMMENT_TYPES = {
  positive: { label: 'Positive', description: 'The viewer appreciated your content.' },
  question: { label: 'Question', description: 'The viewer is asking you something.' },
  criticism: { label: 'Criticism', description: 'The viewer disagrees or is critical.' },
  request: { label: 'Content request', description: 'The viewer is asking for new content.' },
}

export const FILTERS = [
  { id: 'all', label: 'All comments', matches: () => true },
  { id: 'needs-reply', label: 'Needs reply', matches: (comment, replied) => !replied.has(comment.id) },
  { id: 'positive', label: 'Positive', matches: (comment) => comment.type === 'positive' },
  { id: 'question', label: 'Questions', matches: (comment) => comment.type === 'question' },
  { id: 'criticism', label: 'Criticism', matches: (comment) => comment.type === 'criticism' },
  { id: 'others', label: 'Others', matches: (comment) => comment.type === 'request' },
]

export const SORTS = [
  { value: 'latest', label: 'Latest first', compare: (a, b) => a.minutesAgo - b.minutesAgo },
  { value: 'likes', label: 'Most liked', compare: (a, b) => b.likes - a.likes },
]
