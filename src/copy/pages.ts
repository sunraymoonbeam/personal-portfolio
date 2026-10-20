/** Copy for the index pages. Edit sentences here, never in a component. */
export const pages = {
  projects: {
    title: 'Projects',
    lede:
      "Things I've built when I should probably be sleeping. My interests " +
      'usually lean towards automations and computer vision, especially ' +
      'segmentation and object detection.',
  },
  work: {
    title: 'Work experience',
    /** The first paragraph doubles as the meta description. */
    body: [
      'The work I enjoy most starts before any code. I like talking to people ' +
        "as much as I like writing code: working out what's really slowing " +
        'them down, and translating their pain points into a set of requirements.',
      'I like building full-stack systems that are carefully designed, with AI ' +
        'as one part of them. The model is usually a small piece. Most of the ' +
        'work is the design around it: the data, the interfaces, and what ' +
        'happens when the model gets it wrong.',
    ],
  },
  skills: {
    title: 'Skills',
    /** Meta description only; the page has no lede. */
    description: 'Languages, frameworks and tools, and where on this site I used each one.',
  },
  hobbies: {
    /** The h1 is the crayon wordmark and the subtitle crayons "Play", so both
        are markup in the page. This is the plain meta description. */
    description: 'Because play is just as important as work. Climbing, cooking, coffee and guitar.',
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
    description: "Ren Hwa (Zack) Low's one-page résumé, as a PDF.",
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
