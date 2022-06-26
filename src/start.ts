import * as minimist from 'minimist';
import { BreadthFirstSearch } from './bfs';

/**
 * Start application
 */
(function start() {
    /**
     *  parsing command-line arguments
     */
    const argv = minimist(process.argv.slice(2));
    const bfs = new BreadthFirstSearch();
    bfs.readInputFile(argv.input);

})();
