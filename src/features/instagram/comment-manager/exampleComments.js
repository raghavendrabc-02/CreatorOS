// EXAMPLE DATA ONLY. Made-up comments that preview the layout until Instagram is connected
// through the backend. Usernames are fictional. The UI labels all of this as example data.

const REELS = {
  zomato: { title: 'The real story of Zomato', theme: 'dark' },
  psychology: { title: 'Mind tricks in marketing', theme: 'blue' },
  starlink: { title: 'India vs Starlink', theme: 'amber' },
  apple: { title: 'Why Apple wins', theme: 'slate' },
}

export const EXAMPLE_COMMENTS = [
  {
    id: 'c1',
    username: 'example_viewer_1',
    minutesAgo: 2,
    text: 'Super story bro! Zomato story next level 🔥',
    likes: 24,
    type: 'positive',
    reel: REELS.zomato,
    analysis: {
      intent: 'Showing support and genuine appreciation.',
      keyPoints: [
        'Likes the Zomato story',
        'Uses strong positive language',
        'Engaged with the content',
        'Potentially a loyal follower',
      ],
    },
    suggestions: [
      'Thank you so much! 🙌 Glad you liked the Zomato story. More interesting business stories coming soon. Stay tuned! 🚀',
      'Thanks a lot! Zomato has such a crazy journey, right? More stories like this coming soon. Keep watching! 😊',
      "Appreciate the support! 🙏 Zomato's journey is really special. Let me know which brand you want to see next.",
    ],
  },
  {
    id: 'c2',
    username: 'example_viewer_2',
    minutesAgo: 5,
    text: 'Which book do you recommend to learn marketing psychology?',
    likes: 12,
    type: 'question',
    reel: REELS.psychology,
    analysis: {
      intent: 'Wants a learning resource recommendation.',
      keyPoints: [
        'Interested in marketing psychology',
        'Looking for a book suggestion',
        'Good chance to share value',
      ],
    },
    suggestions: [
      'Great question! Start with "Influence" by Robert Cialdini. It explains the core principles really well 📚',
      '"Influence" by Robert Cialdini is the best place to start. I might do a full reel on my top books soon!',
      'Try "Influence" by Cialdini first. Tell me if you want a reel on the books that shaped my content 🙌',
    ],
  },
  {
    id: 'c3',
    username: 'example_viewer_3',
    minutesAgo: 12,
    text: 'Bhai, can you make a video on Starlink in India?',
    likes: 18,
    type: 'request',
    reel: REELS.starlink,
    analysis: {
      intent: 'Requesting a specific new topic.',
      keyPoints: [
        'Interested in Starlink and India',
        'Wants a dedicated video',
        'Possible topic for your content plan',
      ],
    },
    suggestions: [
      'Great idea bro! Starlink in India is a big story. Adding it to my list 🚀',
      'Noted! A Starlink India breakdown is coming. Stay tuned 🙌',
      "Love this suggestion! There's a lot to unpack with Starlink in India. Working on it.",
    ],
  },
  {
    id: 'c4',
    username: 'example_viewer_4',
    minutesAgo: 18,
    text: 'This brand is totally overrated in my opinion.',
    likes: 6,
    type: 'criticism',
    reel: REELS.apple,
    analysis: {
      intent: 'Disagrees with the view presented.',
      keyPoints: [
        'Critical of the brand, not of you',
        'Short opinion without reasons',
        'A calm reply can start a good discussion',
      ],
    },
    suggestions: [
      'Fair point, many people feel that way! What do you think they get wrong? Curious to hear your view.',
      'Totally respect that opinion. The reel was about why their strategy works, not whether everyone should love them 🙂',
      'Interesting take! Which brand do you think does it better? Could be a great comparison reel.',
    ],
  },
  {
    id: 'c5',
    username: 'example_viewer_5',
    minutesAgo: 25,
    text: 'Always love your content ❤️ Keep going!',
    likes: 31,
    type: 'positive',
    reel: REELS.zomato,
    analysis: {
      intent: 'Encouraging you to keep creating.',
      keyPoints: ['Regular viewer', 'Strong emotional support', 'Good relationship to nurture'],
    },
    suggestions: [
      'Thank you so much! ❤️ Means a lot. Lots more coming!',
      'This keeps me going! 🙏 Thanks for always supporting.',
      'Thank you! Comments like this make my day 😊',
    ],
  },
  {
    id: 'c6',
    username: 'example_viewer_6',
    minutesAgo: 32,
    text: 'How do you research all this? Any tips?',
    likes: 14,
    type: 'question',
    reel: REELS.psychology,
    analysis: {
      intent: 'Curious about your research process.',
      keyPoints: [
        'Interested in how you work',
        'Possible behind-the-scenes content idea',
        'Wants practical tips',
      ],
    },
    suggestions: [
      'Mostly annual reports, founder interviews and news archives! Might share my full process in a reel 🙌',
      'Great question! I start with primary sources like interviews and company reports, then cross-check everything.',
      'A lot of reading 😄 Interviews, reports and books. Want a behind-the-scenes reel on it?',
    ],
  },
  {
    id: 'c7',
    username: 'example_viewer_7',
    minutesAgo: 45,
    text: 'Can you share this in Kannada too? 😊',
    likes: 9,
    type: 'request',
    reel: REELS.zomato,
    analysis: {
      intent: 'Wants the content in Kannada.',
      keyPoints: [
        'Prefers Kannada content',
        'Shows demand for a Kannada version',
        'Good signal for your audience mix',
      ],
    },
    suggestions: [
      'Kannada version coming soon! 🙌 Thanks for asking.',
      'Definitely! Kannada nalli kooda maadtini, stay tuned 😊',
      'Great idea! Planning more Kannada content. Thanks for the push 🙏',
    ],
  },
]
