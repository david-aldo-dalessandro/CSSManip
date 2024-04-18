/* main.js
* David D'Alessandro
* April 5, 2024
* Main JS file for the CSS manipulation project. 
At the point of inception this is one single file to handle all global variables, setters, 
getters, and logic. Breaking it down may occur in the future, but until then this is 
doing the job just fine. Separated by sections based on functionality and physical placement 
in the corresponding HTML file.
*/

import {
  keyArray,
  htmlArray,
  cssValues,
  psuedoClassArray,
} from "./selectorsKey.js";

let styleKey;
let styleValue;
let psuedoClassValue;
let psuedoClassKey;
let psuedoClassStart;
let psuedoClassEnd;
let currentElement;
let newChild;
let newChildType;
let htmlElement;
let prevStyle;
let allNodes = [];
let totalNodes = 0;
let printout = "Info:\n";
let choicesField;
let psuedoClassStartField;
let valuePlaceholder = "CSS Value";
let childFieldType;
let key, start, end;

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
  if (value === "input") {
    childFieldType.disabled = false;
    childFieldType.value = "";
    childFieldType.setAttribute("placeholder", "enter input type");
  } else {
    childFieldType.disabled = true;
    childFieldType.value = "";
    childFieldType.setAttribute("placeholder", "");
  }
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

const setPsuedoClassValue = (value) => {
  psuedoClassValue = value;
  if (value === "first-child" || value === "last-child") {
    psuedoClassStartField.disabled = true;
    psuedoClassStartField.placeholder = "";
  } else if (value === "nth-child") {
    psuedoClassStartField.disabled = false;
    psuedoClassStartField.placeholder = "an + b";
  } else {
    psuedoClassStartField.disabled = false;
    psuedoClassStartField.placeholder = "Start Value";
  }
};

const setPsuedoClassKey = (value) => {
  psuedoClassKey = value;
};

const setPsuedoClassKeyPlaceHolder = (value) => {
  if (value !== "CSS Property") {
    document.querySelector("#psuedoClassKeyField").value = value;
  } else {
    document.querySelector("#psuedoClassKeyField").value = "";
    document.querySelector("#psuedoClassKeyField").placeholder = value;
  }
};

const setPsuedoClassStart = (value) => {
  psuedoClassStart = value;
};

