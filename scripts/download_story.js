function downloadStory() {
    const username = document.querySelector(
        "a[role=link][tabindex='0'][href*='https://www.facebook']>img"
    ).alt
    const url = document.head.getAttribute('data-story-url')
    let story = document.querySelectorAll('img[draggable=false]')
    let videos = document.querySelectorAll('video')
    let video = null

    for (const vid of videos) if (vid.offsetHeight !== 0) video = vid

    if (story && (!video || url === 'null'))
        chrome.runtime.sendMessage(null, {
            type: 'story',
            username,
            url: story[story.length - 1].src,
        })
    else {
        chrome.runtime.sendMessage(null, {
            type: 'story',
            username,
            url,
        })
        document.head.removeAttribute('data-story-url')
    }
}

downloadStory()
