const runApp = () => {
    // Home elements
    const textList = document.getElementById('textList');
    const addBtn = document.getElementById('addBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const undoBtn = document.getElementById('undoBtn');

    // Popup elements
    const popupContainer = document.getElementById('popupContainer');
    const popupInput = document.getElementById('popupInput');
    const acceptBtn = document.getElementById('acceptBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    const actionHistory = []; // Action history stack

    /**
     * This method handles showing or not the "Add text" pop up by modifying 
     * the display property of the popupContainer element.
     */  
    const triggerPopup = () => {
        const isOpened = popupContainer.style.display !== '';
        const attributeValueToSet = isOpened ? '' : CSS_SYSTEM_ATTRIBUTE_VALUES.BLOCK;

        popupContainer.style.display = attributeValueToSet;
    };

    /**
     * Method that handles the adition of a string value to the list
     * and adds a new entry to the "actionsHistory" array.
     * @param {string} text 
     */
    const addText = (text) => {
        const liElement = document.createElement(LI.toLowerCase());
        liElement.textContent = text;
        liElement.classList.add(CSS_SYSTEM_CLASSES.LIST_ITEM);
        textList.appendChild(liElement);

        actionHistory.push({ action: HistoryActions.ADD, text: text });
    };

    /**
     * This method validates the written value by the user on the popup input 
     * and calls "addText" function only if theres at least 1 character written.
     * @param {string} text
     */  
    const onClickAccept = () => {
        const text = popupInput.value.trim();
        if (text.length === 0) return;

        addText(text);
        triggerPopup();
        popupInput.value = '';
    }

    /**
     * Popup cancel button handler.
     * Closes the popup and resets the popup input value.
     */ 
    const onClickCancel = () => {
        triggerPopup();
        popupInput.value = '';
    }

    /**
     * Handles removal of all the previously selected items from the list 
     * and adds a new entry to the "actionsHistory" array.
     */
    const deleteSelectedItems = () => {
        const classToSearchFor = `${LI.toLowerCase()}.${CSS_SYSTEM_CLASSES.SELECTED}`;
        const selectedItems = document.querySelectorAll(classToSearchFor);
        if (selectedItems.length === 0) return;

        const deletedTexts = [];
        const removeItem = (item) => {
            deletedTexts.push(item.textContent);
            item.remove();
        };

        selectedItems.forEach((item) => removeItem(item));
        actionHistory.push({ action: HistoryActions.DELETE, texts: deletedTexts });
    };

    /**
     * Handles "undo" action over the list items (Add/Delete).
     */
    const undo = () => {
        const lastAction = actionHistory.pop();
        if (!lastAction || !Object.values(HistoryActions).includes(lastAction.action)) 
            return undefined;
        
        if (lastAction.action === HistoryActions.DELETE) { // DELETE ACTION
            const newListElement = lastAction.texts.map((text) => {
                const liElement = document.createElement(LI.toLowerCase());
                const { SELECTED, LIST_ITEM } = CSS_SYSTEM_CLASSES;
                liElement.classList.add(...[SELECTED, LIST_ITEM]);
                liElement.textContent = text;
                textList.appendChild(liElement);

                return liElement;
            });

            return newListElement;
        };

        return textList.lastElementChild.remove(); // ADD ACTION
    }

    /**
     * Function that handles "selection" of an item from the list.
     * @param {EventTarget} element 
     */
    const selectListElement = (element) => element.classList.toggle(CSS_SYSTEM_CLASSES.SELECTED);

    /**
     * Function that handles "delete" action of an item from the list.
     * @param {EventTarget} element 
     */
    const deleteListElement = (element) => {
        const texts = [element.textContent];
        element.remove();
        actionHistory.push({ action: HistoryActions.DELETE, texts });
    }

    /**
     * List li elements click and double-click abstract callback function. 
     * 
     * Validates click event by checking the existence of the target 
     * and checking if that same target is an "li" element. 
     * 
     * Calls a passed action if everything is ok.
     * @param {MouseEvent} event
     * @param {(target: EventTarget) => void} action
     */
    const clickEventHandler = (event, action) => {
        const target = event.target;
        if (!target || target.tagName !== LI) return;

        return action(target);
    }

    // Home elements listeners 
    textList.addEventListener('click',(event) => clickEventHandler(event, selectListElement));
    textList.addEventListener('dblclick', (event) => clickEventHandler(event, deleteListElement));
    addBtn.addEventListener('click', triggerPopup);
    deleteBtn.addEventListener('click', deleteSelectedItems);
    undoBtn.addEventListener('click', undo);

    // Popup elements listeners
    acceptBtn.addEventListener('click', onClickAccept);
    cancelBtn.addEventListener('click', onClickCancel);
};

// App function will run whenever DOMContentLoaded event is fired
document.addEventListener('DOMContentLoaded', runApp);