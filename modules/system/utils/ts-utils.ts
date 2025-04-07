/**
 * Example TypeScript utility functions
 * This file demonstrates how TypeScript can be used alongside existing JavaScript
 */

/**
 * Interface for a simple result object with typed properties
 */
export interface Result<T> {
	success: boolean;
	data?: T;
	error?: string;
}

/**
 * Type-safe function to create a success result
 * @param data The data to return
 * @returns A success result object with the provided data
 */
export function success<T>(data: T): Result<T> {
	return {
		success: true,
		data,
	};
}

/**
 * Type-safe function to create an error result
 * @param error The error message
 * @returns An error result object with the provided message
 */
export function error<T>(error: string): Result<T> {
	return {
		success: false,
		error,
	};
}

/**
 * A typed wrapper for Foundry's getProperty utility
 * @param object The object to get a property from
 * @param path The path to the property
 * @returns The value at the path, typed as T
 */
export function getTypedProperty<T>(
	object: Record<string, any>,
	path: string
): T | undefined {
	return foundry.utils.getProperty(object, path) as T | undefined;
}

/**
 * A simple debounce function with TypeScript typing
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the function
 */
export function typedDebounce<T extends (...args: any[]) => any>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeout: number | null = null;

	return function (this: any, ...args: Parameters<T>): void {
		const context = this;
		if (timeout !== null) {
			window.clearTimeout(timeout);
		}
		timeout = window.setTimeout(() => {
			fn.apply(context, args);
		}, delay);
	};
}
