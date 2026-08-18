// Shared alt/caption text for gallery images: keeps ProjectCard and the
// case pages byte-identical and numbers renders/drawings independently.
type AltKind = 'render' | 'drawing';

const KIND_LABEL: Record<AltKind, string> = {
  render: 'визуализация',
  drawing: 'чертёж',
};

export function imageAlt(
  img: { caption?: string },
  index: number,
  kind: AltKind,
  project: { title: string; type: string; location?: string },
): string {
  const place = project.location ? `, ${project.location}` : '';
  return img.caption
    ? `${project.title}${place} — ${img.caption}`
    : `${project.title}${place} — ${project.type.toLowerCase()}, ${KIND_LABEL[kind]} ${index + 1}`;
}
