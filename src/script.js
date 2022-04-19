import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'; 

import planeVertex from './shaders/plane/vertex.glsl'
import planeFragment from './shaders/plane/fragment.glsl'

const gui = new dat.GUI({
    width: 500
});

const parameters = {
    color: 0xff0000,
    spin: () => {
        gsap.to(planeMesh.rotation, {y: planeMesh.rotation.y + 10, duration: 1})
    }
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: parameters.color })
const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)


const planeUniforms = {
    vertexShader: planeVertex,
    fragmentShader: planeFragment,
    uniforms: { 
        uFrequency: {
            value: new THREE.Vector2(10, 5)
        },
        uTime: {
            value: 0
        },
        uColor: {
            value: new THREE.Color(0xffb700)
        }
     }

}
const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
const planeMaterial = new THREE.RawShaderMaterial(planeUniforms);

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

const planeVertexCount = planeGeometry.attributes.position.count
const planeVertexRandoms = new Float32Array(planeVertexCount)

for (let i = 0; i < planeVertexCount; i++) {
    planeVertexRandoms[i] = Math.random()
}

planeGeometry.setAttribute('aRandom', new THREE.BufferAttribute(planeVertexRandoms, 1))

console.log(planeGeometry);

scene.add(planeMesh)



/**
 * GUI
 */
gui.add(planeMesh.position, 'y', -3, 3, 0.01).name('elevation')
gui.add(planeMesh, 'visible').name('visibility')
gui.add(planeMesh.material, 'wireframe').name('wireframe')

gui.add(planeMesh.material.uniforms.uFrequency.value, 'x', 0, 20, 0.01).name('x frequency')
gui.add(planeMesh.material.uniforms.uFrequency.value, 'y', 0, 20, 0.01).name('y frequency')



gui.addColor(parameters, 'color').onChange(() => {
    mesh.material.color.set(parameters.color)
})

gui.add(parameters, 'spin')


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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    planeMesh.material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()