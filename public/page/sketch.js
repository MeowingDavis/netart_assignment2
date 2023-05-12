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
    gainNode.gain.value = 0.09; //setting gain to 0.9 
    source.start(0);
    source.loop = true; //loop audio so you can stare for longer \/O_O\/
  });

  // Add an event listener for the "beforeunload" event (I did this in an attempt to stop the audio clipping when exiting the window or refreshing, I dont think it works)
  // audio_context.close() should be executed after the audio is done playing, not on window refresh/exit. but \/O_o\/
  window.addEventListener("beforeunload", () => {
    audio_context.close();
  });
}

function draw() {
  // If bgToggle is true set background
  if (bgToggle) {
    background(220);
  }
  //iter works when viewing locally and on safari, chrome hates it and firefox just seems to ignore it
  // This code calculates the current iteration for an animation that moves back and forth within the screen width.
  const modNumber = (2 * innerWidth) - 1; // Set the modulo limit to the screen width multiplied by 2 minus 1
  let iter = ((frameCount % modNumber) + 1); // Add 1 to the iteration to avoid it being 0
  iter = iter > innerWidth ? (modNumber - iter) : iter;

  // Set the ellipse to have no outline
  noStroke();

  //Calculate the diameter of the ellipse
  let diameter = 100 + 50 * noise(angle + 20);

  // Calculate the ellipse coordinates
  let x = width / 2 + 50 * noise(angle);
  let y = height / 2 + 50 * noise(angle + 10);

  // Set ellipse mode to the center
  ellipseMode(CENTER);

  // Apply color using different wave frequencies
  let r = 255 * 0.5 * (1 + sin(frameCount * 0.01));
  let g = 255 * 0.5 * (1 + sin(frameCount * 0.02));
  let b = 255 * 0.5 * (1 + sin(frameCount * 0.03));
  fill(r, g, b);
  // Recursively draw the ellipse
  recursive_ellipse(x, y, iter, diameter);
  // Update angle for noise used in ellipse calculations
  angle += 0.01;
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
 
