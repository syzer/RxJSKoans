let Rx = require('rx'),
    Observable = Rx.Observable,
    Subject = Rx.Subject

//noinspection JSAnnotator
QUnit.module('Advanced Streams')

let __ = 'Fill in the blank'

test('Merging', () => {
    let easy = []
    let you = Observable.of(1, 2, 3)
    let me = Observable.of('A', 'B', 'C')
    you.merge(me).subscribe(easy.push.bind(easy))
    equal(easy.join(' '), '1 A 2 B 3 C')
})

test('Merging events', () => {
    let first = []
    let both = []

    let s1 = new Subject()
    let s2 = new Subject()

    s1.subscribe(first.push.bind(first))
    s1.merge(s2).subscribe(both.push.bind(both))

    s1.onNext('I')
    s1.onNext('am')
    s2.onNext('nobody.')
    s2.onNext('Nobody')
    s2.onNext('is')
    s1.onNext('perfect.')

    equal('I am nobody. Nobody is perfect.', both.join(' '))
    equal('I am perfect.', first.join(' '))
})

test('Splitting up', () => {
    let oddsAndEvens = []
    let numbers = Observable.range(1, 9)
    let split = numbers.groupBy(n => n % 2)
    split.subscribe(group =>
        group.subscribe((n) => {
            oddsAndEvens[group.key] || (oddsAndEvens[group.key] = '')
            oddsAndEvens[group.key] += n
        })
    )

    equal('2468', oddsAndEvens[0])
    equal('13579', oddsAndEvens[1])
})

test('Need to subscribe immediately when splitting', () => {
    let averages = [0, 0]
    let numbers = Observable.of(22, 22, 99, 22, 101, 22)
    let split = numbers.groupBy(n => n % 2)

    split.subscribe(g =>
        g.average().subscribe(a => averages[g.key] = a)
    )

    equal(22, averages[0])
    equal(100, averages[1])
})

test('Multiple subscriptions', () => {
    let numbers = new Subject()
    let sum = 0
    let average = 0

    numbers.sum().subscribe(n => sum = n)
    numbers.onNext(1)
    numbers.onNext(1)
    numbers.onNext(1)
    numbers.onNext(1)
    numbers.onNext(1)

    numbers.average().subscribe(n => average = n)
    numbers.onNext(2)
    numbers.onNext(2)
    numbers.onNext(2)
    numbers.onNext(2)
    numbers.onNext(2)

    numbers.onCompleted()

    equal(15, sum)
    equal(2, average)
})
