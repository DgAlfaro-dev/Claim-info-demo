export interface Owner {
  name: string;
  lastName: string;
  ruc: string;
}

export interface Broker {
  FullName: string;
}

export interface Coverage {
  coverageCode: string;
  description: string;
  insuredAmount: string;
}

export interface Policy {
  policyNumber: string;
  Owner: Owner;
  Broker: Broker;
  coverages: Coverage[];
  payOverdueDays: number;
}

export interface VehicleInformation {
  model: string;
  plate: string;
  serialChassis: string;
  year: number;
  depreciation: number;
}

export interface Driver {
  name: string;
  lastName: string;
  gender: string;
  birthday: string;
}

export interface Claim {
  claimNumber: string;
  fud: string; // 'NONE' | 'APPLY' | other values
  driver: Driver;
}

export interface Deductible {
  Base: number;
  Calculated: number;
  exoneratedByAnalyst: boolean;
}

export interface ClaimInfoData {
  policy: Policy;
  vehicleInformation: VehicleInformation;
  claim: Claim;
  deductible: Deductible;
  coverageCode: string;
  endorsement: string;
  totalLossPercentage: string;
  creditor: string;
  deductiblePayment: string;
  totalClaimCost: number;
  currency?: string; // Código de moneda (CRC, USD, PAB, etc.)
}