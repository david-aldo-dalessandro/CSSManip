/* main.js
* David D'Alessandro
* April 5, 2024
* Main JS file for the CSS manipulation project. 
At the point of inception this is one single file to handle all global variables, setters, 
getters, and logic. Breaking it down may occur in the future, but until then this is 
doing the job just fine. Separated by sections based on functionality and physical placement 
in the corresponding HTML file.
*/

import keyArray from "./selectorsKey.js";

let styleKey;
let styleValue;
let currentElement;
let newChild;
let prevStyle;
let allNodes = [];
let totalNodes = 0;
let printout = "Element Characteristics:\n";
let valueArray = [];

/////////////////////// setters ///////////////////////////////////
const setStyleKey = (value) => {
  styleKey = value;
};
const setStyleValue = (value) => {
  styleValue = value;
};
const setCurrentElement = (value) => {
  currentElement = value;
};
const setNewChild = (value) => {
  newChild = value;
};

const setAllNodes = (value) => {
  allNodes = [...value];
};
const setOneNode = (value) => {
  allNodes.push(value);
};
const setNodesBlack = () => {
  let currentNodeColor;
  document.querySelectorAll("*").forEach((node) => {
    currentNodeColor = node.style.color;
    node.style.color !== "red" && node.textContent !== "Delete Child"
      ? (node.style.color = currentNodeColor)
      : node.style.color === "red" && node.textContent !== "Delete Child"
      ? (node.style.color = prevStyle)
      : (node.style.color = "white");
  });
};
const removeOneNode = (value) => {
  let modifiedArray = allNodes.filter((node) => node.dataset.id !== value);
  allNodes = [...modifiedArray];
};

const increaseTotalNodes = () => {
  totalNodes++;
};

const setPrevStyle = (value) => {
  prevStyle = value;
};

const updateDivPrintout = () => {
  let newContent = "";
  const regex = /\d/;
  let style = getCurrentElement().style;
  if (currentElement) {
    for (const prop in style) {
      if (
        style[prop] &&
        !regex.test(prop) &&
        prop !== "length" &&
        !prop.includes("cssText") &&
        prop !== "getPropertyPriority" &&
        prop !== "getPropertyValue" &&
        prop !== "item" &&
        prop !== "removeProperty" &&
        prop !== "setProperty"
      ) {
        console.log(prop, style[prop]);
        newContent += `<br/><b>${prop}</b>:${style[prop]}`;
      }
    }
  }
  if (!newContent) {
    div_printout.textContent = printout + "no inline styling on this element";
  } else {
    div_printout.innerHTML = printout + newContent;
  }
};

/////////////////////// getters ///////////////////////////////////
const getStyleKey = () => {
  return styleKey;
};
const getStyleValue = () => {
  return styleValue;
};
const getCurrentElement = () => {
  return currentElement;
};
const getNewChild = () => {
  return newChild;
};
const getAllNodes = () => {
  return allNodes;
};
const getTotalNodes = () => {
  return totalNodes;
};
const getPrevStyle = () => {
  return prevStyle;
};
const getPrintout = () => {
  return printout;
};

/////////////////////// Generate ALL the CSS Selectors ///////////////////////
const makeOptions = (select, optionsArray) => {
  optionsArray.forEach((option) => {
    let newOption = document.createElement("option");
    newOption.textContent = option;
    select.appendChild(newOption);
  });
};

const addCSSSelectors = (select) => {
  if (select.id === "keyField") {
    makeOptions(select, keyArray);
  } else if (select.id === "valueField") {
    console.log(select);
  }
};

/////////////////////// DOM stuff ///////////////////////////////

let v = true;
var print = (log, v) => {
  return v && console.log(log);
};

let span_playground = document.querySelector("#playground");
let span_properties = document.querySelector("#properties");
let span_childAddition = document.querySelector("#childAddition");
var div_printout = document.querySelector("#printout");

div_printout.textContent = getPrintout();

let new_element = document.createElement("div");
new_element.textContent = "Start Here - Click Me!";
new_element.addEventListener("click", (e) => updateCurrentElement(e));
setOneNode(new_element);
span_playground.appendChild(new_element);

/////////////////////// CSS Property fields /////////////////////////

/* keyField
This is the element that takes in the CSS Property name i.e. color, margin, padding, so on
*/
/* let keyField = document.createElement("input");
keyField.setAttribute("placeholder", "CSS Property");
keyField.setAttribute("type", "text");
keyField.addEventListener("input", (e) => updateStyleKey(e));
span_properties.appendChild(keyField); */
let keyField = document.createElement("select");
keyField.setAttribute("id", "keyField");
let defaultKeyOption = document.createElement("option");
defaultKeyOption.textContent = "Select CSS Property";
keyField.appendChild(defaultKeyOption);
addCSSSelectors(keyField);
keyField.addEventListener("change", (e) => updateStyleKey(e));
span_properties.appendChild(keyField);

