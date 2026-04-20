export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText?: string;
}

export interface Project {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  category: 'branding' | 'tasarim' | 'yazilim' | 'pazarlama';
  description: string;
  cover_image: StrapiMedia;
  gallery: StrapiMedia[];
  client: string;
  year: number;
  live_url: string;
  featured: boolean;
  tags: string[];
}

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  category: string;
  content: any;
  summary: string;
  cover_image: StrapiMedia;
  author: string;
  read_time: number;
  publishedAt: string;
  featured: boolean;
}

export interface Solution {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  badge_text: string;
  short_description: string;
  icon: string;
  category: string;
  features: any[];
  process_steps: any[];
  cta_label: string;
  cta_url: string;
  order: number;
}
