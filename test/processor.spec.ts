import * as path from 'path';
import { BitmapProcessor } from '../src/bitmap-processor';
import { Bitmap } from '../src/models/types';

describe('Tests of Bitmap Processor', () => {
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

    it('should compute input bitmap successfully', () => {
        /** given */
        const processor = new BitmapProcessor();
        const filePath = path.resolve(__dirname, 'files/success3x4.txt');
        processor.readInputFile(filePath);

        processor.reader.interface.on('close', () => {
            /** when */
            const processorInput = processor.input.map((rows) => {
                return rows.map((pixel) => pixel.color);
            });

            /** then */
            expect(processorInput).toEqual(input);
            expect(processor.output).toEqual(output);
        });
    });
});
