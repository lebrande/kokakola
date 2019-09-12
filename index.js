import { fromEvent, of } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';

const buttons = document.querySelectorAll('.coin');
const creditDisplay = document.getElementById('credit');
const chargeDisplay = document.getElementById('charge');

const coin$ = fromEvent(buttons, 'click').pipe(
  map((e) => +e.currentTarget.innerText),
);

const credit$ = coin$.pipe(
  scan((credit, coin) => credit + coin, 0),
  startWith(0),
);

const charge$ = of(880);

credit$.subscribe((credit) => {
  creditDisplay.innerText = credit;
});

charge$.subscribe((charge) => {
  chargeDisplay.innerText = charge;
});