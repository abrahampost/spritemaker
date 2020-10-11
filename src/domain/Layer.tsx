export type Cells = Array<Array<string>>;

export class Layer {
    width: number;
    height: number;

    cells: Cells;

    hist: Cells[];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.cells = [...Array(height)].map(_ => [...Array(width).fill("#ffffff")]);
        this.hist = [];
    }

    getCell(x: number, y: number) {
        return this.cells[y][x];
    }
    
    private _setCell(x: number, y: number, color: string) {
        this.cells[y][x] = color;
    }
    
    setCell(x: number, y: number, color: string) {
        // this.pushHistory();
        this._setCell(x, y, color);
    }
    
    setCells(updatedCells: {x: number, y: number, color: string}[]) {
        // this.pushHistory();
        updatedCells.forEach(cell => {
            this._setCell(cell.x, cell.y, cell.color);
        })
    }

    floodFill(x: number, y: number, color: string) {
        const origColor = this.getCell(x, y);
        if (origColor === color) return;
        const helper = (x: number, y: number, origColor: string, color: string) => {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height || this.getCell(x, y) !== origColor) return;
            this._setCell(x, y, color);
            helper(x - 1, y + 1, origColor, color);
            helper(x    , y + 1, origColor, color);
            helper(x + 1, y + 1, origColor, color);
            helper(x - 1, y    , origColor, color);
            helper(x + 1, y    , origColor, color);
            helper(x - 1, y - 1, origColor, color);
            helper(x    , y - 1, origColor, color);
            helper(x + 1, y - 1, origColor, color);
        }
        helper(x, y, origColor, color);
    }

    undo() {
        this.cells = this.hist.pop() || [];
    }
    
    private pushHistory() {
        // this.hist.push(this.cells.map(c => c.slice(0, c.length)));
    }
}