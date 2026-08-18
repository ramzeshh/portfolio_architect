import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const imageRef = (image: any) =>
  z.object({ file: image(), caption: z.string().optional() });

const projects = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      type: z.string(),                 // «Жилая застройка» …
      location: z.string().optional(),  // «Пермь», «Екатеринбург, оз. Шарташ»
      developer: z.string().optional(), // «Самолет», «Талан»
      stage: z.string().optional(),
      year: z.number().optional(),
      order: z.number(),
      draft: z.boolean().default(false),
      cover: image(),
      renders: z.array(imageRef(image)).default([]),
      drawings: z.array(imageRef(image)).default([]),
    }),
});

const detailRow = z.object({ label: z.string(), value: z.string() });

const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './content' }),
  schema: z.object({
    title: z.string().default('Обо мне'),
    experience: z.array(detailRow).default([]),
    education: z.array(detailRow).default([]),
    tools: z.array(z.string()).default([]),
    skills: z.array(detailRow).default([]),
  }),
});

export const collections = { projects, about };
