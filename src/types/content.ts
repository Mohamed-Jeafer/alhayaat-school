export interface ContentBlock {
  id: string;
  [key: string]: string | ContentBlock | ContentBlock[] | { label: string; href: string } | number | number[] | boolean;
}

export interface PageContent {
  page: string;
  meta: {
    id: string;
    title: string;
    description: string;
    og_title: string;
    og_description: string;
  };
  sections: Record<string, ContentBlock & Record<string, unknown>>;
}
