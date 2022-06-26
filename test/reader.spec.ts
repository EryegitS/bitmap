import { InputFileReader } from '../src/input-file-reader';
import * as path from 'path';
import { Pixel } from '../src/models/pixel';
import { PixelValues } from '../src/models/pixel-values';
import { BadDataException } from '../src/exceptions/bad-data-exception';
import { WhitePixelNotFoundException } from '../src/exceptions/white-pixel-not-found-exception';
import {
    BitmapColumnCountValidation,
    BitmapRowCountValidation,
    CaseCountValidation,
    PixelValueValidation,
    isNumberValid
} from '../src/models/validations';
import { ValidationException } from '../src/exceptions/validation-exception';

describe('Tests of Input File Reader', () => {
    it('should read input file successfully', () => {
        /** given */
        const filePath = path.resolve(__dirname, 'files/success3x4.txt');
        const reader = new InputFileReader();
        const input = [
            [0, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 1, 1, 0]
        ];

        /** when */
        reader.readInputFile(filePath);
        const whitePixelList: Pixel[] = [];
        input.forEach((rows, rowIndex) => {
            rows.forEach((color, columnIndex) => {
                if (color === PixelValues.White) {
                    const pixel = {
                        color,
                        row: rowIndex,
                        column: columnIndex,
                        costToWhitePixel: 0
                    } as Pixel;
                    whitePixelList.push(pixel);
                }
            });
        });

        /** then */

        reader.interface.on('close', () => {
            const bitmap = reader.getBitmap();
            const index = 3;

            // input parameters
            expect(reader.testCaseCount).toBe(1);
            expect(reader.getHeightOfBitmap).toBe(3);
            expect(reader.getWidthOfBitmap).toBe(4);
            expect(InputFileReader.getLineNumberByIndex(index)).toBe(index + 3);

            // pixel of bitmap properties
            bitmap.forEach((rows, rowIndex) => {
                rows.map((pixel, columnIndex) => {
                    expect(pixel.color).toBe(input[rowIndex][columnIndex]);
                    expect(pixel.row).toBe(rowIndex);
                    expect(pixel.column).toBe(columnIndex);
                });
            });

            //white pixel
            expect(reader.whitePixels.length).toBe(whitePixelList.length);
            reader.whitePixels.map((pixel, index) => {
                expect(pixel.costToWhitePixel).toBe(whitePixelList[index].costToWhitePixel);
                expect(pixel.color).toBe(whitePixelList[index].color);
                expect(pixel.row).toBe(whitePixelList[index].row);
                expect(pixel.column).toBe(whitePixelList[index].column);
            });
        });
    });

    it('should throw bad data exception if column information is wrong in input file', () => {
        /** given */
        const filePath = path.resolve(__dirname, 'files/fail-bad-input-data-column.txt');
        const reader = new InputFileReader();

        /** when */
        reader.readInputFile(filePath);

        /** then */
        reader.interface.on('close', () => {
            expect(reader.getBitmap()).toThrow(BadDataException);
            expect(reader.getBitmap()).toThrow('Input data is incorrect. Please check: column count at line 5');
        });
    });

    it('should throw bad data exception if row information is wrong in input file', () => {
        /** given */
        const filePath = path.resolve(__dirname, 'files/fail-bad-input-data-row.txt');
        const reader = new InputFileReader();

        /** when */
        reader.readInputFile(filePath);

        /** then */
        reader.interface.on('close', () => {
            expect(reader.getBitmap()).toThrow(BadDataException);
            expect(reader.getBitmap()).toThrow('Input data is incorrect. Please check: row count of input');
        });
    });

    it('should throw no white pixel exception if there is no white pixel value in input data', () => {
        /** given */
        const filePath = path.resolve(__dirname, 'files/fail-no-white-pixel.txt');
        const reader = new InputFileReader();

        /** when */
        reader.readInputFile(filePath);

        /** then */
        reader.interface.on('close', () => {
            expect(reader.getBitmap()).toThrow(WhitePixelNotFoundException);
            expect(reader.getBitmap()).toThrow('No white pixel found in bitmap');
        });
    });

    it('should throw validation exception if input data is not valid', () => {
        /** given */
        const outOfRangeCaseCount = 1001;
        const outOfRangeRowIndex = 183;
        const outOfRangeColumnIndex = 183;
        const outOfRangePixelValue = 2;

        /** when */

        /** then */
        // out of range case count
        try {
            isNumberValid(CaseCountValidation, outOfRangeCaseCount);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidationException);
        }

        // out of range row count
        try {
            isNumberValid(BitmapRowCountValidation, outOfRangeRowIndex);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidationException);
        }

        // out of range column count
        try {
            isNumberValid(BitmapColumnCountValidation, outOfRangeColumnIndex);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidationException);
        }

        // out of range pixel value
        try {
            isNumberValid(PixelValueValidation, outOfRangePixelValue);
        } catch (e) {
            expect(e).toBeInstanceOf(ValidationException);
        }
    });
});
