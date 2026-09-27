/** Identity, routing and switches. Page copy lives in src/copy/. */
export const site = {
  name: 'Zack Low',
  fullName: 'Renhwa (Zack) Low',
  role: 'Software engineer (AI)',
  location: 'Singapore',
  wordmark: 'Zack Low',
  tagline: 'Software engineer specialising in AI, in Singapore.',
  origin: 'https://renhwa.com',
  email: 'zack.low.dev@gmail.com',
  socials: {
    github: 'https://github.com/sunraymoonbeam',
    linkedin: 'https://www.linkedin.com/in/ren-hwa-low-855080224',
  },
  /**
   * The centre of the header. The CV link and the contact button live in the right-hand
   * cluster instead, so they are not in this list.
   */
  nav: [
    { href: '/projects', label: 'Projects' },
    { href: '/work', label: 'Work' },
    { href: '/skills', label: 'Skills' },
    { href: '/hobbies', label: 'Hobbies' },
    { href: '/about', label: 'About' },
  ],
  features: {
    hero3d: true,
    bulb: true,
    cursors: true,
    commandPalette: false, // deferred until there is enough to search
  },
} as const;
