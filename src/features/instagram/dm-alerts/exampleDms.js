// EXAMPLE DATA ONLY. Fictional brands and messages that preview the layout until Instagram
// DMs are connected through the backend. Websites use the reserved .example domain.
// The UI labels all of this as example data.

export const EXAMPLE_DMS = [
  {
    id: 'dm1',
    brand: {
      name: 'Nimbus Living',
      initials: 'NL',
      colour: '#334155',
      category: 'Home & Furniture',
      followers: '120K',
      website: 'https://nimbusliving.example',
      pastCollaborations: 'Yes',
    },
    minutesAgo: 2,
    sentAt: 'Today, 12:18 PM',
    status: 'new',
    message: `Hi {name},

We are planning a new campaign for Nimbus Living and we really like your content. We would love to collaborate with you on an Instagram Reel.

Can you please share your media kit and let us know your availability?

Regards,
Team Nimbus Living`,
    analysis: [
      'This looks like a genuine brand collaboration enquiry.',
      'Brand: Nimbus Living (Home & Furniture)',
      'Intent: Instagram Reel collaboration',
      'Action required: Share media kit and availability',
    ],
    intent: {
      label: 'Brand collaboration',
      confidence: 92,
      summary: 'This message is likely a brand collaboration enquiry based on the content and intent.',
      tags: ['Collaboration', 'Campaign', 'Instagram Reel', 'Media kit', 'Availability'],
    },
    suggestions: [
      "Thank you for reaching out! 🙏 I'd love to know more about the campaign. Please share the brief and details.",
      'Hi! This sounds interesting. Please share the campaign details, deliverables and timeline.',
      'Thanks for considering me! Please find my media kit attached. Let me know the next steps.',
    ],
  },
  {
    id: 'dm2',
    brand: {
      name: 'Coinjar Savings',
      initials: 'CJ',
      colour: '#4338ca',
      category: 'Fintech',
      followers: '340K',
      website: 'https://coinjar-savings.example',
      pastCollaborations: 'Yes',
    },
    minutesAgo: 60,
    sentAt: 'Today, 11:20 AM',
    status: 'new',
    message: `Hi {name},

We really like your content and want to discuss a collaboration around smart saving habits for young Indians.

Would you be open to a short call this week?

Thanks,
Coinjar Savings Marketing`,
    analysis: [
      'Genuine collaboration enquiry from a fintech brand.',
      'Topic fits your business and finance content.',
      'Action required: Confirm interest and suggest a call time',
    ],
    intent: {
      label: 'Brand collaboration',
      confidence: 89,
      summary: 'Clear request to discuss a paid collaboration.',
      tags: ['Collaboration', 'Fintech', 'Call request'],
    },
    suggestions: [
      'Hi! Thanks for reaching out. Happy to discuss. Could you share a brief before the call?',
      'Sounds great! I am free later this week. Please share a few time slots.',
      'Thank you! Please email the campaign details and we can set up a call.',
    ],
  },
  {
    id: 'dm3',
    brand: {
      name: 'Banyan Projects',
      initials: 'BP',
      colour: '#0f172a',
      category: 'Real Estate',
      followers: '58K',
      website: 'https://banyanprojects.example',
      pastCollaborations: 'No',
    },
    minutesAgo: 180,
    sentAt: 'Today, 9:15 AM',
    status: 'new',
    message: `Hi {name},

We have a project launch coming up in Bengaluru and would love to work with you on a story-led Reel about the founders.

Let us know if this interests you.

Best,
Banyan Projects`,
    analysis: [
      'Brand collaboration enquiry for a launch campaign.',
      'Story-led format matches your style.',
      'Action required: Ask for budget and deliverables',
    ],
    intent: {
      label: 'Brand collaboration',
      confidence: 86,
      summary: 'Launch campaign enquiry with a clear content format.',
      tags: ['Collaboration', 'Launch', 'Instagram Reel'],
    },
    suggestions: [
      'Hi! Thanks for thinking of me. Could you share the budget, deliverables and launch date?',
      'This sounds interesting! Please share more about the project and timeline.',
      'Thank you! I would love to hear more. Please send the brief.',
    ],
  },
  {
    id: 'dm4',
    brand: {
      name: 'Lotus Health',
      initials: 'LH',
      colour: '#0e7490',
      category: 'Health Insurance',
      followers: '210K',
      website: 'https://lotushealth.example',
      pastCollaborations: 'Yes',
    },
    minutesAgo: 1440,
    sentAt: 'Yesterday, 4:40 PM',
    status: 'replied',
    message: `Hi {name},

We're running a campaign on health awareness and would love to collaborate with creators who explain things clearly.

Please let us know your rates.

Regards,
Lotus Health`,
    analysis: [
      'Brand collaboration enquiry for an awareness campaign.',
      'Asks for your rates directly.',
      'Action required: Share rate card',
    ],
    intent: {
      label: 'Brand collaboration',
      confidence: 90,
      summary: 'Direct request for rates for a campaign.',
      tags: ['Collaboration', 'Campaign', 'Rates'],
    },
    suggestions: [
      'Hi! Thanks for reaching out. Sharing my rate card shortly.',
      'Thank you! Could you share the deliverables so I can quote accurately?',
      'Happy to help with this campaign. Please share the brief and timeline.',
    ],
  },
  {
    id: 'dm5',
    brand: {
      name: 'Saffron Home Care',
      initials: 'SH',
      colour: '#b45309',
      category: 'Consumer Goods',
      followers: '95K',
      website: 'https://saffronhomecare.example',
      pastCollaborations: 'No',
    },
    minutesAgo: 2880,
    sentAt: '2 days ago',
    status: 'replied',
    message: `Hi {name},

We're impressed with your content. Can we discuss a campaign for our new product line?

Thanks,
Saffron Home Care`,
    analysis: ['Short collaboration enquiry.', 'Details missing.', 'Action required: Ask for the brief'],
    intent: {
      label: 'Brand collaboration',
      confidence: 81,
      summary: 'Likely a collaboration enquiry, but light on details.',
      tags: ['Collaboration', 'Product launch'],
    },
    suggestions: [
      'Hi! Thanks for reaching out. Could you share more about the product and campaign?',
      'Thank you! Please share the brief, deliverables and budget.',
      'Sounds interesting. What kind of content are you looking for?',
    ],
  },
  {
    id: 'dm6',
    brand: {
      name: 'Orbit AI',
      initials: 'OA',
      colour: '#111827',
      category: 'Technology',
      followers: '42K',
      website: 'https://orbit-ai.example',
      pastCollaborations: 'No',
    },
    minutesAgo: 4320,
    sentAt: '3 days ago',
    status: 'awaiting',
    message: `Hi {name},

We'd like to explore a collaboration opportunity around how AI is changing Indian startups.

Let us know a good time to talk.

Cheers,
Orbit AI`,
    analysis: [
      'Collaboration enquiry from a tech startup.',
      'Topic fits your startup content.',
      'Action required: Reply with availability',
    ],
    intent: {
      label: 'Brand collaboration',
      confidence: 84,
      summary: 'Collaboration enquiry asking for a call.',
      tags: ['Collaboration', 'Technology', 'Call request'],
    },
    suggestions: [
      'Hi! Thanks for reaching out. I am available later this week. What works for you?',
      'Sounds interesting! Could you share a short brief before we talk?',
      'Thank you! Please share the details and I will get back with a time.',
    ],
  },
  {
    id: 'dm7',
    brand: {
      name: 'Monsoon Motors',
      initials: 'MM',
      colour: '#1d4ed8',
      category: 'Automotive',
      followers: '510K',
      website: 'https://monsoonmotors.example',
      pastCollaborations: 'Yes',
    },
    minutesAgo: 7200,
    sentAt: '5 days ago',
    status: 'replied',
    message: `Hi {name},

We are working on an exciting campaign about the history of Indian car brands and think you'd be a great fit.

Looking forward to hearing from you.

Monsoon Motors`,
    analysis: [
      'Brand collaboration enquiry for a history-led campaign.',
      'Strong match with your storytelling style.',
      'Action required: Ask for the brief',
    ],
    intent: {
      label: 'Brand collaboration',
      confidence: 88,
      summary: 'Campaign enquiry that matches your niche.',
      tags: ['Collaboration', 'Campaign', 'Storytelling'],
    },
    suggestions: [
      'Hi! This sounds like a great fit. Please share the brief.',
      'Thank you! I would love to know more about the campaign scope.',
      'Thanks for reaching out! What deliverables do you have in mind?',
    ],
  },
  {
    id: 'dm8',
    brand: {
      name: 'Mango Social',
      initials: 'MS',
      colour: '#7c3aed',
      category: 'Social App',
      followers: '15K',
      website: 'https://mangosocial.example',
      pastCollaborations: 'No',
    },
    minutesAgo: 8640,
    sentAt: '6 days ago',
    status: 'replied',
    archived: true,
    message: `Hi {name},

Loved your content! Can we discuss a collaboration for our new product?

Mango Social`,
    analysis: ['Very short enquiry.', 'No campaign details.', 'Possibly low priority'],
    intent: {
      label: 'Brand collaboration',
      confidence: 68,
      summary: 'Possible collaboration enquiry, but vague.',
      tags: ['Collaboration'],
    },
    suggestions: [
      'Hi! Thanks for reaching out. Could you share more details about the product and campaign?',
      'Thank you! Please share a brief so I can see if it is a fit.',
      'Thanks! What kind of collaboration did you have in mind?',
    ],
  },
]
