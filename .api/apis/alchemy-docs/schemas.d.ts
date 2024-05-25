declare const GetTokenAccountsByOwner: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly id: {
                readonly type: "integer";
                readonly default: 1;
            };
            readonly jsonrpc: {
                readonly type: "string";
                readonly default: "2.0";
            };
            readonly method: {
                readonly default: "getTokenAccountsByOwner";
                readonly type: "string";
            };
            readonly params: {
                readonly type: "array";
                readonly prefixItems: {
                    readonly oneOf: readonly [{
                        readonly type: "string";
                        readonly description: "Base-58 Encoded String - Pubkey of queried SPL token account owner.";
                    }, {
                        readonly oneOf: readonly [{
                            readonly type: "object";
                            readonly properties: {
                                readonly mint: {
                                    readonly type: "string";
                                    readonly description: "Base-58 Encoded String - Pubkey of the specific token Mint to limit accounts to.";
                                };
                            };
                        }, {
                            readonly type: "object";
                            readonly properties: {
                                readonly programId: {
                                    readonly type: "string";
                                    readonly description: "Base-58 Encoded String - Pubkey of the Token program that owns the accounts.";
                                };
                            };
                        }];
                    }, {
                        readonly type: "object";
                        readonly properties: {
                            readonly commitment: {
                                readonly type: "string";
                                readonly default: "processed";
                                readonly description: "Configures the commitment level of the blocks queried.\nAccepts one of the following strings: [\"finalized\", \"confirmed\", \"processed\"]\n";
                                readonly enum: readonly ["finalized", "confirmed", "processed"];
                            };
                            readonly encoding: {
                                readonly type: "string";
                                readonly description: "Data encoding for each returned transaction.\nAccepts one of the following strings:\n[\"json\" (Default), \"jsonParsed\", \"base58\" (slow), \"base64\"]\n\"jsonParsed\" encoding attempts to use program-specific parsers to make the transaction.message.instructions list more human-readable; if a parser cannot be found, the instruction falls back to default JSON.\n";
                                readonly default: "json";
                                readonly enum: readonly ["json", "jsonParsed", "base58", "base64"];
                            };
                            readonly dataSlice: {
                                readonly type: "object";
                                readonly description: "Limits the returned account data using the provided offset: <usize> and length: <usize> fields\nOnly available for \"base58\", \"base64\" or \"base64+zstd\" encodings.\n";
                            };
                            readonly minContextSlot: {
                                readonly type: "number";
                                readonly default: 165768577;
                                readonly description: "Set the minimum slot that the request can be evaluated at.";
                            };
                        };
                    }];
                };
                readonly items: {
                    readonly oneOf: readonly [{
                        readonly type: "string";
                        readonly description: "Base-58 Encoded String - Pubkey of queried SPL token account owner.";
                    }, {
                        readonly oneOf: readonly [{
                            readonly type: "object";
                            readonly properties: {
                                readonly mint: {
                                    readonly type: "string";
                                    readonly description: "Base-58 Encoded String - Pubkey of the specific token Mint to limit accounts to.";
                                };
                            };
                        }, {
                            readonly type: "object";
                            readonly properties: {
                                readonly programId: {
                                    readonly type: "string";
                                    readonly description: "Base-58 Encoded String - Pubkey of the Token program that owns the accounts.";
                                };
                            };
                        }];
                    }, {
                        readonly type: "object";
                        readonly properties: {
                            readonly commitment: {
                                readonly type: "string";
                                readonly default: "processed";
                                readonly description: "Configures the commitment level of the blocks queried.\nAccepts one of the following strings: [\"finalized\", \"confirmed\", \"processed\"]\n\nDefault: `processed`";
                                readonly enum: readonly ["finalized", "confirmed", "processed"];
                            };
                            readonly encoding: {
                                readonly type: "string";
                                readonly description: "Data encoding for each returned transaction.\nAccepts one of the following strings:\n[\"json\" (Default), \"jsonParsed\", \"base58\" (slow), \"base64\"]\n\"jsonParsed\" encoding attempts to use program-specific parsers to make the transaction.message.instructions list more human-readable; if a parser cannot be found, the instruction falls back to default JSON.\n\nDefault: `json`";
                                readonly default: "json";
                                readonly enum: readonly ["json", "jsonParsed", "base58", "base64"];
                            };
                            readonly dataSlice: {
                                readonly type: "object";
                                readonly description: "Limits the returned account data using the provided offset: <usize> and length: <usize> fields\nOnly available for \"base58\", \"base64\" or \"base64+zstd\" encodings.\n";
                                readonly additionalProperties: true;
                            };
                            readonly minContextSlot: {
                                readonly type: "number";
                                readonly default: 165768577;
                                readonly description: "Set the minimum slot that the request can be evaluated at.";
                            };
                        };
                    }];
                };
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly apiKey: {
                    readonly type: "string";
                    readonly default: "docs-demo";
                    readonly description: "<style>\n  .custom-style {\n    color: #048FF4;\n  }\n</style>\nFor higher throughput, <span class=\"custom-style\"><a href=\"https://alchemy.com/?a=docs-demo\" target=\"_blank\">create your own API key</a></span>\n";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                };
            };
            readonly required: readonly ["apiKey"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly id: {
                    readonly type: "integer";
                };
                readonly jsonrpc: {
                    readonly type: "string";
                };
                readonly result: {
                    readonly type: "object";
                    readonly properties: {
                        readonly context: {
                            readonly type: "object";
                            readonly properties: {
                                readonly slot: {
                                    readonly type: "integer";
                                    readonly format: "int64";
                                    readonly minimum: -9223372036854776000;
                                    readonly maximum: 9223372036854776000;
                                };
                            };
                        };
                        readonly value: {
                            readonly type: "object";
                            readonly properties: {
                                readonly account: {
                                    readonly type: "object";
                                    readonly properties: {
                                        readonly lamports: {
                                            readonly type: "integer";
                                            readonly format: "int64";
                                            readonly description: "u64 - Number of lamports assigned to this account.";
                                            readonly minimum: -9223372036854776000;
                                            readonly maximum: 9223372036854776000;
                                        };
                                        readonly owner: {
                                            readonly type: "string";
                                            readonly description: "Base-58 Encoded String - Pubkey of the program this account has been assigned to.";
                                        };
                                        readonly data: {
                                            readonly description: "[string, encoding]|object - Data associated with the account, either as encoded binary data or JSON format {<program>: <state>}, depending on encoding parameter.\n";
                                            readonly type: "array";
                                            readonly prefixItems: {
                                                readonly "oneOf:data": readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly type: "object";
                                                }];
                                            };
                                            readonly items: {
                                                readonly "oneOf:data": readonly [{
                                                    readonly type: "string";
                                                }, {
                                                    readonly type: "object";
                                                }];
                                            };
                                        };
                                        readonly executable: {
                                            readonly type: "boolean";
                                            readonly description: "Indicates if the account contains a program (and is strictly read-only).";
                                        };
                                        readonly rentEpoch: {
                                            readonly type: "integer";
                                            readonly description: "u64, The epoch at which this account will next owe rent.";
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
export { GetTokenAccountsByOwner };
