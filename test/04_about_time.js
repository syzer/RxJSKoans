let Rx = require('rx'),
    Observable = Rx.Observable,
    Subject = Rx.Subject,
    Scheduler = Rx.Scheduler

//noinspection JSAnnotator
QUnit.module('Time')

let __ = 'Fill in the blank'

asyncTest('launching an event via a scheduler', () => {
    let state = null
    let received = ''
    let delay = 500 // Fix this value
    Scheduler.default.scheduleFuture(state, delay, (scheduler, state) => {
        received = 'Finished'
    })

    setTimeout(() => {
        start()
        equal('Finished', received)
    }, 500)
})

asyncTest('launching an event in the future', () => {
    let received = null
    let time = 500

    let people = new Subject()
    people.delay(time).subscribe(x => received = x)
    people.onNext('Godot')

    setTimeout(() => {
        equal('Godot', received)
        start()
    }, 500)
})

asyncTest('a watched pot', () => {
    let received = ''
    let delay = 500
    let timeout = 600
    let timeoutEvent = Observable.just('Tepid')

    Observable
        .just('Boiling')
        .delay(delay)
        .timeout(timeout, timeoutEvent)
        .subscribe(x => {
            received = x
        })

    setTimeout(() => {
        equal(received, 'Boiling')
        start()
    }, 500)
})

asyncTest('you can place a time limit on how long an event should take', () => {
    let received = []
    let timeout = 2000
    let timeoutEvent = Observable.just('Tepid')
    let temperatures = new Subject()

    temperatures.timeout(timeout, timeoutEvent).subscribe(received.push.bind(received))

    temperatures.onNext('Started')

    setTimeout(() => {
        temperatures.onNext('Boiling')
    }, 3000)

    setTimeout(() => {
        equal(__, received.join(', '))
        start()
    }, 4000)
})

asyncTest('debouncing', () => {
    expect(1)

    let received = []
    let events = new Subject()
    events.debounce(100).subscribe(received.push.bind(received))

    events.onNext('f')
    events.onNext('fr')
    events.onNext('fro')
    events.onNext('from')

    setTimeout(() => {
        events.onNext('r')
        events.onNext('rx')
        events.onNext('rxj')
        events.onNext('rxjs')

        setTimeout(() => {
            equal(__, received.join(' '))
            start()
        }, 120)
    }, 120)
})

asyncTest('buffering', () => {
    let received = []
    let events = new Subject()
    events.bufferWithTime(100)
        .map(function (c) {
            return c.join('')
        })
        .subscribe(received.push.bind(received))

    events.onNext('R')
    events.onNext('x')
    events.onNext('J')
    events.onNext('S')

    setTimeout(() => {
        events.onNext('R')
        events.onNext('o')
        events.onNext('c')
        events.onNext('k')
        events.onNext('s')

        setTimeout(() => {
            equal(__, received.join(' '))
            start()
        }, 120)
    }, 120)
})

asyncTest('time between calls', () => {
    let received = []
    let events = new Subject()

    events.timeInterval()
        .filter(function (t) {
            return t.interval > 100
        })
        .subscribe(function (t) {
            received.push(t.value)
        })

    events.onNext('too')
    events.onNext('fast')

    setTimeout(() => {
        events.onNext('slow')

        setTimeout(() => {
            events.onNext('down')

            equal(__, received.join(' '))
            start()
        }, 120)
    }, 120)
})

asyncTest('results can be ambiguous timing', () => {
    let results = 0
    let fst = Observable.timer(400).map(-1)
    let snd = Observable.timer(500).map(1)

    fst.amb(snd).subscribe(function (x) {
        results = x
    })

    setTimeout(() => {
        equal(results, __)
        start()
    }, 600)
})
