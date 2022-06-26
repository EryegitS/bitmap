import { InputFileReader } from '../src/input-file-reader';
import * as path from 'path';
import { Pixel } from '../src/models/pixel';
import { PixelValues } from '../src/models/pixel-values';

describe('Tests of Input File Reader', () => {
    // beforeAll(() => {
    //
    // });
    it('should read input file successfully', () => {
        // given
        const filePath = path.resolve(__dirname, 'files/success3x4.txt');
        const reader = new InputFileReader();
        const input = [
            [0, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 1, 1, 0]
        ];

        // when
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

        // then
        reader.interface.on('close', () => {
            const bitmap = reader.getBitmap();
            const pixelValues = bitmap.map(rows => {
                return rows.map(pixel => pixel.color);
            });

            expect(reader.testCaseCount).toBe(1);
            expect(reader.getHeightOfBitmap).toBe(3);
            expect(reader.getWidthOfBitmap).toBe(4);
            expect(pixelValues).toEqual(input);
            expect(reader.whitePixels.length).toEqual(whitePixelList.length);
            reader.whitePixels.map((pixel, index) => {
                expect(pixel.costToWhitePixel).toEqual(whitePixelList[index].costToWhitePixel);
                expect(pixel.color).toEqual(whitePixelList[index].color);
                expect(pixel.row).toEqual(whitePixelList[index].row);
                expect(pixel.column).toEqual(whitePixelList[index].column);
            });

        });
    });
});
