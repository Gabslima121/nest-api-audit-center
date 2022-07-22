interface CreateCompanyDTO {
  corporateName: string;
  cnpj: string;
  state: string;
  city: string;
  cep: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
}

interface UpdateCompanyDTO {
  corporateName: string;
  cnpj: string;
  state: string;
  city: string;
  cep: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
}

export { CreateCompanyDTO, UpdateCompanyDTO };
