import React , { ReactNode, Reference } from "react";

type Country = "Slovenská republika" | "Česká republika";
type Status = "Přijatá"| "Zaplacená" |"Odeslaná"| "Vyzvednutá"| "Zrušená"| "Vrácení";

export type User ={
    _type: "users",
    _id?:string,
    name?: string;
    surname?: string;
    email: string;
    type?: "customer" | "bussiness";
    ico?: number;
    tel?: string;
    event_type: "newsletter" | "reviews" | "order" | "contact";
    souhlas?: boolean;
    country?: string;
    region?: string;
    postalCode?: string;
    address?: string;
    city?: string;
}

export interface SignIn {
    email: string;
}

export interface Contact {
    _type: "contact";
    name: string;
    surname: string;
    email: string;
    tel: string;
    msg: string;
}

export interface ActionResponse<T> {
    success: boolean
    message: string;
    errors?: {
        [K in keyof T]?: string[];
      };
    inputs?: T 
}

export type Campaign = {
  _id?: string;           // Sanity document ID
  _type: "campaigns";      // typ dokumentu
  name: string;
  slug: string;
  campaignCode: Coupon;
  targetSegment: "newsletter" | "order" | "byCategory" | "byProduct";
  targetEra: "month" | "quarter" | "half-yearly" | "year" | "overYear";
  targetSegmentType?: "one" | "more";

  emailSubject: string;
  emailHeading: string;
  emailBody: any;
  emailProducts: Products;

  smsText: string;
  utmTerm: string;
  utmContent: string;
};

export interface OrderedItem {
    _type: string;
    productId: { _type: string, _ref: string };
    price: number;
    quantity: number;
    terpens: string;
    variant: string;
    name?: string;
}

export interface Order {
    _id: string;
    _type: "orders";
    user: User;
    total: number;
    date: string;
    packetaId: number;
    barcode: string;
    status: Status;
    cod: string;
    orderedProducts: OrderedItem[];
    invoice: string;
    couponValue: number;
    free_del: boolean
}

export interface BarcodeSend {
    email: string;
    name: string;
    surname: string;
    phone: string;
    packetaId: number;
    total: number;
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
    _type: string;
    price: number;
    name: string;
    overview: string;
    keywords: string[];
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
    product: Products;
    file: string;
    tutorial: string[]; 
}

export interface basketItem{
    name:  string;
     _id: string;
     price:  number;
     terpen:  string;
     quantity:  number;
     variant: string;
}

export interface Review {
    _type: string;
    user:User,
    review: string;
    rating: number;
    product: {
        _type: "reference",
        _ref: string
    };
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
    product: Product;
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
export type Campaigns = Campaign[]