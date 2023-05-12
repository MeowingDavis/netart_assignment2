const welcomeText = document.getElementById("welcome");

// Fade out the welcome text after 5 seconds
setTimeout(function(){
  gsap.to(welcomeText, { duration: 1, opacity: 0, onComplete: function(){
    welcomeText.textContent = "double click to hold background";
    gsap.to(welcomeText, { duration: 1, opacity: 1 });
  }});
}, 2000);

// Fade out the welcome text again after 5 more seconds
setTimeout(function(){
  gsap.to(welcomeText, { duration: 1, opacity: 0 });
}, 6000);
