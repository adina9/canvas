'use strict'

const COLOR_KEY = 'color';


function setFilter(filter) {
    gCurrShape = filter
}


function usersubmitForm(userPrefs) {
    saveToStorage(COLOR_KEY, userPrefs);
}

function getUserColors() {
    return loadFromStorage(COLOR_KEY)
}