/**
 * Example JavaScript file that imports from a TypeScript module
 * This demonstrates how JS and TS files can be used together
 */

import { success, error, getTypedProperty, typedDebounce } from './utils/ts-utils.js';

/**
 * This method shows how to use TypeScript utility functions from JavaScript
 * Even in JS files, you get the benefit of TypeScript's type checking in your IDE
 */
export function exampleTypedFunctions() {
    // Create a success result
    const successResult = success({ name: "Sword", damage: "1d8" });
    console.log("Success result:", successResult);

    // Create an error result
    const errorResult = error("Item not found");
    console.log("Error result:", errorResult);

    // Use the typed property getter
    const actor = game.actors.contents[0];
    if (actor) {
        const name = getTypedProperty(actor.system, "details.name");
        console.log("Actor name:", name);
    }

    // Use the typed debounce function
    const debouncedFunction = typedDebounce(function (text) {
        console.log("Debounced text:", text);
    }, 300);

    debouncedFunction("Hello world");
}

/**
 * Register this example to be run when the game is ready
 */
Hooks.once('ready', () => {
    // Add a button to the chat to demonstrate the TypeScript functions
    ChatMessage.create({
        content: `
      <div class="ts-demo">
        <h3>TypeScript Demo</h3>
        <p>This message was created by a JavaScript file importing TypeScript utilities.</p>
        <button id="ts-demo-button">Run TS Demo</button>
      </div>
    `
    });

    // Add a hook to listen for the button click
    Hooks.once('renderChatMessage', (message, html) => {
        html.find('#ts-demo-button').click(() => {
            exampleTypedFunctions();
        });
    });
}); 