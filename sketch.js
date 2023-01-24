// Hex-a-Sketch copyright Steve's Makerspace
// video: https://youtu.be/11j33Ok9UL4

let rez1; //type
let rez2; //rotation
let rez3; //color
let alph = 120; //alpha for strokes
let numb; //number of hex across
let swd; //strokeWeight division
let numbSketch = 13; //repeat marks
let sk1; // sketchy movement 0.004
let sk2; //sketchy rotation 0.12
let table, shiftCol, cnv, h, n1, n2, n3, counter, sketchySame, pd, cnvNumb;
let secondX, secondY, secondD, roundTwo;
let bgColArray = [];

/* perlin */
var colorInc = 0.5; // Color change speed
var sat = 100; // saturation max 100
var brt = 100; // brightness max 100
var alphPerlin = 50; // alpha max 100
var numbPart = 300; // number of particles
var partStroke = 1; // line width
var angMult = 25; // 0.1 = straighter lines; 25+ = sharp curves
var angTurn = 1; // adjust angle for straight lines (after adjusting angMult)
var zOffInc = 0.0003; // speed of vector changes
var inc = 0.1;
var scl = 10;
var cols, rows;
var zoff = 0;
var fr;
var particles = [];
var flowfield;
var hu = 0;
var p = 1;

function preload() {
  table = loadTable("colors.csv", "csv", "header");
  winSize = 500;

  colorMode(HSB, 360, 120, 100, 255);
  pixelDensity(1);
  pd = 1;
  roundTwo = false;
  //createCanvas(windowWidth, windowHeight);
  seed = Date.now();
  //seed = int(fxrand()*9999999);
}

function setup() {
  createCanvas(winSize, winSize);
  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP("");
  frameRate(30);

  flowfield = new Array(cols * rows);

  for (var i = 0; i < numbPart; i++) {
    particles[i] = new Particle();
  }
  restart();
}

function draw() {
  if (p > 0) {
    var yoff = 0;
    for (var y = 0; y < rows; y++) {
      var xoff = 0;
      for (var x = 0; x < cols; x++) {
        var index = x + y * cols;
        var angle = noise(xoff, yoff, zoff) * angMult + angTurn;
        var v = p5.Vector.fromAngle(angle);
        v.setMag(1);
        flowfield[index] = v;
        xoff += inc;
        // stroke(100, 50);
        // push();
        // translate(x * scl, y * scl);
        // rotate(v.heading());
        // strokeWeight(1);
        // line(0, 0, scl, 0);
        // pop();
      }
      yoff += inc;

      zoff += zOffInc;
    }

    for (var i = 0; i < particles.length; i++) {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }

    // fr.html(floor(frameRate()));
    hu += colorInc;
    if (hu > 359) {
      hu = 0;
    }
  }
}

function restart() {
  counter = 0;
  randomSeed(seed);
  noiseSeed(seed);
  clear();
  cnv2 = createGraphics(width, height);
  cnv2.rectMode(CENTER);
  n1 = null;
  lessSketch = false;
  midSketch = false;
  moreSketch = false;
  palette = floor(random(42));
  numb = floor(random(20, 32)); //# of hex across
  swd = random(13, 28); // help determine strokeWeight
  rez1 = random(0.0005, 0.005); //noise rez for type
  rez2 = random(0.0005, 0.005); //noise rez for rotation
  rez3 = random(0.0005, 0.0013); //noise rez for color
  //print(sk1,sk2);
  size = width / numb; //size of each hex
  a = size / 2;
  b = a * tan(PI / 6);
  c = sqrt(a * a + b * b);
  d = (b + c) / 2;
  numbDown = height / (c * 2 + b * 2);
  shiftCol = 0;
  cnv = createGraphics(width, height);
  cnvNumb = 0;
  makeCanvas();
  cnv2.image(cnv, 0, 0);
  cnvNumb = 1;
  makeCanvas();
  eraseStuff();
  cnv2.image(cnv, 0, 0);
  cnvNumb = 2;
  makeCanvas();
  cnv2.background(0, 50);
  cnv2.filter(BLUR, 0.8 + pd * 0.1);
  topCanvas();
  image(cnv, 0, 0);
  image(cnv2, 0, 0);
  filter(BLUR, 0.4 + pd * 0.1);
  paperTexture();
  roundTwo = true;
  //fxpreview();
  print("done", palette);
  //save(palette+"-"+seed + ".png");
}

