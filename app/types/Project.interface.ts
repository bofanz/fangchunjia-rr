import type { Media, MediaLayoutItem } from "./Media.interface";

export interface ProjectInfo {
  id: string;
  title: string;
  subtitle: string | null;
  slug: {
    current: string;
  };
  year: number;
  categoryId: string;
  cover: {
    asset: {
      _ref: string;
    };
  };
  highlighted?: boolean;
  isArchived?: boolean;
}

export interface Project extends ProjectInfo {
  link?: string;
  description: string;
  media: Media[];
  mediaLayout: MediaLayoutItem[];
}

export interface Category {
  id: string;
  name: string;
}
