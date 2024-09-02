export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}

export interface User {
    email: string;
    first_name: string;
    last_name: string;
    user_id: string;
    image?: string;
    phone?: string;
    role: UserRole;
  }