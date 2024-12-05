import { type SchemaTypeDefinition } from 'sanity'
import { product } from './schemas/products'
import { category } from './schemas/categories'
import { review } from './schemas/reviews'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, review],
}
