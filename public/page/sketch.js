//Set angle to zero
let angle = 0;

//Create an audio context
const audio_context = new AudioContext();

//Set bgtoggle to true
let bgToggle = true;

// Define function to load audio file asynchronously (this is something that was suggested to me by vscode i originally had it set up as a normal function)
const loadAudio = async (audioFiles) => {
  const audioIndex = Math.floor(Math.random() * audioFiles.length);
  const response = await fetch(audioFiles[audioIndex]);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audio_context.decodeAudioData(arrayBuffer);
  return audioBuffer;   
};

// Call the function with possible audio files & get the promise(I wanted to include an array for that sweet sweet mark)
const audioBufferPromise = loadAudio(["drone.wav", "drone_1.wav"]);

// On setup, initialize the canvas
function setup() {
  createCanvas(innerWidth, innerHeight);

  // Attach an asynchronous click event listener to the canvas
  canvas.addEventListener("click", async () => {
    const buffer = await audioBufferPromise;
    const source = audio_context.createBufferSource();
    const gainNode = audio_context.createGain();
    source.buffer = buffer;
    source.connect(gainNode); // connect the source to the gain node
    gainNode.connect(audio_context.destination); // connect the gain node to the destination
    gainNode.gain.value = 0.2; //setting gain to 0.2 maybe it could be louder but 0.1 seemed good while testing
    source.start(0);
    source.loop = true; //loop audio so you can stare for longer \/O_O\/
  });

  // Add an event listener for the "beforeunload" event (I did this in an attempt to stop the audio clipping when exiting the window or refreshing, I dont think it works)
  window.addEventListener("beforeunload", () => {
    audio_context.close();
  });
}

function draw() {
  // If bgToggle is true set background
  if (bgToggle) {
    background(220);
  }

  // Set the ellipse to have no outline
  noStroke();

  //Calculate the diamater of the ellipse
  let diameter = 100 + 50 * noise(angle + 20);

  // Calculate the ellipse coordinates
  let x = width/2 + 50 * noise(angle);
  let y = height/2 + 50 * noise(angle+10);

  // Set ellipse mode to the center
  ellipseMode(CENTER);

  // Apply color using different wave frequencies(I was initally using random but i wasnt enjoying the flashing changes so ive decided to use what i imagine is similar to an lfo)
  let r = 255 * 0.5 * (1 + sin(frameCount * 0.01));
  let g = 255 * 0.5 * (1 + sin(frameCount * 0.02));
  let b = 255 * 0.5 * (1 + sin(frameCount * 0.03));
  fill(r, g, b);

  // Recursively draw the ellipse
  recursive_ellipse(x, y, diameter, diameter);

  // Update the angle
  angle += 0.05;
}

//Recursive function to draw an ellipse
function recursive_ellipse(x, y, w, h) {
  //Draw the ellipse at the current position
  ellipse(x, y, w, h);

  // If the size of the ellipse is small enough, return
  if (w < 3 || h < 3) return;

  // Recursively call the function on random positions on the screen 
  let newX1 = random(0, width);
  let newY1 = random(0, height);
  recursive_ellipse(newX1, newY1, w / 2, h / 2);

  let newX2 = random(0, width);
  let newY2 = random(0, height);
  recursive_ellipse(newX2, newY2, w / 2, h / 2);
}
// resizeable window
function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}

//Toggle background on double click 
function doubleClicked() {
  bgToggle = !bgToggle;
  if (bgToggle) {
  
    background(220);
  } 
}
