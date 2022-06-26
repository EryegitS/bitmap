import * as minimist from 'minimist';
import { BitmapProcessor } from './bitmap-processor';


(function start() {
    try {
        /**
         *  parsing command-line arguments
         */
        const argv = minimist(process.argv.slice(2));
        const bitmapProcessor = new BitmapProcessor();
        bitmapProcessor.readInputFile(argv.input);
    } catch (e) {
        console.log(e);
    }

})();
