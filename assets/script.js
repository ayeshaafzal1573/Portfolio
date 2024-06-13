// menu icon navbar
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');

};
// scroll section active link
   let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

// Add event listener for scroll
window.addEventListener('scroll', () => {
  sections.forEach(sec => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150; // Corrected offset calculation
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(links => {
        links.classList.remove('active');
        document.querySelector('header nav a[href*="' + id + '"]').classList.add('active'); // Added quotes around id
      });
    }
  });

  let header = document.querySelector('header'); 
  header.classList.toggle('sticky', window.scrollY > 100);
  menuIcon.classList.remove('bx-x');
  navbar.classList.remove('active');
});
// dark light mode
let darkModeIcon = document.querySelector('#darkMode-icon');
darkModeIcon.onclick = () => {
    darkModeIcon.classList.toggle('bx-sun');
    document.body.classList.toggle('dark-mode');
};
// scroll reveal
  ScrollReveal({ 
      reset: true,
      distance: '80px',
      duration: 2000,
      delay: 200
  });
  ScrollReveal().reveal('.home-content ,.heading', { origin: 'top' });
  ScrollReveal().reveal('.home-img img', { origin: 'bottom' });
  ScrollReveal().reveal('.home-content h1', { origin: 'left' });
ScrollReveal().reveal('.home-content h3 .home-content p', { origin: 'right' });
// SKILLS
const circles = document.querySelectorAll('.circle');
circles.forEach(elem => {
  var dots = parseInt(elem.getAttribute("data-dots")); // Parse as integer
  var marked = parseInt(elem.getAttribute("data-percent")); // Parse as integer
  var percent = Math.floor(dots * marked / 100);
  var points = "";
  var rotate = 360 / dots;

  for (let i = 0; i < dots; i++) { 
    points += `<div class="points" style="--i: ${i}; --rot: ${rotate}deg"></div>`;
  }
  elem.innerHTML = points;
  const pointsMarked = elem.querySelectorAll('.points');
  for (let i = 0; i < percent; i++){
  pointsMarked[i].classList.add('marked')
  }
})
//Portfolio
var mixer = mixitup('.portfolio-gallery');
// CONTACT
 function validateForm() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;

    if (name === "") {
      alert("Please enter your name.");
      return false;
    }

    if (email === "") {
      alert("Please enter your email.");
      return false;
    } else if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (message === "") {
      alert("Please enter your message.");
      return false;
    }

    // Perform additional validation if needed

    // If all validations pass, you can submit the form
    document.getElementById("contactForm").submit();
  }

  function isValidEmail(email) {
    var pattern ="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
    return pattern.test(email);
  }
  // COUNTER
        
            let valueDisplays = document.querySelectorAll(".c-no");
            let interval = 1000;

            valueDisplays.forEach((valueDisplay) => {
                let startValue = 0;
                let endValue = parseInt(valueDisplay.getAttribute("data-val"));
                let duration = Math.floor(interval / endValue);
                let counter = setInterval(function() {
                    startValue += 1;
                    valueDisplay.textContent = startValue;
                    if (startValue == endValue) {
                        clearInterval(counter);
                    }
                }, duration);
            });