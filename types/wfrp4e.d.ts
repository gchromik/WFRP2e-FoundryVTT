/**
 * Type definitions for WFRP4e system
 * These help provide TypeScript support for the WFRP4e system
 */

// Use declaration merging instead of declaring a new namespace
declare global {
	interface Game {
		wfrp4e: {
			/**
			 * Configuration object containing various system settings
			 */
			config: {
				/**
				 * Effect scripts registered with the system
				 */
				effectScripts: Record<string, any>;

				/**
				 * System-specific tables
				 */
				tables: any;

				/**
				 * System-specific utility functions
				 */
				utility: any;

				/**
				 * System-specific status effects
				 */
				statusEffects: any[];

				/**
				 * System-specific weapon properties
				 */
				weaponProperties: Record<string, string>;

				/**
				 * System-specific armor properties
				 */
				armorProperties: Record<string, string>;

				/**
				 * Career skills by career
				 */
				careerSkills: Record<string, string[]>;

				/**
				 * Item qualities
				 */
				qualities: Record<string, string>;

				/**
				 * Item flaws
				 */
				flaws: Record<string, string>;
			};

			/**
			 * Roll functions
			 */
			rolls: {
				/**
				 * Opposed test function
				 */
				opposedTest: (options: any) => Promise<any>;
			};

			/**
			 * Postprocessors for rolls
			 */
			postRollActions: Record<string, (test: any) => void>;

			// Additional properties from wfrp4e-custom.d.ts
			utility: any;
			tables: any;
			chat: any;
			audio: any;
			backend: any;
			migration: any;
			tagManager: any;
			effectScripts: Record<string, any>;
		};
	}
}

// Additional interfaces for WFRP4e Actor and Item data
interface ActorDataWFRP {
	characteristics: {
		ws: { value: number; initial: number; advances: number };
		bs: { value: number; initial: number; advances: number };
		s: { value: number; initial: number; advances: number };
		t: { value: number; initial: number; advances: number };
		i: { value: number; initial: number; advances: number };
		ag: { value: number; initial: number; advances: number };
		dex: { value: number; initial: number; advances: number };
		int: { value: number; initial: number; advances: number };
		wp: { value: number; initial: number; advances: number };
		fel: { value: number; initial: number; advances: number };
	};
	status: {
		wounds: { value: number; max: number };
		advantage: { value: number; max: number };
		fate: { value: number; max: number };
		fortune: { value: number; max: number };
		corruption: { value: number; max: number };
		sin: { value: number; max: number };
		resolve: { value: number; max: number };
		resilience: { value: number; max: number };
		experience: { value: number; total: number };
	};
}

interface ItemDataWFRP {
	description: {
		type: string;
		value: string;
	};
	gmdescription?: {
		value: string;
	};
	properties?: {
		qualities: { value: string[] };
		flaws: { value: string[] };
	};
}

// Export empty object to make this a module
export {};
