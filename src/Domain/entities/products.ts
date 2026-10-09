import BaseModel from "./base.model";

export default class Products extends BaseModel {
  category_id: number;
  subcategory_id: number;
  name: string;
  description: string;
  product_type: string;
  status: boolean;
  created_at: Date;
  price:number;
  stock:number;

  constructor({
    id,
    category_id,
    subcategory_id,
    name,
    description,
    product_type,
    status,
    created_at,
    price,
    stock,
  }: {
    id: string;
    category_id: number;
    subcategory_id: number;
    name: string;
    description: string;
    product_type: string;
    status: boolean;
    created_at: Date;
    price:number;
    stock:number;
  }) {
    super(id);
    this.category_id = category_id;
    this.subcategory_id = subcategory_id;
    this.name = name;
    this.description = description;
    this.product_type = product_type;
    this.status = status;
    this.created_at = created_at;
    this.price = price;
    this.stock = stock;
  }
}
