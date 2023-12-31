let button = document.querySelector("#btn")


button.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Send message to the content script of the active tab
        chrome.tabs.sendMessage(tabs[0].id, { text: "c" });
    });
});
