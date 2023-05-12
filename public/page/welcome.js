const welcomeText = document.getElementById("welcome");

// Fade out the welcome 
setTimeout(function(){
  gsap.to(welcomeText, { duration: 1, opacity: 0, onComplete: function(){
    welcomeText.textContent = "double click to hold background";
    gsap.to(welcomeText, { duration: 1, opacity: 1 });
  }});
}, 2000);

// Fade out the welcome text again.
setTimeout(function(){
  gsap.to(welcomeText, { duration: 1, opacity: 0 });
}, 6000);
