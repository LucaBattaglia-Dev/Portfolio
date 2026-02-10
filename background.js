new p5((s) => {
    let triangles = [];
    let pts = [];
    let w = 0;
    let h = 0;
    const density = 90; 

    const makePoints = () => {
        pts = [];
        const cols = Math.ceil(w / density) + 1;
        const rows = Math.ceil(h / density) + 1;
        for (let y = 0; y <= rows; y++) {
            for (let x = 0; x <= cols; x++) {
                pts.push({ 
                    x: x * density + s.random(-25, 25), 
                    y: y * density + s.random(-25, 25), 
                    phase: s.random(0, s.TAU) 
                });
            }
        }

        triangles = [];
        const idx = (cx, cy) => cy * (cols + 1) + cx;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                triangles.push([idx(x, y), idx(x + 1, y), idx(x, y + 1)]);
                triangles.push([idx(x + 1, y), idx(x + 1, y + 1), idx(x, y + 1)]);
            }
        }
    };

    s.setup = () => {
        const container = document.getElementById('canvas-container');
        w = container.offsetWidth;
        h = container.offsetHeight;
        const canvas = s.createCanvas(w, h);
        canvas.parent('canvas-container');
        makePoints();
    };

    s.windowResized = () => {
        const container = document.getElementById('canvas-container');
        w = container.offsetWidth;
        h = container.offsetHeight;
        s.resizeCanvas(w, h);
        makePoints();
    };

    // s.draw = () => {
    //     s.background(15, 15, 15);
    s.draw = () => {
    // Using the desaturated red/grey background we discussed
    s.background(40, 35, 35); 
    
    const t = s.millis() * 0.0007;
    const centerX = w / 2;
    const centerY = h / 2;

    for (let p of pts) {
        p._x = p.x + Math.sin(t + p.phase) * 15;
        p._y = p.y + Math.cos(t + p.phase) * 15;
    }

    for (let tri of triangles) {
        const a = pts[tri[0]], b = pts[tri[1]], c = pts[tri[2]];
        const cx = (a._x + b._x + c._x) / 3;
        const cy = (a._y + b._y + c._y) / 3;
        
        // 1. Calculate distance from Mouse (for interactivity)
        const mouseDist = s.dist(s.mouseX, s.mouseY, cx, cy);
        
        // 2. Calculate distance from Screen Center (for the glow)
        const centerDist = s.dist(centerX, centerY, cx, cy);

        // Base opacity from mouse movement
        let opacity = s.map(mouseDist, 0, 400, 160, 45);

        // 3. Add the "Center Boost"
        // If centerDist is 0 (dead center), boost is 20. 
        // If centerDist is 500+, boost is 0.
        const centerBoost = s.map(centerDist, 0, 500, 20, 0);
        const finalOpacity = s.constrain(opacity + centerBoost, 0, 255);

        s.fill(214, 109, 117, finalOpacity);
        s.stroke(214, 109, 117, finalOpacity + 20);
        s.strokeWeight(0.5);
        s.triangle(a._x, a._y, b._x, b._y, c._x, c._y);
    }
};
});