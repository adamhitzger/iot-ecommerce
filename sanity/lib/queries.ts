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

export const PRODUCT_REVIWS = groq`*[_type == "reviews" && product->slug.current == $slug] {
    name,
    review,
    rating,
}`;

export const PRODUCT = groq`*[_type == "products" && slug.current == $slug][0] {
    name,
    overview,
    "slug": slug.current,
    price,
    details,
    "picture": image.asset->url,
    "pictures": images[].asset->url,
    quantity,
    category->{
        name,
        "slug": slug.current,
    },
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