function makeCanvas() {
  counter += 9999;
  randomSeed(seed + counter);
  noiseSeed(seed + counter);
  shiftCol = floor(random(3, 7)); //used to shift color
  cnv = createGraphics(width, height);
  cnv.colorMode(HSB, 360, 120, 100, 255);
  n1 = null;
  for (zz = 0; zz < 10; zz++) {
    //decide sketch amount for this canvas
    sketchAmount = random(3);
    if (sketchAmount < 1 && lessSketch == false) {
      sk1 = random(0.0025, 0.0037); //less sketchy
      sk2 = random(-0.4, 0.4); //rotation sketchiness
      lessSketch = true;
      break;
    } else if (sketchAmount < 2 && midSketch == false) {
      sk1 = random(0.0052, 0.008); //mid sketchy
      sk2 = random(-0.3, 0.3);
      midSketch = true;
      break;
    } else if (sketchAmount < 3 && moreSketch == false) {
      sk1 = random(0.012, 0.04); //more sketchy
      sk2 = random(-0.3, 0.3);
      moreSketch = true;
      break;
    }
  }
  //sk1 = 0.04;
  //sk2 = 0.4;
  //print(sk1,sk2);
  // make background
  if (roundTwo == false) {
    getColor();
    if (random(4) < 1) {
      h1 = h;
      getColor();
      h = (h + h1) / 2;
      s = random(30, 120);
      b3 = random(35, 60);
    } else {
      s = max(30, min(s, 60));
      b3 = max(35, min(b3 - 20, 60));
    }
    bgCol = color(h, s, b3);
    bgColArray.push(bgCol);
  } else {
    bgCol = bgColArray[cnvNumb];
  }
  cnv.background(bgCol);
  counter += 9999;
  randomSeed(seed + counter);
  noiseSeed(seed + counter);
  cnv.rectMode(CENTER);
  cnv.noFill();
  cnv.strokeWeight(max(1, size / swd));
  // start hex grid
  for (i = 0; i < numb; i++) {
    for (j = 0; j < numbDown; j++) {
      cnv.push();
      x = i * size + a;
      y = j * (c * 2 + b * 2);
      cnv.translate(x, y);
      n1 = noise((x / width) * 1000 * rez1, (y / height) * 1000 * rez1) - 0.2;
      n2 =
        noise(
          (x / width) * 1000 * rez2 + 10000,
          (y / height) * 1000 * rez2 + 10000
        ) - 0.2;
      n3 =
        noise(
          (x / width) * 1000 * rez3 + 20000,
          (y / height) * 1000 * rez3 + 20000
        ) - 0.2;
      //drawHex();
      drawCurve();
      cnv.pop();
    }
  }
  for (i = -1; i < numb; i++) {
    for (j = 0; j < numbDown; j++) {
      cnv.push();
      x = i * size + a + size / 2;
      y = j * (c * 2 + b * 2) + b + c;
      cnv.translate(x, y);
      n1 = noise((x / width) * 1000 * rez1, (y / height) * 1000 * rez1) - 0.2;
      n2 =
        noise(
          (x / width) * 1000 * rez2 + 10000,
          (y / height) * 1000 * rez2 + 10000
        ) - 0.2;
      n3 =
        noise(
          (x / width) * 1000 * rez3 + 20000,
          (y / height) * 1000 * rez3 + 20000
        ) - 0.2;
      //drawHex();
      drawCurve();
      cnv.pop();
    }
  }
  if (sk1 > 0.011) {
    cnv.filter(BLUR, 0.5);
  }
}

function drawHex() {
  beginShape();
  vertex(0, -c);
  vertex(a, -b);
  vertex(a, b);
  vertex(0, c);
  vertex(-a, b);
  vertex(-a, -b);
  endShape();
}

