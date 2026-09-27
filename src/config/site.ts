/** Identity, routing and switches. Page copy lives in src/content/home.ts. */
export const site = {
  name: 'Zack Low',
  fullName: 'Renhwa (Zack) Low',
  role: 'Software engineer specialising in data',
  location: 'Singapore',
  motto: 'I build useful systems around data.',
  origin: 'https://renhwa.com',
  email: 'zack.low.dev@gmail.com',
  socials: {
    github: 'https://github.com/sunraymoonbeam',
    linkedin: 'https://www.linkedin.com/in/ren-hwa-low-855080224',
  },
  nav: [
    { href: '/projects', label: 'Projects' },
    { href: '/work', label: 'Work experience' },
    { href: '/about', label: 'About' },
    { href: '/resume', label: 'Résumé' },
  ],
  features: {
    hero3d: true,
    bulb: true,
    cursors: true,
    commandPalette: false, // deferred until there is enough to search
  },
} as const;
