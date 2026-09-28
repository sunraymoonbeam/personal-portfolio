/** Copy for the index pages. Edit sentences here, never in a component. */
export const pages = {
  projects: {
    eyebrow: 'Projects',
    title: "Things I've built, end to end.",
    lede: 'Open any project for the full story.',
  },
  work: {
    eyebrow: 'Work',
    title: "Where I've worked, and what I did there.",
    /** The first paragraph doubles as the meta description. */
    body: [
      "I've gone from flipping patties behind a burger counter to working on " +
        'databases, AI systems and production infrastructure.',
      'I learn best by doing the work. Moving between different roles taught ' +
        'me to pick up unfamiliar things quickly, and to look at the same ' +
        'problem from different perspectives.',
      'The job I enjoy most is the one where I get to touch both the code and ' +
        'the people.',
    ],
  },
  skills: {
    eyebrow: 'Skills',
    title: 'Things I know how to do.',
    lede: 'Learned some in theory. Learned most the hard way.',
  },
  hobbies: {
    eyebrow: 'Hobbies',
    title: 'Life away from the terminal.',
    lede:
      'Four things I do when nobody is paying me. They mostly involve making ' +
      'something, learning something, or obsessing over an improvement nobody ' +
      'else would notice.',
  },
  about: {
    eyebrow: 'About',
    title: "Hi, I'm Zack.",
    /** One line under the name. The long version is the quote below it. */
    summary:
      "I'm a software engineer who likes understanding a problem properly, " +
      'then owning the solution to the end.',
    lede:
      'Ren Hwa Low on paper, Zack to most people. A software engineer ' +
      'specialising in AI, currently at Carro in Singapore.',
    /** The card beside the portrait. Every line is on the CV. */
    facts: [
      { k: 'Based in', v: 'Singapore' },
      { k: 'Currently', v: 'AI Engineer at Carro' },
      { k: 'Studied', v: 'B.E. Computer Science, NTU' },
      { k: 'Focus', v: 'Full-stack, AI, data infrastructure' },
    ],
    /** Label above the quote. */
    quoteLabel: 'In my own words',
  },
  cv: {
    eyebrow: 'CV',
    title: 'One page.',
    lede: 'Read it here, or take a copy.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Got a problem worth solving?',
    /** One string per line, set as a quote. */
    lede: [
      "That's kind of my thing. I like messy problems and ambiguous ideas, " +
        'especially when I can turn them into something useful.',
      "I'm interested in roles where I can own a problem end to end and build " +
        'something people actually find useful.',
      'Or just ask me out for coffee.',
    ],
  },
} as const;
