// ABOUT.
// The current game state is exposed as a global variable named gameState.
// You have 100ms to do all of your calculations.

function processGameTick() {
    return {
        command: 'shoot',
        direction: Math.random() * 2 * Math.PI
    };
}

processGameTick();