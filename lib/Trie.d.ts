import { ITrie, ITestOpts, ISearchOpts } from './BaseTrie';
export interface INode {
    [key: string]: INode;
}
export declare class Trie implements ITrie {
    root: INode;
    frozen: boolean;
    constructor(tree?: INode);
    insert(str: string): this;
    test(str: string, {wildcard, prefix}?: ITestOpts): boolean;
    search(str: string, {wildcard, prefix, first}?: ISearchOpts): string | string[];
    clone(): Trie;
    freeze(): this;
    encode(): string;
    toJSON(): any;
}
