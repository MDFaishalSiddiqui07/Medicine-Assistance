
export interface DrugInfo {
  input: string;
  dawa_ka_sahi_naam: string;
  brand_ya_generic: "Brand" | "Generic";
  use: string;
  safety_note: string;
  confidence: number;
}

export type AppTab = 'drug' | 'image' | 'video';
