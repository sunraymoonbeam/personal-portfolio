/** Home page copy. Edit sentences here, never in a component. */
export const home = {
  name: 'Ren Hwa (Zack) Low',
  role: 'Software engineer, specialising in data',

  /* The positioning line: what he is, not what he does. */
  tagline: 'I solve problems. The code is just how I do it.',

  lede:
    'I build full-stack software end to end, and I specialise in AI — with real ' +
    'breadth across computer vision, audio and speech, and large language models. ' +
    'Most of my useful work happens before any code is written: working out what ' +
    'is actually broken, and for whom.',

  sections: {
    projects: {
      title: 'Projects',
      sub: 'The things I build on my own time, usually instead of sleeping.',
    },
    work: {
      title: 'Work',
      sub: 'Five roles across AI, research and data. Each one has the long version.',
    },
    stack: {
      title: 'Tools I reach for',
      sub: 'Everything here shows up in something above.',
    },
    hobbies: {
      title: 'Hobbies',
      sub: 'The things I do when nobody is paying me.',
    },
  },

  cta: {
    title: 'Have something worth building?',
    sub: 'Open to roles where I can own a problem end to end. Or just say hello.',
    action: 'Get in touch',
  },
} as const;
