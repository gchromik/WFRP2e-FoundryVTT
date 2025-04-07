/**
 * Type definitions for the foundry namespace used in Foundry VTT
 * These are supplementary to the official fvtt-types package
 */

// Only include declarations if they don't conflict with fvtt-types
// This file is mainly kept as a reference and for any custom extensions
// your project might need

// Intentionally left empty to avoid conflicts with fvtt-types

declare namespace foundry {
	export namespace utils {
		/**
		 * Gets the value of a property within an object using dot-notation.
		 * @param object The object to traverse
		 * @param path The property path to get
		 * @returns The value at the end of the path, or undefined
		 */
		export function getProperty(
			object: Record<string, any>,
			path: string
		): any;

		/**
		 * Sets the value of a property within an object using dot-notation.
		 * @param object The object to modify
		 * @param path The property path to set
		 * @param value The value to set at the path
		 * @returns The modified object
		 */
		export function setProperty(
			object: Record<string, any>,
			path: string,
			value: any
		): Record<string, any>;

		/**
		 * Merges source data into a target object.
		 * @param original The target object
		 * @param other The source data
		 * @param options Merging options
		 * @returns The merged object
		 */
		export function mergeObject(
			original: Record<string, any>,
			other: Record<string, any>,
			options?: {
				insertKeys?: boolean;
				insertValues?: boolean;
				overwrite?: boolean;
				recursive?: boolean;
				inplace?: boolean;
				enforceTypes?: boolean;
			}
		): Record<string, any>;

		/**
		 * Creates a deep copy of an object.
		 * @param original The object to clone
		 * @returns The cloned object
		 */
		export function deepClone<T>(original: T): T;
	}
}
