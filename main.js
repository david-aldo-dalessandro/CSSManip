/* main.js
* David D'Alessandro
* April 5, 2024
* Main JS file for the CSS manipulation project. 
At the point of inception this is one single file to handle all global variables, setters, 
getters, and logic. Breaking it down may occur in the future, but until then this is 
doing the job just fine. Separated by sections based on functionality and physical placement 
in the corresponding HTML file.
*/

import { keyArray, htmlArray, cssValues } from "./selectorsKey.js";

let styleKey;
let styleValue;
let currentElement;
let newChild;
let htmlElement;
let prevStyle;
let allNodes = [];
let totalNodes = 0;
let printout = "Info:\n";
let choicesField;
let valuePlaceholder = "CSS Value";

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
const setHtmlElement = (value) => {
  htmlElement = value;
};
const setValuePlaceholder = (value) => {
  valuePlaceholder = value;
  if (value === "CSS Value") {
    valueField.setAttribute("value", ``);
    valueField.setAttribute("placeholder", `${value}`);
  } else if (value.includes("<") && value.includes(">")) {
    valueField.setAttribute("value", ``);
    valueField.setAttribute(
      "placeholder",
      `enter something for ${valuePlaceholder}`
    );
    document.querySelector("#valueField").value = "";
  } else {
    valueField.setAttribute("value", `${valuePlaceholder}`);
    updateValueKey(valuePlaceholder);
    document.querySelector("#valueField").value = valuePlaceholder;
  }
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
  let currentNodeInArrayColor;
  for (let i = 0; i < allNodes.length; i++) {
    currentNodeInArrayColor = allNodes[i].styleList.color;
    if (allNodes[i].styleList.color != "red") {
      allNodes[i].styleList.color = currentNodeInArrayColor;
    } else if (allNodes[i].styleList.color === "red") {
      allNodes[i].styleList.color = prevStyle;
    }
  }
};

