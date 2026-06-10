export interface BriefingLink {
  id: string;
  briefingId: string;
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface BriefingFile {
  id: string;
  briefingId: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Briefing {
  id: string;
  companyName: string;
  briefingText: string;
  links: BriefingLink[];
  files: BriefingFile[];
  createdAt: string;
  updatedAt: string;
}

export interface BriefingLinkInput {
  title: string;
  url: string;
}

export interface BriefingFileInput {
  fileName: string;
  fileUrl: string;
}

export interface CreateBriefingInput {
  companyName: string;
  briefingText: string;
  links?: BriefingLinkInput[];
  files?: BriefingFileInput[];
}

export type UpdateBriefingInput = Partial<CreateBriefingInput>;
