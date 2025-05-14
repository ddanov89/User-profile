export interface ProfileUpdateDTO {
  name?: string | null;
  username?: string | null;
  email?: string | null;
  address?: AddressDTO | null;
  phone?: string | null;
  website?: string | null;
  company?: CompanyDTO | null;
  avatar?: File | string;
}

export interface AddressDTO {
  street?: string | null;
  suite?: string | null;
  city?: string | null;
  zipcode?: string | null;
}

export interface CompanyDTO {
  name?: string | null;
}
