export interface UploadedImage {
  id: string;
  url: string;
  base64: string; // Base64 string without the prefix for API
  mimeType: string;
  file: File;
}

export interface GeneratedPost {
  id: string;
  content: string;
  selectedImages: UploadedImage[];
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
