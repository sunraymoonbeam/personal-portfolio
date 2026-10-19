/** Copy for the index pages. Edit sentences here, never in a component. */
export const pages = {
  projects: {
    title: 'Projects',
    lede: "Things I've built outside work, with the code on GitHub.",
  },
  work: {
    title: 'Work experience',
    /** Doubles as the meta description. */
    lede:
      "I started out flipping patties at Shake Shack. Since then I've migrated " +
      'law firm databases, prototyped LLM tools for the government in the ' +
      "GPT-3.5 days, worked out who's speaking in classroom recordings and " +
      'generated 3D animation from text. Now I build the AI agents that handle ' +
      "Carro's customer tickets.",
  },
  skills: {
    title: 'Skills',
    lede: 'Tap a skill with a number to see where I used it.',
  },
  hobbies: {
    title: 'Hobbies',
    lede: 'Climbing, cooking for my family, coffee and some guitar.',
  },
  about: {
    eyebrow: 'About',
    title: "Hi, I'm Zack.",
    /** The meta description. */
    lede:
      'Ren Hwa Low on paper, Zack to most people. A software engineer ' +
      'specialising in AI, currently at Carro in Singapore.',
    /** The card beside the portrait. Every line is on the CV. */
    facts: [
      { k: 'Based in', v: 'Singapore' },
      { k: 'Currently', v: 'AI Engineer at Carro' },
      { k: 'Studied', v: 'B.E. Computer Science, NTU' },
      { k: 'Focus', v: 'AI, agents, full-stack' },
    ],
  },
  cv: {
    title: 'CV',
    lede: 'One page, updated October 2026.',
  },
  contact: {
    title: 'Get in touch',
    /** One string per line, set as a quote. */
    lede: [
      "I'm open to roles where I can own a problem from the first conversation " +
        'with users through to production. If that sounds like your team, send ' +
        'me an email.',
      "Or ask me out for coffee. I'll probably end up talking about grind size.",
    ],
  },
} as const;
