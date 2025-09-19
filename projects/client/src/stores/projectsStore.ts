import { create } from "zustand";
import { combine } from "zustand/middleware";

export interface MetricDetails {
  value: number;
  desktop: number;
  mobile: number;
}

export interface ProjectMetrics {
  visitors: MetricDetails;
  impressions: MetricDetails;
  conversions: MetricDetails;
  activity: MetricDetails;
}

export interface Project {
  id: string;
  name: string;
  websiteUrl: string;
  enabled: boolean;
  metrics: ProjectMetrics;
}

type ProjectsState = { projects: Project[] };
type ProjectsActions = {
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
};
export type ProjectsStore = ProjectsState & ProjectsActions;


const initialProjects: Project[] = [
  {
    id: "1",
    name: "Ресторан \u201CВкусно\u201D",
    websiteUrl: "https://vkusno.example",
    enabled: true,
    metrics: {
      visitors: { value: 0, desktop: 120, mobile: 380 },
      impressions: { value: 0, desktop: 3320, mobile: 12780 },
      conversions: { value: 0, desktop: 0, mobile: 0 },
      activity: { value: 0, desktop: 0, mobile: 0 },
    },
  },
  {
    id: "2",
    name: "Интернет магазин \u201CВаленки\u201D",
    websiteUrl: "https://valenki.example",
    enabled: true,
    metrics: {
      visitors: { value: 0, desktop: 99, mobile: 25 },
      impressions: { value: 0, desktop: 674, mobile: 294 },
      conversions: { value: 0, desktop: 0, mobile: 0 },
      activity: { value: 0, desktop: 0, mobile: 0 },
    },
  },
];

export const useProjectsStore = create<ProjectsStore>()(
  combine<ProjectsState, ProjectsActions>(
    { projects: initialProjects },
    (set, get) => ({
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (project) =>
        set(() => ({
          projects: get().projects.map((p) =>
            p.id === project.id ? project : p
          ),
        })),
    })
  )
);