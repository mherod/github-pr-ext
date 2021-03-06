function findDiff(element) {
    let el = element;
    while (el.parentNode != null && el.id.indexOf("diff-") < 0) {
        el = el.parentNode
    }
    return el.id
}

function onPageScroll() {
    for (let viewedCheckboxElement of document.getElementsByClassName("mr-1 js-reviewed-checkbox")) {
        let diff = findDiff(viewedCheckboxElement)
        let checked = viewedCheckboxElement.hasAttribute("checked")
        if (!checked) {
            let hidden = document.querySelector("#" + diff + " > div.js-file-content.Details-content--hidden > div")
            if (hidden != null && hidden.innerHTML != null && hidden.innerHTML.indexOf("Whitespace-only changes") > -1) {
                viewedCheckboxElement.click()
            }
        }
    }
}

function checkLocationForRedirect() {
    let location = window.location.href;
    console.log("href: " + location)
    if (location.indexOf("pull") > -1 && location.indexOf("files") > -1) {
        if (location.indexOf("w=1") < 0) {
            let a = "?"
            if (location.indexOf("?") > -1) a = "&"
            window.location = location + a + "w=1"
        }
    }
}

function onPageReady() {

    checkLocationForRedirect();

    const debounced = null
    document.onscroll = () => {
        setInterval(function () {
            clearInterval(debounced);
            onPageScroll();
        }, 1000);
    }
    window.addEventListener('locationchange', function(){
        checkLocationForRedirect()
    })
}

chrome.extension.sendMessage({}, function (response) {
    const readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            onPageReady();
        }
    }, 10);
});
