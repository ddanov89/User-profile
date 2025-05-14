export interface ProfileUpdateDTO {
  name?: string | null;
  username?: string | null;
  email?: string | null;
  address?: Address | null;
  phone?: string | null;
  website?: string | null;
  company?: Company | null;
//   avatar?: File | string;
}

export interface Address {
  street?: string | null;
  suite?: string | null;
  city?: string | null;
  zipcode?: string | null;
}

export interface Company {
  name?: string | null;
}
