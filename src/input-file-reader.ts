import {createReadStream} from 'fs';
import {createInterface, Interface} from 'readline';
import {Bitmap} from './models/types';
import {BadDataException} from './exceptions/bad-data-exception';
import {Pixel} from './models/pixel';
import {PixelValues} from './models/pixel-values';
import {WhitePixelNotFoundException} from "./exceptions/white-pixel-not-found-exception";
import {
    BitmapColumnCountValidation,
    BitmapRowCountValidation,
    CaseCountValidation,
    PixelValueValidation
} from './models/validations';
import * as Joi from 'joi';

export class InputFileReader {
    private testCaseCount: number;
    private sizeOfBitmap: number[];
    private bitmap: Bitmap<Pixel> = [];
    private readerInterface: Interface;
    public whitePixels: Pixel[] = [];

    /**
     * parsing input file line by line
     * there are some logic according to line number
     * validating line: there are different validation rules according to the line number
     * @param filePath: path of input file
     */
    public readInputFile(filePath) {
        this.readerInterface = createInterface(createReadStream(filePath));
        let counter = 0;
        this.readerInterface.on('line', (line: string) => {
            if (!counter) {
                const caseCount = Number(line.trim());
                this.validateNumberValues(CaseCountValidation, caseCount);
                this.testCaseCount = caseCount;
            } else if (counter === 1) {
                const sizeOfBitmap = line.trim().split(' ').map(Number);
                this.validateNumberValues(BitmapRowCountValidation, sizeOfBitmap[0]);
                this.validateNumberValues(BitmapColumnCountValidation, sizeOfBitmap[1]);
                this.sizeOfBitmap = sizeOfBitmap
            } else {
                const rowIndex = counter - 2;
                this.createBitmap(line.trim().split('').map(Number), rowIndex);
            }
            counter++;
        });
        this.readerInterface.on('close', () => {
            this.validateBitmapData();
        });
    }

    /**
     * validating bitmap data
     * @private
     */
    private validateBitmapData() {
        /** Checkin row count of input */
        if (this.bitmap.length !== this.getHeightOfBitmap())
            throw new BadDataException('row count of input');

        /** Checkin column count of input */
        this.bitmap.forEach((rows, index) => {
            if (rows.length !== this.getWidthOfBitmap())
                throw new BadDataException(`column count at line ${this.getLineNumberByIndex(index)}`);
        })

        /** Checkin white pixel count of input */
        if (!this.whitePixels.length)
            throw new WhitePixelNotFoundException();
    }

    /**
     * using for validation of number values with related joi schema
     * @param validation: Joi number validation ruleset
     * @param value which should be validated
     * @private
     */
    private validateNumberValues(validation: Joi.NumberSchema, value: number): void {
        const {error} = validation.validate(value);
        if (error) throw new Error(error.message);
    }

    /**
     * creating bitmap by input file values and row and column index
     * @param values: color values of pixel
     * @param rowIndex: index of row in bitmap array
     * @private
     */
    private createBitmap(values: number[], rowIndex) {
        this.bitmap[rowIndex] = [];
        if (values.length !== this.getWidthOfBitmap())
            throw new BadDataException(`column count at line ${this.getLineNumberByIndex(rowIndex)}`);
        values.forEach((value, columnIndex) => {
            this.validateNumberValues(PixelValueValidation, value)
            const pixel = {
                column: columnIndex,
                row: rowIndex,
                color: value,
            } as Pixel;
            if (pixel.color === PixelValues.White) this.addWhitePixelsToList(pixel);
            this.bitmap[rowIndex].push(pixel);
        });
    }

    /**
     * adding white pixel a list that will be used when it's needed
     * @param pixel
     * @private
     */
    private addWhitePixelsToList(pixel: Pixel) {
        this.whitePixels.push(pixel);
    }

    /**
     *  get created bitmap by input file
     */
    public getBitmap(): Bitmap<Pixel> {
        return this.bitmap;
    }

    /**
     * get height of bitmap
     */
    public getHeightOfBitmap(): number {
        return this.sizeOfBitmap[0];
    }

    /**
     * get width of bitmap
     */
    public getWidthOfBitmap(): number {
        return this.sizeOfBitmap[1];
    }

    /**
     * Get reader interface
     */
    get interface(): Interface {
        return this.readerInterface;
    }

    /**
     * get line number of row index
     * @param index
     * @private
     */
    private getLineNumberByIndex(index: number): number {
        return index + 3
    }

}
