export interface IUser {
  id: string;
  email: string;
}

export interface IUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  userId: string;
}
