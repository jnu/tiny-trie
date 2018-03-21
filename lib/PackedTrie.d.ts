import { ITrie, ISearchOpts, ITestOpts } from './BaseTrie';
export declare class PackedTrie implements ITrie {
    data: string;
    private offset;
    private table;
    private inverseTable;
    private wordWidth;
    private lastMask;
    private pointerMask;
    private pointerShift;
    private charMask;
    private charShift;
    constructor(binary: string);
    test(str: string, {wildcard, prefix}?: ITestOpts): boolean;
    search(str: string, {wildcard, prefix, first}?: ISearchOpts): string | string[];
}