const removeOneNode = (value) => {
  console.log(value);
  let modifiedArray = allNodes.filter(
    (node) => node.element.dataset.id !== value
  );
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
  if (currentElement) {
    let node = getOneNode(getCurrentElement().element.dataset.id);
    newContent =
      "<br/>Element Type: <b>" + node.element.localName + "</b> <br/> ";
    for (let style in node.styleList) {
      newContent += `<b>${style}</b>:${node.styleList[style]}<br/>`;
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
  if (currentElement) {
    return getOneNode(currentElement.dataset.id);
  }
};
const getNewChild = () => {
  return newChild;
};
const getAllNodes = () => {
  return allNodes;
};
const getOneNode = (nodeId) => {
  return allNodes.find((node) => node.element.dataset.id === nodeId);
};
const getTotalNodes = () => {
  return totalNodes;
};
const getPrevStyle = () => {
  if (prevStyle === "") {
    return "black";
  } else {
    return prevStyle;
  }
};
const getPrintout = () => {
  return printout;
};
const getHtmlElement = () => {
  return htmlElement;
};
const getValuePlaceholder = () => {
  return valuePlaceholder;
};

/////////////////////// Element Object Creation /////////////////////////

/* newElementObject
element - the HTML element to associate with this object
Creates a new instance of an Element Object to hold the HTML element as well as
its style object
*/
function newElementObject(element) {
  this.element = element;
  this.styleList = {};
}

/* addStyleToElement
element - HTML element that is having its style updated
key - CSS selector 
value - value of the CSS Selector
*/
const addStyleToElement = (element, key, value) => {
  let n = allNodes.find(
    (node) => node.element.dataset.id === element.element.dataset.id
  );
  n.styleList[key] = value;
};

/////////////////////// Generate ALL the CSS Selectors ///////////////////////
const makeOptions = (select, optionsArray) => {
  if (select.id === "choicesField") {
    setValuePlaceholder(optionsArray[0]);
    updateValueKey(optionsArray[0]);
  }
  optionsArray.forEach((option) => {
    let newOption = document.createElement("option");
    newOption.textContent = option;
    select.appendChild(newOption);
  });
};

const addSelectors = (select) => {
  if (select.id === "keyField") {
    makeOptions(select, keyArray);
  } else if (select.id === "valueField") {
    console.log(select);
  } else if (select.id === "htmlField") {
    makeOptions(select, htmlArray);
  }
};
/////////////////////// Utility Functions ////////////////////////

/* updateStyleKey
e - event associated with event listener
Sets the style key global variable
*/
const updateStyleKey = (e) => {
  setStyleKey(e.target.value);
  setValuePlaceholder("CSS Value");
  while (choicesField.firstChild) {
    choicesField.removeChild(choicesField.firstChild);
  }
  makeOptions(choicesField, cssValues[styleKey]);
};

/* updateValueKey
  e - event associated with event listener
  Sets the value key global variable
  */
const updateValueKey = (e) => {
  if (e.target) {
    setStyleValue(e.target.value);
  } else {
    setStyleValue(e);
  }
};

/* updateCurrentElement
  e - event associated with event listener
  Sets the current element global variable and is responsible for changing the selected 
  element to red so the user knows it was selected
  */
const updateCurrentElement = (e) => {
  e.stopPropagation();
  setCurrentElement(e.target);
  if (
    !getCurrentElement().styleList["color"] ||
    getCurrentElement().styleList["color"] !== "red"
  ) {
    setNodesBlack();
    setPrevStyle(e.target.style.color);
    addStyleToElement(getOneNode(currentElement.dataset.id), "color", "red"); //set the node in the array
    getCurrentElement().element.style.color = "red"; //set the actual element on the page
  } else {
    addStyleToElement(
      getOneNode(currentElement.dataset.id),
      "color",
      getPrevStyle()
    );
    getCurrentElement().element.style.color = getPrevStyle();
    setCurrentElement("");
  }
  updateDivPrintout();
};

const updateNewChild = (e) => {
  newChild = e.target.value;
};

const newStyle = (element, key, value) => {
  if (element) {
    element.style[key] = value; //sets the element on the page
    getOneNode(currentElement.dataset.id).styleList[key] = value; //sets the corresponding node in the array
    setNodesBlack();
    setCurrentElement("");
    updateDivPrintout();
  }
};

const clearElementStyle = (element) => {
  if (element && element.dataset.id !== "0") {
    element.style = "";
    element.style.color = "black";
    setCurrentElement("");
    div_printout.textContent = getPrintout();
    updateDivPrintout;
    getOneNode(element.dataset.id).styleList = { color: "black" };
  } else {
    element.style = "";
    element.style.color = "black";
    element.style.border = "solid";
    setCurrentElement("");
    div_printout.textContent = getPrintout();
    updateDivPrintout();
    getOneNode(element.dataset.id).styleList = {
      color: "black",
      border: "solid",
    };
  }
};

/*addChild
  This originally took input for a child element and used a span to set innerHTML to the child
  tags and content. Now I dynamically set the element using the element type that the user enters
  and set the textContent using their input instead. 
  */
const addChild = (element, child) => {
  if (element) {
    if (getTotalNodes() === 0) {
      new_element.textContent = "";
    }
    increaseTotalNodes();

    let fragment = document.createElement(getHtmlElement());
    fragment.textContent = child;

    fragment.setAttribute("data-id", getTotalNodes());
    fragment.style.color = "black";

    let newChildNode = new newElementObject(fragment);
    setOneNode(newChildNode);
    addStyleToElement(newChildNode, "color", "black");
    element.appendChild(fragment);
    getCurrentElement().element.style.color = getPrevStyle();
    getCurrentElement().styleList["color"] = getPrevStyle();
    setNodesBlack();
    setCurrentElement("");
    updateDivPrintout();
  } else {
    console.log("no element selected");
  }
};

const deleteChild = (element) => {
  let value = element.getAttribute("data-id");
  console.log(allNodes);
  removeOneNode(value);

  let nodeToRemove = document.querySelector(`[data-id="${value}"]`);
  nodeToRemove.remove();
  console.log(allNodes);
  setNodesBlack();
  setCurrentElement("");
  updateDivPrintout();
};

/////////////////////// DOM stuff ///////////////////////////////

let v = true;
const print = (log, v) => {
  return v && console.log(log);
};

let span_playground = document.querySelector("#playground");
let span_properties = document.querySelector("#properties");
let span_childAddition = document.querySelector("#childAddition");
let div_printout = document.querySelector("#printout");

div_printout.textContent = getPrintout();

let new_element = document.createElement("div");
new_element.textContent = " ";
new_element.setAttribute("data-id", 0);
new_element.style.border = "solid";
new_element.addEventListener("click", (e) => updateCurrentElement(e));
span_playground.appendChild(new_element);
let new_element_Object = new newElementObject(new_element);
setOneNode(new_element_Object);
addStyleToElement(new_element_Object, "color", "black");
addStyleToElement(new_element_Object, "border", "solid");

/////////////////////// CSS Property fields /////////////////////////

/* keyField
This is the element that takes in the CSS Property name i.e. color, margin, padding, so on
*/
let keyField = document.createElement("select");
keyField.setAttribute("id", "keyField");
let defaultKeyOption = document.createElement("option");
defaultKeyOption.textContent = "Select CSS Property";
keyField.appendChild(defaultKeyOption);
addSelectors(keyField);
keyField.addEventListener("change", (e) => updateStyleKey(e));
span_properties.appendChild(keyField);

/* choicesField
This is the element to display all possible options for the key selected
*/
choicesField = document.createElement("select");
choicesField.setAttribute("id", "choicesField");
choicesField.addEventListener("change", (e) =>
  setValuePlaceholder(e.target.value)
);
let defaultChoicesOption = document.createElement("option");
defaultChoicesOption.textContent = "choice";
choicesField.appendChild(defaultChoicesOption);
span_properties.appendChild(choicesField);

/* valueField
This is the element that takes in the CSS Property value to be assigned to the name
*/
let valueField = document.createElement("input");
valueField.setAttribute("id", "valueField");
valueField.setAttribute("placeholder", `${getValuePlaceholder()}`);
valueField.setAttribute("type", "text");
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

/* htmlField
Drop down of every single html element to choose from 
*/
let htmlField = document.createElement("select");
htmlField.setAttribute("id", "htmlField");
htmlField.addEventListener("change", (e) => setHtmlElement(e.target.value));
let defaultHtmlOption = document.createElement("option");
defaultHtmlOption.textContent = "Select HTML Element";
htmlField.appendChild(defaultHtmlOption);
addSelectors(htmlField);
span_childAddition.appendChild(htmlField);

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
