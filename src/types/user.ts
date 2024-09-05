export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}

export enum UserStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
}

export interface User {
    email: string;
    first_name: string;
    last_name: string;
    user_id: string;
    image: string | null;
    phone?: string;
    role?: UserRole;
  }