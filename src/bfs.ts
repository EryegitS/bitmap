import { InputFileReader } from './input-file-reader';
import { Bitmap } from './models/bitmap';
import { Pixel } from './models/pixel';
import { Direction } from './models/direction';

export class BreadthFirstSearch {
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
      this.output = this.calculate();
      this.printOutput();
    });
  }

  private isNewPixelInMap(rowIndex: number, columnIndex: number): boolean {
    return rowIndex >= 0 && columnIndex >= 0 && rowIndex <= this.rowMaxIndex && columnIndex <= this.columnMaxIndex;
  }

  private getNeighbourPixels(pixel: Pixel): Pixel[] {
    const neighbours: Pixel[] = [];
    for (const direction in this.directions) {
      const newRowIndex = pixel.row + this.directions[direction][0];
      const newColumnIndex = pixel.column + this.directions[direction][1];
      if (this.isNewPixelInMap(newRowIndex, newColumnIndex)) {
        // console.log(`Direction: ${direction};
        // \nOldRow: ${pixel.row}; OldColumn: ${pixel.column};
        // \nNewRow: ${newRowIndex}; NewColumn: ${newColumnIndex}
        // `);
        const neighbour = this.input[newRowIndex][newColumnIndex];
        if (!neighbour.isHit) {
          neighbours.push(neighbour);
          // console.log('neighbour:', neighbour);
        }
      }
    }
    return neighbours;
  }

  private calculate(): Bitmap<number> {
    /* White pixels will be origin pixels. So defined qu. according to distance from them I can set black points */
    const queue: Pixel[] = this.reader.whitePixels.map(white => {
      white.costToWhitePixel = 0;
      white.isHit = true;
      return white;
    });

    while (queue.length > 0) {
      const pixel: Pixel = queue.shift();
      const neighbours = this.getNeighbourPixels(pixel);
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

  get rowMaxIndex() {
    return this.reader.getHeightOfBitmap() - 1;
  }

  get columnMaxIndex() {
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
