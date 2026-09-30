import { FRAGMENT, POST_FRAGMENT, VERTEX } from './field.frag.js';
import { createNoiseTexture } from './noiseTexture.js';

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return shader;
}

function link(gl, fragmentSource) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  let fragment;
  try {
    fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  } catch (error) {
    gl.deleteShader(vertex);
    throw error;
  }
  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPos');
  gl.linkProgram(program);
  // Once linked the shader objects are no longer needed.
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link failed: ${log}`);
  }
  return program;
}

const UNIFORMS = ['uRes', 'uCss', 'uTime', 'uProg', 'uPointer', 'uEnergy', 'uHover', 'uPointerActive', 'uZone', 'uZoneP', 'uDetail', 'uFocus', 'uNoise', 'uLens'];

export class FieldRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.lost = false;
    this.lastResize = null;
    this.onLost = (event) => {
      event.preventDefault();
      this.lost = true;
    };
    this.onRestored = () => {
      this.init();
      if (this.lastResize) this.resize(...this.lastResize);
      this.lost = false;
    };
    canvas.addEventListener('webglcontextlost', this.onLost);
    canvas.addEventListener('webglcontextrestored', this.onRestored);

    this.gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
    if (!this.gl) {
      this.detach();
      throw new Error('WebGL2 unavailable');
    }
    try {
      this.init();
    } catch (error) {
      this.dispose();
      throw error;
    }
  }

  detach() {
    this.canvas.removeEventListener('webglcontextlost', this.onLost);
    this.canvas.removeEventListener('webglcontextrestored', this.onRestored);
  }

  init() {
    const { gl } = this;
    this.program = link(gl, FRAGMENT);
    this.locations = Object.fromEntries(UNIFORMS.map((name) => [name, gl.getUniformLocation(this.program, name)]));
    this.post = link(gl, POST_FRAGMENT);
    this.postLocations = { uTex: gl.getUniformLocation(this.post, 'uTex'), uLensPx: gl.getUniformLocation(this.post, 'uLensPx') };

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.clearColor(0, 0, 0, 0);

    this.noise = createNoiseTexture(gl);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.noise);
    gl.useProgram(this.program);
    gl.uniform1i(this.locations.uNoise, 0);
    gl.useProgram(this.post);
    gl.uniform1i(this.postLocations.uTex, 1);

    // Offscreen target for the lens pass; created on first use and whenever the canvas size changes.
    this.target = null;
    this.targetFbo = null;
    this.targetSize = [0, 0];
  }

  ensureTarget() {
    const { gl, canvas } = this;
    const { width, height } = canvas;
    if (this.target && this.targetSize[0] === width && this.targetSize[1] === height) return;
    if (this.target) gl.deleteTexture(this.target);
    if (this.targetFbo) gl.deleteFramebuffer(this.targetFbo);

    this.target = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.target);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.activeTexture(gl.TEXTURE0);

    this.targetFbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetFbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.target, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.targetSize = [width, height];
  }

  resize(cssWidth, cssHeight, pixelRatio) {
    this.lastResize = [cssWidth, cssHeight, pixelRatio];
    if (this.lost) return;
    const width = Math.max(2, Math.round(cssWidth * pixelRatio));
    const height = Math.max(2, Math.round(cssHeight * pixelRatio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.gl.viewport(0, 0, width, height);
    this.css = [cssWidth, cssHeight];
  }

  render({ time, progress, pointerX, pointerY, energy, hover, active, zones, zoneParams, detail, focus, lens }) {
    if (this.lost) return;
    const { gl, locations: u } = this;
    const lensOn = lens.s > 0.002 && lens.x > -500;

    if (lensOn) {
      this.ensureTarget();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetFbo);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    gl.useProgram(this.program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform2f(u.uCss, this.css[0], this.css[1]);
    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uProg, progress);
    gl.uniform2f(u.uPointer, pointerX, pointerY);
    gl.uniform1f(u.uEnergy, energy);
    gl.uniform1f(u.uHover, hover);
    gl.uniform1f(u.uPointerActive, active);
    gl.uniform4fv(u.uZone, zones);
    gl.uniform2fv(u.uZoneP, zoneParams);
    gl.uniform1f(u.uDetail, detail);
    gl.uniform2f(u.uFocus, focus[0], focus[1]);
    gl.uniform4f(u.uLens, lens.x, lens.y, lens.r, lens.s);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (!lensOn) return;

    // Lens pass: the finished field goes to the screen, blurred and dimmed inside the horizon.
    const scale = this.canvas.width / this.css[0];
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.target);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.activeTexture(gl.TEXTURE0);
    gl.useProgram(this.post);
    gl.uniform4f(this.postLocations.uLensPx, lens.x * scale, this.canvas.height - lens.y * scale, lens.r * scale, lens.s);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose() {
    this.detach();
    const { gl } = this;
    if (!gl || this.lost) return;
    if (this.noise) gl.deleteTexture(this.noise);
    if (this.target) gl.deleteTexture(this.target);
    if (this.targetFbo) gl.deleteFramebuffer(this.targetFbo);
    if (this.buffer) gl.deleteBuffer(this.buffer);
    if (this.program) gl.deleteProgram(this.program);
    if (this.post) gl.deleteProgram(this.post);
  }
}
