import { defineCollection, reference, type SchemaContext } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Three collections, three strict schemas, one small shared base.
 *
 * Every object is `.strict()` — INCLUDING nested ones. An outer `.strict()`
 * does not propagate: a typo inside a nested `metrics` entry is silently
 * stripped otherwise. See tests/content-policy.test.ts.
 */

/** `YYYY-MM`. Never parsed into a Date — that invents a day and shifts zones. */
const month = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected a YYYY-MM month, e.g. "2025-07"');

/** Visibility is three independent fields; one flag cannot express all cases. */
const visibility = {
  /** Hidden from every surface, and no route is generated. */
  draft: z.boolean().default(false),
  /** Does a full article route exist for this entry? */
  writeup: z.boolean().default(true),
  /**
   * Position in its home section. Unique among published entries in that
   * section; selectors take the first N. Absent = not featured.
   */
  featuredOrder: z.number().int().positive().optional(),
};

type ImageFn = SchemaContext['image'];

const common = (image: ImageFn) => ({
  title: z.string().min(1),
  /** Card label, only when `title` is too long for a card. */
  shortTitle: z.string().min(1).optional(),
  summary: z.string().min(1).max(280),
  cover: image().optional(),
  coverAlt: z.string().min(1).optional(),
  /** Bright UI screenshots want dimming in dark mode; photos do not. */
  coverDim: z.boolean().default(false),
  ...visibility,
});

/** Max 3, short. Longer than this is a paragraph and belongs in the body. */
const cardHighlights = z.array(z.string().min(1).max(80)).max(3).optional();

/** A number without a baseline or period is decoration — hence `context`. */
const metric = z
  .object({
    value: z.string().min(1),
    label: z.string().min(1),
    context: z.string().min(1).optional(),
  })
  .strict();

const links = z
  .object({
    live: z.string().url().optional(),
    repo: z.string().url().optional(),
    docs: z.string().url().optional(),
  })
  .strict();

const work = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './src/content/work' }),
  schema: ({ image }) =>
    z
      .object({
        ...common(image),
        /** Tenure, not employer: `carro-2025` and `carro-2029` are separate. */
        employer: reference('employers'),
        role: z.string().min(1),
        kind: z.enum(['Full-time', 'Part-time', 'Internship', 'Apprenticeship', 'Contract']),
        location: z.string().min(1),
        start: month,
        /** Absent = present. */
        end: month.optional(),
        /** Does it appear in work surfaces at all? A published article may be unlisted. */
        showInWork: z.boolean().default(true),
        stack: z.array(z.string().min(1)).default([]),
        /**
         * Verbatim from the résumé, in résumé order. Kept verbatim on purpose:
         * the site and the PDF must never disagree about what I did. `**…**`
         * marks where the emphasis falls; it adds no words. See lib/text.ts.
         */
        bullets: z.array(z.string().min(1).max(280)).max(6).optional(),
        metrics: z.array(metric).max(4).optional(),
      })
      .strict()
      .refine((d) => !d.end || d.end >= d.start, {
        message: 'end must not be before start',
        path: ['end'],
      }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        ...common(image),
        /** One-line claim shown on the row, under the name. */
        claim: z.string().min(1).max(120),
        /** Overrides the 280-char base: a project row carries a full paragraph. */
        summary: z.string().min(1).max(640),
        published: month,
        status: z.enum(['Shipped', 'Ongoing', 'Archived']).default('Shipped'),
        tags: z.array(z.string().min(1)).min(1),
        stack: z.array(z.string().min(1)).default([]),
        links: links.optional(),
        cardHighlights,
        metrics: z.array(metric).max(4).optional(),
        /** Cross-list under /play without duplicating the entry or its URL. */
        showInPlay: z.boolean().default(false),
      })
      .strict(),
});

const play = defineCollection({
  loader: glob({ pattern: '*/index.mdx', base: './src/content/play' }),
  schema: ({ image }) =>
    z
      .object({
        ...common(image),
        published: month,
        caption: z.string().min(1).max(160),
      })
      .strict(),
});

/** Shared employer identity, so two tenures can point at one company. */
const employers = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/employers' }),
  schema: ({ image }) =>
    z.object({ name: z.string().min(1), url: z.string().url().optional(), logo: image() }).strict(),
});

export const collections = { work, projects, play, employers };
