import { FRAGMENT, VERTEX } from './field.frag.js';
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

const UNIFORMS = ['uRes', 'uCss', 'uTime', 'uProg', 'uPointer', 'uEnergy', 'uHover', 'uPointerActive', 'uZone', 'uZoneP', 'uDetail', 'uFocus', 'uNoise'];

export class FieldRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    canvas.addEventListener('webglcontextlost', (event) => event.preventDefault());
    this.gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
    if (!this.gl) throw new Error('WebGL2 unavailable');
    this.init();
  }

  init() {
    const { gl } = this;
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
    }

    this.program = program;
    this.locations = Object.fromEntries(UNIFORMS.map((name) => [name, gl.getUniformLocation(program, name)]));

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);
    gl.clearColor(0, 0, 0, 0);
    this.noise = createNoiseTexture(gl);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.noise);
    gl.uniform1i(this.locations.uNoise, 0);
  }

  resize(cssWidth, cssHeight, pixelRatio) {
    const width = Math.max(2, Math.round(cssWidth * pixelRatio));
    const height = Math.max(2, Math.round(cssHeight * pixelRatio));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.gl.viewport(0, 0, width, height);
    this.css = [cssWidth, cssHeight];
  }

  render({ time, progress, pointerX, pointerY, energy, hover, active, zones, zoneParams, detail, focus }) {
    const { gl, locations: u } = this;
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
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  dispose() {
    const { gl } = this;
    gl.deleteTexture(this.noise);
    gl.deleteProgram(this.program);
  }
}
