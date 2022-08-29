import './style.css'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as CANNON from 'cannon-es'
import { Vec3 } from 'cannon-es';


// //////////////////////// LOADERS
const loader = new THREE.TextureLoader()
const gltfloader = new GLTFLoader();

const texture = loader.load('/textures/wireframe.png')
const height = loader.load('/textures/height.png')
const alpha = loader.load('/textures/alpha.jpg')
const o = loader.load('/textures/o.png')

const canvas = document.querySelector('canvas.webgl')
const cta = document.querySelector('.cta')
const sections = document.querySelectorAll('.section')

const scene = new THREE.Scene();
const gui = new dat.GUI();

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
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
orbit.update();

// /////////////////// OBJECTS
// Plane
const planeGeometry = new THREE.PlaneBufferGeometry(50, 70, 64, 64)
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
genoshaLogo.position.x = -7
genoshaLogo.position.y = 2
genoshaLogo.position.z = 0
const genoshaLogoId = genoshaLogo.id
scene.add(genoshaLogo)

// Cat
let cat;
let catMixerSmell;
let catMixerAtoB;
let catMixerBIdle;
let catMixerBtoA;
let catMixerWalk;
let catMixerWash;
let catMixerWash2;
let catMixerPicks;
let catMixerJumpS;
let catMixerJumpL;
let catMixerJumpE;
let catMixerAIdle;
gltfloader.load( 'objects/cat/scene.gltf', function ( gltf ) {
    scene.add( gltf.scene );
    cat = gltf.scene;
    
    const clips = gltf.animations
    
    catMixerSmell = new THREE.AnimationMixer(cat)
    const clipSmell = THREE.AnimationClip.findByName(clips, 'A_smell')
    const actionSmell = catMixerSmell.clipAction(clipSmell)
    actionSmell.play()
    
    catMixerJumpS = new THREE.AnimationMixer(cat)
    const clipJumpS = THREE.AnimationClip.findByName(clips, 'A_jump_start')
    const actionJumpS = catMixerJumpS.clipAction(clipJumpS)
    actionJumpS.reset();
    actionJumpS.clampWhenFinished = true;
    actionJumpS.timeScale = 1;
    actionJumpS.setLoop(THREE.LoopOnce, 1);
    actionJumpS.play();
    
    catMixerJumpL = new THREE.AnimationMixer(cat)
    const clipJumpL = THREE.AnimationClip.findByName(clips, 'A_jump_loop')
    const actionJumpL = catMixerJumpL.clipAction(clipJumpL)
    actionJumpL.play()
    
    catMixerJumpE = new THREE.AnimationMixer(cat)
    const clipJumpE = THREE.AnimationClip.findByName(clips, 'A_jump_end')
    const actionJumpE = catMixerJumpE.clipAction(clipJumpE)
    actionJumpE.reset();
    actionJumpE.clampWhenFinished = true;
    actionJumpE.timeScale = 1;
    actionJumpE.setLoop(THREE.LoopOnce, 1);
    actionJumpE.play()
    
    catMixerWash = new THREE.AnimationMixer(cat)
    const clipWash = THREE.AnimationClip.findByName(clips, 'B_wash')
    const actionWash = catMixerWash.clipAction(clipWash)
    actionWash.play()
    
    catMixerWash2 = new THREE.AnimationMixer(cat)
    const clipWash2 = THREE.AnimationClip.findByName(clips, 'B_wash_b')
    const actionWash2 = catMixerWash2.clipAction(clipWash2)
    actionWash2.play()  
    
    catMixerPicks = new THREE.AnimationMixer(cat)
    const clipPicks = THREE.AnimationClip.findByName(clips, 'B_picks')
    const actionPicks = catMixerPicks.clipAction(clipPicks)
    actionPicks.play()   

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
    
    catMixerAIdle = new THREE.AnimationMixer(cat)
    const clipAIdle = THREE.AnimationClip.findByName(clips, 'A_idle')
    const actionAIdle = catMixerAIdle.clipAction(clipAIdle)
    actionAIdle.play()

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
        onUpdate: function() {
            cta.style.opacity = '0';
            document.querySelector('.description').style.opacity = '0';
        }
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

    const totemGUI = gui.addFolder('Totem');
    totemGUI.add(totem, 'visible')
    totemGUI.add(totem.position, 'x').min(-13).max(13).step(0.00001)
    totemGUI.add(totem.position, 'y').min(-13).max(13).step(0.00001)
    totemGUI.add(totem.position, 'z').min(-13).max(13).step(0.00001)
    totemGUI.add(totem.rotation, 'x').min(-13).max(13).step(0.00001)
    totemGUI.add(totem.rotation, 'y').min(-13).max(13).step(0.00001)

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

    const cardboxGUI = gui.addFolder('Cardbox');
    cardboxGUI.add(cardbox, 'visible')
    cardboxGUI.add(cardbox.position, 'x').min(-13).max(13).step(0.00001)
    cardboxGUI.add(cardbox.position, 'y').min(-13).max(13).step(0.00001)
    cardboxGUI.add(cardbox.position, 'z').min(-13).max(13).step(0.00001)
    cardboxGUI.add(cardbox.rotation, 'x').min(-13).max(13).step(0.00001)
    cardboxGUI.add(cardbox.rotation, 'y').min(-13).max(13).step(0.00001)

}, undefined, function ( error ) {
    console.error( error );
} );

