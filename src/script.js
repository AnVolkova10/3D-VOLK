import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger'


// //////////////////////// LOADERS
const loader = new THREE.TextureLoader()
const texture = loader.load('/textures/wireframe2.jpg')
const height = loader.load('/textures/height.png')
const alpha = loader.load('/textures/alpha.jpg')

const gltfloader = new GLTFLoader();

const canvas = document.querySelector('canvas.webgl')

const cta = document.querySelector('.cta')

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }

// /////////////////////// RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})

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
camera.position.set(0, 15, 0);

// //////////////////// CONTROLS
const orbit = new OrbitControls(camera, canvas);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
orbit.update();

// /////////////////// OBJECTS
// Plane
const planeGeometry = new THREE.PlaneBufferGeometry(30, 15, 64, 64)
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
genoshaLogo.position.x = -3
genoshaLogo.position.y = 2
genoshaLogo.position.z = -12
const genoshaLogoId = genoshaLogo.id
scene.add(genoshaLogo)

// Cat
let cat;
let catMixerSmell;
let catMixerAtoB;
let catMixerBIdle;
let catMixerBtoA;
let catMixerWalk;
gltfloader.load( 'objects/cat/scene.gltf', function ( gltf ) {
    scene.add( gltf.scene );
    cat = gltf.scene;
    
    const clips = gltf.animations
    
    catMixerSmell = new THREE.AnimationMixer(cat)
    const clipSmell = THREE.AnimationClip.findByName(clips, 'A_smell')
    const actionSmell = catMixerSmell.clipAction(clipSmell)
    actionSmell.play()
    catMixerWalk = new THREE.AnimationMixer(cat)
    const clipWalk = THREE.AnimationClip.findByName(clips, 'A_walk')
    const actionWalk = catMixerWalk.clipAction(clipWalk)
    actionWalk.play()

    catMixerAtoB = new THREE.AnimationMixer(cat)
    const clipAtoB = THREE.AnimationClip.findByName(clips, 'AtoB')
    const actionAtoB = catMixerAtoB.clipAction(clipAtoB)
    actionAtoB.reset();
    actionAtoB.clampWhenFinished = true;
    actionAtoB.timeScale = 1;
    actionAtoB.setLoop(THREE.LoopOnce, 1);
    actionAtoB.play();
    
    catMixerBtoA = new THREE.AnimationMixer(cat)
    const clipBtoA = THREE.AnimationClip.findByName(clips, 'BtoA')
    const actionBtoA = catMixerBtoA.clipAction(clipBtoA)
    actionBtoA.reset();
    actionBtoA.clampWhenFinished = true;
    actionBtoA.timeScale = 1;
    actionBtoA.setLoop(THREE.LoopOnce, 1);
    actionBtoA.play();
    
    catMixerBIdle = new THREE.AnimationMixer(cat)
    const clipBIdle = THREE.AnimationClip.findByName(clips, 'B_idle')
    const actionBIdle = catMixerBIdle.clipAction(clipBIdle)
    actionBIdle.play()

    cat.position.x= -7
    cat.position.y= 1.1
    cat.position.z= 4
    cat.rotation.y = 0.75 * Math.PI

    
    cat.traverse((object)=> {
    if (object.isMesh)
        object.castShadow = true
    })

    gsap.from(cat.position, {
        duration: 1,
        ease: 'expo',
    })
    gsap.from('h1', {
        yPercent: 100,
        autoAlpha: 0,
        ease: 'back',
        delay: 0.3,
    })
    gsap.to(cat.position, {
        x: -6.99,
        scrollTrigger: {
            trigger: sections[2],
        },
    })
    gsap.to(cat, {
        scrollTrigger: {
            trigger: sections[2],
        },
        onUpdate: function() {
            cta.style.opacity = '100%';
            document.querySelector('.description').style.opacity = '100%';
        }
    })

    const catGUI = gui.addFolder('Cat');
    catGUI.add(cat, 'visible')
    catGUI.add(cat.position, 'x').min(-13).max(13).step(0.00001)
    catGUI.add(cat.position, 'y').min(-13).max(13).step(0.00001)
    catGUI.add(cat.position, 'z').min(-13).max(13).step(0.00001)
    catGUI.add(cat.rotation, 'x').min(-13).max(13).step(0.00001)
    catGUI.add(cat.rotation, 'y').min(-13).max(13).step(0.00001)

}, undefined, function ( error ) {
    console.error( error );
} );

