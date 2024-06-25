import { render, screen } from "@testing-library/preact";
import { html } from "htm/preact";
import { Observable, Subject } from "rxjs";
import { expect, test } from "vitest";
import { useObservableState } from "./use-observable-state";

test("Use the init parameter as first value", () => {
	const subject = new Subject<string>();
	const observable = subject.asObservable();
	const id = Math.random().toString();
	const value = Math.random().toString();

	const TestComponent = () => {
		const state = useObservableState(observable, value);
		return html`<div data-testid=${id}>${state}</div>`;
	};

	render(html`<${TestComponent}><//>`);
	expect(screen.getByTestId(id).textContent).toBe(value);
});

test("Use the latest observed value", async () => {
	const subject = new Subject<string>();
	const observable = subject.asObservable();
	const id = Math.random().toString();
	const value = Math.random().toString();
	const lastValue = Math.random().toString();

	const TestComponent = () => {
		const state = useObservableState(observable, value);
		return html`<div data-testid=${id}>${state}</div>`;
	};

	render(html`<${TestComponent}><//>`);
	subject.next(lastValue);
	await screen.findByText(lastValue);
});

test("Unsubscribe when component unmounts", async () => {
	const subject = new Subject<string>();

	function countSubscriptions<T>(countCallback: (count: number) => void) {
		let subscriptionCount = 0;

		return (source) =>
			new Observable<T>((observer) => {
				subscriptionCount++;
				countCallback(subscriptionCount);

				const subscription = source.subscribe({
					next(value) {
						observer.next(value);
					},
					error(err) {
						observer.error(err);
					},
					complete() {
						observer.complete();
					}
				});

				return () => {
					subscriptionCount--;
					countCallback(subscriptionCount);
					subscription.unsubscribe();
				};
			});
	}

	let subscriptions = 0;

	const observable = subject.pipe(
		countSubscriptions((count) => {
			subscriptions = count;
		})
	);

	const id = Math.random().toString();
	const value = Math.random().toString();

	const TestComponent = () => {
		const state = useObservableState(observable, value);
		return html`<div data-testid=${id}>${state}</div>`;
	};

	const { unmount } = render(html`<${TestComponent}><//>`);

	expect(subscriptions).toBe(1);
	unmount();
	expect(subscriptions).toBe(0);
});
