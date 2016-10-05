let Rx = require('rx'),
    Observable = Rx.Observable,
    Subject = Rx.Subject,
    Range = require('../util/range')

// QUnit.module('Observable Streams')

let __ = 'Fill in the blank'

test('simple subscription', function () {
    Observable.just(42).subscribe((x) => {
        equal(x, 42)
    })
})

test('what comes in goes out', function () {
    Observable.just(101).subscribe((x) => {
        equal(x, 101)
    })
})

// Which interface Rx apply? (hint: what does "just()" return)
test('this is the same as an event stream', function () {
    let events = new Subject()
    events.subscribe((x) => {
        equal(37, x)
    })
    events.onNext(37)
})

// What is the relationship between "this is the same as an event stream" and "simple subscription"?
test('how event streams relate to observables', function () {
    let observableResult = 1
    Observable.just(73).subscribe((x) => {
        observableResult = x
    })

    let eventStreamResult = 1
    let events = new Subject()
    events.subscribe((x) => {
        eventStreamResult = x
    })
    events.onNext(73)

    equal(observableResult, eventStreamResult)
})

// What does Observable.just() map to for a Subject?
test('event streams have multiple results', function () {
    let eventStreamResult = 0
    let events = new Subject()
    events.subscribe(x => {
        eventStreamResult += x
    })

    events.onNext(10)
    events.onNext(7)

    equal(17, eventStreamResult)
})

// What does Observable.just() map to for a Subject?
test('simple return', function () {
    let received = ''
    Observable.just('foo').subscribe((x) => {
        received = x
    })

    equal('foo', received)
})

test('the last event', function () {
    let received = ''
    let names = ['foo', 'bar']
    Observable.from(names).subscribe((x) => {
        received = x
    })

    equal('bar', received)
})

test('everything counts', function () {
    let received = 0
    let numbers = [3, 4]
    Observable.from(numbers).subscribe((x) => {
        received += x
    })

    equal(7, received)
})

test('this is still an event stream', function () {
    let received = 0
    let numbers = new Subject()
    numbers.subscribe((x) => {
        received += x
    })

    numbers.onNext(10)
    numbers.onNext(5)

    equal(15, received)
})

// LOL
test('all events will be received', function () {
    let received = 'Working '
    let numbers = Range.create(9, 5)

    Observable.from(numbers).subscribe((x) => {
        received += x
    })

    equal('Working 98765', received)
})

test('do things in the middle', function () {
    let status = []
    let daysTilTest = Observable.from(Range.create(4, 1))

    daysTilTest.tap((d) => {
        status.push(d + '=' + (d === 1 ? 'Study Like Mad' : 'Party'))
    }).subscribe()

    equal('4=Party,3=Party,2=Party,1=Study Like Mad', status.toString())
})

test('nothing listens until you subscribe', function () {
    let sum = 0,
        numbers = Observable.from(Range.create(1, 10)),
        observable = numbers.tap((n) => {
            sum += n
        })

    equal(0, sum)
    observable.subscribe()

    equal(1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10, sum)
})

test('events before you subscribe do not count', function () {
    let sum = 0,
        numbers = new Subject(),
        observable = numbers.tap((n) => {
            sum += n
        })

    numbers.onNext(1)
    numbers.onNext(2)

    observable.subscribe()

    numbers.onNext(3)
    numbers.onNext(4)

    equal(7, sum)
})

test('events after you unsubscribe dont count', function () {
    let sum = 0,
        numbers = new Subject(),
        observable = numbers.tap((n) => {
            sum += n
        }),
        subscription = observable.subscribe()

    numbers.onNext(1)
    numbers.onNext(2)

    subscription.dispose()

    numbers.onNext(3)
    numbers.onNext(4)

    equal(3, sum)
})

test('events while subscribing', function () {
    let received = [],
        words = new Subject(),
        observable = words.tap(received.push.bind(received))

    words.onNext('Peter')
    words.onNext('said')

    let subscription = observable.subscribe()

    words.onNext('you')
    words.onNext('look')
    words.onNext('pretty')

    subscription.dispose()

    words.onNext('ugly')

    equal('you look pretty', received.join(' '))
})
