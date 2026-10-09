import BaseModel from "./base.model";

export default class Subcategories extends BaseModel {
  category_id: string;
  name: string;
  status: boolean;
  created_at: string;

  constructor({
    id,
    category_id,
    name,
    status,
    created_at,
  }: {
    id: string;
    category_id: string;
    name: string;
    status: boolean;
    created_at: string;
  }) {
    super(id);
    this.category_id = category_id;
    this.name = name;
    this.status = status;
    this.created_at = created_at;
  }
}
