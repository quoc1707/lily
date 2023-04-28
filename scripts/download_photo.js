function downloadPhoto() {
    const is_viewing_photo = window.location.href.indexOf('photo') !== -1

    if (is_viewing_photo) {
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
    } else
        chrome.runtime.sendMessage(null, {
            noPhotoAvailable: true,
        })
}

downloadPhoto()
