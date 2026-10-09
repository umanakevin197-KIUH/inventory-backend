import BaseModel from "./base.model";

export default class inventory_movements extends BaseModel {
  product_id: string;
  movement_type: string;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  created_by: number;
  created_at: string;

  constructor({
    id,
    product_id,
    movement_type,
    quantity,
    previous_stock,
    new_stock,
    reason,
    created_by,
    created_at,
  }: {
    id: string;
    product_id: string;
    movement_type: string;
    quantity: number;
    previous_stock: number;
    new_stock: number;
    reason: string;
    created_by: number;
    created_at: string;
  }) {
    super(id);
    this.product_id = product_id;
    this.movement_type = movement_type;
    this.quantity = quantity;
    this.previous_stock = previous_stock;
    this.new_stock = new_stock;
    this.reason = reason;
    this.created_by = created_by;
    this.created_at = created_at;
  }
}
