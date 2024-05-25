import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';
export type GetTokenAccountsByOwnerBodyParam = FromSchema<typeof schemas.GetTokenAccountsByOwner.body>;
export type GetTokenAccountsByOwnerMetadataParam = FromSchema<typeof schemas.GetTokenAccountsByOwner.metadata>;
export type GetTokenAccountsByOwnerResponse200 = FromSchema<typeof schemas.GetTokenAccountsByOwner.response['200']>;
