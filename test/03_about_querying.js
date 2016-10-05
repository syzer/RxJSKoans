let Rx = require('rx'),
    Observable = Rx.Observable,
    EventEmitter = require('events').EventEmitter

//noinspection JSAnnotator
QUnit.module('Querying')

let __ = 'Fill in the blank'

test('Basic querying', () => {
    let strings = []
    let numbers = Observable.range(1, 100)

    numbers
        .filter(x => x % 11 === 0)
        .map(x => x.toString())
        .toArray()
        .subscribe(strings.push.bind(strings))

    equal('11,22,33,44,55,66,77,88,99', strings.toString())
})

test('Querying over events', () => {
    let results = 0

    let e = new EventEmitter()
    Observable.fromEvent(e, 'click')
        .filter(click => click.x === click.y)
        .map(click => click.x + click.y)
        .subscribe(x => results = x)

    e.emit('click', {x: 100, y: 50})
    e.emit('click', {x: 75, y: 75})
    e.emit('click', {x: 40, y: 80})

    equal(results, 150)
})

test('Buffering with count and skip', () => {
    let results = []
    Observable.range(1, 10)
        .bufferWithCount(5)
        .subscribe(results.push.bind(results))

    equal('12345', results[0].join(''))
    equal('678910', results[1].join(''))
})
