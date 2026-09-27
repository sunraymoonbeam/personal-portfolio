/** Copy for the index pages. Edit sentences here, never in a component. */
export const pages = {
  projects: {
    eyebrow: 'Projects',
    title: "Things I've built, end to end.",
    lede: 'Open any project for the full story.',
  },
  work: {
    eyebrow: 'Work',
    title: 'A look at my professional journey so far.',
    /** The first paragraph doubles as the meta description. */
    body: [
      'I have done all sorts of work, from flipping patties behind a burger ' +
        'counter to data analytics, stakeholder management, infrastructure ' +
        'and discovery.',
      'I am a strong believer in learning how to do something by doing it. In ' +
        'that kind of environment you learn to wear several hats quickly, and ' +
        'to look at the same problem from more than one side.',
      'The job I enjoy most is the one where I get to touch both the code and ' +
        'the people.',
    ],
  },
  skills: {
    eyebrow: 'Skills',
    title: 'What I bring, technical and otherwise.',
    lede: 'Learned some in theory. Learned most the hard way.',
  },
  hobbies: {
    eyebrow: 'Hobbies',
    /** "play" is set in the crayon face, so the title is assembled in the page. */
    titleBefore: 'Work hard, ',
    titleWord: 'play',
    titleAfter: ' hard.',
    lede:
      'Outside of work I tend to rotate between hobbies that involve making, ' +
      'learning, or obsessing over tiny improvements no one else would ' +
      'notice. They are mostly just for fun, but they have taught me a ' +
      'surprising amount about patience, experimentation, and sticking with ' +
      'things longer than I probably should.',
  },
  about: {
    eyebrow: 'About',
    title: "Hi, I'm Zack.",
    /** One line under the name. The long version is the quote below it. */
    summary:
      'A curious software engineer who would rather understand a problem ' +
      'properly than guess at it, and who likes owning it to the end.',
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
    lede: 'Read it below, or take the file.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Got a problem to be solved?',
    /** One string per line, set as a quote. */
    lede: [
      'That is kind of my thing. I like messy problems, ambiguous ideas, and ' +
        'figuring out how to turn them into something useful.',
      'I am open to roles where I can own problems end to end, build things ' +
        'that matter, and make life a little easier for the people around me.',
      'Or just ask me out for coffee.',
    ],
  },
} as const;
