import fs from 'node:fs';
import { load } from 'js-yaml';
import { z } from 'astro/zod';

const SectionId = z.enum(['hero', 'projects', 'about', 'contact', 'custom']);

const schema = z.object({
  name: z.string(),
  name_latin: z.string(),
  job_title: z.string(),
  city: z.string(),
  tagline: z.string(),               // hero intro paragraph
  hero_meta: z.string().default(''), // small hero side text
  chips: z.array(z.string()).default([]),
  contacts: z.object({
    email: z.string(),
    phone: z.string(),
    telegram: z.string().url(),
  }),
  resume_pdf: z.string().default(''),      // '' -> button hidden (D15)
  seo: z.object({
    title: z.string(),
    description: z.string(),
  }),
  metrika_id: z.string().default(''),          // '' -> no counter (D16)
  yandex_verification: z.string().default(''),
  google_verification: z.string().default(''),
  sections: z.array(z.object({
    id: SectionId,
    enabled: z.boolean().default(true),
    // for id: custom — universal «heading + text + gallery» section (D12)
    heading: z.string().optional(),
    text: z.string().optional(),
    images: z.array(z.string()).default([]),
  })),
});

export type SiteConfig = z.infer<typeof schema>;

let cached: SiteConfig | undefined;
export function getSite(): SiteConfig {
  if (!cached) {
    cached = schema.parse(load(fs.readFileSync('content/site.yaml', 'utf8')));
  }
  return cached;
}
