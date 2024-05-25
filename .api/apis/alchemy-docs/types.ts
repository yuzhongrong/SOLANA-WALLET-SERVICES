import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';

export type GetProgramAccountsBodyParam = FromSchema<typeof schemas.GetProgramAccounts.body>;
export type GetProgramAccountsMetadataParam = FromSchema<typeof schemas.GetProgramAccounts.metadata>;
export type GetProgramAccountsResponse200 = FromSchema<typeof schemas.GetProgramAccounts.response['200']>;
