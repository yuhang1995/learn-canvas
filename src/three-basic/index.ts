import * as THREE from "three"
import { createCanvas } from "../utils"

window.onload = init

let scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer

let canvas: HTMLCanvasElement

let model: THREE.Object3D

let sphereRotator: THREE.Object3D

let animating = false

function createWorld() {
    renderer.setClearColor(0x444444)
    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
        45,
        canvas.width / canvas.height,
        1,
        30
    )
    camera.position.z = 15

    scene.add(new THREE.DirectionalLight(0xffffff, 0.4))
    let viewpointLight = new THREE.DirectionalLight(0xffffff, 0.8)

    viewpointLight.position.set(0, 1, 1)
    scene.add(viewpointLight)

    model = new THREE.Object3D()
    model.add(
        new THREE.Mesh(
            new THREE.BoxGeometry(3, 3, 3),
            new THREE.MeshLambertMaterial({ color: 0x00000aa })
        )
    )

    let sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 16),
        new THREE.MeshPhongMaterial({
            color: "green",
            specular: 0x404040,
            shininess: 32,
        })
    )

    sphere.position.x = 4
    sphereRotator = new THREE.Object3D()
    sphereRotator.add(sphere)
    model.add(sphereRotator)

    model.rotation.set(0, 2, 0)

    scene.add(model)
}

function render() {
    renderer.render(scene, camera)
}

function updateForFrame() {
    sphereRotator.rotation.z += 0.03
}

function doFrame() {
    if (animating) {
        updateForFrame()
        render()
        requestAnimationFrame(doFrame)
    }
}

function doAnimateCheckbox() {
    const node = document.getElementById("animate") as HTMLInputElement
    let anim = node.checked
    if (anim != animating) {
        animating = anim
        if (animating) {
            doFrame()
        }
    }
}

function doKey(event: KeyboardEvent) {
    let code = event.keyCode
    let rotated = true

    switch (code) {
        case 37:
            model.rotation.y -= 0.03
            break // left arrow
        case 39:
            model.rotation.y += 0.03
            break // right arrow
        case 38:
            model.rotation.x -= 0.03
            break // up arrow
        case 40:
            model.rotation.x += 0.03
            break // down arrow
        case 33:
            model.rotation.z -= 0.03
            break // page up
        case 34:
            model.rotation.z += 0.03
            break // page down
        case 36:
            model.rotation.set(0.2, 0, 0)
            break // home
        default:
            rotated = false
    }
    if (rotated) {
        event.preventDefault() // Prevent keys from scrolling the page.
        if (!animating) {
            // (if an animation is running, no need for an extra render)
            render()
        }
    }
}

function init() {
    try {
        canvas = document.getElementById("glcanvas") as HTMLCanvasElement

        renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        })
    } catch (error) {
        console.error(error)
    }

    document.addEventListener("keydown", doKey, false)
    ;(document.getElementById("animate") as HTMLInputElement).checked = false
    document.getElementById("animate").onchange = doAnimateCheckbox

    createWorld()
    render()
}
