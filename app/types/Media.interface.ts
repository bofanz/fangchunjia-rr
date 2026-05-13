export interface Media {
  key: string;
  contentType?: string;
}

export interface MediaLayoutItem {
  key: string;
  size: MediaSize;
}

export enum MediaSize {
  S = "s",
  M = "m",
  L = "l",
}
