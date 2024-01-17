import * as THREE from 'three'

class WebGL {
  public renderer: THREE.WebGLRenderer
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera
  public time = { delta: 0, elapsed: 0 }

  private clock = new THREE.Clock()
  private resizeCallback?: () => void

  constructor() {
    const { width, height, aspect } = this.size
    const canvas = document.querySelector('#canvas') as HTMLCanvasElement
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true
    this.renderer.outputEncoding = THREE.sRGBEncoding

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.01, 100)

    window.addEventListener('resize', this.handleResize)
  }

  private handleResize = () => {
    this.resizeCallback && this.resizeCallback()

    const { width, height, aspect } = this.size
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  get size() {
    const { innerWidth: width, innerHeight: height } = window
    return { width, height, aspect: width / height }
  }

  setup(containers: ParentNode) {
    // container.appendChild(this.renderer.domElement)
    const es = containers.querySelectorAll('[data-webgl]')
    return es
  }

  setResizeCallback(callback: () => void) {
    this.resizeCallback = callback
  }

  getMesh<T extends THREE.Material>(name: string) {
    return this.scene.getObjectByName(name) as THREE.Mesh<THREE.BufferGeometry, T>
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  requestAnimationFrame(callback: () => void) {
    gl.renderer.setAnimationLoop(() => {
      this.time.delta = this.clock.getDelta()
      this.time.elapsed = this.clock.getElapsedTime()
      callback()
    })
  }

  cancelAnimationFrame() {
    gl.renderer.setAnimationLoop(null)
  }

  dispose() {
    this.cancelAnimationFrame()
    gl.scene?.clear()
  }
}

export const gl = new WebGL()