// ////////////////// LIGHTS

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Spot Light - Main
const spotLight = new THREE.SpotLight(0xFFFFFF, 0.8,300);
scene.add(spotLight);
spotLight.position.set(24, 23, -48);
spotLight.castShadow = true;
spotLight.angle = 0.2;

// Spot Light - Box
const spotLightBox = new THREE.SpotLight(0xFFFFFF, 0,300);
scene.add(spotLightBox);
scene.add( spotLightBox.target );
spotLightBox.position.set(8, 10, 4);
spotLightBox.castShadow = true;
spotLightBox.target.position.set(8,1,4);
spotLightBox.angle = -0.31;
spotLightBox.penumbra = 0.3;

const dLightHelper = new THREE.DirectionalLightHelper(spotLight, 5);
scene.add(dLightHelper);
const dLightBoxHelper = new THREE.DirectionalLightHelper(spotLightBox, 5);
scene.add(dLightBoxHelper);
const dLightShadowHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(dLightShadowHelper);

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

const GUIOptions = {
    planeColor: '#ffffff',
    wireframe: false
}

gui.addColor(GUIOptions, 'planeColor').onChange(function(e){
    plane.material.color.set(e)
} )

gui.add(GUIOptions, 'wireframe').onChange(function(e){
    plane.material.wireframe = e
} )

// Camera GUI
const cameraGUI = gui.addFolder('Camera');
cameraGUI.add(camera.position, 'x').min(-10).max(10).step(0.00001)
cameraGUI.add(camera.position, 'y').min(-10).max(50).step(0.001)
cameraGUI.add(camera.position, 'z').min(-10).max(10).step(0.00001)

// Lights GUI
const lightGUI = gui.addFolder('Main Light');
lightGUI.add(spotLight, 'visible')
lightGUI.add(spotLight.position, 'y').min(-130).max(130).step(0.001)
lightGUI.add(spotLight.position, 'x').min(-160).max(100).step(0.001)
lightGUI.add(spotLight.position, 'z').min(-130).max(130).step(0.001)
lightGUI.add(spotLight, 'intensity').min(0).max(10).step(0.01)

const lightBoxGUI = gui.addFolder('Box Light');
lightBoxGUI.add(spotLightBox, 'visible')
lightBoxGUI.add(spotLightBox.position, 'y').min(-130).max(130).step(0.001)
lightBoxGUI.add(spotLightBox.position, 'x').min(-160).max(100).step(0.001)
lightBoxGUI.add(spotLightBox.position, 'z').min(-130).max(130).step(0.001)
lightBoxGUI.add(spotLightBox, 'intensity').min(0).max(10).step(0.01)
lightBoxGUI.add(spotLightBox, 'angle').min(-10).max(10).step(0.01)
lightBoxGUI.add(spotLightBox, 'penumbra').min(-10).max(10).step(0.01)

// /////////////////// CANNON
const world = new CANNON.World({gravity: new CANNON.Vec3(0, -9.81,0)})
const planeBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(25,35,1))
})
planeBody.quaternion.setFromEuler(-Math.PI/2,0,0)
world.addBody(planeBody)

// ////////////////// RAYCASTER
const mousePosition = new THREE.Vector2();
const rayCaster = new THREE.Raycaster();

// Create object with click
const intersectionPoint = new THREE.Vector3()
const planeNormal = new THREE.Vector3()
const planeClick = new THREE.Plane()

window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;

    //obj w/click
    planeNormal.copy(camera.position).normalize()
    planeClick.setFromNormalAndCoplanarPoint(planeNormal, scene.position)
    rayCaster.setFromCamera(mousePosition,camera)
    rayCaster.ray.intersectPlane(planeClick, intersectionPoint)

});

