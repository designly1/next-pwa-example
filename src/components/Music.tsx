import React from 'react'
import Embed from 'react-embed'

export default function Music() {
    return (
        <div className="flex flex-col gap-10">
            <h2 className="text-2xl font-bold text-center">Here&apos;s Some Music for Your Listening Enjoyment!</h2>
            <iframe
                className="rounded-xl"
                src="https://open.spotify.com/embed/track/0fKXPbVng9JmR8XUVkgbq3?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            ></iframe>
            <iframe
                className="rounded-xl"
                src="https://open.spotify.com/embed/album/0VQZHjbjonTMnZSgA4aLZg?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            ></iframe>
            <Embed url="https://soundcloud.com/jaysudo1/the-way-you-get" />
        </div>
    )
}