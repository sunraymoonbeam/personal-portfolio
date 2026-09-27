import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Content collections = your editable data. Add/edit a .md file, git push, done.
// The zod schema below is TypeScript-checked at build time: if a file is missing
// a field or has the wrong type, the build fails with a clear error.

const experience = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    start: z.string(),
    end: z.string(), // e.g. "Present"
    order: z.number(), // lower = shown first (most recent)
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    stack: z.array(z.string()),
    link: z.string().url().optional(),
    order: z.number(),
  }),
});

export const collections = { experience, projects };
