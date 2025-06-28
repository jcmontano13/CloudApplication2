/* browser side java script */
const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const mobileMenuElement = document.getElementById('mobile-menu');

function toggleMobileMenu() {
    mobileMenuElement.classList.toggle('open') //manage class part of the element
}

mobileMenuBtnElement.addEventListener('click', toggleMobileMenu);