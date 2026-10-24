/** Identity, routing and switches. Page copy lives in src/copy/. */
export const site = {
  name: 'Zack Low',
  fullName: 'Ren Hwa (Zack) Low',
  role: 'Software engineer (AI)',
  location: 'Singapore',
  wordmark: 'Zack Low',
  tagline: 'Software engineer in Singapore, specialising in AI.',
  /** The home page's meta description: what a search result shows under the name. */
  description:
    'Ren Hwa (Zack) Low, a software engineer in Singapore specialising in AI: ticketing agents at Carro, text-to-motion models at AI Singapore, and speech processing at NIE.',
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
    { href: '/projects/', label: 'Projects' },
    { href: '/work/', label: 'Work experience' },
    { href: '/skills/', label: 'Skills' },
    { href: '/hobbies/', label: 'Hobbies' },
    { href: '/about/', label: 'About' },
  ],
} as const;
