let Rx = require('rx'),
    Observable = Rx.Observable,
    EventEmitter = require('events').EventEmitter

//noinspection JSAnnotator
QUnit.module('Events')

let __ = 'Fill in the blank'

test('The main event', () => {
    let received = []
    let e = new EventEmitter()
    let subscription = Observable.fromEvent(e, 'change')
        .subscribe(received.push.bind(received))

    e.emit('change', 'R')
    e.emit('change', 'x')
    e.emit('change', 'J')
    e.emit('change', 'S')

    subscription.dispose()

    e.emit('change', '!')

    equal('RxJS', received.join(''))
})
