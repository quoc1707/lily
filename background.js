const host = 'facebook.com'
const hostname = 'facebook'
const canvas = new OffscreenCanvas(32, 32)
const context = canvas.getContext('2d')

let icon_background = null
let icon_arrow = null
let icon_redbar = null

function handleInstall() {
    chrome.action.disable()
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {
                            hostSuffix: host,
                        },
                    }),
                ],
                actions: [new chrome.declarativeContent.ShowAction()],
            },
        ])
    })
}

function handleMessage(message, sender) {
    const { site, username, url, noStoryAvailable } = message

    if (noStoryAvailable) {
        animateIconFailed(sender.tab.id)
        return
    }

    const date = new Date()
    const date_string = `${date.getFullYear()}-${
        date.getMonth() + 1
    }-${date.getDate()}`
    const extension = new RegExp(/\w{3,4}$/gm).exec(url)[0]
    const filename = `${username}'s ${site} ${date_string} story.${extension}`

    chrome.downloads.download({
        url,
        filename,
        saveAs: false,
    })
    animateIconArrowDown(sender.tab.id)
}

function handleClick(tab) {
    const { url, id } = tab

    if (!url) {
        animateIconFailed(id)
        return
    }

    if (url.indexOf(host) !== -1) {
        chrome.scripting.executeScript({
            target: { tabId: id },
            world: chrome.scripting.ExecutionWorld.MAIN,
            files: ['scripts/getUrl.js'],
        })
        chrome.scripting.executeScript({
            target: { tabId: id },
            files: ['scripts/download.js'],
        })
    }
}

async function fetchIcons() {
    let image_blob = await fetch(
        chrome.runtime.getURL('icons/32_background.png')
    ).then((r) => r.blob())

    icon_background = await createImageBitmap(image_blob)
    image_blob = await fetch(chrome.runtime.getURL('icons/32_arrow.png')).then(
        (r) => r.blob()
    )
    icon_arrow = await createImageBitmap(image_blob)
    image_blob = await fetch(chrome.runtime.getURL('icons/32_redbar.png')).then(
        (r) => r.blob()
    )
    icon_redbar = await createImageBitmap(image_blob)
}

function animateIconArrowDown(tabId, y = 7) {
    let done = false
    let animation_icon = setInterval(function () {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(icon_arrow, 8, y)
        context.drawImage(icon_background, 0, 0)
        chrome.action.setIcon({
            tabId: tabId,
            imageData: context.getImageData(0, 0, 32, 32),
        })

        y += 2

        if (done) clearInterval(animation_icon)
        if (y > 35) y = -17
        else if (y === 7) done = true
    }, 1000 / 30)
}

function animateIconFailed(tabId) {
    let angle = Math.PI / 2
    let fade = false
    let fade_alpha = 1
    let max_angle = (135 * Math.PI) / 180
    let animation_icon = setInterval(function () {
        let rotateAngle = Math.min(angle, max_angle)
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.globalAlpha = fade_alpha
        context.translate(16, 16)
        context.rotate(rotateAngle)
        context.drawImage(icon_redbar, -2, -9)
        context.rotate(-2 * rotateAngle)
        context.drawImage(icon_redbar, -2, -9)
        context.rotate(rotateAngle)
        context.translate(-16, -16)
        context.globalAlpha = 1
        context.drawImage(icon_background, 0, 0)
        chrome.action.setIcon({
            tabId: tabId,
            imageData: context.getImageData(0, 0, 32, 32),
        })

        angle += 0.08

        if (fade) fade_alpha -= 0.1
        if (angle > max_angle + 0.2) fade = true
        if (fade_alpha < 0) {
            animateIconArrowDown(tabId, -17)
            clearInterval(animation_icon)
        }
    }, 1000 / 30)
}

fetchIcons()

chrome.runtime.onInstalled.addListener(handleInstall)
chrome.runtime.onMessage.addListener(handleMessage)
chrome.action.onClicked.addListener(handleClick)