function drawCurve() {
  //curveType = random(0, 5.3);
  curveType = min(n1 * 10.6, 5.3);
  //rotate(floor(random(6)) * (PI / 3));
  cnv.rotate(floor(n2 * 12) * (PI / 3));
  getColor();
  for (z = 0; z < numbSketch; z++) {
    cnv.push();
    cnv.translate(
      random(-width * sk1, width * sk1),
      random(-height * sk1, height * sk1)
    );
    cnv.rotate(random(-sk2, sk2));
    cnv.stroke(
      h + random(-8, 8),
      s + random(-10, 10),
      b3 + random(-10, 10),
      alph
    );
    if (curveType < 1) {
      cnv.arc(a, -b, b * 2, b * 2, PI * 0.5, PI * 1.1667);
      cnv.arc(-a, -b, b * 2, b * 2, -PI * 0.1667, PI * 0.5);
      cnv.arc(0, c, b * 2, b * 2, PI * 1.1667, -PI * 0.1667);
    } else if (curveType < 2) {
      cnv.arc(0, c, b * 2, b * 2, PI * 1.1667, -PI * 0.1667);
      cnv.arc(0, -c, b * 2, b * 2, PI * 0.1667, PI * 0.8333);
      cnv.line(a, 0, -a, 0);
    } else if (curveType < 3) {
      cnv.arc(a, -b, b * 2, b * 2, PI * 0.5, PI * 1.1667);
      cnv.arc(-a, -b, b * 2, b * 2, -PI * 0.1667, PI * 0.5);
      cnv.arc(0, c, b * 2, b * 2, PI * 1.1667, -PI * 0.1667);
      cnv.arc(a, b, b * 2, b * 2, PI * 0.8333, PI * 1.5);
      cnv.arc(-a, b, b * 2, b * 2, PI * 1.5, PI * 0.1667);
      cnv.arc(0, -c, b * 2, b * 2, PI * 0.1667, PI * 0.8333);
    } else if (curveType < 4) {
      cnv.line(a, 0, -a, 0);
      cnv.line(-a / 2, d, a / 2, d);
      //cnv.line(-a / 2, -d, a / 2, d);
      cnv.line(-a / 2, d, a / 2, -d);
    } else if (curveType < 5) {
      cnv.arc(-a, 0, b * 2.6, b * 4, PI * 1.67, PI * 0.33);
      cnv.arc(a, 0, b * 2.6, b * 4, PI * 0.67, PI * 1.33);
      cnv.point(a, 0);
      cnv.point(-a, 0);
    } else if (curveType < 6) {
      cnv.arc(a, -b, b * 2, b * 2, PI * 0.5, PI * 1.1667);
      cnv.arc(-a, -b, b * 2, b * 2, -PI * 0.1667, PI * 0.5);
      cnv.arc(0, c, b * 2, b * 2, PI * 1.1667, -PI * 0.1667);
      cnv.arc(a, b, b * 2, b * 2, PI * 0.8333, PI * 1.5);
      cnv.arc(-a, b, b * 2, b * 2, PI * 1.5, PI * 0.1667);
      cnv.arc(0, -c, b * 2, b * 2, PI * 0.1667, PI * 0.8333);
      cnv.fill(
        h + random(-8, 8),
        s + random(-10, 10),
        b3 + random(-10, 10),
        alph / 5
      );
      cnv.circle(0, 0, b * 2);
      cnv.noFill();
    }
    cnv.pop();
  }
}

function eraseStuff() {
  cnv.erase();
  cnv.fill(0);
  eraseNum = random(3, 5);
  for (q = 0; q < eraseNum; q++) {
    w = random(3.5);
    if (w < 1) {
      //horizontal or vertical strip
      cnv.push();
      cnv.translate(width / 2, height / 2);
      cnv.rotate(floor(random(2)) * PI * 0.5);
      cnv.rect(
        random(-width / 2.7, width / 2.7),
        0,
        random(width / 15, width / 7),
        height
      );
      cnv.pop();
    } else if (w < 2) {
      //diagonal strip
      cnv.push();
      cnv.translate(width / 2, height / 2);
      cnv.rotate(random(2) * PI);
      cnv.rect(
        random(-width / 2.7, width / 2.7),
        0,
        random(width / 15, width / 7),
        height * 2
      );
      cnv.pop();
    } else if (w < 3.5) {
      //curve along edge
      cnv.push();
      cnv.translate(width / 2, height / 2);
      cnv.rotate(random(2) * PI);
      cnv.beginShape();
      cnv.curveVertex(-width * 2, -height * 2);
      cnv.curveVertex(-width * 2, -height * 2);
      cnv.curveVertex(random(-width * 0.5, -width * 0.3), -height * 2);
      cnv.curveVertex(random(-width * 0.5, -width * 0.3), -height * 0.35);
      cnv.curveVertex(random(-width * 0.5, -width * 0.3), 0);
      cnv.curveVertex(random(-width * 0.5, -width * 0.3), height * 0.35);
      cnv.curveVertex(random(-width * 0.5, -width * 0.3), height * 2);
      cnv.curveVertex(-width * 2, height * 2);
      cnv.curveVertex(-width * 2, height * 2);
      cnv.endShape();
      cnv.pop();
    }
  }
  if (random(3) < 1.5) {
    //frame
    cnv.noFill();
    cnv.strokeWeight(width * 0.05);
    cnv.rect(width / 2, height / 2, width, height);
  }
}

