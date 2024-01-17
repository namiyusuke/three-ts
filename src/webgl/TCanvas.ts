import * as THREE from 'three'
import { gl } from './core/WebGL'
import { effects } from './effects/Effects'
import fragmentShader from './shaders/planeFrag.glsl'
import vertexShader from './shaders/planeVert.glsl'
// import { Assets, loadAssets } from './utils/assetLoader'
// import { calcCoveredTextureScale } from './utils/coveredTexture'
import { controls } from './utils/OrbitControls'

export class TCanvas {
  // private assets: Assets = {
  //   image: { path: 'resources/unsplash.jpg' },
  // }
  // this.els: = document.querySelectorAll('[data-webgl]');
  constructor(private parentNode: ParentNode) {
    // loadAssets(this.assets).then(() => {
    this.init()
    // this.getWorldPosition()
    this.createObjects()
    gl.requestAnimationFrame(this.anime)
    // })
  }

  private init() {
    // gl.setup(this.parentNode.querySelector('.three-container')!)

    gl.scene.background = new THREE.Color('#000000')
    gl.camera.position.z = 1.5
    gl.setResizeCallback(() => effects.resize())
  }

  private createObjects() {
    let els = gl.setup(this.parentNode)
    const canvas = document.querySelector('#canvas')
    const canvasRect = canvas?.getBoundingClientRect()
    function getWorldPosition(rect: any, canvasRect: any) {
      const x = rect.left + rect.width / 2 - canvasRect.width / 2
      const y = -rect.top - rect.height / 2 + canvasRect.height / 2
      return { x, y }
    }
    const cameraWidth = canvasRect.width
    const cameraHeight = canvasRect.height
    const near = 1500
    const far = 4000
    const aspect = cameraWidth / cameraHeight
    const cameraZ = 2500
    const radian = 2 * Math.atan(cameraHeight / 2 / cameraZ)
    const fov = radian * (180 / Math.PI)
    gl.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    gl.camera.position.z = cameraZ
    els.forEach((el) => {
      const rect = el.getBoundingClientRect()

      // const texture = this.assets.image.data as THREE.Texture
      const geometry = new THREE.PlaneGeometry(rect.width, rect.height, 1, 1)
      // const screenAspect = geometry.parameters.width / geometry.parameters.height
      // const [scaleWidth, scaleHeight] = calcCoveredTextureScale(texture, screenAspect)
      // const material = new THREE.ShaderMaterial({
      //   uniforms: {
      //     // u_image: { value: { texture, coveredScale: new THREE.Vector2(scaleWidth, scaleHeight) } },
      //     u_time: { value: 0 },
      //   },
      //   vertexShader,
      //   fragmentShader,
      //   side: THREE.DoubleSide,
      // })
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.4 })
      const mesh = new THREE.Mesh(geometry, material)
      const { x, y } = getWorldPosition(rect, canvasRect)
      console.log(x, y)
      mesh.position.x = x
      mesh.position.y = y
      mesh.name = 'plane'
      gl.scene.add(mesh)
    })
  }

  // ----------------------------------
  // animation
  private anime = () => {
    // const plane = gl.getMesh<THREE.ShaderMaterial>('plane')
    // plane.material.uniforms.u_time.value += gl.time.delta

    controls.update()
    gl.render()
    // effects.render()
  }

  // ----------------------------------
  // dispose
  dispose() {
    gl.dispose()
  }
}
