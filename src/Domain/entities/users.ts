import BaseModel from "./base.model";

export default class Users extends BaseModel {
  name: string;
  email: string;
  password: string;
  role: string;
  status: boolean;
  created_at: string;

  constructor({
    id,
    name,
    email,
    password,
    role,
    status,
    created_at,
  }: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    status: boolean;
    created_at: string;
  }) {
    super(id);
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.status = status;
    this.created_at = created_at;
  }
}
