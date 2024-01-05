m = document.getElementById("life").getContext("2d");
document.getElementById("life").width = window.innerWidth;
document.getElementById("life").height = window.innerHeight;


let closestAtom = null;
// Sort out colors over time
const COUNTER_THRESHOLD = 0;
const DISTANCE_THRESHOLD = document.getElementById("distanceSlider").value * Math.random() * 0.5 + 0.5;
const COLOR_DIFFERENCE_THRESHOLD = document.getElementById("thresholdSlider").value * Math.random() * 0.5 + 0.5;
const VX_INCREMENT = document.getElementById("XVelSlider").value * Math.random() * 0.5 + 0.5;
const VY_INCREMENT = document.getElementById("YVelSlider").value * Math.random() * 0.5 + 0.5;
const GRAVITY_CONSTANT = document.getElementById("gravitySlider").value * Math.random() * 0.5 + 0.5;

drawCounter = (counter) => {
    m.fillStyle = "black";
    // make it so that the text isn't drawn over by the atoms
    m.fillRect(0, 0, 500, 500);
    m.fillStyle = "white";
    m.font = "20px Arial";
    m.fillText(`Epoch: ${counter}`, 10, 50);
};

drawGroupedAtoms = (groupedAtoms) => {
    m.fillStyle = "black";
    m.fillRect(0, 0, 0, 0);
    m.fillStyle = "white";
    m.font = "20px Arial";
    m.fillText(`Test: ${groupedAtoms}`, 10, 100);
}


drawTimeStarted = () => {
    m.fillStyle = "black";
    m.fillRect(0, 0, 0, 0);
    m.fillStyle = "white";
    m.font = "20px Arial";
    // right side of the screen
    m.fillText(`Time Started: ${new Date().toLocaleTimeString()}`, innerWidth - 250, 100);
}

draw = (x, y, c, s) => {
    m.fillStyle = c;
    // draw the path the atom took
    if (c === "black") {
        m.fillRect(x, y, s, s);
    } else {
        m.fillRect(x, y, s, s);
    }
};

atoms = [];
atom = (x, y, c) => {
  return { x: x, y: y, vx: 0, vy: 0, color: c };
};

groupedAtoms = [];
groupedAtom = (x, y, c) => {
    return { x: x, y: y, vx: 0, vy: 0, color: c };
};

snapToGrid = (value, gridSize) => {
    return Math.round(value / gridSize) * gridSize;
};

random = () => {
  return Math.random() * innerHeight * 0.8 + 0.9 + innerHeight * 0.1;
};

create = (number, color) => {
  group = [];
  for (let i = 0; i < number; i++) {
    group.push(atom(random(), random(), color));
    atoms.push(group[i]);
  }
  return group;
};


colorDifference = (a, b) => {
    return Math.abs(colorToInt(a.color) - colorToInt(b.color));
};

// Define gravitational rules based on color
let colorRules = {
    // get the value from the sliders defined in the HTML
    "red": (g) => { return -g * document.getElementById("redSlider").value * Math.random() * 0.5 + 0.5; },
    "green": (g) => { return g * document.getElementById("greenSlider").value * Math.random() * 0.5 + 0.5; },
    "blue": (g) => { return -g * document.getElementById("blueSlider").value * Math.random() * 0.5 + 0.5; },
    "yellow": (g) => { return g * document.getElementById("yellowSlider").value * Math.random() * 0.5 + 0.5; },
    "purple": (g) => { return -g * document.getElementById("purpleSlider").value * Math.random() * 0.5 + 0.5; },
    "cyan": (g) => { return g * document.getElementById("cyanSlider").value * Math.random() * 0.5 + 0.5; },
    "white": (g) => { return -g * document.getElementById("whiteSlider").value * Math.random() * 0.5 + 0.5; },
    "grey": (g) => { return g * document.getElementById("greySlider").value * Math.random() * 0.5 + 0.5; },
    "lime": (g) => { return -g * document.getElementById("limeSlider").value * Math.random() * 0.5 + 0.5; },
    "gold": (g) => { return g * document.getElementById("goldSlider").value * Math.random() * 0.5 + 0.5; },
    "brown": (g) => { return -g * document.getElementById("brownSlider").value * Math.random() * 0.5 + 0.5; },
    "magenta": (g) => { return g * document.getElementById("magentaSlider").value * Math.random() * 0.5 + 0.5; }
    
};

