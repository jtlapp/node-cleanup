// tests in which spawned child installs multiple cleanup handlers

var t = require('tap');
var lib = require('./lib/library');

t.test("multiple handlers: normal exit", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: null,
        messages2: null,
        return1: true,
        return2: true,
        exception: false,
        uninstall: false
    }, function (childPID) {
        // no signal
    }, {
        exitReason: 0,
        stdout: "cleanup1 cleanup2",
        stderr: ""
    });
});

t.test("multiple handlers: uncaught exception - default message", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: null,
        messages2: null,
        return1: true,
        return2: true,
        exception: true,
        uninstall: false
    }, function (childPID) {
        // no signal
    }, {
        exitReason: 1,
        stdout: "cleanup1 cleanup2",
        stderr: lib.DEFAULT_EXCEPTION_OUT
    });
});

t.test("multiple handlers: uncaught exception - custom message", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: {
            uncaughtException: "Look! A surprise!"
        },
        messages2: {
            uncaughtException: "Not the surprise you're looking for."
        },
        return1: true,
        return2: true,
        exception: true,
        uninstall: false
    }, function (childPID) {
        // no signal
    }, {
        exitReason: 1,
        stdout: "cleanup1 cleanup2",
        stderr: /^Look! A surprise!/
    });
});

t.test("multiple handlers: child SIGINT - both heeded", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: null,
        messages2: null,
        return1: true,
        return2: true,
        exception: false,
        uninstall: false
    }, function (childPID) {
        process.kill(childPID, 'SIGINT');
    }, {
        exitReason: 'SIGINT',
        stdout: "cleanup1 cleanup2",
        stderr: lib.DEFAULT_SIGINT_OUT
    });
});

t.test("multiple handlers: child SIGINT - first heeded", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: null,
        messages2: null,
        return1: true,
        return2: false,
        exception: false,
        uninstall: false
    }, function (childPID) {
        process.kill(childPID, 'SIGINT');
    }, {
        exitReason: 0,
        stdout: "cleanup1 cleanup2",
        stderr: ""
    });
});

t.test("multiple handlers: child SIGINT - second heeded", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: null,
        messages2: null,
        return1: false,
        return2: true,
        exception: false,
        uninstall: false
    }, function (childPID) {
        process.kill(childPID, 'SIGINT');
    }, {
        exitReason: 0,
        stdout: "cleanup1 cleanup2",
        stderr: ""
    });
});

t.test("multiple handlers: child SIGINT - custom message", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: {
            ctrl_C: "{^C1}"
        },
        messages2: {
            ctrl_C: "{^C2}"
        },
        return1: true,
        return2: true,
        exception: false,
        uninstall: false
    }, function (childPID) {
        process.kill(childPID, 'SIGINT');
    }, {
        exitReason: 'SIGINT',
        stdout: "cleanup1 cleanup2",
        stderr: "{^C1}\n"
    });
});

t.test("multiple handlers: child SIGQUIT", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: null,
        messages2: null,
        return1: true,
        return2: true,
        exception: false,
        uninstall: false
    }, function (childPID) {
        process.kill(childPID, 'SIGQUIT');
    }, {
        exitReason: 'SIGQUIT',
        stdout: "cleanup1 cleanup2",
        stderr: ""
    });
});

t.test("multiple handlers: child SIGTERM", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: null,
        messages2: null,
        return1: true,
        return2: true,
        exception: false,
        uninstall: false
    }, function (childPID) {
        process.kill(childPID, 'SIGTERM');
    }, {
        exitReason: 'SIGTERM',
        stdout: "cleanup1 cleanup2",
        stderr: ""
    });
});

t.test("multiple handlers: child SIGKILL", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: null,
        messages2: null,
        return1: true,
        return2: true,
        exception: false,
        uninstall: false
    }, function (childPID) {
        process.kill(childPID, 'SIGKILL');
    }, {
        exitReason: 'SIGKILL',
        stdout: "",
        stderr: ""
    });
});

t.test("multiple handlers/uninstall: normal child exit", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: null,
        messages2: null,
        return1: true,
        return2: true,
        exception: false,
        uninstall: true
    }, function (childPID) {
        // no signal
    }, {
        exitReason: 0,
        stdout: "",
        stderr: ""
    });
});

t.test("multiple handlers/uninstall: uncaught exception", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: null,
        messages2: null,
        return1: true,
        return2: true,
        exception: true,
        uninstall: true
    }, function (childPID) {
        // no signal
    }, {
        exitReason: 1,
        stdout: "",
        stderr: /tests[\/\\]bin[\/\\]stackable.js/
    });
});

t.test("multiple handlers/uninstall: child SIGINT", function (t) {
    lib.test(t, {
        child: 'stackable',
        handlers: 2,
        messages1: null,
        messages2: null,
        return1: true,
        return2: true,
        exception: false,
        uninstall: true
    }, function (childPID) {
        process.kill(childPID, 'SIGINT');
    }, {
        exitReason: 'SIGINT',
        stdout: "",
        stderr: ""
    });
});
