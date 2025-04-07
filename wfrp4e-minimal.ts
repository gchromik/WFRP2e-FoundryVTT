/**
 * A minimal TypeScript entry point for WFRP4e
 * This serves as a proof of concept for TypeScript integration
 */

// Import our TypeScript utilities
import {
	success,
	error,
	getTypedProperty,
} from "./modules/system/utils/ts-utils.js";
// Import an existing JavaScript module to show interop
import "./modules/system/ts-example.js";

// Basic initialization
Hooks.once("init", function () {
	console.log(
		"Warhammer Fantasy Roleplay 4th Ed: TypeScript Integration Test"
	);

	// Create basic global object if it doesn't exist
	if (!(game as any).wfrp4e) {
		(game as any).wfrp4e = {
			config: {},
			utility: {},
			effectScripts: {},
		};
	}

	// Add our TypeScript utilities to the global object
	(game as any).wfrp4e.tsUtils = {
		success,
		error,
		getTypedProperty,
		getRandomInt,
	};

	// Log success message
	console.log("WFRP4e TypeScript minimal system initialized!");
});

// Simple function with TypeScript typing
export function getRandomInt(min: number, max: number): number {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// This module exports the above function
export default {
	getRandomInt,
};
