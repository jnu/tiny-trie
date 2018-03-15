declare class BinaryString {
    private buffer;
    private pointer;
    private data;
    write(val: number, width?: number): void;
    flush(): void;
    getData(): string;
    _digest(): void;
}
export default BinaryString;
