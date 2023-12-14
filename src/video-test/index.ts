window.onload = () => {
    const video: HTMLVideoElement = document.getElementById(
        "video"
    ) as HTMLVideoElement
    const c1: HTMLCanvasElement = document.getElementById(
        "c1"
    ) as HTMLCanvasElement
    const c2: HTMLCanvasElement = document.getElementById(
        "c2"
    ) as HTMLCanvasElement

    class Processor {
        private video: HTMLVideoElement
        private c1: HTMLCanvasElement
        private c2: HTMLCanvasElement
        private ctx1: CanvasRenderingContext2D
        private ctx2: CanvasRenderingContext2D
        private width: number
        private height: number

        constructor(options: {
            video: HTMLVideoElement
            c1: HTMLCanvasElement
            c2: HTMLCanvasElement
        }) {
            this.video = options.video
            this.c1 = options.c1
            this.c2 = options.c2

            this.ctx1 = this.c1.getContext("2d")
            this.ctx2 = this.c2.getContext("2d")
        }

        public doLoad() {
            this.video.addEventListener(
                "play",
                () => {
                    this.width = this.video.videoWidth
                    this.height = this.video.videoHeight
                    this.unifromWidthAndHeight()
                    this.timerCallback()
                },
                false
            )
        }

        private unifromWidthAndHeight() {
            this.c1.width = this.width
            this.c1.height = this.height
            this.c2.width = this.width
            this.c2.height = this.height
        }

        private timerCallback() {
            if (video.paused || video.ended) {
                return
            }
            this.computeFrame()
            setTimeout(() => {
                this.timerCallback()
            }, 0)
        }

        private computeFrame() {
            this.ctx1.drawImage(this.video, 0, 0, this.width, this.height)
            const frame = this.ctx1.getImageData(0, 0, this.width, this.height)
            const data = frame.data

            for (let i = 0; i < data.length; i += 4) {
                const red = data[i + 0]
                const green = data[i + 1]
                const blue = data[i + 2]
                if (green > 100 && red > 100 && blue < 43) {
                    data[i + 3] = 0
                }
            }
            this.ctx2.putImageData(frame, 0, 0)
        }
    }

    const processor = new Processor({
        video,
        c1,
        c2,
    })

    processor.doLoad()
}