/* valueField
This is the element that takes in the CSS Property value to be assigned to the name
*/
let valueField = document.createElement("input");
valueField.setAttribute("placeholder", "CSS Value");
valueField.setAttribute("type", "text");
valueField.addEventListener("input", (e) => updateValueKey(e));
span_properties.appendChild(valueField);
/* let valueField = document.createElement("select");
valueField.setAttribute("id", "valueField");
let defaultValueOption = document.createElement("option");
defaultValueOption.textContent = "Select CSS Value";
valueField.appendChild(defaultValueOption);
addCSSSelectors(valueField); */
valueField.addEventListener("input", (e) => updateValueKey(e));
span_properties.appendChild(valueField);

/* submitButton
Submits the CSS property key-value combination on the selected element
*/
let submitButton = document.createElement("button");
submitButton.textContent = "submit";
submitButton.setAttribute("type", "submit");
submitButton.addEventListener("click", () =>
  newStyle(currentElement, getStyleKey(), getStyleValue())
);
span_properties.appendChild(submitButton);

/* clearStyleButton
Clears all the current styling of the selected element 
*/
let clearStyleButton = document.createElement("button");
clearStyleButton.textContent = "clear style";
clearStyleButton.addEventListener("click", () =>
  clearElementStyle(currentElement)
);
span_properties.appendChild(clearStyleButton);

////////////////////////// Add Child Nodes /////////////////////////

/* deleteChildButton
Takes the selected element and removes it from the element array and the document
*/
let deleteChildButton = document.createElement("button");
deleteChildButton.textContent = "Delete Child";
deleteChildButton.style.background = "indianred";
deleteChildButton.style.color = "white";
deleteChildButton.addEventListener("click", () => deleteChild(currentElement));
span_childAddition.appendChild(deleteChildButton);

/* childField
Takes in plain text and sets it as a variable to be submitted as a new element in the DOM
*/
let childField = document.createElement("input");
childField.setAttribute("placeholder", "enter child node info");
childField.setAttribute("type", "text");
childField.addEventListener("input", (e) => updateNewChild(e));
span_childAddition.appendChild(childField);

/* addChildButton
Sets the variable with the new HTML to a new element of the DOM
*/
let addChildButton = document.createElement("button");
addChildButton.textContent = "Add Child";
addChildButton.addEventListener("click", () =>
  addChild(currentElement, newChild)
);
span_childAddition.appendChild(addChildButton);

/////////////////////// Utility Functions ////////////////////////

/* updateStyleKey
e - event associated with event listener
Sets the style key global variable
*/
var updateStyleKey = (e) => {
  setStyleKey(e.target.value);
  print(`Current style: ${getStyleKey()}`, v);
};

/* updateValueKey
e - event associated with event listener
Sets the value key global variable
*/
var updateValueKey = (e) => {
  setStyleValue(e.target.value);
  print(`Current value: ${getStyleValue()}`, v);
};

/* updateCurrentElement
e - event associated with event listener
Sets the current element global variable and is responsible for changing the selected 
element to red so the user knows it was selected
*/
var updateCurrentElement = (e) => {
  currentElement = e.target;

  if (
    !getCurrentElement().style.color ||
    getCurrentElement().style.color !== "red"
  ) {
    setNodesBlack();
    setPrevStyle(e.target.style.color);
    getCurrentElement().style.color = "red";
  } else {
    getCurrentElement().style.color = getPrevStyle();
    setCurrentElement("");
  }
  currentElement &&
    print(`Current Element:  ${getCurrentElement().textContent}`, v);
  updateDivPrintout();
};

var updateNewChild = (e) => {
  newChild = e.target.value;
  print(`New Child: ${newChild}`, v);
};

var newStyle = (element, key, value) => {
  element.style[key] = value;
  console.log(element, key, value);
  updateDivPrintout();
};

var clearElementStyle = (element) => {
  if (element) {
    element.style = "";
    currentElement = "";
    div_printout.textContent = getPrintout();
  }
};

var addChild = (element, child) => {
  print(`Inside addChild: `, v);
  print(`Total nodes before: ${getTotalNodes()}`, v);
  increaseTotalNodes();

  print(`${element.textContent}`, v);
  print(`${child}`, v);
  let fragment = document.createElement("span");
  if (
    child[0] === "<" &&
    child[child.length - 1] === ">" &&
    child[1] !== " " &&
    child[1] !== ">" &&
    child.includes("/")
  ) {
    fragment.innerHTML = child;
    fragment.setAttribute("data-id", getTotalNodes());
    fragment.style.color = "black";

    setOneNode(fragment);
    print(`Total nodes after: ${getTotalNodes()}`, v);

    if (element) {
      element.appendChild(fragment);
    } else {
      console.log("no element selected");
    }
    getCurrentElement().style.color = getPrevStyle();
    setNodesBlack();
    setCurrentElement("");
  } else {
    print(`You entered incomplete or incorrect html: ${child}`, v);
  }
};

var deleteChild = (element) => {
  let value = element.parentNode.getAttribute("data-id");
  console.log(allNodes);
  removeOneNode(value);
  let nodeToRemove = document.querySelector(`[data-id="${value}"]`);
  nodeToRemove.remove();
  console.log(allNodes);
};