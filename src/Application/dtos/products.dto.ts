export interface ProductsDto {
  category_id: number;
  subcategory_id: number;
  name: string;
  description: string;
  product_type: string;
  status: boolean;
  created_at: Date;
  price:number;
  stock:number;
}
