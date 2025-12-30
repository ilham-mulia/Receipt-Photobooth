
export type LayoutType = 'SOLO' | 'CLASSIC_4' | 'DOUBLE_SHOT' | 'TWIN_STRIP';
export type PaperSize = '58mm' | '80mm' | '4x6';

export interface AppConfig {
  logoText: string;
  subText: string;
  wordmark: string;
  footerText: string;
  primaryColor: string;
  autoPrint: boolean;
  countdownSeconds: number;
  paperSize: PaperSize;
  cameraMirror: boolean;
  homeBackgroundImage?: string; // Base64 string for the home screen background
}

export interface PhotoboothState {
  currentStep: 'HOME' | 'LAYOUT' | 'CAPTURE' | 'PREVIEW' | 'ADMIN';
  selectedLayout: LayoutType;
  capturedImages: string[];
}
