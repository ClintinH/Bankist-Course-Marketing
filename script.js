"use strict";

const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function () {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//////////////////////////////////////////////////////
// button scrolling

// implementing smooth scrolling
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", function (e) {
  // first need to get the co-ordinates of the section1
  const s1coord = section1.getBoundingClientRect();

  // new method for modern browsers only
  section1.scrollIntoView({ behavior: "smooth" });
});

// tabbed component
//event delegation of the tabbed component
tabContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab"); // no matter where you click in button it will go to the closest target as specified. targets closest parent with class name operations
  console.log(clicked);

  // Guard Clause
  if (!clicked) return; //checked if there is a click value else ends funtion

  // removeactive classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Active Tab
  clicked.classList.add("operations__tab--active");

  // Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Menu Fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const sibling = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    sibling.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5)); // bind method return a copy of the function
nav.addEventListener("mouseout", handleHover.bind(1));

// Implementing sticky navigation scroll event
const initCoords = section1.getBoundingClientRect();

window.addEventListener("scroll", function () {
  if (this.window.scrollY > initCoords.top) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
});

// sticky navigation using the intersection observer API

const obsCallBack = function (entries, observer) {
  // callback everytime the section intersect with the root depending on our preset threshold
  // entries is the threshold value being passed in the callback.
  entries.forEach((entry) => {
    console.log(entry);
  });
};
const obsOptions = {
  root: null, //first value is root - it is the target that will intersect with the observe part
  threshold: 0.1,
};
// have to start with new IntersectionObserver(callback function, options)
const observer = new IntersectionObserver(obsCallBack, obsOptions);
// calling the observe method on the intersection observer (the part it needs to observe)
observer.observe(section1);

const headers = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  //adding the sticky class on when the intersecting is false
  else nav.classList.remove("sticky"); // removing the sticky class when intersecting is true
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // this is the margin that the callback will start as if the header is 90pixels smaller in height
});
headerObserver.observe(headers);

// reveal sections
const allSections = document.querySelectorAll(".section");

const revealSections = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSections, {
  root: null, //null = viewport
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// lazy loading images
const imgTarget = document.querySelectorAll("img[data-src]");

const loadImage = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTarget.forEach((img) => imgObserver.observe(img));

// slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class = "dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    // as the current slide go up in value until it reaches the maximum number of slides the curslide will be used to move the slides left and right
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event Handlers
  //next slide - you want to set the value at 0% 1st img , 100% 2nd img and so on
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide(); //both methods does same work
  });
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////////////////////////////
// Page navigation

// this
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute(href);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//event delegation - add call back function on the parent then navigate to target link
// 1. Add event listener to commen parent element
// 2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  console.log(e.target);

  // matching strategy
  if (e.target.classList.contains("nav__link")) {
    console.log("link");
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// advanced dom and events
// Selecting, creating and deleting elements

// selecting elements
console.log(document.documentElement); // selects all elements
console.log(document.head); // selects head elements
console.log(document.body); // selects body elements

const header = document.querySelector(".header");
// selects all section elements
const allSection = document.querySelectorAll("section"); // return a notelist
console.log(allSection);

// selecting elements by id
document.getElementById("section--1");
// selecting all buttons
const allButtons = document.getElementsByTagName("button");
console.log(allButtons); // return an htmlcollection

// selecting elements by class
console.log(document.getElementsByClassName("btn"));

// Creating and inserting elements
// NB! .insertAdjacentHTML

// building an element
const message = document.createElement("div"); //return dom object
// adding a class to the newly created div
message.classList.add("cookie-message");
// message.textContent = "we use cookies for improved functionality and anylitics";

// adding html
message.innerHTML =
  'we use cookies for improved functionality and anylitics. <button class = "btn btn--close-cookie">Got it!</button>';

// adding the message to the dom
header.prepend(message); // prepend insert the message in dom. Header First child
// header.append(message); // append insert the message in dom. Header Last Child
// The append overites the prepend as there cant be two instances in the dom at the same time. Therefor if you want both to be applied you have to use clone method

header.append(message.cloneNode(true)); // clones message so that the clone is appendid

// Before and after
header.before(message); // inserts before header. Header sibling
header.after(message); // insert after header. header sibling

// delete elements
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove(); // newest method of removing elements
    // message.parentElement.removeChild(message); // Older method of removing elements
  });

// Styles Attributes and classes
// Styles - gets set as inline styles on html tag
message.style.backgroundColor = "#37383d";
// adding background color to message element
message.style.width = "120%";

// to check the style properties on the element use getComputedStyle(element).stylename
console.log(getComputedStyle(message).color);

