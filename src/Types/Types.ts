export type ProductsData = {
  limit: number;
  products: Products[];
  skip: number;
  total: number;
};

export type Products = {
  brand: string;
  category: string;
  description: string;
  discountPercentage: number;
  id: number;
  images: string[];
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  title: string;
};
