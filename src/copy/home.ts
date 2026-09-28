/** Home page copy. Edit sentences here, never in a component. */
export const home = {
  name: 'Ren Hwa (Zack) Low',
  role: 'Software engineer (AI)',

  /**
   * The opening. Two paragraphs. `em` sets a phrase in the ink colour and
   * `hi` sets it in the accent, so the emphasis lives with the sentence rather
   * than in a component.
   * No tagline above it: the positioning is woven into the prose instead.
   */
  lede: [
    [
      { text: 'I love building ' },
      { text: 'full-stack software', em: true },
      { text: ': real applications that people actually use. I specialise in ' },
      { text: 'AI', em: true },
      { text: ', and my work has taken me through many different domains, such as data systems, computer vision, motion and speech.' },
    ],
    [
      { text: 'I try to ' },
      { text: 'work from first principles', hi: true },
      { text: ': understand what is actually wrong, decide what matters, then own the solution end to end.' },
    ],
  ],

  sections: {
    projects: {
      index: '01',
      title: 'Projects',
      sub: 'Things I build when I should probably be sleeping.',
    },
    work: {
      index: '02',
      title: 'Work',
      sub: "Where I've worked, and what I learned there.",
    },
    skills: { index: '03', title: 'Skills' },
    /** The subtitle carries an inline <code>, so it is passed as a slot. */
    hobbies: { index: '04' },
  },

  /** Title and body come from `pages.contact`: one message, in one place. */
  cta: { action: 'Contact' },
} as const;
