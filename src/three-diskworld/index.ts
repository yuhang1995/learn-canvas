import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

window.onload = init

let isAnimation = false

let currentModel: THREE.Object3D

let axleModel: THREE.Object3D, carModel: THREE.Object3D

let carAxle1: THREE.Object3D,
    carAxle2: THREE.Object3D,
    diskworld: THREE.Object3D,
    roadCarModel: THREE.Object3D

let scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer

let controls

function doFrame() {
    if (isAnimation) {
        updateForFrame()
        controls.update()
        render()
        requestAnimationFrame(doFrame)
    }
}

function updateForFrame() {
    // if (!currentModel) currentModel = carModel
    if (currentModel == axleModel) {
        axleModel.rotation.z += 0.05
    } else if (currentModel == carModel) {
        carAxle1.rotation.z += 0.05
        carAxle2.rotation.z += 0.05
    } else {
        carAxle1.rotation.z += 0.05
        carAxle2.rotation.z += 0.05

        // diskworldAxle1.rotation.z += 0.05
        // diskworldAxle2.rotation.z += 0.05
        roadCarModel.rotation.y += 0.01
        // let treeScale = growingTree.scale.x
        // if (treeScale < 0.5) 0.5       //     treeScale += 0.0005
        //     growingTree.scale.set(treeScale, treeScale, treeScale)
        // }
    }
}

function doAnimateCheckbox() {
    let anim = (document.getElementById("animate") as HTMLInputElement).checked
    if (anim != isAnimation) {
        isAnimation = anim
        if (!!isAnimation) {
            doFrame()
        }
    }
}

function init() {
    const animated = document.getElementById("animate") as HTMLInputElement
    animated.onchange = doAnimateCheckbox
    const canvas = document.getElementById("canvas") as HTMLCanvasElement
    renderer = createRenderer({ canvas })
    renderer.setClearColor("white")

    scene = createScene()

    camera = new THREE.PerspectiveCamera(
        45,
        canvas.width / canvas.height,
        1,
        30
    )
    camera.position.z = 15

    let viewpointLight = new THREE.DirectionalLight(0xffffff, 0.8)
    viewpointLight.position.set(0, 1, 1)
    scene.add(viewpointLight)

    scene.add(new THREE.DirectionalLight(0xffffff, 0.4))

    // const diskworldModel = new THREE.Object3D()

    // 车轮
    let wheel = new THREE.Mesh(
        new THREE.TorusGeometry(0.75, 0.25, 16, 32),
        new THREE.MeshLambertMaterial({ color: 0x0000a0 })
    )

    // 车轴
    let cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 1),
        new THREE.MeshPhongMaterial({
            color: "yellow",
            specular: 0x101010,
            shininess: 16,
        })
    )
    cylinder.scale.set(0.15, 1.2, 0.15)

    wheel.add(cylinder.clone())
    cylinder.rotation.z = Math.PI / 3
    wheel.add(cylinder.clone())
    cylinder.rotation.z = -Math.PI / 3
    wheel.add(cylinder.clone())

    axleModel = new THREE.Object3D()
    cylinder.scale.set(0.2, 4.3, 0.2)
    cylinder.rotation.set(Math.PI / 2, 0, 0)
    axleModel.add(cylinder)
    wheel.position.z = 2
    axleModel.add(wheel.clone())
    wheel.position.z = -2
    axleModel.add(wheel)

    axleModel.rotation.set(0, 0, Math.PI / 2)

    // axleModel.rotateZ(Math.PI / )

    const chassisModel = new THREE.Object3D()

    axleModel.position.set(-0.6, -0.5, 0)
    axleModel.scale.set(0.4, 0.4, 0.4)
    carAxle1 = axleModel.clone()
    chassisModel.add(carAxle1)

    axleModel.position.set(0.6, -0.5, 0)
    carAxle2 = axleModel.clone()
    chassisModel.add(carAxle2)

    const boxGeometry = new THREE.BoxGeometry(2, 1, 1.2)

    // 创建每个面的颜色数组
    const faceColors = [
        new THREE.MeshLambertMaterial({ color: 0xff0000, name: "face1" }), // red
        new THREE.MeshLambertMaterial({ color: 0x00ff00, name: "face2" }), // green
        new THREE.MeshLambertMaterial({ color: 0x0000ff, name: "face3" }), // blue
        new THREE.MeshLambertMaterial({ color: 0xffff00, name: "face4" }), // yellow
        new THREE.MeshLambertMaterial({ color: 0x00ffff, name: "face5" }), // cyan
        new THREE.MeshLambertMaterial({ color: 0xff00ff, name: "face6" }), // magenta
    ]

    // BoxGeometry 有 12 个三角面，我们将它们分组，每组两个三角面
    for (let i = 0; i < 12; i += 2) {
        boxGeometry.addGroup(i * 3, 6, (i / 2) % 6)
    }

    // 创建 Mesh 对象
    const boxModel = new THREE.Mesh(boxGeometry, faceColors)

    const carBodyModel = new THREE.Object3D()

    carBodyModel.add(boxModel.clone())
    boxModel.scale.set(0.7, 0.7, 0.7)
    boxModel.position.y = 0.7
    carBodyModel.add(boxModel)

    // 车灯
    const carLightModel = new THREE.Mesh(
        new THREE.SphereGeometry(1, 16, 8),
        new THREE.MeshLambertMaterial({
            color: "yellow",
        })
    )

    carLightModel.scale.set(0.1, 0.15, 0.15)
    carLightModel.position.set(-1, 0.1, -0.25)
    carBodyModel.add(carLightModel.clone())

    carLightModel.position.set(-1, 0.1, 0.25)
    carBodyModel.add(carLightModel)

    carModel = new THREE.Object3D()

    carModel.add(carBodyModel)
    carModel.add(chassisModel)

    carModel.scale.set(0.5, 0.5, 0.5)

    carModel.position.x = -2.9
    carModel.position.y = 1.1
    carModel.rotation.y = Math.PI / 2

    roadCarModel = new THREE.Object3D()

    const roadModel = new THREE.Mesh(
        new THREE.RingGeometry(2.3, 3.6, 64, 1),
        new THREE.MeshLambertMaterial({ color: 0x777799 })
    )

    roadModel.rotation.x = -Math.PI / 2
    roadModel.position.y = 0.6

    roadCarModel.add(roadModel)
    roadCarModel.add(carModel)
    // roadCarModel.rotateX(Math.PI / 3)

    diskworld = new THREE.Object3D()

    const lownModel = createLown()
    diskworld.add(lownModel)
    diskworld.add(roadCarModel)

    diskworld.rotateX(Math.PI / 5)

    scene.add(diskworld)

    controls = new OrbitControls( camera, renderer.domElement );

    render()
}

