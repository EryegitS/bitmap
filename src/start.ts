import * as minimist from 'minimist';
import { BitmapProcessor } from './bitmap-processor';
import { InputFlagNotUsedException } from './exceptions/input-flag-not-used-exception';

(function start() {
    try {
        /**
         *  parsing command-line arguments
         */
        const argv = minimist(process.argv.slice(2));
        if (!argv.input)
            throw new InputFlagNotUsedException();
        const bitmapProcessor = new BitmapProcessor();
        bitmapProcessor.readInputFile(argv.input);
    } catch (e) {
        console.error(`Application stopped working!. Error: ${e.message}`);
    }
})();
