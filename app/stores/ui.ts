import { atom } from "nanostores";
import type { Project, ProjectInfo } from "~/types";

export const $activeProject = atom<ProjectInfo | null>(null);
export const $activePos = atom<{ top: number; left: number } | null>(null);
export const $hoveredProject = atom<ProjectInfo | null>(null);
