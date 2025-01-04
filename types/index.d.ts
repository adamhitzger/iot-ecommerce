import React , { ReactNode } from "react";

type Country = "Slovenská republika" | "Česká republika";
type Status = "Přijatá"| "Zaplacená" |"Odeslaná"| "Vyzvednutá"| "Zrušená"| "Vrácení";

interface OrderedItem {
    _type: "orderedItem";
    productId: string;
    quantity: number;
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
type RGB = {
    r: number,
        g: number,
        b: number,
        a: number,
}
type Color = {
    rgb: RGB;
}

type Terpen = {
    t_name: string;
    slug: string;
    color: Color;
}
type Var = {
    v_name: string;
    slug: string;
    price_b2c: number;
    price_b2b: number;
    
}

type Terpens = Terpen[];
type Vars = Var[];

export interface Product {
    _id: string;
    name: string;
    overview: string;
    sale: number;
    slug: string;
    terpens: Terpens;
    details: any;
    picture: string;
    pictures: string[];
    terpens: Terpens;
    variants: Vars;
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
    slug: string;
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
    isPercentage: boolean;
    value: number;
    free_del: boolean;
  }

export interface Card {
    icon: React.ReactNode;
    heading: string;
    text: string;
}


export type Cards = Card[]
export type Coupons = Coupon[]  
export type Banners = Banner[]
export type Products = Product[]
export type Reviews = Review[]
export type Categories = Category[]
export type Links = Href[]
export type XML = Route[]