// changing the height of the element which is not defined by us but by the browser
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + "px";
// have to use parseFloat / parseInt because te getComputedStyle method returns a string and you can not add a number to a string.

// css custom properties / variables
document.documentElement.style.setProperty("--color-primary", "orangered");
//setProperty('css custome property', 'value to change'). css custome property gets set in the css root as variables which changes all the places the property gets used. You use documentElement to point towards the root channel

// Attributes - changes / accessing attributes of a element
const logo = document.querySelector(".nav__logo");
//standar attributes (accessible)
console.log(logo.src);
console.log(logo.className);
console.log(logo.alt);

// setting attributes
logo.alt = "Beautiful minimalist logo";

// not standard attribute (not - accessible)
logo.setAttribute("designer", "Jonas");
console.log(logo.designer); // undefined
console.log(logo.getAttribute("designer")); // use getAttribute method will return result
logo.setAttribute("company", "Bankist");

console.log(logo.src); // absolute src of image
console.log(logo.getAttribute("src")); // relative src of image

// Data Attributes - special attribute that start with word data
console.log(logo.dataset.versionNumber); // returns 3.0

// Classes - Use these 4 methods NB!!
logo.classList.add("c"); // add class
logo.classList.remove("c"); // removes class
logo.classList.toggle("c");
logo.classList.contains("c");

// DONT USE
logo.className = "Jonas"; // overwrites other classes.

// Type of events and Event handlers

// const alertH1 = function (e) {
//   alert("addEventListener: Great! You are reading the heading :D");

//   h1.removeEventListener("mouseenter", alertH1);
// };
// addEventListener
// const h1 = document.querySelector("h1");
// h1.addEventListener("mouseenter", alertH1);
// can add multiple events to the same listner
// can stop an eventListener - need to move the function to a named function

// onEvent - calling the event handeler with the word on infrom (Old way of doing eventListeners)
// h1.onmouseenter = function (e) {
//   alert("onmouseenter: Great! You are reading the heading :D");
// };
// can not add multiple events to the same listner. will overite each other

// add event as a html tag element
// example <h1 onclick = 'alert message'></h1>

// Events Propagation: bubbling and capturing

// randomizing colors
// rgb(255,255,255)
const randomInt = (max, min) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomCol = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector(".nav__link").addEventListener("click", function (e) {
  this.style.backgroundColor = randomCol();
  console.log("Link", e.target, e.currentTarget);
  //e.target point towards where the event happened and e.currentTarget point towards the element from which the event is fired

  // stop propagation
  // e.stopPropagation();
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  this.style.backgroundColor = randomCol();
  console.log("Container", e.target, e.currentTarget);
});

document.querySelector(".nav").addEventListener("click", function (e) {
  this.style.backgroundColor = randomCol();
  console.log("Nav", e.target, e.currentTarget);
});

// Dom traversing
const h1Again = document.querySelector("h1");

// Going Downwards: child
console.log(h1Again.querySelectorAll(".highlights"));

// Direct Child
console.log(h1Again.childNodes);
// more commonly used
console.log(h1Again.children);
// can call methods on the child
h1Again.firstElementChild.style.color = "white";
h1Again.lastElementChild.style.color = "orangered";

// Going upwards: parents
console.log(h1Again.parentNode);
console.log(h1Again.parentElement);

//closest method - use to get the closest parent to the element
h1Again.closest(".header").style.color = "var(--gradient-secondary)";

// Going Sideways: Siblings (only access direct siblings- previous and next)
console.log(h1Again.previousElementSibling);
console.log(h1Again.nextElementSibling);

//nodes
console.log(h1Again.previousSibling);
console.log(h1Again.nextSibling);

// to see all sibling of element. get the parent of the element and then get the children of the parent
console.log(h1Again.parentElement.children); // return an html spreadsheet
// use html spread in a array
[...h1Again.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = "scale(0.5)";
});

// Life Cycle - from the webpage is first acceseed until it is closed

// DOMContentLoaded -its the when the HTML is parsed and The Dom tree is build. After which the Javascript will load
document.addEventListener("DOMContentLoaded", function (e) {
  console.log("HTML parsed and DOM tree Build!");
});

// Loaded window event - when all the html and images and css content is parsed
window.addEventListener("load", function (e) {
  console.log("Page is fully loaded!");
});

// Before Unload event - this happens as the user closes the webpage (how you make a popup asking if they want to leave)
window.addEventListener("beforeunload", function (e) {
  e.preventDefault(); // have to prevent default
  console.log(e);
  e.returnValue = "";
});
