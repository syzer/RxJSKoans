let Rx = require('rx'),
    Observable = Rx.Observable

//noinspection JSAnnotator
QUnit.module('Mapping')

let __ = 'Fill in the blank'

test('flatMap can be a cartesian product', () => {
    let results = []
    Observable.range(1, 3)
        .flatMap((x, i) => Observable.range(__, __))
        .subscribe(results.push.bind(results))

    equal('234', results.join(''))
})

test('flatMapLatest only gets us the latest value', () => {
    let results = []
    Observable.range(1, 3)
        .flatMapLatest(x => Observable.range(x, ___))
        .subscribe(results.push.bind(results))

    equal('12345', results.join(''))
})
