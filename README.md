# Bitmap Assignment

### Introduction

There is given a rectangular bitmap of size n\*m. Each pixel of the bitmap is either white or black, but at least one is
white. The pixel in i-th line and j-th column is called the pixel (i,j). The distance between two pixels p1=(i1,j1) and
p2=(i2,j2) is defined as d(p1,p2)=|i1-i2|+|j1-j2|.

The **aims** of the application;

* Read the description of the bitmap from the standard input
* For each pixel, computes the distance to the nearest white
* Writes the results to the standard output

---

### Input File Information

The number of test cases t (1≤t≤1000) is in the first line of input, then t test cases follow separated by an empty
line. In the first line of each test case there is a pair of integer numbers n, m separated by a single space, 1<=n <
=182, 1<=m<=182. In each of the following n lines of the test case exactly one zero-one word of length m, the
description of one line of the bitmap, is written. On the j-th position in the line (i+1), 1 <= i <= n, 1 <= j <= m,
is '1' if, and only if the pixel
(i,j) is white.

```text
1
3 4 
0001
0011
0110
```

### Output Format

```text
3 2 1 0
2 1 0 0
1 0 0 1
```

---

### Flow

* The application is getting input file and parsing it to create a bitmap with provided information.
* After creation of bitmap, computing the distance to the nearest white pixel.
* After all computing process is completed, printing output to console.

---

### Setup

* Before start the application, you need to install [Node.js](https://nodejs.org/en/download/).

* Then install all dependencies via npm:

```shell
npm install
```

### Running Configuration

* Build the app:

```shell
npm run build
```

Before start program you have to point input file location by a flag in run command.

|       Flag        | Example | Description                   |
|-------------------|---------|-------------------------------|
| `--input`         |./test-cases/example1.txt| input file that will be parsed     |

###### Run Script

After installation is completed you are ready to go.

```shell
node dist/start.js --input ./test-cases/example1.txt
```
