import BaseModel from "./base.model";

export default class Categories extends BaseModel {
  name: string;
  description: string;
   status: boolean;
  created_at: string;

  constructor({
    id,
    name,
    description,
    status,
    created_at,
  }: {
    id: string;
    name: string;
    description: string;
    status: boolean;
    created_at: string;
  }) {
    super(id);
    this.name = name;
    this.description = description;
    this.status = status;
    this.created_at = created_at;
  }
}
