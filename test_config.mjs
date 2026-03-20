import { getInfernoDifficultyConfig } from './src/inferno_difficulty.js';

const levels = [1, 10, 25, 50, 99];
console.log('--- Verifying outwardPercentage (halved) ---');
levels.forEach(level => {
    const config = getInfernoDifficultyConfig(level);
    console.log(`Level ${level}: ${config.outwardPercentage.toFixed(4)}`);
});
