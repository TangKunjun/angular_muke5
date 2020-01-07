export interface User {
  id?: string;
  email: string;
  passwrod: string;
  name: string;
  avatar: string;
  projectIds: string[];
  address?: Address;
  indentity?: Identity;
  dateOfBirth?: string;
}



export interface Address {
    provice: string;
    city: string;
    district: string;
    street?: string;
}

export enum IdentityType {
  IdCard = 0,
  Insurance,
  Passport,
  Military,
  Other
}

export interface Identity {
    identityNo: string;
    identityType: IdentityType;
}
