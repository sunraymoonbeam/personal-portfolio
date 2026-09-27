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
      { text: ', real working applications that people actually use. I also specialise in ' },
      { text: 'AI', em: true },
      { text: ', and I have worked across a large number of domains, including computer vision and audio / speech processing.' },
    ],
    [
      { text: 'I take pride in my programming fundamentals, and I try to ' },
      { text: 'work the problem from first principles', em: true },
      { text: ': understand the cause deeply, come up with the best solution, and then own it end to end. ' },
      { text: 'Problem solving is my forte', hi: true },
      { text: '. Writing code is only one of the ways I do it.' },
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
      sub: 'The roles, teams and experiences that shaped me.',
    },
    skills: { index: '03', title: 'Skills' },
    /** The subtitle carries an inline <code>, so it is passed as a slot. */
    hobbies: { index: '04' },
  },

  /** Title and body come from `pages.contact`: one message, in one place. */
  cta: { action: 'Contact' },
} as const;
