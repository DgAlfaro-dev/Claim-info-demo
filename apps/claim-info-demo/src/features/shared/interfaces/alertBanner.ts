export type BannerVariant = 'success' | 'error';
export type BannerState = 'success' | 'error' | null;

export interface AlertBannerProps {
  variant: BannerVariant;
  onClose: () => void;
}