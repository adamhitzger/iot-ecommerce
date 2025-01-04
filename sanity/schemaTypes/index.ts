import { type SchemaTypeDefinition } from 'sanity'
import { product } from './schemas/products'
import { category } from './schemas/categories'
import { review } from './schemas/reviews'
import { orders } from './schemas/orders'
import { orderedItem } from './schemas/orderedItems'
import { newsletter } from './schemas/newsletter'
import { banner } from './schemas/banners'
import { coupon } from './schemas/coupons'
import { contact } from './schemas/contacts'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, review, orders, orderedItem, newsletter, banner, coupon, contact],
}
