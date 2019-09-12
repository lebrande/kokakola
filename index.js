import { fromEvent } from 'rxjs';

const buttons = document.querySelectorAll('.coin');

const coin$ = fromEvent(buttons, 'click');

coin$.subscribe((e) => console.log(e));