import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Loading
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('/textures/normalMap.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// OBJ1 ////////////////////////////////////////////////////
const geometry = new THREE.SphereBufferGeometry( .5, 64, 64 );

// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.normalMap = normalTexture;
material.color = new THREE.Color(0x292929)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// OBJ2 //////////////////////////////////////////////

const geometry2 = new THREE.PlaneBufferGeometry(3,3,64,64)
const material2 = new THREE.MeshStandardMaterial()
material2.metalness = 1
material2.roughness = 1
material2.color = new THREE.Color(0xffffff)
const plane = new THREE.Mesh(geometry2,material2)
scene.add(plane)

plane.rotation.x = 181

const planeGUI = gui.addFolder('Plane');
planeGUI.add(plane, 'visible')
planeGUI.add(plane.rotation, 'x').min(-3).max(3).step(0.00001)
planeGUI.add(plane.rotation, 'y').min(-3).max(3).step(0.00001)
planeGUI.add(plane.position, 'x').min(-3).max(3).step(0.00001)
planeGUI.add(plane.position, 'y').min(-3).max(3).step(0.00001)

// Lights

//LIGHT 1
const pointLight = new THREE.AmbientLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const light = gui.addFolder('Light 1 - AmbientLight')

light.add(pointLight, 'visible')
light.add(pointLight, 'castShadow')
light.add(pointLight.position, 'y').min(-3).max(3).step(0.01)
light.add(pointLight.position, 'x').min(-6).max(10).step(0.01)
light.add(pointLight.position, 'z').min(-3).max(3).step(0.01)
light.add(pointLight, 'intensity').min(0).max(10).step(0.01)

const pointLightHelper0 = new THREE.PointLightHelper(pointLight, 1)
scene.add(pointLightHelper0)

// LIGHT 2 - RED
const pointLight2 = new THREE.PointLight(0xff0000, 2)
pointLight2.position.set(1,1,1)
pointLight2.intensity = 1
scene.add(pointLight2)

const light2 = gui.addFolder('Light 2 - PointLight')

light2.add(pointLight2, 'visible')
light2.add(pointLight2, 'castShadow')
light2.add(pointLight2.position, 'y').min(-3).max(3).step(0.01)
light2.add(pointLight2.position, 'x').min(-6).max(10).step(0.01)
light2.add(pointLight2.position, 'z').min(-3).max(3).step(0.01)
light2.add(pointLight2, 'intensity').min(0).max(10).step(0.01)

const pointLightHelper = new THREE.AmbientLightProbe(pointLight2, 1)
scene.add(pointLightHelper)

// LIGHT 3 - BLUE
const pointLight3 = new THREE.HemisphereLight(0xff0000,0x00ff00, 2)
pointLight3.position.set(-3,1,1)
pointLight3.intensity = 1
scene.add(pointLight3)

const light3 = gui.addFolder('Light 3 - HemisphereLight')

light3.add(pointLight3, 'visible')
light3.add(pointLight3, 'castShadow')
light3.add(pointLight3.position, 'y').min(-3).max(3).step(0.01)
light3.add(pointLight3.position, 'x').min(-6).max(10).step(0.01)
light3.add(pointLight3.position, 'z').min(-3).max(3).step(0.01)
light3.add(pointLight3, 'intensity').min(0).max(10).step(0.01)

const pointLightHelper2 = new THREE.HemisphereLightHelper(pointLight3, 1)
scene.add(pointLightHelper2)

// LIGHT 4 

const pointLight4 = new THREE.RectAreaLight(0xe600ad, 2,2 ,20)
pointLight4.position.set(-0.11,-3,-2.11)
pointLight4.intensity = 4.9
scene.add(pointLight4)

const light4 = gui.addFolder('Light 4 - ReactAreaLight')

light3.add(pointLight4, 'visible')
light3.add(pointLight4, 'castShadow')
light4.add(pointLight4.position, 'y').min(-3).max(3).step(0.01)
light4.add(pointLight4.position, 'x').min(-6).max(10).step(0.01)
light4.add(pointLight4.position, 'z').min(-3).max(3).step(0.01)
light4.add(pointLight4, 'intensity').min(0).max(10).step(0.01)

const light4Color = {
    color: 0xe600ad
}

light4.addColor(light4Color, 'color')
    .onChange(()=> {
        pointLight4.color.set(light4Color.color)
    })

const pointLightHelper3 = new THREE.PointLightHelper(pointLight4, .5)
scene.add(pointLightHelper3)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true

})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */


// MOUSE
document.addEventListener('mousemove', onDocumentMouseMove);

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove (e) {
    mouseX = (e.clientX - windowHalfX);
    mouseY = (e.clientY - windowHalfY);
}


// SCROLL

const scrollSphere = (event) => {
    sphere.position.y = window.scrollY * -.001
}
window.addEventListener('scroll', scrollSphere);



const clock = new THREE.Clock()

const tick = () =>
{

    targetX = mouseX * .001
    targetY = mouseY * .001
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    sphere.rotation.y += .45 * (targetX - sphere.rotation.y)
    sphere.rotation.x += .05 * (targetY - sphere.rotation.x)
    sphere.position.z += -.05 * (targetY - sphere.rotation.x)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()