function render() {
    renderer.render(scene, camera)
}

function createRenderer(options: THREE.WebGLRendererParameters) {
    return new THREE.WebGLRenderer(options)
}

function createScene() {
    return new THREE.Scene()
}

type CameraType =
    | "PerspectiveCamera"
    | "OrthographicCamera"
    | "CubeCamera"
    | "ArrayCamera"

type PerspectiveCameraOptions = {
    fov?: number
    aspect?: number
    near?: number
    far?: number
}

type OrthographicCameraOptions = {
    left?: number
    right?: number
    top?: number
    bottom?: number
    near?: number
    far?: number
}

type CubeCameraOptions = {
    near?: number
    far?: number
    renderTarget?: THREE.WebGLCubeRenderTarget
}

type ArrayCameraOptions = {
    cameras: THREE.Camera[]
}

type CameraOptions =
    | PerspectiveCameraOptions
    | OrthographicCameraOptions
    | ArrayCameraOptions

function createCamera(type: CameraType, options?: CameraOptions): THREE.Camera {
    switch (type) {
        case "PerspectiveCamera":
            let newOptions1 = options as PerspectiveCameraOptions
            return new THREE.PerspectiveCamera(
                newOptions1?.fov ?? 45,
                newOptions1?.aspect ?? 1,
                newOptions1?.near ?? 0.1,
                newOptions1?.far ?? 2000
            )
        case "OrthographicCamera":
            let newOptions2 = options as OrthographicCameraOptions
            return new THREE.OrthographicCamera(
                newOptions2?.left ?? -1,
                newOptions2?.right ?? 1,
                newOptions2?.top ?? 1,
                newOptions2?.bottom ?? -1,
                newOptions2?.near ?? 0.1,
                newOptions2?.far ?? 2000
            )
        // case "CubeCamera":
        //     let options3 = options as CubeCameraOptions
        //     return new THREE.CubeCamera(
        //         options3?.near ?? 0.1,
        //         options3?.far ?? 2000,
        //         options3?.renderTarget
        //     )
        // case "ArrayCamera":
        //     return new THREE.ArrayCamera(options?.cameras ?? [])
        default:
            throw new Error(`Invalid camera type: ${type}`)
    }
}

function createTree() {
    let tree = new THREE.Object3D()
    let trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 1, 16, 1),
        new THREE.MeshLambertMaterial({
            color: "brown",
        })
    )
    trunk.position.y = 0.5
    let leaves = new THREE.Mesh(
        new THREE.ConeGeometry(0.7, 2, 16, 3),
        new THREE.MeshPhongMaterial({
            color: "green",
            specular: 0x002000,
            shininess: 50,
        })
    )

    leaves.position.y = 2
    tree.add(trunk)
    tree.add(leaves)

    return tree
}

function createTrees() {
    const treesModel = new THREE.Object3D()

    const tree = createTree()
    tree.position.set(-4, 0.5, 0)
    treesModel.add(tree.clone())
    tree.scale.set(0.25, 0.25, 0.25)
    tree.position.set(-2, 0.4, 4)
    treesModel.add(tree.clone())
    tree.position.set(0, 0.6, 0)
    tree.scale.set(1.2, 1.2, 1.2)
    treesModel.add(tree.clone())
    tree.position.set(4, 0.5, 0)
    tree.scale.set(0.8, 0.8, 0.8)
    treesModel.add(tree.clone())
    tree.position.set(3.8, 0.5, 0.9)
    tree.scale.set(0.5, 0.5, 0.5)
    treesModel.add(tree.clone())
    tree.position.set(4.2, 0.5, 0.6)
    tree.scale.set(0.2, 0.2, 0.2)
    treesModel.add(tree.clone())
    tree.scale.set(0.25, 0.25, 0.25)
    tree.position.set(1, 0.5, -4.5)
    treesModel.add(tree.clone())

    return treesModel
}

function createLown() {
    const bottonModel = new THREE.Object3D()

    const lownGeometry = new THREE.Mesh(
        new THREE.CylinderGeometry(5, 5, 1, 64, 1),
        new THREE.MeshPhongMaterial({
            color: 0x00cc55,
            specular: 0x101010,
            shininess: 16,
        })
    )

    const roadModel = new THREE.Mesh(
        new THREE.RingGeometry(2.3, 3.6, 64, 1),
        new THREE.MeshLambertMaterial({ color: 0x777799 })
    )

    roadModel.rotation.x = -Math.PI / 2
    roadModel.position.y = 0.6

    const treesModel = createTrees()

    bottonModel.add(roadModel)
    bottonModel.add(lownGeometry)
    bottonModel.add(treesModel)

    return bottonModel
}
