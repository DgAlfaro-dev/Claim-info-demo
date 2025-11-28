import { BannerState } from '@features/shared/interfaces/alertBanner';

export type WaiveDeductibleModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (state: BannerState) => void;
};

export type WaiveReason = 
  | 'customer_loyalty' 
  | 'special_case' 
  | 'low_damage' 
  | 'good_history' 
  | 'management_decision';

export interface WaiveDeductibleFormData {
  reason: WaiveReason | '';
  comments: string;
}