/**
 * Options to refine membership test queries.
 */
export interface ITestOpts {
    wildcard?: string;
    prefix?: boolean;
}

/**
 * Options to refine search queries.
 */
export interface ISearchOpts {
    wildcard?: string;
    prefix?: boolean;
    first?: boolean;
}

/**
 * Base Trie interface that supports testing and searching.
 */
export interface ITrie {
    /**
     * Test that a string exists in a trie.
     * @param {string} s
     * @param {ITestOpts} opts
     * @returns {boolean}
     */
    test: (s: string, opts?: ITestOpts) => boolean;

    /**
     * Query a trie for membership of a string, optionally using wildcards and/or prefix matching.
     * @param {string} s
     * @param {ISearchOpts} opts
     * @returns {string | string[]}
     */
    search: (s: string, opts?: ISearchOpts) => string | string[];
}