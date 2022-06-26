import * as minimist from 'minimist';
import { BitmapProcessor } from './bitmap-processor';
import { InputFlagNotUsedException } from './exceptions/input-flag-not-used-exception';

(async function start() {
    try {
        /**
         *  parsing command-line arguments
         */
        const argv = minimist(process.argv.slice(2));
        if (!argv.input)
            throw new InputFlagNotUsedException();
        const bitmapProcessor = new BitmapProcessor();
        await bitmapProcessor.readInputFile(argv.input);
        bitmapProcessor.printOutput();
    } catch (e) {
        console.error(`Application stopped working!. Error: ${e.message}`);
    }
})();
