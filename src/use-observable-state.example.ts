import { html } from "htm/preact";
import { type Observable, Subject } from "rxjs";
import { useObservableState } from "./use-observable-state";

const subject = new Subject<string>();
const observable: Observable<string> = subject.asObservable();

export const ExampleComponent = () => {
	const state = useObservableState(observable, "Initial value");
	return html`<div>${state}</div>`;
};
