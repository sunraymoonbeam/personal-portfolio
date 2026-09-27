/** Home page copy. Edit sentences here, never in a component. */
export const home = {
  eyebrow: 'Software engineer, AI · Singapore',
  headline: "I find out what's actually broken, then build the thing that fixes it.",
  lede:
    'Full-stack apps that solve a real problem for a real person, with AI where it earns its place. ' +
    'I talk to whoever has the problem, understand it all the way down, and own it until it works.',
  sections: {
    projects: { title: 'Projects', sub: 'Things I built because I wanted them to exist.' },
    work: { title: 'Work experience', sub: 'Five roles, written like posts.' },
    play: { title: 'Play', sub: 'Cooking, climbing, and things I make when nobody is paying me.' },
  },
  cta: {
    title: 'Have something worth building?',
    sub: 'Open to new-grad roles and problems worth the effort.',
    action: 'Get in touch',
  },
} as const;
