import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type GetTransactionBodyParam = FromSchema<typeof schemas.GetTransaction.body>;
export type GetTransactionMetadataParam = FromSchema<typeof schemas.GetTransaction.metadata>;
export type GetTransactionResponse200 = FromSchema<typeof schemas.GetTransaction.response['200']>;
