;(() => {
    document.head.setAttribute('data-story-url', 'null')

    let videos = [...document.querySelectorAll('video')].reverse()
    let story_url = null

    for (const video of videos) {
        if (!video.offsetHeight) continue

        let react_key = ''
        const keys = Object.keys(video)

        for (const key of keys) {
            if (key.indexOf('__reactFiber') !== -1) {
                react_key = key.split('__reactFiber')[1]
                break
            }
        }

        try {
            story_url =
                video.parentElement.parentElement.parentElement.parentElement[
                    '__reactProps' + react_key
                ].children[0].props.children.props.implementations[1].data.hdSrc
        } catch {}

        if (!story_url) {
            try {
                story_url =
                    video.parentElement.parentElement.parentElement
                        .parentElement['__reactProps' + react_key].children[0]
                        .props.children.props.implementations[1].data.sdSrc
            } catch {}
        }

        if (!story_url) {
            try {
                story_url =
                    video.parentElement.parentElement.parentElement
                        .parentElement['__reactProps' + react_key].children
                        .props.children.props.implementations[1].data.hdSrc
            } catch {}
        }

        if (!story_url) {
            try {
                story_url =
                    video.parentElement.parentElement.parentElement
                        .parentElement['__reactProps' + react_key].children
                        .props.children.props.implementations[1].data.sdSrc
            } catch {}
        }

        if (!story_url) {
            try {
                story_url =
                    video['__reactFiber' + react_key].return.stateNode.props
                        .videoData.$1.hd_src
            } catch {}
        }

        if (!story_url) {
            try {
                story_url =
                    video['__reactFiber' + react_key].return.stateNode.props
                        .videoData.$1.sd_src
            } catch {}
        } else break
    }

    document.head.setAttribute('data-story-url', story_url)
})()
