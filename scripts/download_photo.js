function downloadPhoto() {
    const username = document
        .querySelector('div.x1vqgdyp a[role="link"]')
        .getAttribute('aria-label')
    const url = document
        .querySelector('img[data-visualcompletion="media-vc-image"]')
        .getAttribute('src')

    if (url)
        chrome.runtime.sendMessage(null, {
            type: 'photo',
            username,
            url,
        })
}

downloadPhoto()
