// Single source of truth for the "about me" bits.
// Typed so your editor autocompletes and the build catches typos.

export interface TechGroup {
  label: string;
  items: string[];
}

export const site = {
  name: "Low Ren Hwa",
  handle: "Zack",
  role: "AI Engineer",
  tagline: "I build agentic AI systems and the infrastructure that runs them.",
  location: "Singapore",
  email: "zack.low.dev@gmail.com",
  socials: {
    github: "https://github.com/sunraymoonbeam",
    linkedin: "https://www.linkedin.com/in/ren-hwa-low",
  },
  about: [
    "I'm an AI Engineer focused on agentic workflows, LLM infrastructure and automation. At Carro I design systems that handle tens of thousands of support tickets a month while keeping costs low.",
    "Outside work I run a self-hosted homelab of AI agents, and I climb, cook and play guitar.",
  ],
  interests: ["Rock climbing", "Cooking", "Guitar"],
  tech: [
    { label: "Languages", items: ["Python", "TypeScript", "SQL"] },
    { label: "Backend & Tools", items: ["FastAPI", "Django", "Docker", "Bash", "n8n", "Git"] },
    { label: "AI / LLM", items: ["LangChain", "LangGraph", "Google ADK", "Langfuse", "LiteLLM", "PyTorch"] },
    { label: "Cloud & Infra", items: ["GCP", "Azure", "Terraform", "AWS"] },
  ] satisfies TechGroup[],
} as const;
