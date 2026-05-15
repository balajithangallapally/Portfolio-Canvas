import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import staticData from "@/data/portfolio.json";

export interface PortfolioProject {
  id: number;
  name: string;
  description: string;
  tech: string[];
  features: string[];
  github: string;
  live: string;
  sortOrder: number;
}

export interface NormalizedPortfolioData {
  name: string;
  role: string;
  tagline: string;
  about: string;
  skills: Record<string, string[]>;
  projects: PortfolioProject[];
  links: { github: string; linkedin: string; email: string };
  education: { degree: string; institute: string; year: string };
  isLoading: boolean;
}

interface ApiPortfolioResponse {
  profile: { id: number; name: string; role: string; tagline: string; about: string } | null;
  projects: PortfolioProject[];
  skills: { id: number; category: string; skills: string[]; sortOrder: number }[];
  links: { id: number; github: string; linkedin: string; email: string } | null;
  education: { id: number; degree: string; institute: string; year: string } | null;
}

function buildFallback(): NormalizedPortfolioData {
  const s = staticData as any;
  return {
    name: s.name,
    role: s.role,
    tagline: s.tagline,
    about: s.about,
    skills: s.skills as Record<string, string[]>,
    projects: (s.projects as any[]).map((p, i) => ({ id: i, sortOrder: i, ...p })),
    links: s.links,
    education: s.education,
    isLoading: false,
  };
}

function normalize(api: ApiPortfolioResponse): NormalizedPortfolioData {
  const skillsMap: Record<string, string[]> = {};
  for (const row of api.skills) {
    skillsMap[row.category] = row.skills;
  }
  return {
    name: api.profile?.name ?? staticData.name,
    role: api.profile?.role ?? staticData.role,
    tagline: api.profile?.tagline ?? staticData.tagline,
    about: api.profile?.about ?? staticData.about,
    skills: Object.keys(skillsMap).length > 0 ? skillsMap : (staticData.skills as Record<string, string[]>),
    projects: api.projects.length > 0 ? api.projects : buildFallback().projects,
    links: api.links ?? staticData.links,
    education: api.education ?? staticData.education,
    isLoading: false,
  };
}

const PortfolioDataContext = createContext<NormalizedPortfolioData>(buildFallback());

export function PortfolioDataProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery<ApiPortfolioResponse>({
    queryKey: ["portfolio"],
    queryFn: () => apiFetch<ApiPortfolioResponse>("/portfolio"),
    staleTime: 30_000,
    retry: 1,
  });

  const value: NormalizedPortfolioData = isLoading || !data
    ? { ...buildFallback(), isLoading }
    : normalize(data);

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioContext(): NormalizedPortfolioData {
  return useContext(PortfolioDataContext);
}
