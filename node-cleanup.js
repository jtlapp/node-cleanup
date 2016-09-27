/**
 * nodeCleanup() installs a function that performs cleanup activities just
 * before the node process exits. The cleanup function runs when the process
 * exits normally, when the user presses ctrl-C, and when an exception is
 * uncaught. The caller may specify the termination messages to use.
 *
 * Call this function multiple times to install multiple cleanup handlers.
 * Only the messages provided with the first call are used.
 *
 * See https://github.com/jtlapp/node-cleanup for more information. Code
 * largely borrowed from http://stackoverflow.com/a/21947851/650894.
 */
 
var installed = false;

module.exports = function nodeCleanup(cleanupHandler, messages) {

    // attach user callback to the process event emitter.
    // if no callback, it will still exit gracefully on Ctrl-C
    cleanupHandler = cleanupHandler || noOp;
    process.on('cleanup', cleanupHandler);
    
    // only install the termination handlers once
    if (!installed) {
        install(messages);
        installed = true;
    }
};

function install(messages) {

    messages = messages || {};
    if (typeof messages.ctrl_C !== 'string')
        messages.ctrl_C = '[ctrl-C]';
    if (typeof messages.uncaughtException !== 'string')
        messages.uncaughtException = 'Uncaught exception...';

    // do app-specific cleaning before exiting
    process.on('exit', function () {
        process.emit('cleanup');
    });

    // catch ctrl+c event and exit normally
    process.on('SIGINT', function () {
        if (messages.ctrl_C !== '')
            process.stderr.write(messages.ctrl_C + "\n");
        process.exit(2);
    });

    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', function(e) {
        if (messages.uncaughtException !== '') {
            process.stderr.write(messages.uncaughtException + "\n");
            process.stderr.write(e.stack + "\n");
        }
        process.exit(99);
    });
}

function noOp() {}; // for just the benefit of graceful SIGINTs
