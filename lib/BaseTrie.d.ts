export interface ITestOpts {
    wildcard?: string;
    prefix?: boolean;
}
export interface ISearchOpts {
    wildcard?: string;
    prefix?: boolean;
    first?: boolean;
}
export interface ITrie {
    test: (s: string, opts?: ITestOpts) => boolean;
    search: (s: string, opts?: ISearchOpts) => string | string[];
}