const setPsuedoClassEnd = (value) => {
  psuedoClassEnd = value;
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
const getNewChildType = () => {
  return newChildType;
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
const getPsuedoClassValue = () => {
  return psuedoClassValue;
};

const getPsuedoClassKey = () => {
  return psuedoClassKey;
};

const getPsuedoClassStart = () => {
  return psuedoClassStart;
};

const getPsuedoClassEnd = () => {
  return psuedoClassEnd;
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
  let n = getOneNode(element.element.dataset.id);
  /*   let n = allNodes.find(
    (node) => node.element.dataset.id === element.element.dataset.id
  ); */
  n.styleList[key] = value;
};

const addEventPropertiesToElement = (element, psuedoClass, key, start, end) => {
  let n = getOneNode(element.element.dataset.id);
  n[psuedoClass] = { key: key, start: start, end: end };
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
  } else if (select.id === "psuedoClassField") {
    makeOptions(select, psuedoClassArray);
  }
};
/////////////////////// Utility Functions ////////////////////////

/* updateStyleKey
e - event associated with event listener
Sets the style key global variable
*/
const updateStyleKey = (e) => {
  if (e.target.value === "Select CSS Property") {
    setStyleKey("");
    setPsuedoClassKey("");
    setPsuedoClassKeyPlaceHolder("CSS Property");
    setValuePlaceholder("CSS Value");
    while (choicesField.firstChild) {
      choicesField.removeChild(choicesField.firstChild);
    }
  } else {
    setStyleKey(e.target.value);
    setPsuedoClassKey(e.target.value);
    setValuePlaceholder("CSS Value");
    setPsuedoClassKeyPlaceHolder(e.target.value);
    while (choicesField.firstChild) {
      choicesField.removeChild(choicesField.firstChild);
    }
    makeOptions(choicesField, cssValues[styleKey]);
  }
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

const updateNewChildType = (e) => {
  newChildType = e.target.value;
};

const newStyle = (element, key, value) => {
  if (element) {
    element.style[key] = value; //sets the element on the page
    getOneNode(element.dataset.id).styleList[key] = value; //sets the corresponding node in the array
    setNodesBlack();
    setCurrentElement("");
    updateDivPrintout();
  } else {
    setNodesBlack();
    setCurrentElement("");
    updateDivPrintout();
  }
};

const clearElementStyle = (element) => {
  if (element && element.dataset.id !== "0") {
    element.style = "";
    element.style.color = "black";
    removePsuedoClass(element);
    addStyleToElement(getOneNode(currentElement.dataset.id), "color", "black");

    setCurrentElement("");
    div_printout.textContent = getPrintout();
    updateDivPrintout;
    getOneNode(element.dataset.id).styleList = { color: "black" };
  } else {
    removePsuedoClass(element);
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
  if (element && getHtmlElement() !== "label") {
    if (getTotalNodes() === 0) {
      new_element.textContent = "";
    }

    increaseTotalNodes();

    let fragment = document.createElement(getHtmlElement());
    fragment.textContent = child;
    if (getHtmlElement() === "input") {
      fragment.setAttribute("type", getNewChildType());
      fragment.setAttribute("name", `${element.tagName} ${element.dataset.id}`);
    }

    fragment.setAttribute("data-id", getTotalNodes());
    fragment.setAttribute("id", getHtmlElement() + getTotalNodes());
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
  } else if (getHtmlElement() === "label") {
    const parentElement = element.parentNode;
    const nextSibling = element.nextSibling;

    let fragment = document.createElement(getHtmlElement());
    fragment.textContent = child;
    fragment.setAttribute("type", getNewChildType());
    fragment.setAttribute("for", element.id);

    fragment.setAttribute("id", getHtmlElement() + element.dataset.id);
    if (nextSibling && nextSibling.tagName !== "LABEL") {
      console.log(nextSibling.tagName);
      parentElement.insertBefore(fragment, nextSibling);
    } else if (!nextSibling) {
      parentElement.appendChild(fragment);
    }
    setNodesBlack();
    setCurrentElement("");
    updateDivPrintout();
  } else {
    console.log("no element selected");
  }
};

const deleteChild = (element) => {
  if (element && element.dataset.id !== "0") {
    let value = element.getAttribute("data-id");
    console.log(allNodes);
    removeOneNode(value);

    let nodeToRemove = document.querySelector(`[data-id="${value}"]`);
    let nodeType = nodeToRemove.type;
    nodeToRemove.remove();
    if (document.querySelector(`#label${value}`)) {
      let labelToRemove = document.querySelector(`#label${value}`);

      if (labelToRemove) {
        labelToRemove.remove();
      }
    }

    console.log(allNodes);
    setNodesBlack();
    setCurrentElement("");
    updateDivPrintout();
  } else {
    let value = element.getAttribute("data-id");
    if (document.querySelector(`#label${value}`)) {
      let labelToRemove = document.querySelector(`#label${value}`);

      if (labelToRemove) {
        labelToRemove.remove();
      }
    }
  }
};

const attachPsuedoClass = () => {
  if (currentElement && currentElement.dataset.id !== 0) {
    addStyleToElement(
      getOneNode(currentElement.dataset.id),
      "psuedo-class",
      getPsuedoClassValue() + " on " + psuedoClassKey
    );
    if (getPsuedoClassValue() === "hover") {
      if (getPsuedoClassKey() && getPsuedoClassStart() && getPsuedoClassEnd()) {
        attachHover();
      }
    } else if (getPsuedoClassValue() === "active") {
      if (getPsuedoClassKey() && getPsuedoClassStart() && getPsuedoClassEnd()) {
        attachActive();
      }
    } else if (getPsuedoClassValue() === "focus") {
      if (getPsuedoClassKey() && getPsuedoClassStart() && getPsuedoClassEnd()) {
        attachFocus();
      }
    } else if (getPsuedoClassValue() === "first-child") {
      if (getPsuedoClassKey() && getPsuedoClassEnd()) {
        attachFirstChild();
      }
    } else if (getPsuedoClassValue() === "last-child") {
      if (getPsuedoClassKey() && getPsuedoClassEnd()) {
        attachLastChild();
      }
    } else if (getPsuedoClassValue() === "nth-child") {
      if (getPsuedoClassKey() && getPsuedoClassEnd()) {
        attachNthChild();
      }
    }
  }
};

const changeStyleOnHover = (Key, Start, End) => {
  key = Key;
  let node = getOneNode(currentElement.dataset.id);
  addEventPropertiesToElement(node, "hover", Key, Start, End);
  currentElement.addEventListener("mouseover", addEndProperty);
  currentElement.addEventListener("mouseout", addStartProperty);
  newStyle(node.element, Key, Start);
};

const changeStyleOnActive = (Key, Start, End) => {
  key = Key;
  let node = getOneNode(currentElement.dataset.id);
  addEventPropertiesToElement(node, "active", Key, Start, End);
  currentElement.addEventListener("mousedown", addStartProperty);
  currentElement.addEventListener("mouseup", addEndProperty);
  newStyle(node.element, Key, End);
};

const changeStyleOnFocus = (Key, Start, End) => {
  key = Key;
  let node = getOneNode(currentElement.dataset.id);
  addEventPropertiesToElement(node, "focus", Key, Start, End);
  currentElement.addEventListener("focus", addStartProperty);
  currentElement.addEventListener("blur", addEndProperty);
  newStyle(currentElement, Key, End);
};

const changeStyleOnFirstChild = (Key, Start, End) => {
  key = Key;
  let node = getOneNode(currentElement.dataset.id);
  addEventPropertiesToElement(node, "firstChild", Key, Start, End);
  newStyle(currentElement.children[0], Key, End);
};

const changeStyleOnLastChild = (Key, Start, End) => {
  key = Key;
  let node = getOneNode(currentElement.dataset.id);
  addEventPropertiesToElement(node, "lastChild", Key, Start, End);
  newStyle(
    currentElement.children[currentElement.children.length - 1],
    Key,
    End
  );
};

const clearStyleOnNthChild = (Node, Formula) => {
  let formula = Formula.split(" ").join("");
  let form = [...formula];
  const regex = /^(?:\d|[1-9]\d|99)$/;
  let a;
  let b;
  let check;

  if (form[0] === "n") {
    check = true;
    if (form.length === 3 && regex.test(form[2])) {
      b = Number(form[2]);
    } else if (
      form.length === 4 &&
      regex.test(form[2]) &&
      regex.test(form[3])
    ) {
      console.log("setting b");
      b = Number(form[2] + form[3]);
    }
  } else if (regex.test(form[0]) || regex.test(form[3])) {
    check = true;
    if (form.length > 1) {
      a = Number(form[0]);
    }
    if (form.length > 2) {
      b = Number(form[3]);
    }
  }

  if (check) {
    let j;
    console.log("passed");
    if (a && b) {
      console.log(a, b);
      for (let i = 0; i < Node.element.children.length; i++) {
        j = a * i + b - 1;
        console.log(i, j);
        if (j < Node.element.children.length) {
          Node.element.children[j].style = "";
          Node.element.children[j].style.color = "black";
        }
      }
    } else if (a && !b) {
      console.log(a, b);
      for (let i = 1; i < Node.element.children.length; i++) {
        j = a * i - 1;
        console.log(j);
        if (j < Node.element.children.length) {
          Node.element.children[j].style = "";
          Node.element.children[j].style.color = "black";
        }
      }
    } else if (!a && b) {
      console.log(a, b);
      for (let i = 0; i < Node.element.children.length; i++) {
        j = b + i - 1;
        console.log(j);
        if (j < Node.element.children.length) {
          Node.element.children[j].style = "";
          Node.element.children[j].style.color = "black";
        }
      }
    } else if (!a && !b) {
      console.log(a, b);
      for (let i = 0; i < Node.element.children.length; i++) {
        console.log(i);
        Node.element.children[i].style = "";
        Node.element.children[i].style.color = "black";
      }
    }
  }
  setNodesBlack();
  setCurrentElement("");
  updateDivPrintout();
};

const changeStyleOnNthChild = (Key, Formula, End) => {
  let formula = Formula.split(" ").join("");
  let form = [...formula];
  const regex = /^(?:\d|[1-9]\d|99)$/;
  let a;
  let b;
  let check;

  if (form[0] === "n") {
    check = true;
    if (form.length === 3 && regex.test(form[2])) {
      b = Number(form[2]);
    } else if (
      form.length === 4 &&
      regex.test(form[2]) &&
      regex.test(form[3])
    ) {
      console.log("setting b");
      b = Number(form[2] + form[3]);
    }
  } else if (regex.test(form[0]) || regex.test(form[3])) {
    check = true;
    if (form.length > 1) {
      a = Number(form[0]);
    }
    if (form.length > 2) {
      b = Number(form[3]);
    }
  }
  key = Key;
  let node = getOneNode(currentElement.dataset.id);

  if (check) {
    let j;
    console.log("passed");
    addEventPropertiesToElement(node, "nthChild", Key, Formula, End);
    if (a && b) {
      console.log(a, b);
      for (let i = 0; i < currentElement.children.length; i++) {
        j = a * i + b - 1;
        console.log(i, j);
        if (j < currentElement.children.length) {
          currentElement.children[j].style[key] = End;
          getOneNode(currentElement.children[j].dataset.id).styleList[key] =
            End;
        }
      }
    } else if (a && !b) {
      console.log(a, b);
      for (let i = 1; i < currentElement.children.length; i++) {
        j = a * i - 1;
        console.log(j);
        if (j < currentElement.children.length) {
          currentElement.children[j].style[key] = End;
          getOneNode(currentElement.children[j].dataset.id).styleList[key] =
            End;
        }
      }
    } else if (!a && b) {
      console.log(a, b);
      for (let i = 0; i < currentElement.children.length; i++) {
        j = b + i - 1;
        console.log(j);
        if (j < currentElement.children.length) {
          currentElement.children[j].style[key] = End;
          getOneNode(currentElement.children[j].dataset.id).styleList[key] =
            End;
        }
      }
    } else if (!a && !b) {
      console.log(a, b);
      for (let i = 0; i < currentElement.children.length; i++) {
        console.log(i);
        currentElement.children[i].style[key] = End;
        getOneNode(currentElement.children[i].dataset.id).styleList[key] = End;
      }
    }
  }

  setNodesBlack();
  setCurrentElement("");
  updateDivPrintout();
};

const addStartProperty = (event) => {
  let n = getOneNode(event.target.dataset.id);
  console.log(n);
  if (event.type === "mouseout") {
    event.target.style[n.hover.key] = n.hover.start;
    n.styleList[n.hover.key] = n.hover.start;
  }
  if (event.type === "mousedown") {
    event.target.style[n.active.key] = n.active.start;
    n.styleList[n.active.key] = n.active.start;
  }
  if (event.type === "focus") {
    event.target.style[n.focus.key] = n.focus.start;
    n.styleList[n.focus.key] = n.focus.start;
  }
  updateDivPrintout("");
};

const addEndProperty = (event) => {
  let n = getOneNode(event.target.dataset.id);
  event.stopPropagation();
  if (event.type === "mouseover") {
    event.target.style[n.hover.key] = n.hover.end;
    n.styleList[n.hover.key] = n.hover.end;
  }
  if (event.type === "mouseup") {
    event.target.style[n.active.key] = n.active.end;
    n.styleList[n.active.key] = n.active.end;
  }
  if (event.type === "blur") {
    event.target.style[n.focus.key] = n.focus.end;
    n.styleList[n.focus.key] = n.focus.end;
  }
  updateDivPrintout("");
};

const attachHover = () => {
  changeStyleOnHover(psuedoClassKey, psuedoClassStart, psuedoClassEnd);
};

const attachActive = () => {
  changeStyleOnActive(psuedoClassKey, psuedoClassStart, psuedoClassEnd);
};

const attachFocus = () => {
  changeStyleOnFocus(psuedoClassKey, psuedoClassStart, psuedoClassEnd);
};

const attachFirstChild = () => {
  changeStyleOnFirstChild(psuedoClassKey, psuedoClassStart, psuedoClassEnd);
};

const attachLastChild = () => {
  changeStyleOnLastChild(psuedoClassKey, psuedoClassStart, psuedoClassEnd);
};

const attachNthChild = () => {
  changeStyleOnNthChild(psuedoClassKey, psuedoClassStart, psuedoClassEnd);
};

const removePsuedoClass = (element) => {
  if (element) {
    let node = getOneNode(element.dataset.id);
    console.log(node);
    if (node.styleList["psuedo-class"]) {
      if (node.hover) {
        element.removeEventListener("mouseover", addEndProperty);
        element.removeEventListener("mouseout", addStartProperty);
        delete node.hover;
      }
      if (node.active) {
        element.removeEventListener("mousedown", addStartProperty);
        element.removeEventListener("mouseup", addEndProperty);
        delete node.active;
      }
      if (node.focus) {
        element.removeEventListener("focus", addStartProperty);
        element.removeEventListener("blur", addEndProperty);
        delete node.focus;
      }
      if (node.firstChild) {
        clearElementStyle(element.children[0]);
        delete node.firstChild;
      }
      if (node.lastChild) {
        clearElementStyle(element.children[element.children.length - 1]);
        delete node.lastChild;
      }
      if (node.nthChild) {
        let node = getOneNode(element.dataset.id);
        clearStyleOnNthChild(node, node.nthChild.start);
        delete node.nthChild;
      }
    }
    delete node.styleList["psuedo-class"];
  }
};

/////////////////////// DOM stuff ///////////////////////////////

let v = true;
const print = (log, v) => {
  return v && console.log(log);
};

let span_playground = document.querySelector("#playground");
let span_psuedoClasses = document.querySelector("#psuedoClasses");
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

/* psuedoClassField
 */
let psuedoClassField = document.createElement("select");
psuedoClassField.setAttribute("id", "psuedoClassField");
let defaultPsuedoClassFieldOption = document.createElement("option");
defaultPsuedoClassFieldOption.textContent = "Select Class";
psuedoClassField.appendChild(defaultPsuedoClassFieldOption);
addSelectors(psuedoClassField);
psuedoClassField.addEventListener("change", (e) =>
  setPsuedoClassValue(e.target.value)
);
span_psuedoClasses.appendChild(psuedoClassField);

/* psuedoClassKeyField
 */
let psuedoClassKeyField = document.createElement("input");
psuedoClassKeyField.style.width = "100px";
psuedoClassKeyField.setAttribute("id", "psuedoClassKeyField");
psuedoClassKeyField.setAttribute("placeholder", "CSS Property");
psuedoClassKeyField.setAttribute("type", "text");
psuedoClassKeyField.addEventListener("input", (e) =>
  setPsuedoClassKey(e.target.value)
);
span_psuedoClasses.appendChild(psuedoClassKeyField);

/* psuedoClassStartField
 */
psuedoClassStartField = document.createElement("input");
psuedoClassStartField.style.width = "100px";
psuedoClassStartField.disabled = false;
psuedoClassStartField.setAttribute("id", "psuedoClassStartField");
psuedoClassStartField.setAttribute("placeholder", "Start Value");
psuedoClassStartField.setAttribute("type", "text");
psuedoClassStartField.addEventListener("input", (e) =>
  setPsuedoClassStart(e.target.value)
);
span_psuedoClasses.appendChild(psuedoClassStartField);

/* psuedoClassEndField
 */
let psuedoClassEndField = document.createElement("input");
psuedoClassEndField.style.width = "100px";
psuedoClassEndField.setAttribute("id", "psuedoClassEndField");
psuedoClassEndField.setAttribute("placeholder", "End Value");
psuedoClassEndField.setAttribute("type", "text");
psuedoClassEndField.addEventListener("input", (e) =>
  setPsuedoClassEnd(e.target.value)
);
span_psuedoClasses.appendChild(psuedoClassEndField);

/* attachButton
Submits the CSS property key-value combination on the selected element
*/
let attachButton = document.createElement("button");
attachButton.textContent = "submit";
attachButton.setAttribute("type", "submit");
attachButton.addEventListener("click", () => attachPsuedoClass());
span_psuedoClasses.appendChild(attachButton);

/* keyField
This is the element that takes in the CSS Property name i.e. color, margin, padding, so on
*/
let keyField = document.createElement("select");
keyField.style.width = "175px";
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
choicesField.style.width = "100px";
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
valueField.style.width = "100px";
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
childField.style.width = "100px";
childField.setAttribute("placeholder", "enter text");
childField.setAttribute("type", "text");
childField.addEventListener("input", (e) => updateNewChild(e));
span_childAddition.appendChild(childField);

/* childFieldType
Takes in plain text and sets it as a variable to be submitted as a new element in the DOM
*/
childFieldType = document.createElement("input");
childFieldType.style.width = "100px";
childFieldType.setAttribute("disabled", true);
childFieldType.setAttribute("placeholder", "");
childFieldType.setAttribute("type", "text");
childFieldType.addEventListener("input", (e) => updateNewChildType(e));
span_childAddition.appendChild(childFieldType);

/* addChildButton
Sets the variable with the new HTML to a new element of the DOM
*/
let addChildButton = document.createElement("button");
addChildButton.textContent = "Add Child";
addChildButton.addEventListener("click", () =>
  addChild(currentElement, newChild, newChildType)
);
span_childAddition.appendChild(addChildButton);
