import { Universe, Cell } from "wasm-game-of-life";
import { memory } from "wasm-game-of-life/wasm_game_of_life_bg"

const CELL_SIZE_PX = 10;
const GRID_COLOR = "#CCCCCC";
const ALIVE_COLOR = "#000000";
const DEAD_COLOR = "#FFFFFF";

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of the cells with a 1px border around each
const canvas = document.getElementById("game-of-life-canvas");
canvas.width = (CELL_SIZE_PX + 1) * width + 1;
canvas.height = (CELL_SIZE_PX + 1) * height + 1;

const context = canvas.getContext("2d");

const renderLoop = () => {
    universe.tick();

    drawGrid();
    drawCells();

    requestAnimationFrame(renderLoop);
};

const drawGrid = () => {
    context.beginPath();
    context.strokeStyle = GRID_COLOR;

    // Vertical lines
    for (let i = 0; i <= width; i++) {
        const currentCol = i * (CELL_SIZE_PX + 1) + 1;
        const top = (CELL_SIZE_PX + 1) * height + 1;

        context.moveTo(currentCol, 0);
        context.lineTo(currentCol, top);
    }

    // Horizontal lines
    for (let j = 0; j <= height; j++) {
        const currentRow = j * (CELL_SIZE_PX + 1) + 1;
        const right = (CELL_SIZE_PX + 1) * width + 1;

        context.moveTo(0, currentRow);
        context.moveTo(right, currentRow);
    }

    context.stroke();
};

const getIndex = (row, column) => {
    return row * width + column;
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    context.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const index = getIndex(row, col);
            const currentCol = col * (CELL_SIZE_PX + 1) + 1;
            const currentRow = row * (CELL_SIZE_PX + 1) + 1;

            context.fillStyle = cells[index] === Cell.Alive ? ALIVE_COLOR : DEAD_COLOR;

            context.fillRect(currentCol, currentRow, CELL_SIZE_PX, CELL_SIZE_PX);
        }
    }

    context.stroke();
};

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);
