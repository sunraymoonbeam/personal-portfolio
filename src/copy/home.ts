/** Home page copy. Edit sentences here, never in a component. */
export const home = {
  name: 'Ren Hwa (Zack) Low',

  /**
   * The opening. Two paragraphs, mirroring the résumé summary. `em` sets a
   * phrase in the ink colour and `hi` sets it in the accent, so the emphasis
   * lives with the sentence rather than in a component.
   */
  lede: [
    [
      { text: 'Software engineer specialising in ' },
      { text: 'AI', em: true },
      { text: ', with experience across multiple domains: agentic systems, computer vision, generative AI and speech processing. Strong programming fundamentals and full-stack experience.' },
    ],
    [
      { text: 'I ' },
      { text: 'work from first principles', em: true },
      { text: ": I take the time to understand the problem deeply and how the ideal solution might fit into the bigger picture. I'm comfortable owning ambiguous problems end to end, from discovery with stakeholders to evaluation and deployment. " },
      { text: 'Solving problems is what I do', hi: true },
      { text: '. Writing code is only one of the ways I do it.' },
    ],
  ],

  sections: {
    projects: { title: 'Projects' },
    work: { title: 'Work experience' },
    skills: { title: 'Skills' },
  },

  /** Title and body come from `pages.contact`: one message, in one place. */
  cta: { action: 'Contact' },
} as const;