// TOTEM
let totem;
gltfloader.load( 'objects/totem/scene.gltf', function ( gltf ) {
   scene.add( gltf.scene );
   totem = gltf.scene;
   

   totem.scale.set(2.5,2.5,2.5)
   totem.position.x = 3
   totem.position.y = 0.2
   totem.position.z = -4
   totem.rotation.y = -0.3 * Math.PI
   
   totem.traverse((object)=> {
    if (object.isMesh)
        object.castShadow = true
    })

}, undefined, function ( error ) {
    console.error( error );
} );

// MARADONA
let maradona;
gltfloader.load( 'objects/maradona/scene.gltf', function ( gltf ) {
   scene.add( gltf.scene );
   maradona = gltf.scene;

   maradona.scale.set(1,1,1)
   maradona.position.x =2.5
   maradona.position.y =-1.8
   maradona.position.z =-4.8
   
   maradona.traverse((object)=> {
    if (object.isMesh)
        object.castShadow = true
    })

}, undefined, function ( error ) {
    console.error( error );
} );

// BOX
let box;
gltfloader.load( 'objects/box/scene.gltf', function ( gltf ) {
   scene.add( gltf.scene );
   box = gltf.scene;
   

   box.scale.set(.008,.008,.008)
   box.position.x = 8
   box.position.y = 0.2
   box.position.z = -12
   box.rotation.y = -0.5 * Math.PI
   
   box.traverse((object)=> {
    if (object.isMesh)
        object.castShadow = true
    })

}, undefined, function ( error ) {
    console.error( error );
} );

// CARDBOX
let cardbox;
gltfloader.load( 'objects/cardbox/scene.gltf', function ( gltf ) {
   scene.add( gltf.scene );
   cardbox = gltf.scene;
   
   cardbox.position.x = 8
   cardbox.position.y = 1
   cardbox.position.z = 4
   cardbox.rotation.y = -0.3 * Math.PI
   
   cardbox.traverse((object)=> {
    if (object.isMesh)
        object.castShadow = true
    })

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
directionalLight.shadow.camera.botom = -20
directionalLight.shadow.camera.top = 20

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);

//const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
//scene.add(dLightShadowHelper);

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

// CameraGUI
const cameraGUI = gui.addFolder('Camera');
cameraGUI.add(camera.position, 'x').min(-10).max(10).step(0.00001)
cameraGUI.add(camera.position, 'y').min(-10).max(50).step(0.001)
cameraGUI.add(camera.position, 'z').min(-10).max(10).step(0.00001)


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

// ////////////////////// GSAP
let tl = gsap.timeline()
let tlBox = gsap.timeline({paused:true, repeat:1})
let tlBox2 = gsap.timeline({paused:true, repeat:1})

tl.to(camera.position, {duration:2})
tl.to(camera.position, {
    y: 8,  
    z: 10, 
    duration: 3,
    onUpdate: function() {
        camera.lookAt( 0,0,0 );
	}
})

gsap.registerPlugin(ScrollTrigger)
   ScrollTrigger.defaults({
   scrub: 2,
   ease: 'none',
})

const sections = document.querySelectorAll('.section')

// ///////////////// ANIMATE
const clock = new THREE.Clock()

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

    if (catMixerSmell && cat.position.x <= -7) {
        catMixerSmell.update(clock.getDelta())    
    } else if (catMixerAtoB && cat.position.x > -7) {
        tl.to(cat, {
            duration: 1.3,
            onUpdate: function() {
                catMixerAtoB.update(clock.getDelta())    
            }
        })
        tl.to(cat, {
            duration: Infinity,
            onUpdate: function() {
                catMixerBIdle.update(clock.getDelta())    
            }
        })
    }
    
    cta.addEventListener('click',function() {
        tlBox.play()
        tlBox2.play()
    });

    if(cat){
        tlBox.to(cat, {
            duration: 1.3,
            onUpdate: function() {
                catMixerBIdle.stopAllAction()
                catMixerBtoA.update(clock.getDelta())    
            }
        })
        
        tlBox.to(
            cat.position, {
            duration: 3,
            x: 3,
            z: 4.3,
            onUpdate: function() {
                catMixerWalk.update(clock.getDelta())    
            }
        })
        tlBox2.to(cat.rotation, {
            duration:5,
            y: 1.5,
        })
    }
    
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});