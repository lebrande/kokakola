import { fromEvent, of, combineLatest } from 'rxjs';
import { filter, map, scan, startWith, withLatestFrom } from 'rxjs/operators';

const buttons = document.querySelectorAll('.coin');
const creditDisplay = document.getElementById('credit');
const chargeDisplay = document.getElementById('charge');
const changeDisplay = document.getElementById('change');
const machine = document.getElementById('machine');
const can = document.getElementById('can');

const coin$ = fromEvent(buttons, 'click').pipe(
  map((e) => +e.currentTarget.innerText),
);

const charge$ = of(880);

const credit$ = coin$.pipe(
  startWith(0),
  withLatestFrom(charge$),
  scan((credit, [coin, charge]) => {
    if (credit > charge) {
      return coin;
    }
    return credit + coin;
  }, 0),
);

const purchase$ = combineLatest(
  credit$,
  charge$,
).pipe(
  filter(([credit, charge]) => credit >= charge),
);

const change$ = combineLatest(
  credit$,
  charge$,
).pipe(
  map(([credit, charge]) => {
    if (credit >= charge) {
      return credit - charge;
    }
    return 0;
  }),
);

const creditDisplay$ = combineLatest(
  credit$,
  charge$,
).pipe(
  map(([credit, charge]) => {
    if (credit >= charge) {
      return 0;
    }
    return credit;
  }),
);

creditDisplay$.subscribe((credit) => {
  creditDisplay.innerText = credit;
});

charge$.subscribe((charge) => {
  chargeDisplay.innerText = charge;
});

change$.subscribe((change) => {
  changeDisplay.innerText = change;
});

purchase$.subscribe(() => {
  machine.classList.add('shake');
  setTimeout(() => {
    machine.classList.remove('shake');
    can.classList.add('pullDown');
  }, 500);
  setTimeout(() => {
    can.classList.remove('pullDown');
  }, 1000);
});
