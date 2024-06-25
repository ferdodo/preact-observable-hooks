import { useEffect, useRef, useState } from "preact/hooks";
import type { Observable } from "rxjs";

/**
 * Hook to use an observable as state.
 *
 * @includeExample ./src/use-observable-state.example.ts
 */
export function useObservableState<T>(
	observable: Observable<T>,
	initialValue: T | (() => T)
): T {
	const [state, setState] = useState<T>(initialValue);
	const observableRef = useRef(observable);

	useEffect(() => {
		const subscription = observableRef.current.subscribe(setState);
		return () => subscription.unsubscribe();
	});

	return state;
}
