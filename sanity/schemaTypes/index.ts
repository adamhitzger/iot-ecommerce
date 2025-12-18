import { type SchemaTypeDefinition } from 'sanity'
import { product } from './schemas/products'
import { category } from './schemas/categories'
import { review } from './schemas/reviews'
import { orders } from './schemas/orders'
import { orderedItem } from './schemas/orderedItems'
import { banner } from './schemas/banners'
import { coupon } from './schemas/coupons'
import { contact } from './schemas/contacts'
import { userType } from './schemas/users'
import { campaign } from './schemas/campaigns'
import { verifyCodes } from './schemas/safetyCodes'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product,campaign,category, review, orders, orderedItem,  banner, coupon, contact, userType, verifyCodes],
}
