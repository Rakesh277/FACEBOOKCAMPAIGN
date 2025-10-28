// Optionally move this to types/ai.ts
export interface CaptionInput {
  objective: string;
  adType: string;
  description: string;
}

export interface PostInput {
  caption: string;
  budget: number;
  duration: number;
}