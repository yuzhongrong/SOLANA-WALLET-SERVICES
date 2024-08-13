interface DexInfo {
    amm: string;
    liquidity: string;
    name: string;
    pair: string;
}

interface PairHoldersRank {
    address: string;
    lock?: string[];
    mark?: string | null;
    percent: string;
    quantity: string;
}

interface TokenHoldersRank {
    address: string;
    is_contract?: number;
    is_lp?: number;
    mark?: string | null;
    percent: string;
    quantity: string;
}

interface ContractData {
    analysis_big_wallet: string;
    analysis_lp_current_adequate: string;
    analysis_lp_current_volume: number;
    analysis_scam_wallet: string;
    approve_gas: string;
    burn_amount: number;
    buy_gas: string;
    chain: string;
    data_source: string;
    decimal: string;
    dex: DexInfo[];
    err_code: string;
    err_msg: string;
    has_black_method: number;
    has_code: number;
    has_mint_method: number;
    has_not_burned_lp: number;
    has_owner_removed_risk: number;
    has_top10_holder_amount_over_30: number;
    holders: number;
    lock_amount: number;
    owner: string;
    pair_holders: number;
    pair_holders_rank: PairHoldersRank[];
    pair_lock_percent: number;
    pair_total: number;
    query_count: number;
    risk_score: number;
    sell_gas: string;
    token: string;
    token_holders_rank: TokenHoldersRank[];
    token_lock_percent: number;
    total: string;
    vote_support: string;
}

interface TokenContract {
    contract_data: ContractData;
    vote_support: number;
    vote_against: number;
    my_vote: number;
    tx_count: number;
    daily_activity_addr: number;
}

interface NftContract {
    contract_data: ContractData | null;
    vote_support: number;
    vote_against: number;
    my_vote: number;
}

export interface CheckToken {
    token_contract: TokenContract;
    nft_contract: NftContract;
}

