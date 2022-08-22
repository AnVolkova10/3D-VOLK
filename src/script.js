import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';


// //////////////////////// LOADERS
const loader = new THREE.TextureLoader()
const texture = loader.load('/textures/wireframe2.jpg')
const height = loader.load('/textures/height.png')
const alpha = loader.load('/textures/alpha.jpg')

const gltfloader = new GLTFLoader();


// /////////////////////// RENDERER
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

// ////////////////////// SCENE
const scene = new THREE.Scene();

// ///////////////////// CAMERA
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 5, 10);

// //////////////////// CONTROLS
const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
orbit.update();


// /////////////////// OBJECTS
// Plane
const planeGeometry = new THREE.PlaneBufferGeometry(19, 15, 64, 64)
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 'gray',
    map: texture,
    displacementMap: height,
    displacementScale: .5,
    alphaMap: alpha,
    transparent: true,
    depthTest: true,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI
plane.receiveShadow = true;

// Genosha Logo
const geometryGenoshaLogo = new THREE.PlaneBufferGeometry(5, 1)
const materialGenoshaLogo = new THREE.MeshBasicMaterial({
    map: loader.load('/images/genosha-logo.png'),
    transparent: true
})
const genoshaLogo = new THREE.Mesh(geometryGenoshaLogo, materialGenoshaLogo)
genoshaLogo.position.y = 2
genoshaLogo.position.z = -12
const genoshaLogoId = genoshaLogo.id
scene.add(genoshaLogo)

// Cat
let cat;
gltfloader.load( 'objects/cat/scene.gltf', function ( gltf ) {
    scene.add( gltf.scene );
    cat = gltf.scene;
    
    cat.position.x= -5
    cat.position.y= 1.1
    cat.position.z= 2
    cat.rotation.y = 0.5 * Math.PI

}, undefined, function ( error ) {
    console.error( error );
} );

// TOTEM
let totem;
gltfloader.load( 'objects/totem/scene.gltf', function ( gltf ) {
   scene.add( gltf.scene );
   totem = gltf.scene;
   
   
   totem.position.x = 5
   totem.position.y = 0.2
   totem.position.z = 0
   totem.rotation.y = -0.3 * Math.PI
   
      
}, undefined, function ( error ) {
    console.error( error );
} );

// ////////////////// LIGHTS
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);

//  const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
//  scene.add(dLightShadowHelper);

// const spotLight = new THREE.SpotLight(0xFFFFFF);
// scene.add(spotLight);
// spotLight.position.set(-10, 10, 0);
// spotLight.castShadow = true;
// spotLight.angle = 0.2;

// const sLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(sLightHelper);

// ////////////////// FOG
// scene.fog = new THREE.Fog(0XFFFFFF, 0, 200)
// scene.fog = new THREE.FogExp2(0XFFFFFF, .01)

// ///////////////// SKYBOX
const skyboxLoader = new THREE.CubeTextureLoader();
const skybox = skyboxLoader.load([
    '/textures/right.png',
        '/textures/left.png',
        '/textures/top.png',
        '/textures/bottom.png',
        '/textures/front.png',
        '/textures/back.png',
    ]);
    scene.background = skybox;
    
// ///////////////// GUI
const gui = new dat.GUI();

const options = {
    planeColor: '#ffffff',
    wireframe: false
}

gui.addColor(options, 'planeColor').onChange(function(e){
    plane.material.color.set(e)
} )

gui.add(options, 'wireframe').onChange(function(e){
    plane.material.wireframe = e
} )

// ////////////////// RAYCASTER
const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

let objs = []
scene.traverse((object)=> {
    if (object.isMesh)
        objs.push(object)
})


// ///////////////// ANIMATE
function animate(){
    // Raycasting
    rayCaster.setFromCamera(mousePosition,camera)
    const intersects = rayCaster.intersectObjects(objs)
     
    // mouse in
     for(const intersect of intersects){
        if (intersect.object.id === genoshaLogoId)
        intersect.object.scale.set(1.1,1.1)
    }

    // mouse out
    for (const object of objs) {
        if (!intersects.find(intersect=> intersect.object === object) && object.id === genoshaLogoId) {
            object.scale.set(1,1)  
        }
    }

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});