// Global declarations for Foundry VTT

// Only declare these if they're not already defined by fvtt-types
declare const Hooks: {
	once(hook: string, callback: Function): void;
	on(hook: string, callback: Function): void;
};

declare const CONFIG: any;
declare const game: any;
declare const Actors: any;
declare const Items: any;
declare const ActorSheet: any;
declare const ItemSheet: any;
declare const globalThis: any;
declare const ChatMessage: any;
declare const HandlebarsTemplateCache: any;

// Export empty object to make this a module
export {};
