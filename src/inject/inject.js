function findDiff(element) {
    let el = element;
    while (el.parentNode != null && el.id.indexOf("diff-") < 0) {
        el = el.parentNode
    }
    return el.id
}

function onPageScroll() {
    for (let elementsByClassNameElement of document.getElementsByClassName("mr-1 js-reviewed-checkbox")) {
        let diff = findDiff(elementsByClassNameElement)
        let checked = elementsByClassNameElement.hasAttribute("checked")
        if (!checked) {
            let hidden = document.querySelector(diff + " > div.js-file-content.Details-content--hidden > div")
            if (hidden != null && hidden.innerHTML != null && hidden.innerHTML.indexOf("Whitespace-only changes") > -1) {
                elementsByClassNameElement.click()
            }
        }
    }
}

function onPageReady() {

    let location = window.location.href;
    console.log("href: " + location)
    if (location.indexOf("pull") > -1 && location.indexOf("files") > -1) {
        if (location.indexOf("w=1") < 0) {
            let a = "?"
            if (location.indexOf("?") > -1) a = "&"
            window.location = location + a + "w=1"
        }
    }

    const debounced = null
    document.onscroll = () => {
        setInterval(function () {
            clearInterval(debounced);
            onPageScroll();
        }, 3000);
    }
}

chrome.extension.sendMessage({}, function (response) {
    const readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            onPageReady();
        }
    }, 10);
});
