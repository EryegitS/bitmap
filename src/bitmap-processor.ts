import {InputFileReader} from './input-file-reader';
import {Bitmap} from './models/types';
import {Pixel} from './models/pixel';
import {Direction} from './models/types';

export class BitmapProcessor {
    private reader: InputFileReader;
    private input: Bitmap<Pixel>;
    private output: Bitmap<number>;
    private readonly directions: Direction = {
        east: [0, 1],
        west: [0, -1],
        south: [1, 0],
        north: [-1, 0],
    };

    public readInputFile(filePath: string) {
        this.reader = new InputFileReader();
        this.reader.readInputFile(filePath);
        this.reader.interface.on('close', () => {
            this.input = this.reader.getBitmap();
            this.printInput();
            this.output = this.estimateCosts();
            this.printOutput();
        });
    }

    private isNewPixelInMap(rowIndex: number, columnIndex: number): boolean {
        return rowIndex >= 0 && columnIndex >= 0 && rowIndex <= this.rowMaxIndex && columnIndex <= this.columnMaxIndex;
    }

    private getNeighbourPixels(pixel: Pixel): Pixel[] {
        const neighbours: Pixel[] = [];
        /** Searching possible neighbour each direction */
        for (const direction in this.directions) {
            const newRowIndex = pixel.row + this.directions[direction][0];
            const newColumnIndex = pixel.column + this.directions[direction][1];

            /** Checkin new pixel value in bitmap */
            if (this.isNewPixelInMap(newRowIndex, newColumnIndex)) {
                const neighbour = this.input[newRowIndex][newColumnIndex];
                /** Checkin new pixel is already hit */
                if (!neighbour.isHit) {
                    neighbours.push(neighbour);
                }
            }
        }
        return neighbours;
    }

    private estimateCosts(): Bitmap<number> {
        /**
         *  Basic explanation of the process:
         *  White pixels will be origin while estimating neighbour pixels. So first elements of queue are white pixels.
         *  Firstly finding neighbour pixels and checking their position in bitmap.
         *  Then checking they are already hit. If not, then adding to queue
         *  Afterwards set the cost to reach white by help of previous pixel
         */
        const queue: Pixel[] = this.reader.whitePixels.map(white => {
            white.costToWhitePixel = 0;
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

    get rowMaxIndex(): number {
        return this.reader.getHeightOfBitmap() - 1;
    }

    get columnMaxIndex(): number {
        return this.reader.getWidthOfBitmap() - 1;
    }

    private printInput() {
        console.log('Input table:');
        console.table(this.input.map(rows => {
            return rows.map(p => p.color);
        }));
    }

    private printOutput() {
        console.log('output table:');
        console.table(this.output);
    }

}
