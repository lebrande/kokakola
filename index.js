import { fromEvent, of, combineLatest } from 'rxjs';
import { filter, map, scan, startWith, withLatestFrom, repeat, takeWhile, pairwise, tap } from 'rxjs/operators';

const buttons = document.querySelectorAll('.coin');
const creditDisplay = document.getElementById('credit');
const chargeDisplay = document.getElementById('charge');
const changeDisplay = document.getElementById('change');
const machine = document.getElementById('machine');

const coin$ = fromEvent(buttons, 'click').pipe(
  map((e) => +e.currentTarget.innerText),
);

const charge$ = of(880);

const credit$ = coin$.pipe(
  startWith(0),
  scan((credit, coin) => credit + coin, 0),
  pairwise(),
  startWith([0, 0]),
  withLatestFrom(charge$),
  takeWhile(([[credit], charge]) => credit < charge),
  map(([[, credit]]) => credit),
  repeat(),
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
    if (credit > charge) {
      return credit - charge;
    }
    return 0;
  }),
);

credit$.subscribe((credit) => {
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
  }, 500);
});
