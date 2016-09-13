/**
 * nodeCleanup() installs a function that performs cleanup activities just
 * before the node process exits. The cleanup function runs when the process
 * exits normally, when the user presses ctrl-C, and when an exception is
 * uncaught. The caller may specify the termination messages to use.
 *
 * nodeCleanup() also ensures that ctrl-C is handled gracefully in contexts
 * that already have exit handlers installed, such as Node Express. To
 * receive just this benefit, the caller need not provide a cleanup handler.
 *
 * This code was borrowed and modified from CanyonCasa's answer to a
 * stackoverflow question. I found the code necessary for all my node
 * projects. See the stackoverflow answer for example usage:
 * http://stackoverflow.com/a/21947851/650894
 *
 * @param cleanupHandler A function that performs the final cleanup of
 *      resources before the node process exits. The function may write to
 *      stderr and stdout. It takes no parameters and can't abort the exit.
 *      The handler is optional, defaulting to a function that does nothing.
 * @param messages An optional object mapping any of the keys `ctrl_C` and
 *      `uncaughtException` to the message strings that output to stderr.
 *      Set a message to the empty string '' to prevent output to stderr
 *      for its case. Default messages are provided omitted messages.
 */

module.exports = function nodeCleanup(cleanupHandler, messages) {

    messages = messages || {};
    if (typeof messages.ctrl_C !== 'string')
        messages.ctrl_C = '[ctrl-C]';
    if (typeof messages.uncaughtException !== 'string')
        messages.uncaughtException = 'Uncaught exception...';

    // attach user callback to the process event emitter.
    // if no callback, it will still exit gracefully on Ctrl-C
    cleanupHandler = cleanupHandler || noOp;
    process.on('cleanup', cleanupHandler);

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
};

function noOp() {}; // for just the benefit of graceful SIGINTs
