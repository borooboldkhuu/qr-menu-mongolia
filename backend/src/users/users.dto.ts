export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export class UpdateUserDto {
  name?: string;
  phone?: string;
}
