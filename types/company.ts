// types/company.ts

export interface StoreLocation {
  name: string;
  postalCode?: string;
  prefecture?: string;
  city?: string;
  addressLine?: string;
  address?: string;
  managerName?: string;
  phone?: string;
  email?: string;
}

export interface ActivityLog {
  timestamp: string;
  adminName: string;
  action: string;
  details?: string;
}

export type PlanType = 'S' | 'A' | 'B' | 'C' | 'D' | 'E_plus' | 'E' | string;

export interface CompanyData {
  id: string;
  corporateType: string;
  companyName: string;
  companyNameKana: string;
  representativeName: string;
  contactName: string;
  industry: string;
  corporateNumber: string;
  invoiceNumber: string;
  establishmentDate: string;
  capital: string;
  fullTimeEmployees: string;
  partTimeEmployees: string;
  businessDescription: string;
  homepageUrl: string;
  licenses: string;
  accountingContactName?: string;
  accountingEmail?: string;
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine: string;
  address: string;
  stores?: StoreLocation[];
  phone: string;
  email: string;
  newsletterOptIn?: boolean;
  status: string;
  createdAt: string;
  adminMemo?: string;
  assignedStaff?: string;
  planType?: PlanType;
  jobs?: any[];
  auditLogs?: ActivityLog[];
}