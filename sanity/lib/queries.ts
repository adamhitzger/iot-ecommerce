import { groq } from "next-sanity"

export const BANNERS = groq`*[_type == "banners"] {
    heading,
    text,
    "imageUrl": image.asset->url,
    category->{
        name,
        "slug": slug.current
    }
}`;

export const PRODUCT_REVIEWS = groq`*[_type == "reviews" && product->slug.current == $slug] {
    name,
    review,
    rating,
}`;

export const PRODUCT = groq`*[_type == "products" && slug.current == $slug][0]{
    _id,
    name,
    overview,
      sale,
    "slug": slug.current,
    terpens[]{
        t_name,
        "slug":value.current,
        color
    },
    variants[]{
        v_name,
        "slug":value.current,
        price_b2c,
        price_b2b,
      
    },
    details,
    "picture": image.asset->url,
    "pictures": images[].asset->url,
    quantity,
    category->{
        name,
        "slug": slug.current,
    }
}`

export const PRODUCTS = groq`*[_type == "products"][0..11] {
    name,
    overview,
    "slug": slug.current,
    price,
    "picture": image.asset->url,
}`

export const CATEGORIES = groq`*[_type == "categories"][0..5] {
    name,
    "slug": slug.current,
    "picture": image.asset->url,
}`

export const ALL_CATEGORIES = groq`*[_type == "categories"] {
    name,
    "slug": slug.current,
    "picture": image.asset->url,
    
}`

export const ALL_PRODUCTS = groq`*[_type == "products"][0..11] {
    name,
    overview,
    "slug": slug.current,
    price,
    "picture": image.asset->url,
}`

export const PRODUCTS_BY_CAT = groq`*[_type == "products" && category->slug.current == $name] {
    name,
    overview,
    "slug": slug.current,
    price,
    "picture": image.asset->url,
}`
