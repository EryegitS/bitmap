import { InputFileReader } from './input-file-reader';
import { Bitmap } from './models/types';
import { Pixel } from './models/pixel';
import { Direction } from './models/types';

export class BitmapProcessor {
    private _reader: InputFileReader;
    private _input: Bitmap<Pixel>;
    private _output: Bitmap<number>;
    private readonly directions: Direction = {
        east: [0, 1],
        west: [0, -1],
        south: [1, 0],
        north: [-1, 0]
    };

    /**
     * starts to compute costs after bitmap is created by reading input file
     * after all pixels processed, prints the output
     * @param filePath: path of input file
     */
    public async readInputFile(filePath: string): Promise<void>  {
        this._reader = new InputFileReader();
        this._input = await this._reader.readInputFile(filePath);
        this._output = this.computeCosts();
    }

    /**
     *  White pixels will be origin while determining neighbour pixels. So first elements of queue are white pixels.
     *  Firstly finding neighbour pixels and checking their position in bitmap.
     *  Then checking they are already hit. If not, then adding to queue
     *  Afterwards set the cost to reach white by help of previous pixel
     * @private
     */
    private computeCosts(): Bitmap<number> {
        const queue: Pixel[] = this._reader.whitePixels.map(white => {
            white.isHit = true;
            return white;
        });

        while (queue.length > 0) {
            const pixel: Pixel = queue.shift();
            const neighbours = this.getNeighbourPixels(pixel);

            /** Setting cost to reach white and isHit as true */
            neighbours.forEach(n => {
                n.costToWhitePixel = pixel.costToWhitePixel + 1;
                n.isHit = true;
                queue.push(n);
            });
        }

        return this.input.map(rows => {
            return rows.map(pixel => {
                return pixel.costToWhitePixel;
            });
        });
    }

    /**
     * checks whether new pixel position all into bitmap
     * @param rowIndex: row index of candidate pixel
     * @param columnIndex: column index of candidate pixel
     * @private
     */
    private isNewPixelInMap(rowIndex: number, columnIndex: number): boolean {
        return rowIndex >= 0 && columnIndex >= 0 && rowIndex <= this.rowMaxIndex && columnIndex <= this.columnMaxIndex;
    }

    /**
     * get neighbour pixels of the pixel sent as parameter
     * checking whether is hit already while detecting neighbours
     * @param pixel
     * @private
     */
    private getNeighbourPixels(pixel: Pixel): Pixel[] {
        const neighbours: Pixel[] = [];

        /** Searching possible neighbour each direction */
        for (const direction in this.directions) {
            const newRowIndex = pixel.row + this.directions[direction][0];
            const newColumnIndex = pixel.column + this.directions[direction][1];

            /** Checkin new pixel value in bitmap */
            if (this.isNewPixelInMap(newRowIndex, newColumnIndex)) {
                const neighbour = this._input[newRowIndex][newColumnIndex];
                /** Checkin new pixel is already hit */
                if (!neighbour.isHit) {
                    neighbours.push(neighbour);
                }
            }
        }
        return neighbours;
    }

    /**
     * print input of computation as table
     * @private
     */
    private printInput() {
        console.log('Input table:');
        console.table(this.input.map(rows => {
            return rows.map(p => p.color);
        }));
    }

    /**
     * print output of computation as table
     * @private
     */
    public printOutput() {
        this.printInput();
        console.log('output table:');
        console.table(this._output);
    }


    /**
     * gets highest index of row items array
     */
    get rowMaxIndex(): number {
        return this._reader.getHeightOfBitmap - 1;
    }

    /**
     * gets highest index of column items array
     */
    get columnMaxIndex(): number {
        return this._reader.getWidthOfBitmap - 1;
    }

    /**
     * gets input of output and output of reader
     */
    get input(): Bitmap<Pixel> {
        return this._input;
    }

    /**
     * gets output of computation
     */
    get output(): Bitmap<number> {
        return this._output;
    }

    /**
     * gets reader instance
     */
    get reader(): InputFileReader {
        return this._reader;
    }
}
