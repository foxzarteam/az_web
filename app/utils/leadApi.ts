export interface CreateLeadRequest {
  pan: string;
  mobileNumber: string;
  fullName: string;
  category: 'personal_loan' | 'home_loan' | 'business_loan' | 'credit_card' | 'insurance' | 'vehicle_loan';
  userId?: string;
  email?: string;
  pincode?: string;
  requiredAmount?: number;
}

export interface CreateLeadResponse {
  success: boolean;
  data?: any;
  message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://az-app-khaki.vercel.app';

export async function createLead(leadData: CreateLeadRequest): Promise<CreateLeadResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Failed to create lead',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error creating lead:', error);
    return {
      success: false,
      message: 'Network error. Please try again later.',
    };
  }
}

// Map service value to API category
export function mapServiceToCategory(service: string): CreateLeadRequest['category'] {
  const mapping: Record<string, CreateLeadRequest['category']> = {
    'personal-loan': 'personal_loan',
    'home-loan': 'home_loan',
    'business-loan': 'business_loan',
    'credit-card': 'credit_card',
    'insurance': 'insurance',
  };
  
  return mapping[service] || 'personal_loan';
}
