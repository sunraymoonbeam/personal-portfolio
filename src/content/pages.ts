/** Copy for the index pages. Edit sentences here, never in a component. */
export const pages = {
  projects: {
    eyebrow: 'Projects',
    title: 'Things I built end to end.',
    lede:
      'Newest first. Each one has a write-up covering what the problem was, what I ' +
      'decided, and what it actually cost.',
  },
  work: {
    eyebrow: 'Work experience',
    title: 'Where I have worked, and what I actually did there.',
    lede:
      'Five roles across production AI, research and data engineering. The résumé ' +
      'version is one page — these are the long versions, including the parts that ' +
      'went wrong.',
    ledger: {
      title: 'All roles',
      sub: 'Newest first, grouped by the year I started.',
    },
  },
  play: {
    eyebrow: 'Play',
    title: 'The things I do when nobody is paying me.',
    lede:
      'Cooking, climbing, guitar, film. None of it is work, and most of it has ' +
      'taught me something that turned out to be useful anyway.',
  },
  about: {
    eyebrow: 'About',
    title: "Hi, I'm Zack.",
    lede:
      'Renhwa Low on paper, Zack to everyone else. Software engineer in Singapore, ' +
      'currently at Carro, building AI systems that people rely on every day.',
  },
  resume: {
    eyebrow: 'Résumé',
    title: 'One page.',
    lede: 'One page, updated September 2026. Read it below, or take the file.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Say hi.',
    lede:
      'Have something worth building, or just want to talk shop? Email is fastest. ' +
      'I reply to everything that is not spam, usually the same day.',
  },
} as const;