// Add a function to convert color names to integers for comparison
colorToInt = (color) => {
    const colorMap = {
        "red": 1,
        "green": 2,
        "blue": 3,
        "yellow": 4,
        "purple": 5,
        "cyan": 6,
        "white": 7,
        "grey": 8,
        "lime": 9,
        "gold": 10,
        "brown": 11,
        "magenta": 12
    };
    return colorMap[color] || 0;
};


// Listen for slider changes and update strength
document.getElementById('yellowSlider').addEventListener('input', function() {
    const sliderValue = parseFloat(this.value) / 100; // Normalize to [0, 1]
    colorRules['yellow'] = g => g * sliderValue;
});

document.getElementById('greenSlider').addEventListener('input', function() {
    const sliderValue = parseFloat(this.value) / 100; // Normalize to [0, 1]
    colorRules['green'] = g => g * sliderValue;
});

document.getElementById('redSlider').addEventListener('input', function() {
    const sliderValue = parseFloat(this.value) / 100; // Normalize to [0, 1]
    colorRules['red'] = g => g * sliderValue;
    // write the value next to the slider
    document.getElementById('redSlider').innerHTML = this.value;
});

document.getElementById('blueSlider').addEventListener('input', function() {
    const sliderValue = parseFloat(this.value) / 100; // Normalize to [0, 1]
    colorRules['blue'] = g => g * sliderValue;
});
document.getElementById('cyanSlider').addEventListener('input', function() {
    const sliderValue = parseFloat(this.value) / 100; // Normalize to [0, 1]
    colorRules['cyan'] = g => g * sliderValue;
});

document.getElementById('purpleSlider').addEventListener('input', function() {
    const sliderValue = parseFloat(this.value) / 100; // Normalize to [0, 1]
    colorRules['purple'] = g => g * sliderValue;
});

document.getElementById('magentaSlider').addEventListener('input', function() {
    const sliderValue = parseFloat(this.value) / 100; // Normalize to [0, 1]
    colorRules['magenta'] = g => g * sliderValue;
});

document.getElementById('whiteSlider').addEventListener('input', function() {
    const sliderValue = parseFloat(this.value) / 100; // Normalize to [0, 1]
    colorRules['white'] = g => g * sliderValue;
});

document.getElementById('limeSlider').addEventListener('input', function() {
    const sliderValue = parseFloat(this.value) / 100; // Normalize to [0, 1]
    colorRules['lime'] = g => g * sliderValue;
});

document.getElementById('goldSlider').addEventListener('input', function() {
    const sliderValue = parseFloat(this.value) / 100; // Normalize to [0, 1]
    colorRules['gold'] = g => g * sliderValue;
});

document.getElementById('brownSlider').addEventListener('input', function() {
    const sliderValue = parseFloat(this.value) / 100; // Normalize to [0, 1]
    colorRules['brown'] = g => g * sliderValue;
});

document.getElementById('greySlider').addEventListener('input', function() {
    const sliderValue = parseFloat(this.value) / 100; // Normalize to [0, 1]
    colorRules['grey'] = g => g * sliderValue;
});

rule = (atoms1, atoms2, g) => {
  for (let i = 0; i < atoms1.length; i++) {
    fx = 0;
    fy = 0;
    for (let j = 0; j < atoms2.length; j++) {
        a = atoms1[i];
        b = atoms2[j];
        dx = a.x - b.x;
        dy = a.y - b.y;
        d = Math.sqrt(dx * dx + dy * dy);
        // check if an atom is on top of another atom and if so, merge them
        if (d > 0 && d < 80) {
            F = (g * 0.45) / (d * d)
            fx += F * dx;
            fy += F * dy;
        }
    }
    a.vx = (a.vx + fx) * Math.random() * 0.35;
    a.vy = (a.vy + fy) * Math.random() * 0.50;
    // add it to the right group
    a.Group = atoms2;
    a.x += a.vx;
    a.y += a.vy;
    if (a.x <= 0 || a.x >= innerWidth) { a.vx *= -(Math.random() * 0.5 + 2); }
    if (a.y <= 0 || a.y >= innerHeight) { a.vy *= -(Math.random() * 0.5 + 2); }
  }
};


red = create(50, "red");
green = create(50, "green");
blue = create(50, "blue");
yellow = create(50, "yellow");
purple = create(50, "purple");
cyan = create(50, "cyan");
white = create(50, "white");
grey = create(50, "grey");
lime = create(50, "lime");
gold = create(50, "gold");
brown = create(50, "brown");
magenta = create(50, "magenta");



color_list = [yellow, red, green, blue, purple, cyan, white, grey, lime, gold, brown, magenta];
colonies = [];
let generation = 0;
let counter = 0;
let colorCount = {};