const maradonaMeshes = []
const maradonaBodies = []

window.addEventListener('click', function(e){
    const cylinderGeo = new THREE.CylinderGeometry(0.4,0.4,0.1,64)
    const cylinderMat = new THREE.MeshStandardMaterial({
        map: o,
        transparent: true,
    })

    const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat)
    scene.add(cylinder)
    cylinder.rotation.x = -0.5 * Math.PI
    cylinder.position.copy(intersectionPoint)

    // MARADONA
    const maradonaBodyShape = new CANNON.Box(new Vec3(0.5,0.5,0.5))
    const maradonaBody = new  CANNON.Body({
        mass: 0.3,
        shape: maradonaBodyShape,
        position: new CANNON.Vec3(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z)
    })
    world.addBody(maradonaBody)

    let maradona;
    gltfloader.load( 'objects/maradona/scene.gltf', function ( gltf ) {
    scene.add( gltf.scene );
    maradona = gltf.scene;
    maradona.scale.set(1,1,1)
    
    console.log(maradona.scale.x);
    console.log(maradona.scale.y);
    console.log(maradona.scale.z);
    
    maradonaMeshes.push(maradona)
    maradonaBodies.push(maradonaBody)

    maradona.traverse((object)=> {
        if (object.isMesh)
            object.castShadow = true
        })

    }, undefined, function ( error ) {
        console.error( error );
    } );
})


let objs = []
scene.traverse((object)=> {
    if (object.isMesh)
        objs.push(object)
})


// ////////////////////// GSAP
let tl = gsap.timeline()
let tlBox = gsap.timeline({paused:true, repeat:1})
let tlBox2 = gsap.timeline({paused:true, repeat:1})
let tlBox3 = gsap.timeline({paused:true, repeat:1})

gsap.registerPlugin(ScrollTrigger)
   ScrollTrigger.defaults({
   scrub: 2,
   ease: 'none',
})

tl.to(camera.position, {duration:2})
tl.to(camera.position, {
    y: 8,  
    z: 10, 
    duration: 3,
    onUpdate: function() {
        camera.lookAt( 0,0,0 );
	}
})


// ///////////////// ANIMATE
const clock = new THREE.Clock()
const timestep = 1/60

function animate(){
    // Gravity
    world.step(timestep)
    plane.position.copy(planeBody.position)
    plane.quaternion.copy(planeBody.quaternion)

    for (let i = 0; i < maradonaMeshes.length; i++) {
        maradonaMeshes[i].position.copy(maradonaBodies[i].position)
        maradonaMeshes[i].quaternion.copy(maradonaBodies[i].quaternion)   
    }

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
        .to(cat, {
            duration: Infinity,
            onUpdate: function() {
                catMixerBIdle.update(clock.getDelta())    
            }
        })
    }
    
    cta.addEventListener('click',function() {
        spotLightBox.intensity = 1
        tlBox.play()
        tlBox2.play()
        tlBox3.play()
    });

    if(cat){
        tlBox2
        .to(cat, {
            duration: 1.3,
            onUpdate: function() {
                catMixerBIdle.stopAllAction()
                catMixerBtoA.update(clock.getDelta())
            }
        })
        .to(
            cat.position, {
            duration: 3,
            x: 2.8,
            z: 4.3,
            onUpdate: function() {
                catMixerWalk.update(clock.getDelta())        
            }
        })
        .to(cat.rotation, {
            duration:1.8,
            y: 1.5,
        }, "<")
        .to(
            cat.position, {
            duration: .3,
            x: 3,
            y:2,
            onUpdate: function() {
                catMixerWalk.stopAllAction()
                catMixerJumpS.update(clock.getDelta())
                
            }
        })
        .to(
            cat.position, {
            duration: .3,
            y:2.2,
            x: 4.3,
            onUpdate: function() {
                catMixerJumpL.update(clock.getDelta())
                cardbox.scale.set(1.2,1.2,1.2)    
            }
        })
        .to(
            cat.position, {
            duration: .9667,
            y:1.4,
            x: 4.5,
            onUpdate: function() {
                catMixerJumpE.update(clock.getDelta()) 
                cardbox.scale.set(1.9,1.9,1.9)
                spotLightBox.angle = -0.1
            }
        })
        .to(
            cat.position, {
            duration: Infinity,
            onUpdate: function() {
                catMixerJumpS.stopAllAction()    
                catMixerJumpL.stopAllAction()    
                catMixerJumpE.stopAllAction()    
                catMixerAIdle.update(clock.getDelta())    
            }
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