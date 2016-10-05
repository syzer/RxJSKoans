let Rx = require('rx'),
    Observable = Rx.Observable,
    Subject = Rx.Subject,
    Range = require('../util/range')

//noinspection JSAnnotator
QUnit.module('Composable Observations')

let __ = 'Fill in the blank'

test('composable add', () => {
    let received = 0,
        numbers = [10, 100, 1000]

    Observable.from(numbers)
        .sum()
        .subscribe(x => {
            received = x
        })

    equal(1110, received)
})

test('composable before and after', () => {
    let names = Range.create(1, 6),
        a = '',
        b = ''

    Observable.from(names)
        .tap(n => a += n)
        .filter(n => n % 2 === 0)
        .tap(n => b += n)
        .subscribe()

    equal('123456', a)
    equal('246', b)
})

test('we wrote this', () => {
    let received = [],
        names = ['Bart', 'Marge', 'Wes', 'Linus', 'Erik', 'Matt']

    Observable.from(names)
        .filter(n => n.length <= 4)
        .subscribe(received.push.bind(received))

    equal('Bart,Wes,Erik,Matt', received)
})

test('converting events', () => {
    let received = '',
        names = ['wE', 'hOpE', 'yOU', 'aRe', 'eNJoyIng', 'tHiS']

    Observable.from(names)
        .map(x => x.toLocaleLowerCase())
        .subscribe(x => {
            received += x + ' '
        })

    equal('we hope you are enjoying this ', received)
})

test('create a more relevant stream', () => {
    let received = '',
        mouseXMovements = [100, 200, 150],
        relativemouse = Observable.from(mouseXMovements)
            .map(x => x - 50)

    relativemouse.subscribe(x => {
        received += x + ', '
    })

    equal('50, 150, 100, ', received)
})

test('checking everything', () => {
    let received = null,
        names = [2, 4, 6, 8]

    Observable.from(names)
        .every(x => x % 2 === 0)
        .subscribe(x => {
            received = x
        })

    equal(true, received)
})

test('composition means the sum is greater than the parts', () => {
    let received = 0,
        numbers = Observable.range(1, 10)

    numbers.filter(x => x > 8)
        .sum()
        .subscribe(x => {
            received = x
        })

    equal(19, received)
})
