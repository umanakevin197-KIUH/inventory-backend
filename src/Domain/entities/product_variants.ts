import BaseModel from "./base.model";

export default class Product_variants extends BaseModel {
  product_id: integer;
  sku: string;
  size: string;
  color: string;
  brand: string;
  stock: integer;
  price: decimal;
  created_at: timestamp;

  constructor({
    id,
    product_id,
    sku,
    size,
    color,
    brand,
    stock,
    price,
    created_at,
  }: {
    id: string;
    product_id: integer;
    sku: string;
    size: string;
    color: string;
    brand: string;
    stock: integer;
    price: decimal;
    created_at: timestamp;
  }) {
    super(id);
    this.product_id = product_id;
    this.sku = sku;
    this.size = size;
    this.color = color;
    this.brand = brand;
    this.stock = stock;
    this.price = price;
    this.created_at = created_at;
  }
}
