type Country = "Slovenská republika" | "Česká republika";
type Status = "Přijatá"| "Zaplacená" |"Odeslaná"| "Vyzvednutá"| "Zrušená"| "Vracení";

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
    category: string;
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
    details: any;
    slug: Slug;
    picture: string;
}

export type Products = Product[]
export type Reviews = Review[]
export type Categories = Category[]