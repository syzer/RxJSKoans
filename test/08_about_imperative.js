let Rx = require('rx'),
    Observable = Rx.Observable

//noinspection JSAnnotator
QUnit.module('Imperative')

let __ = 'Fill in the blank'

test('Can make a decision with an if with no else', () => {
    let results = []
    Observable.range(1, 10)
        .flatMap(x => Rx.Observable.if(
            () => x % 2 === 0,
            Observable.just(x)
        ))
        .subscribe(results.push.bind(results))

    equal('246810', results.join(''))
})

test('Can make a decision with an if with an else', () => {
    let results = []
    Observable.range(1, 5)
        .flatMap((x, i) => Rx.Observable.if(
            () => x % 2 === 0,
            Observable.just(x),
            Observable.range(x, i)
        ))
        .subscribe(results.push.bind(results))

    equal('23445678', results.join(''))
})

test('We can make test cases', () => {
    let result = ''

    let cases = {
        'matt': Observable.just(1),
        'erik': Observable.just(2),
        'bart': Observable.just(3),
        'wes': Observable.just(4)
    }

    Observable.just('wes')
        .flatMap(x => Observable.case(
            () => x,
            cases
        ))
        .subscribe(x => result = x)

    equal(4, result)
})

test('We can also have a default case', () => {
    let result = ''

    let cases = {
        'matt': Observable.just(1),
        'erik': Observable.just(2),
        'bart': Observable.just(3),
        'wes': Observable.just(4)
    }

    Observable.just('RxJS')
        .flatMap(x => Observable.case(
            () => x,
            cases,
            Observable.just(5)
        ))
        .subscribe(x => result = x)

    equal(5, result)
})

test('While does something until proven false', () => {
    let i = 0
    let result = []

    let source = Rx.Observable
        .while(
            () => ++i < 3,
            Rx.Observable.just(42)
        )
        .subscribe(result.push.bind(result))

    equal('4242', result.join(''))
})
