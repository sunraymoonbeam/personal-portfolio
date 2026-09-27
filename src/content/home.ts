/** Home page copy. Edit sentences here, never in a component. */
export const home = {
  eyebrow: 'Software engineer, AI · Singapore',
  headline: "I find out what's actually broken, then build the thing that fixes it.",
  lede:
    'I build full-stack systems that people actually use, and I put AI in them only where it ' +
    'earns its place. Right now that means twelve agents handling sixty thousand support ' +
    'tickets a month at Carro, on infrastructure I designed and pay close attention to.',
  sections: {
    projects: {
      title: 'Projects',
      sub: 'Side projects I shipped end to end — the design, the backend, the deploy, and the bill.',
    },
    work: {
      title: 'Work experience',
      sub: 'Five roles across production AI, research and data. Each one has the long version.',
    },
    play: {
      title: 'Play',
      sub: 'What I do when nobody is paying me. Usually it teaches me something anyway.',
    },
  },
  cta: {
    title: 'Have something worth building?',
    sub: 'Open to roles where I can own a problem end to end. Or just say hello.',
    action: 'Get in touch',
  },
} as const;
