import { groq } from "next-sanity"

export const FIND_COUPON = groq`*[_type == "coupons" && code == $coupon][0]{
    code,
    isPercentage,
    value,
    free_del
}`

export const BANNERS = groq`*[_type == "banners"] {
    heading,
    text,
    "imageUrl": image.asset->url,
    category->{
        name,
        "slug": slug.current
    },
    product->{
        name,
        "slug": slug.current
    }
}`;

export const PRODUCT_REVIEWS = groq`*[_type == "reviews" && product->slug.current == $slug][0...9] {
    user->{
    name,
    surname,
    email,
    },
    review,
    rating,
}`;

export const PRODUCT = groq`*[_type == "products" && slug.current == $slug][0]{
    _id,
    name,
    overview,
      sale,
    "slug": slug.current,
    keywords[],
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

export const PRODUCTS = groq`*[_type == "products"][0...11] {
    name,
    overview,
    "slug": slug.current,
    price,
    "picture": image.asset->url,
}`

export const CATEGORIES = groq`*[_type == "categories"][0...5] {
    name,
    "slug": slug.current,
    "picture": image.asset->url,
}`

export const ALL_CATEGORIES = groq`*[_type == "categories"] {
    name,
    "slug": slug.current,
    "picture": image.asset->url,
    
}`

export const ALL_PRODUCTS = groq`*[_type == "products"][$start...$end] {
    name,
    overview,
    "slug": slug.current,
    price,
    "picture": image.asset->url,
}`

export const PRODUCTS_BY_CAT = groq`*[_type == "products" && category->slug.current == $name][$start...$end] {
    name,
    overview,
    "slug": slug.current,
    price,
    "picture": image.asset->url,
}`
export const USER_ORDERS = groq`*[_type == "orders" && email == $email]{
    orderedProducts,
    "invoice": invoice.asset->url,
    status,
    couponValue,
    total,
    cod,    
}`

export const USER_BY_EMAIL = groq`*[_type == "users" && email == $email]{
    _id,
    souhlas
}`

export const GET_VERIFY_CODE = groq`*[_type == "verifyCodes" && code == $code]{
    code,
    _id,
    email
}`

export const GET_CUR_USER = groq`*[_type == "users" && email==$email]{
  _id,
  email,
  name,
  surname,
  tel,
  type,
  ico,
  souhlas,
  country,
  region,
  postalCode,
  address,
  city
}
`

export const GET_CAMPAIGN = groq`*[_type == "campaigns" && _id == $id][0]{
    _id,
    _type,
    name,
    slug,
    campaignCode->{
        code
    },
    targetSegment,
    targetEra,
    targetSegmentType,
    emailSubject,
    emailHeading,
    emailBody,
    emailProducts[]->{
        name,
        price,
        sale,
        "imageUrl":image.asset->url,
    },
    smsText,
    utmTerm,
    utmContent
  }`;

  export const GET_USERS = groq`*[_type == "orders" && user->event_type == $type && user->souhlas == true && dateTime(_updatedAt) > dateTime(now()) - $date]{
    user->{
    email,
    tel,
    name,
    surname
    }
  }`

export const ORDER_BY_ID = groq`*[_type == "orders" && _id == $id]{
    orderedProducts[],
    "invoice": invoice.asset->url,
    status,
    couponValue,
    free_del,
    total,
    cod, 
    date, 
    user->{
        email,
        tel,
        name,
        surname,
        country,
        region,
        postalCode,
        address,
        city
    },
}`