
import { AppConfig, LayoutType } from './types';

export const DEFAULT_CONFIG: AppConfig = {
  logoText: "MEMOIR STUDIO",
  subText: "SNAP YOUR MOMENT",
  wordmark: "receipt.mark",
  footerText: "THANK YOU FOR VISITING",
  primaryColor: "#000000",
  autoPrint: false,
  countdownSeconds: 5,
  paperSize: '80mm',
  cameraMirror: true,
  homeBackgroundImage: undefined,
};

export const LAYOUTS: { id: LayoutType; name: string; shotsNeeded: number }[] = [
  { id: 'SOLO', name: 'SOLO SHOT', shotsNeeded: 1 },
  { id: 'CLASSIC_4', name: 'CLASSIC 4', shotsNeeded: 4 },
  { id: 'DOUBLE_SHOT', name: 'DOUBLE SHOT', shotsNeeded: 2 },
  { id: 'TWIN_STRIP', name: 'TWIN STRIP', shotsNeeded: 8 },
];
