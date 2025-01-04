'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig, DocumentActionsResolver, DocumentActionComponent} from 'sanity'
import {structureTool} from 'sanity/structure'
import { colorInput} from "@sanity/color-input"
// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'
import { cancelledOrder, completedOrder, paidOrder, refundedOrder, sendOrder } from './sanity/lib/actions'


export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    colorInput(),
    visionTool({defaultApiVersion: apiVersion}),
  ],
  document: {
    actions: ((prev: DocumentActionComponent[], context: { schemaType: string }) => {
      // Check if the schema type is 'orders'
      if (context.schemaType === 'orders') {
        return [paidOrder, sendOrder, completedOrder, cancelledOrder, refundedOrder, ...prev];
      }
      return prev;
    }) as DocumentActionsResolver,
  }
})
