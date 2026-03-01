// ==============================================
// script.js - ITZFIZZ Car Scroll Animation
// Written by BCA Semester 2 Student
// ==============================================

// Wait for page to fully load before doing anything
window.addEventListener('load', function () {

  // ============================================
  // STEP 1: GRAB ALL THE ELEMENTS WE NEED
  // ============================================

  // All the individual letters in the headline
  var letters = document.querySelectorAll('.brand-headline span:not(.letter-gap)');

  // The underline under headline
  var underline = document.getElementById('headline-underline');

  // The tagline text
  var tagline = document.getElementById('hero-tagline');

  // The car image
  var carImage = document.getElementById('car-image');

  // The car wrapper div (we move this on scroll)
  var carWrapper = document.getElementById('car-wrapper');

  // All 4 stat boxes
  var statBoxes = document.querySelectorAll('.stat-box');

  // Scroll indicator
  var scrollIndicator = document.getElementById('scroll-indicator');

  // All feature blocks in scroll zone
  var featureBlocks = document.querySelectorAll('.feature-block');


  // ============================================
  // STEP 2: PAGE LOAD ANIMATION
  // Using GSAP timeline so animations happen in order
  // ============================================

  // Create a GSAP timeline
  // delay: 0.3 means start after 0.3 seconds
  var loadTimeline = gsap.timeline({ delay: 0.3 });

  // --- Animate letters one by one ---
  // stagger means each letter starts 0.05s after the previous one
  loadTimeline.to(letters, {
    opacity: 1,
    y: 0,           // move back to original position (was -30px)
    duration: 0.6,
    stagger: 0.05,  // delay between each letter
    ease: 'power2.out'
  });

  // --- Animate the underline growing ---
  loadTimeline.to(underline, {
    width: '60%',
    duration: 0.8,
    ease: 'power2.inOut'
  }, '-=0.2'); // '-=0.2' means start 0.2s before previous animation ends

  // --- Fade in the tagline ---
  loadTimeline.to(tagline, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.4');

  // --- Car slides up and fades in ---
  loadTimeline.to(carImage, {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power3.out'
  }, '-=0.3');

  // --- Stats come in one by one with delay ---
  loadTimeline.to(statBoxes, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.12,   // each stat box delays by 0.12s
    ease: 'power2.out'
  }, '-=0.5');

  // --- Show scroll indicator last ---
  loadTimeline.to(scrollIndicator, {
    opacity: 1,
    duration: 0.5,
    ease: 'power2.out'
  }, '-=0.2');


  // ============================================
  // STEP 3: SCROLL ANIMATION
  // Move the car based on how much user scrolled
  // ============================================

  // We track the current position of car smoothly
  // This is called "interpolation" - makes motion fluid
  var currentCarX   = 0;  // current X position (where car is now visually)
  var targetCarX    = 0;  // target X position (where car should go)
  var currentCarY   = 0;
  var targetCarY    = 0;
  var currentScale  = 1;
  var targetScale   = 1;
  var currentRotate = 0;
  var targetRotate  = 0;

  // How fast the car "catches up" to target position
  // Lower = more lag/smoothness, Higher = snappier
  var lerpFactor = 0.07;

  // Total scrollable height (used to calculate scroll progress)
  function getScrollMax() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  // Listen for scroll events
  window.addEventListener('scroll', function () {
    // Get current scroll position from top
    var scrollY = window.pageYOffset;

    // scrollMax is the total scroll distance possible
    var scrollMax = getScrollMax();

    // progress goes from 0 (top) to 1 (bottom)
    var progress = scrollY / scrollMax;

    // ------- Calculate target car position based on scroll -------

    // Move car to the right as user scrolls (max 500px right)
    targetCarX = progress * 500;

    // Car goes slightly down as user scrolls
    targetCarY = progress * 120;

    // Car gets slightly smaller as user scrolls
    targetScale = 1 - (progress * 0.3);  // from 1 to 0.7

    // Car rotates a little (like it's turning)
    targetRotate = progress * 8;  // max 8 degrees

    // Fade car out near the end of scroll
    var carOpacity = 1 - (progress * 1.2);
    carOpacity = Math.max(0, Math.min(1, carOpacity)); // clamp between 0 and 1
    carImage.style.opacity = carOpacity;

    // ---- Check which feature blocks are visible on screen ----
    // Loop through each block and check if it's in viewport
    featureBlocks.forEach(function (block) {
      var rect = block.getBoundingClientRect();
      // If block top is within screen height
      if (rect.top < window.innerHeight * 0.85) {
        block.classList.add('visible'); // add visible class
      }
    });

  });


  // ============================================
  // STEP 4: SMOOTH ANIMATION LOOP
  // This runs every frame (like 60 times per second)
  // It smoothly moves car towards target position
  // ============================================

  function animationLoop() {

    // Lerp = Linear Interpolation
    // Formula: current = current + (target - current) * factor
    // This makes the car slowly ease towards the target
    currentCarX   += (targetCarX   - currentCarX)   * lerpFactor;
    currentCarY   += (targetCarY   - currentCarY)   * lerpFactor;
    currentScale  += (targetScale  - currentScale)  * lerpFactor;
    currentRotate += (targetRotate - currentRotate) * lerpFactor;

    // Apply the calculated transform to the car wrapper
    // Using transform is best for performance (no layout reflow)
    carWrapper.style.transform =
      'translateX(calc(-50% + ' + currentCarX + 'px))' +
      ' translateY(' + currentCarY + 'px)' +
      ' scale(' + currentScale + ')' +
      ' rotate(' + currentRotate + 'deg)';

    // Keep calling this function every frame
    requestAnimationFrame(animationLoop);
  }

  // Start the animation loop
  animationLoop();


  // ============================================
  // STEP 5: SMALL EXTRA EFFECTS
  // ============================================

  // --- Parallax on mouse move (subtle 3D tilt effect) ---
  document.addEventListener('mousemove', function (e) {
    // Only do this in the hero section
    var heroSection = document.getElementById('hero');
    var heroRect = heroSection.getBoundingClientRect();

    // Check if mouse is inside hero section
    if (e.clientY > heroRect.top && e.clientY < heroRect.bottom) {

      // Calculate how far mouse is from center (from -0.5 to 0.5)
      var mouseXPercent = (e.clientX / window.innerWidth) - 0.5;
      var mouseYPercent = (e.clientY / window.innerHeight) - 0.5;

      // Move headline very subtly with mouse
      var headline = document.querySelector('.headline-wrapper');
      headline.style.transform =
        'translateX(' + (mouseXPercent * -10) + 'px)' +
        ' translateY(' + (mouseYPercent * -5) + 'px)';
    }
  });


  // --- Hover effect on stat boxes ---
  statBoxes.forEach(function (box) {
    box.addEventListener('mouseenter', function () {
      // Scale up slightly on hover using GSAP
      gsap.to(box, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    box.addEventListener('mouseleave', function () {
      // Scale back on mouse leave
      gsap.to(box, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });


  // ============================================
  // STEP 6: CONSOLE LOG (to show it's working)
  // ============================================
  console.log('ITZFIZZ script loaded successfully!');
  console.log('Scroll down to see car animation.');

}); // end of window load event