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

    public readInputFile(filePath) {
        this.readerInterface = createInterface(createReadStream(filePath));
        let counter = 0;
        this.readerInterface.on('line', (line: string) => {
            if (!counter) {
                const caseCount = Number(line.trim());
                this.validate(CaseCountValidation, caseCount);
                this.testCaseCount = caseCount;
            } else if (counter === 1) {
                const sizeOfBitmap = line.trim().split(' ').map(Number);
                this.validate(BitmapRowCountValidation, sizeOfBitmap[0]);
                this.validate(BitmapColumnCountValidation, sizeOfBitmap[1]);
                this.sizeOfBitmap = sizeOfBitmap
            } else {
                const rowIndex = counter - 2;
                this.prepareBitmap(line.trim().split('').map(Number), rowIndex);
            }
            counter++;
        });
        this.readerInterface.on('close', () => {
            this.validateBitmapData();
        });
    }

    private validateBitmapData() {
        if (this.bitmap.length !== this.getHeightOfBitmap()) throw new BadDataException(this.bitmap);
        this.bitmap.forEach(rows => {
            if (rows.length !== this.getWidthOfBitmap()) throw new BadDataException(this.bitmap);
        })
    }

    private validate(validation: Joi.NumberSchema, value: number): void {
        const {error} = validation.validate(value);
        if (error) throw new Error(error.message);
    }

    private prepareBitmap(values: number[], rowIndex) {
        // TODO validation
        this.bitmap[rowIndex] = [];
        if (values.length !== this.getWidthOfBitmap()) throw new BadDataException(values);
        values.forEach((value, columnIndex) => {
            this.validate(PixelValueValidation, value)
            const pixel = {
                column: columnIndex,
                row: rowIndex,
                color: value,
            } as Pixel;
            if (pixel.color === PixelValues.White) this.addWhitePixelsToList(pixel);
            this.bitmap[rowIndex].push(pixel);
        });

        if (!this.whitePixels.length) throw new WhitePixelNotFoundException();
    }

    private addWhitePixelsToList(pixel: Pixel) {
        this.whitePixels.push(pixel);
    }

    public getBitmap(): Bitmap<Pixel> {
        return this.bitmap;
    }

    public getHeightOfBitmap() {
        return this.sizeOfBitmap[0];
    }

    public getWidthOfBitmap() {
        return this.sizeOfBitmap[1];
    }

    get interface() {
        return this.readerInterface;
    }

}
