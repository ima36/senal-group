import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Payload runs embedded in this Next app, so reads go through the Local API —
 * a direct database call, no HTTP hop, no REST query-string encoding.
 * getPayload memoises internally, so calling this per request is cheap.
 */
export const getPayloadClient = async () => getPayload({ config: configPromise })
