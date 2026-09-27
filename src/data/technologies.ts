/**
 * Stable IDs → label → optional simple-icons slug.
 *
 * The ID is the identity, NOT the icon slug: if simple-icons renames or drops
 * a glyph, content still renders a readable label.
 */
export type Tech = { id: string; label: string; icon?: string };

export const TECHNOLOGIES: Record<string, Tech> = {
  python:       { id: 'python',       label: 'Python',       icon: 'python' },
  typescript:   { id: 'typescript',   label: 'TypeScript',   icon: 'typescript' },
  javascript:   { id: 'javascript',   label: 'JavaScript',   icon: 'javascript' },
  postgresql:   { id: 'postgresql',   label: 'SQL',          icon: 'postgresql' },

  astro:        { id: 'astro',        label: 'Astro',        icon: 'astro' },
  fastapi:      { id: 'fastapi',      label: 'FastAPI',      icon: 'fastapi' },
  django:       { id: 'django',       label: 'Django',       icon: 'django' },
  threedotjs:   { id: 'threedotjs',   label: 'Three.js',     icon: 'threedotjs' },

  langchain:    { id: 'langchain',    label: 'LangChain',    icon: 'langchain' },
  langgraph:    { id: 'langgraph',    label: 'LangGraph',    icon: 'langgraph' },
  langfuse:     { id: 'langfuse',     label: 'Langfuse' },
  litellm:      { id: 'litellm',      label: 'LiteLLM' },
  pytorch:      { id: 'pytorch',      label: 'PyTorch',      icon: 'pytorch' },
  huggingface:  { id: 'huggingface',  label: 'Hugging Face', icon: 'huggingface' },
  nvidia:       { id: 'nvidia',       label: 'NVIDIA NeMo',  icon: 'nvidia' },

  docker:       { id: 'docker',       label: 'Docker',       icon: 'docker' },
  n8n:          { id: 'n8n',          label: 'n8n',          icon: 'n8n' },
  gnubash:      { id: 'gnubash',      label: 'Bash',         icon: 'gnubash' },
  git:          { id: 'git',          label: 'Git',          icon: 'git' },
  linux:        { id: 'linux',        label: 'Linux',        icon: 'linux' },
  traefikproxy: { id: 'traefikproxy', label: 'Traefik',      icon: 'traefikproxy' },
  terraform:    { id: 'terraform',    label: 'Terraform',    icon: 'terraform' },
  googlecloud:  { id: 'googlecloud',  label: 'GCP',          icon: 'googlecloud' },
  hetzner:      { id: 'hetzner',      label: 'Hetzner',      icon: 'hetzner' },
  telegram:     { id: 'telegram',     label: 'Telegram',     icon: 'telegram' },
  azure:        { id: 'azure',        label: 'Azure' },
  aws:          { id: 'aws',          label: 'AWS' },
};

/** The About page's grouped view. */
export const STACK_GROUPS: Array<{ title: string; items: string[] }> = [
  { title: 'Languages',       items: ['python', 'typescript', 'javascript', 'postgresql'] },
  { title: 'Web & product',   items: ['astro', 'fastapi', 'django', 'threedotjs'] },
  { title: 'AI & agents',     items: ['langgraph', 'langchain', 'langfuse', 'litellm', 'pytorch', 'huggingface', 'nvidia'] },
  { title: 'Cloud & systems', items: ['docker', 'n8n', 'traefikproxy', 'terraform', 'googlecloud', 'hetzner', 'linux', 'gnubash', 'azure', 'aws'] },
];