function topCanvas() {
  //erasing main object shapes
  topItems = random(3, 5);
  firstX = random(width / 5, (width / 5) * 4);
  firstY = random(width / 5, (width / 5) * 4);
  firstD = random(width * 0.3, width * 0.6);
  numCircles = 0;
  onlyOneCircle = false;
  for (q = 0; q < topItems; q++) {
    cnv2.noErase();
    let sw2 = 0;
    getColor();
    w = random(4);
    cnv2.noFill();
    cnv2.stroke(h, s - 20, 30, 0);
    cnv2.strokeWeight(width * 0.03);
    if (w < 2 && numCircles < 2) {
      //draw circle
      if (numCircles == 0) {
        //draw first circle
        cnv2.circle(firstX, firstY, firstD);
        if (random(5) < 2) {
          //donut
          cnv2.noFill();
          sw2 = random(firstD * 0.3, firstD * 0.5);
          cnv2.strokeWeight(sw2);
          cnv2.erase();
          cnv2.circle(firstX, firstY, firstD - sw2 / 2);
        } else {
          cnv2.erase();
          cnv2.fill(0);
          cnv2.noStroke();
          cnv2.circle(firstX, firstY, firstD);
        }
      } else {
        //checking if 2nd circle can be drawn
        if (
          abs(firstX - width / 2) < width * 0.2 &&
          abs(firstY - height / 2) < height * 0.2
        ) {
          q--;
          onlyOneCircle = true;
        } else {
          //draw 2nd circle
          if (firstX < width / 2) {
            secondX = random((width / 5) * 3, (width / 5) * 4);
          } else {
            secondX = random(width / 5, (width / 5) * 2);
          }
          if (firstY < height / 2) {
            secondY = random((height / 5) * 3, (height / 5) * 4);
          } else {
            secondY = random(height / 5, (height / 5) * 2);
          }
          secondD = random(width * 0.2, width * 0.4);
          if (random(5) < 2) {
            //donut
            cnv2.noFill();
            sw2 = random(secondD * 0.3, secondD * 0.5);
            cnv2.strokeWeight(sw2);
            cnv2.erase();
            cnv2.circle(secondX, secondY, secondD - sw2 / 2);
          } else {
            cnv2.erase();
            cnv2.fill(0);
            cnv2.noStroke();
            cnv2.circle(secondX, secondY, secondD);
          }
        }
      }
      numCircles++;
    } else if (w < 3) {
      //horizontal or vertical strip
      cnv2.push();
      cnv2.translate(width / 2, height / 2);
      rotAmount = floor(random(2)) * PI * 0.5;
      cnv2.rotate(rotAmount);
      rectX = random(-width / 2.7, width / 2.7);
      rectWid = random(width / 15, width / 7);
      cnv2.rect(rectX, 0, rectWid, height);
      cnv2.erase();
      cnv2.fill(0);
      cnv2.noStroke();
      cnv2.rect(rectX, 0, rectWid, height);
      cnv2.pop();
    } else if (w < 4) {
      //diagonal strip
      cnv2.push();
      cnv2.translate(width / 2, height / 2);
      rotAmount = random(2) * PI;
      cnv2.rotate(rotAmount);
      rectX = random(-width / 2.7, width / 2.7);
      rectWid = random(width / 15, width / 7);
      cnv2.rect(rectX, 0, rectWid, height * 2);
      cnv2.erase();
      cnv2.fill(0);
      cnv2.noStroke();
      cnv2.rect(rectX, 0, rectWid, height * 2);
      cnv2.pop();
    }
  }
}

function getColor() {
  if (n3 == null) {
    col1 = floor(random(5));
  } else {
    col1 = min(4, max(0, round(n3 * 12 - 1)));
    //print(col1);
    col1 -= shiftCol;
    if (shiftCol == 5) {
      col1--;
    }
    if (col1 < 0) {
      col1 += 5;
    }
    if (col1 < 0) {
      col1 += 5;
    }
  }
  h = int(table.get(palette, col1 * 3)) + random(-7, 7);
  s = int(table.get(palette, col1 * 3 + 1)) + random(-5, 8);
  b3 = int(table.get(palette, col1 * 3 + 2)) + random(-5, 8);
  //print (col1);
}

function paperTexture() {
  colorMode(HSB, 360, 120, 100, 255);
  noFill();
  textureNum = 20000;
  for (i = 0; i < textureNum; i++) {
    stroke(random(360), random(30, 50), random(50, 80), 15); //6
    x = random(-width * 0.2, width * 1.2);
    y = random(-height * 0.2, height * 1.2);
    push();
    translate(x, y);
    strokeWeight(max(0.6, width * 0.002)); //1
    rotate(random(PI * 2));
    curve(
      width * random(0.035, 0.14),
      0,
      0,
      width * random(-0.03, 0.03),
      width * random(-0.03, 0.03),
      width * random(0.035, 0.07),
      width * random(0.035, 0.07),
      width * random(0.035, 0.14)
    );
    pop();
  }
}

function keyTyped() {
  if (key === "s") {
    save(palette + "-" + seed + ".png");
  }
}

function mousePressed(){
  p=p*-1;
}
