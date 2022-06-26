import { createReadStream } from 'fs';
import { createInterface, Interface } from 'readline';
import { Bitmap } from './models/types';
import { BadDataException } from './exceptions/bad-data-exception';
import { Pixel } from './models/pixel';
import { PixelValues } from './models/pixel-values';
import { WhitePixelNotFoundException } from './exceptions/white-pixel-not-found-exception';
import {
    BitmapColumnCountValidation,
    BitmapRowCountValidation,
    CaseCountValidation,
    PixelValueValidation,
    isNumberValid
} from './models/validations';

export class InputFileReader {
    private _testCaseCount: number;
    private _sizeOfBitmap: number[];
    private _bitmap: Bitmap<Pixel> = [];
    private _readerInterface: Interface;
    private _whitePixels: Pixel[] = [];

    /**
     * parsing input file line by line
     * there are some logic according to line number
     * validating line: there are different validation rules according to the line number
     * @param filePath: path of input file
     */
    public readInputFile(filePath): Promise<Bitmap<Pixel>> {
        this._readerInterface = createInterface(createReadStream(filePath));
        let counter = 0;
        this._readerInterface.on('line', (line: string) => {
            if (!counter) {
                const caseCount = Number(line.trim());
                isNumberValid(CaseCountValidation, caseCount);
                this._testCaseCount = caseCount;
            } else if (counter === 1) {
                const sizeOfBitmap = line.trim().split(' ').map(Number);
                isNumberValid(BitmapRowCountValidation, sizeOfBitmap[0]);
                isNumberValid(BitmapColumnCountValidation, sizeOfBitmap[1]);
                this._sizeOfBitmap = sizeOfBitmap;
            } else {
                const rowIndex = counter - 2;
                this.createBitmap(line.trim().split('').map(Number), rowIndex);
            }
            counter++;
        });
        return new Promise((resolve, reject) => {
            this._readerInterface.on('close', () => {
                resolve(this._bitmap);
            });
        });

    }

    /**
     * validating bitmap data
     * @private
     */
    private validateBitmapData() {
        /** Checkin row count of input */
        if (this._bitmap.length !== this.getHeightOfBitmap)
            throw new BadDataException('row count of input');

        /** Checkin column count of input */
        this._bitmap.forEach((rows, index) => {
            if (rows.length !== this.getWidthOfBitmap)
                throw new BadDataException(`column count at line ${InputFileReader.getLineNumberByIndex(index)}`);
        });

        /** Checkin white pixel count of input */
        if (!this._whitePixels.length)
            throw new WhitePixelNotFoundException();
    }

    /**
     * creating bitmap by input file values and row and column index
     * @param values: color values of pixel
     * @param rowIndex: index of row in bitmap array
     * @private
     */
    private createBitmap(values: number[], rowIndex) {
        this._bitmap[rowIndex] = [];
        values.forEach((value, columnIndex) => {
            isNumberValid(PixelValueValidation, value);
            const pixel = {
                column: columnIndex,
                row: rowIndex,
                color: value
            } as Pixel;
            if (pixel.color === PixelValues.White) {
                pixel.costToWhitePixel = 0;
                this.addWhitePixelsToList(pixel);
            }
            this._bitmap[rowIndex].push(pixel);
        });
    }

    /**
     * adding white pixel a list that will be used when it's needed
     * @param pixel
     * @private
     */
    private addWhitePixelsToList(pixel: Pixel) {
        this._whitePixels.push(pixel);
    }

    /**
     *  get created bitmap by input file
     */
    public getBitmap(): Bitmap<Pixel> {
        this.validateBitmapData();
        return this._bitmap;
    }

    /**
     * get line number of row index
     * @param index
     * @private
     */
    static getLineNumberByIndex(index: number): number {
        return index + 3;
    }

    /**
     * get width of bitmap
     */
    get getWidthOfBitmap(): number {
        return this._sizeOfBitmap[1];
    }

    /**
     * get height of bitmap
     */
    get getHeightOfBitmap(): number {
        return this._sizeOfBitmap[0];
    }

    /**
     * get reader interface
     */
    get interface(): Interface {
        return this._readerInterface;
    }

    /**
     * get test case count
     */
    get testCaseCount(): number {
        return this._testCaseCount;
    }

    /**
     * get white pixel information
     */
    get whitePixels(): Pixel[] {
        return this._whitePixels;
    }

}
