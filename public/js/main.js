"use strict";

import App from "./app.js";


const mainContainer = document.querySelector('#myTasks');
const navLinks = document.querySelector('#nav-links');

const app = new App(mainContainer, navLinks);

