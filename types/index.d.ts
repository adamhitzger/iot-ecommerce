type Country = "Slovenská republika" | "Česká republika";
type Status = "Přijatá"| "Zaplacená" |"Odeslaná"| "Vyzvednutá"| "Zrušená"| "Vrácení";

interface OrderedItem {
    _type: "orderedItem";
    productId: string;
    quantity: number;
}

interface Slug {
   current: string;
}

export interface Newsletter {
    email: string;
    name: string;
    surname: string;
}

export interface Order {
    email: string;
    name: string;
    surname: string;
    phone: string;
    country: Country;
    region: string;
    postalCode: number;
    address: string;
    total: number;
    packetaId: number;
    barcode: string;
    status: Status;
    orderedProducts: OrderedItem[];
}

export interface Product {
    name: string;
    overview: string;
    slug: Slug;
    price: number;
    details: any;
    picture: string;
    pictures: string[];
    quantity: number;
    category: Category;
    file: string;
    tutorial: string[];
}

export interface Review {
    name: string;
    review: string;
    rating: number;
    procuct: string;
}

export interface Category {
    name: string;
    slug: Slug;
    picture: string;
}

export interface Banner {
    heading: string;
    imageUrl: string;
    text: string;
    category: Category;
}


export interface Href {
    route: string;
    name?: string;
};



export interface Route extends Href {
    lastModified: string;
  };

  export interface Coupon {
    code: string;
    percentage: number;
    free_del: boolean;
  }

export type Coupons = Coupon[]  
export type Banners = Banner[]
export type Products = Product[]
export type Reviews = Review[]
export type Categories = Category[]
export type Links = Href[]
export type XML = Route[]