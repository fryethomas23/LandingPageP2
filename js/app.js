/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Comments should be present at the beginning of each procedure and class.
 * Great to have comments before crucial code sections within the procedure.
 */

/**
 * Define Global Variables
 *
 */

const navBar = document.getElementById("navbar__list");
const sections = document.querySelectorAll("section");
let activeSection = null;
let queuedSetActive = null;

/**
 * End Global Variables
 * Start Helper Functions
 *
 */
/**
 * Determines if an element is in the current view or not
 * @param {Element} element DOM element to compare with viewport
 * @returns {bool}
 */
const isNearViewportTop = (element) => {
  // const elementRect = element.getBoundingClientRect();
  return (
    window.scrollY < element.offsetTop &&
    element.offsetTop < window.scrollY + 400
  );
};

/**
 * queues a callback to run prior to the next animation from. Removes the previously queued function if one is provided.
 * @param {string || null} prevCallbackId id of currently queued calledback for next animation from
 * @param {func} newCallback function to queue for next animation frame
 * @returns
 */
const debounceCallback = (prevCallbackId, newCallback) => {
  if (prevCallbackId) window.cancelAnimationFrame(prevCallbackId);
  return window.requestAnimationFrame(() => {
    newCallback();
  });
};

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav
/**
 * Builds the navigation bar from the present sections
 */
const createNavigationBar = () => {
  navBar.style.cssText = `
            display: flex;
            flex-direction: row;
        `;
  for (const section of sections) {
    const sectionHeaderText = section.querySelectorAll("h2")[0].innerText;
    const sectionNumber = section.dataset.nav.split(" ").pop();

    const navItem = document.createElement("li");
    const navItemHeader = document.createElement("h4");

    const headerId = `header${sectionNumber}`;
    navItemHeader.classList.add("menu__link");
    navItemHeader.innerText = sectionHeaderText;
    navItemHeader.setAttribute("href", `${section.id}`);
    navItemHeader.setAttribute("id", headerId);
    section.dataset.headerId = headerId;

    navItem.appendChild(navItemHeader);
    navBar.appendChild(navItem);
  }
};

// Add class 'active' to section when near top of viewport
/**
 * Sets a section as active based off the position of the viewport
 * @returns {undefined}
 */
const makeSectionActive = () => {
  let topSection = [null, Number.POSITIVE_INFINITY];
  for (const section of sections) {
    if (!isNearViewportTop(section)) continue;
    const distanceToTop =
      window.pageYOffset + section.getBoundingClientRect().top;
    if (topSection[1] > distanceToTop) topSection = [section, distanceToTop];
  }
  if (topSection[0] === activeSection || !topSection[0]) return;
  if (activeSection) {
    activeSection.classList.remove("your-active-class");
    activeHeader = document.getElementById(activeSection.dataset.headerId);
    activeHeader.classList.remove("menu__link__active");
  }
  topSection[0].classList.add("your-active-class");
  header = document.getElementById(topSection[0].dataset.headerId);
  header.classList.add("menu__link__active");
  activeSection = topSection[0];
};

// Scroll to anchor ID using scrollTO event
/**
 * scrolls to an element if the event target contains the element id in its href attribute
 * @param {Event} e event
 * @returns {undefined}
 */
const scrollToElement = (e) => {
  e.preventDefault();
  const elementId = e.target.getAttribute("href");
  if (!elementId) return;
  const element = document.getElementById(elementId);
  element.scrollIntoView({
    block: "start",
    inline: "start",
    behavior: "smooth",
  });
};

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu
document.addEventListener("DOMContentLoaded", createNavigationBar);

// Scroll to section on link click
navBar.addEventListener("click", scrollToElement);

// Set sections as active
document.addEventListener("scroll", () => {
  queuedSetActive = debounceCallback(queuedSetActive, makeSectionActive);
});
