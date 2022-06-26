import { createReadStream } from 'fs';
import { createInterface, Interface } from 'readline';
import { Bitmap } from './models/bitmap';
import { BadDataException } from './exceptions/bad-data-exception';
import { Pixel } from './models/pixel';
import { PixelValues } from './models/pixel-values';

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
        this.testCaseCount = Number(line.trim());
      } else if (counter === 1) {
        this.sizeOfBitmap = line.trim().split(' ').map(Number);
      } else {
        const rowIndex = counter - 2;
        this.prepareBitmap(line.trim().split('').map(Number), rowIndex);
      }
      counter++;
    });
  }

  private prepareBitmap(values: number[], rowIndex) {
    // TODO validation
    this.bitmap[rowIndex] = [];
    if (values.length !== this.getWidthOfBitmap()) throw new BadDataException(values);
    values.forEach((value, columnIndex) => {
      const pixel = {
        column: columnIndex,
        row: rowIndex,
        color: value,
      } as Pixel;
      if (pixel.color === PixelValues.White) this.addWhitePixelsToList(pixel);
      this.bitmap[rowIndex].push(pixel);
    });
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
