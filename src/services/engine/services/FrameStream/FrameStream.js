class FrameStream extends stream.Writable {
    _write = (chunk, enc, next) => {
        console.log(chunk.toString())
        next()
    }
}