update = () => {
    counter += 1;
    const gridSize = 10;
    for (i = 0; i < color_list.length; i++) {
        let g = Math.random() + document.getElementById("gravitySlider").value * Math.random() * 0.5 + 0.5;
        
        rule(color_list[i], color_list[i], g);

        for (j = 0; j < color_list.length; j++) {
            const map = color_list[i][j];

        if (counter % COUNTER_THRESHOLD === 0) {
            for (let k = 0; k < color_list[i].length; k++) {
                let minColorDifference = Number.MAX_SAFE_INTEGER;
                let closestAtom;
                for (let l = 0; l < color_list[j].length; l++) {
                    const currentColorDifference = colorDifference(color_list[i][k], color_list[j][l]);
                    if (currentColorDifference < minColorDifference) {
                        minColorDifference = currentColorDifference;
                        closestAtom = color_list[j][l];
                    }
                    if (currentColorDifference === minColorDifference) {
                        if (color_list[i][k].x === color_list[j][l].x && color_list[i][k].y === color_list[j][l].y) {
                            color_list[i][k].vx = snapToGrid(color_list[i][k].vx, gridSize * 2);
                            color_list[i][k].vy = snapToGrid(color_list[i][k].vy, gridSize * 2);
                        }
                    }
                }
            }

            if (closestAtom) {
                if (map.color === closestAtom.color) {
                    if (Math.abs(map.x - closestAtom.x) < DISTANCE_THRESHOLD && Math.abs2(map.y - closestAtom.y) < DISTANCE_THRESHOLD) {
                        map.x = closestAtom.x + VX_INCREMENT;
                        map.y = closestAtom.y + VY_INCREMENT;
                        map.vx = closestAtom.vx + VX_INCREMENT;
                        map.vy = closestAtom.vy + VY_INCREMENT;
                    }
                } else {
                    if (colorDifference(map, closestAtom) < COLOR_DIFFERENCE_THRESHOLD) {
                        const dx = closestAtom.x - (map.x + map.vx)
                        const dy = closestAtom.y - (map.y + map.vy)
                        const d = Math.sqrt(dx * dx + dy * dy);
                        const F = (GRAVITY_CONSTANT * map.mass) / (d * d);
                        map.vx += F * dx;
                        map.vy += F * dy;
                    }
                }
            }
        }
            if (Math.abs(color_list[i][j].x - color_list[i][j + 1].x) < DISTANCE_THRESHOLD && Math.abs(color_list[i][j].y - color_list[i][j + 1].y) < DISTANCE_THRESHOLD) {
                let groupedAtoms = []; // Clear the array

                let newGroupedAtoms = [];

                for (let k = 0; k < groupedAtoms.length; k++) {
                    let atom = newGroupedAtoms[k];

                    for (let l = 0; l < color_list[i].length; l++) {
                        if (Math.abs(atom.x - color_list[i][l].x) < DISTANCE_THRESHOLD && Math.abs(atom.y - color_list[i][l].y) < DISTANCE_THRESHOLD) {
                            newGroupedAtoms.push(groupedAtom(color_list[i][l].x, color_list[i][l].y, color_list[i][l].color));
                        }
                    }

                    
                }

                groupedAtoms = newGroupedAtoms;

                // Delete all the colonies that are not the same color
                for (k = 0; k < groupedAtoms.length; k++) {
                    if (groupedAtoms[k].color != color_list[i][j].color) {
                        groupedAtoms.splice(k, 1);
                    } else {
                        groupedAtoms[k].color = color_list[i][j].color;
                    }
                }
            }


        // Apply gravitational rules based on color
        const color1 = color_list[i][j].color;
        const color2 = color_list[j][i].color;

        if (colorRules[color1]) {
            rule(color_list[i], color_list[j], colorRules[color1](g));
        } else
        {
            rule(color_list[i], color_list[j], -g);
        }

        if (colorRules[color2]) {
            rule(color_list[j], color_list[i], colorRules[color2](g));
        } else
        {
            rule(color_list[j], color_list[i], -g);
        }
        }
        
    }

    m.clearRect(0, 0, innerWidth, innerHeight);
    draw(0, 0, "black", innerWidth);
    drawCounter(counter);
    drawTimeStarted();
    // Draw the atoms
    for (i = 0; i < color_list.length; i++) {
        for (j = 0; j < color_list[i].length; j++) {
            draw(snapToGrid(color_list[i][j].x, gridSize), snapToGrid(color_list[i][j].y, gridSize), color_list[i][j].color, 10);
        }
    }

    setTimeout(requestAnimationFrame(update), 10000 / 144);
};

update();