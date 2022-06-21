interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  cpf: string;
  avatar?: string;
  isDeleted?: boolean;
}

export { CreateUserDTO };
