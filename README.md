# node-cleanup

installs a cleanup handler that always runs on exiting node

## Installation

```
npm install node-cleanup --save
```

## Usage

nodeCleanup() installs a function that performs cleanup activities just before the node process exits. The cleanup function runs when the process exits normally, when the user presses *ctrl-C*, and when an exception is uncaught. The caller may specify the termination messages to use.

You may call nodeCleanup() multiple times to install multiple cleanup handlers, but only the messages provided with the first call get used.

```js
var nodeCleanup = require('node-cleanup');

nodeCleanup(function () {
    // release resources here before node exits
});
```

nodeCleanup() also ensures that *ctrl-C* is handled gracefully in contexts that already have exit handlers installed, such as Node Express. To receive just this benefit, the caller need not provide a cleanup handler.

By default, `nodeCleanup()` writes "[ctrl-C]" to `stderr` when interrupted and "Uncaught exception..." to `stderr` when an uncaught exception occurs. You may override either or both of these values in a second parameter:

```js
var nodeCleanup = require('node-cleanup');

nodeCleanup(function () {
    // release resources here before node exits
}, { ctrl_C: '^C' });
```

## Reference

`function nodeCleanup(cleanupHandler, messages)`

Install a cleanup handler that reliably runs when node exits. Both parameters are optional. Calling `nodeCleanup()` without a `cleanupHandler` still provides the benefit of ensuring that other installed exit handlers run on *ctrl-C*.

Call this function multiple times to install multiple cleanup handlers. Only the messages provided with the first call are used.

| Param | Description |
| --- | --- |
| cleanupHandler | A function that performs the final cleanup of resources before the node process exits. The function may write to `stderr` and `stdout`. It takes no parameters and can't abort the exit. The handler is optional, defaulting to a function that does nothing. |
| messages | An optional object mapping any of the keys `ctrl_C` and `uncaughtException` to the message strings that output to stderr. Set a message to the empty string `''` to prevent output to `stderr` for its case. Default messages are provided omitted messages. |

## Credit

This code was borrowed and modified from [CanyonCasa](http://stackoverflow.com/users/3319552/canyoncasa)'s answer to a stackoverflow question. I found the code necessary for all my node projects. See [the stackoverflow answer](http://stackoverflow.com/a/21947851/650894) for more examples of use.

