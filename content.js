document.addEventListener('fillForm', (e) => {
    fillForm(e.detail);
}, false);

function fillForm(data) {
    //if data exists, fill the form
    // console.log(data);
    if (data) {

        // get the active element
        const activeElement = document.activeElement;
        // check if the active element is an input or textarea
        // console.log(data);

        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            activeElement.value = data;  // insert the email
        }
    }
}