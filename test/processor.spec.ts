import * as path from 'path';
import { BitmapProcessor } from '../src/bitmap-processor';
import { Bitmap } from '../src/models/types';

describe('Tests of Bitmap Processor', () => {

    it('should compute 3x4 input bitmap successfully', async () => {
        /** given */
        const processor = new BitmapProcessor();
        const filePath = path.resolve(__dirname, 'files/success3x4.txt');
        await processor.readInputFile(filePath);
        const input = [
            [0, 0, 0, 1],
            [0, 0, 1, 1],
            [0, 1, 1, 0]
        ];
        const output = [
            [3, 2, 1, 0],
            [2, 1, 0, 0],
            [1, 0, 0, 1]
        ] as Bitmap<number>;

        /** when */
        const processorInput = processor.input.map((rows) => {
            return rows.map((pixel) => pixel.color);
        });

        /** then */
        expect(processorInput).toEqual(input);
        expect(processor.output).toEqual(output);
        expect(processor.rowMaxIndex).toEqual(input.length - 1);
        expect(processor.columnMaxIndex).toEqual(input[0].length - 1);
        processor.input.forEach(rows => {
            rows.forEach(pixel => {
                expect(pixel.isHit).toEqual(true);
            });
        });

    });

    it('should compute 1x1 input bitmap successfully', async () => {
        /** given */
        const processor = new BitmapProcessor();
        const filePath = path.resolve(__dirname, 'files/success1x1.txt');
        await processor.readInputFile(filePath);
        const input = [[1]];
        const output = [[0]] as Bitmap<number>;

        /** when */
        const processorInput = processor.input.map((rows) => {
            return rows.map((pixel) => pixel.color);
        });

        /** then */
        expect(processorInput).toEqual(input);
        expect(processor.output).toEqual(output);
    });

    it('should compute 9x9 input bitmap successfully', async () => {
        /** given */
        const processor = new BitmapProcessor();
        const filePath = path.resolve(__dirname, 'files/success9x9.txt');
        await processor.readInputFile(filePath);
        const input = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        const output = [
            [8, 7, 6, 5, 4, 5, 6, 7, 8],
            [7, 6, 5, 4, 3, 4, 5, 6, 7],
            [6, 5, 4, 3, 2, 3, 4, 5, 6],
            [5, 4, 3, 2, 1, 2, 3, 4, 5],
            [4, 3, 2, 1, 0, 1, 2, 3, 4],
            [5, 4, 3, 2, 1, 2, 3, 4, 5],
            [6, 5, 4, 3, 2, 3, 4, 5, 6],
            [7, 6, 5, 4, 3, 4, 5, 6, 7],
            [8, 7, 6, 5, 4, 5, 6, 7, 8]] as Bitmap<number>;

        /** when */
        const processorInput = processor.input.map((rows) => {
            return rows.map((pixel) => pixel.color);
        });

        /** then */
        expect(processorInput).toEqual(input);
        expect(processor.output).toEqual(output);
    });
});
