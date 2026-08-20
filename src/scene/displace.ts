import * as THREE from 'three'

/**
 * Shared radial-noise displacement, injected into any three.js material's
 * vertex shader.
 *
 * This used to run on the CPU: a loop over every vertex plus
 * `geometry.computeVertexNormals()` on every single frame. That is main-thread
 * work competing with GSAP's scroll timelines and React — exactly the budget
 * that decides whether scrolling feels like film or like a slideshow.
 *
 * Moving it into the vertex shader also gets the normals for free: under
 * `flatShading` three.js derives normals from screen-space derivatives of the
 * *displaced* position in the fragment shader, so the facets stay correct with
 * no normal recomputation at all.
 *
 * The GLSL mirrors the previous JS `noise3()` exactly, so the silhouette is
 * unchanged — this is a performance change, not a visual one.
 */
export type DisplaceUniforms = {
	uTime: { value: number }
	uAmp: { value: number }
}

export function createDisplaceUniforms(): DisplaceUniforms {
	return { uTime: { value: 0 }, uAmp: { value: 0 } }
}

const HEADER = /* glsl */ `
uniform float uTime;
uniform float uAmp;

float noise3(vec3 p, float t) {
	return sin(p.x * 2.1 + t) * 0.45
	     + sin(p.y * 1.7 + t * 1.3 + p.x) * 0.35
	     + sin(p.z * 2.6 + t * 0.7 + p.y) * 0.2;
}
`

const BODY = /* glsl */ `
vec3 transformed = position * (1.0 + uAmp * noise3(position, uTime));
`

/**
 * Attach to a material BEFORE its first render. Safe on MeshStandardMaterial
 * and MeshBasicMaterial alike — both include the `begin_vertex` chunk.
 */
export function attachDisplacement(material: THREE.Material, uniforms: DisplaceUniforms): void {
	material.onBeforeCompile = (shader) => {
		shader.uniforms.uTime = uniforms.uTime
		shader.uniforms.uAmp = uniforms.uAmp
		shader.vertexShader = HEADER + shader.vertexShader.replace('#include <begin_vertex>', BODY)
	}
	// Distinguishes these programs from an un-displaced material of the same
	// type in three.js's shader cache.
	material.customProgramCacheKey = () => 'shard-displace'
}
