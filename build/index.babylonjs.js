import { B3DMLoaderBase as e, LoaderBase as t, TilesRendererBase as n, getWorkingPath as r, readMagicBytes as i } from "./renderer-BcKWXcM-.js";
import { TransformNode as a } from "@babylonjs/core/Meshes/transformNode";
import { Matrix as o, Quaternion as s, Vector3 as c } from "@babylonjs/core/Maths/math.vector";
import { Frustum as l } from "@babylonjs/core/Maths/math.frustum";
import { Observable as u } from "@babylonjs/core/Misc/observable";
import { Plane as d } from "@babylonjs/core/Maths/math.plane";
import { LoadAssetContainerAsync as f } from "@babylonjs/core/Loading/sceneLoader";
import "@babylonjs/loaders/glTF/2.0";
import { BoundingSphere as p } from "@babylonjs/core/Culling/boundingSphere";
import { BoundingBox as m } from "@babylonjs/core/Culling/boundingBox";
//#region src/babylonjs/renderer/loaders/GLTFLoader.js
var h = /* @__PURE__ */ o.Identity(), GLTFLoader = class extends t {
	constructor(e) {
		super(), this.scene = e, this.adjustmentTransform = o.Identity();
	}
	async parse(e, t, n) {
		let { scene: r, workingPath: i, adjustmentTransform: a } = this, o = i;
		o.length && !/[\\/]$/.test(o) && (o += "/");
		let c = n === "gltf" ? ".gltf" : ".glb", l = null, u = await f(new File([e], t), r, {
			pluginExtension: c,
			rootUrl: o,
			pluginOptions: { gltf: { onParsed: (e) => {
				l = e.json;
			} } }
		});
		u.addAllToScene();
		let d = u.rootNodes[0];
		d.rotationQuaternion = s.Identity();
		let p = d.computeWorldMatrix(!0);
		return a.multiplyToRef(p, h), h.decompose(d.scaling, d.rotationQuaternion, d.position), {
			scene: d,
			container: u,
			metadata: l
		};
	}
}, B3DMLoader = class extends e {
	constructor(e) {
		super(), this.scene = e, this.adjustmentTransform = o.Identity();
	}
	async parse(e, t) {
		let n = super.parse(e), { scene: r, workingPath: i, fetchOptions: a, adjustmentTransform: o } = this, s = new GLTFLoader(r);
		s.workingPath = i, s.fetchOptions = a, o && (s.adjustmentTransform = o);
		let c = await s.parse(n.glbBytes, t, "glb"), l = c.scene;
		return {
			...n,
			scene: l,
			container: c.container,
			metadata: c.metadata
		};
	}
}, g = /* @__PURE__ */ new c(), OBB = class {
	constructor() {
		this.min = new c(-1, -1, -1), this.max = new c(1, 1, 1), this.transform = o.Identity(), this.inverseTransform = o.Identity(), this.points = Array(8).fill(null).map(() => new c());
	}
	update() {
		let { min: e, max: t, points: n, transform: r } = this;
		r.invertToRef(this.inverseTransform);
		let i = 0;
		for (let a = 0; a <= 1; a++) for (let o = 0; o <= 1; o++) for (let s = 0; s <= 1; s++) n[i].set(a === 0 ? e.x : t.x, o === 0 ? e.y : t.y, s === 0 ? e.z : t.z), c.TransformCoordinatesToRef(n[i], r, n[i]), i++;
	}
	clampPoint(e, t) {
		let { min: n, max: r, transform: i, inverseTransform: a } = this;
		return c.TransformCoordinatesToRef(e, a, t), t.x = Math.max(n.x, Math.min(r.x, t.x)), t.y = Math.max(n.y, Math.min(r.y, t.y)), t.z = Math.max(n.z, Math.min(r.z, t.z)), c.TransformCoordinatesToRef(t, i, t), t;
	}
	distanceToPoint(e) {
		return this.clampPoint(e, g), c.Distance(g, e);
	}
	intersectsFrustum(e) {
		return m.IsInFrustum(this.points, e);
	}
}, _ = /* @__PURE__ */ new c(), v = /* @__PURE__ */ new c(), y = /* @__PURE__ */ new c(), b = /* @__PURE__ */ new c(), x = /* @__PURE__ */ new c(), TileBoundingVolume = class {
	constructor() {
		this.sphere = null, this.obb = null;
	}
	setSphereData(e, t, n, r, i) {
		let a = new p(x, x), o = a.centerWorld.set(e, t, n);
		c.TransformCoordinatesToRef(o, i, o), i.decompose(b, null, null), a.radiusWorld = r * Math.max(Math.abs(b.x), Math.abs(b.y), Math.abs(b.z)), this.sphere = a;
	}
	setObbData(e, t) {
		let n = new OBB();
		_.set(e[3], e[4], e[5]), v.set(e[6], e[7], e[8]), y.set(e[9], e[10], e[11]);
		let r = _.length(), i = v.length(), a = y.length();
		_.normalize(), v.normalize(), y.normalize(), r === 0 && c.CrossToRef(v, y, _), i === 0 && c.CrossToRef(_, y, v), a === 0 && c.CrossToRef(_, v, y), n.transform = o.FromValues(_.x, v.x, y.x, e[0], _.y, v.y, y.y, e[1], _.z, v.z, y.z, e[2], 0, 0, 0, 1).transpose().multiply(t), n.min.set(-r, -i, -a), n.max.set(r, i, a), n.update(), this.obb = n;
	}
	distanceToPoint(e) {
		let { sphere: t, obb: n } = this, r = -Infinity, i = -Infinity;
		return t && (r = c.Distance(e, t.centerWorld) - t.radiusWorld, r = Math.max(r, 0)), n && (i = n.distanceToPoint(e)), r > i ? r : i;
	}
	intersectsFrustum(e) {
		let { sphere: t, obb: n } = this;
		return t && !t.isInFrustum(e) || n && !n.intersectsFrustum(e) ? !1 : !!(t || n);
	}
}, S = /* @__PURE__ */ o.Identity(), C = /* @__PURE__ */ new c(), w = /* @__PURE__ */ [
	,
	,
	,
	,
	,
	,
].fill(null).map(() => new d(0, 0, 0, 0)), TilesRenderer = class extends n {
	constructor(e, t) {
		super(e), this.scene = t, this.group = new a("tiles-root", t), this.checkCollisions = !1, this._upRotationMatrix = o.Identity(), this._observables = /* @__PURE__ */ new Map();
	}
	addEventListener(e, t) {
		this._observables.has(e) || this._observables.set(e, new u()), this._observables.get(e).add(t);
	}
	removeEventListener(e, t) {
		this._observables.has(e) && this._observables.get(e).removeCallback(t);
	}
	dispatchEvent(e) {
		this._observables.has(e.type) && this._observables.get(e.type).notifyObservers(e);
	}
	loadRootTileset(...e) {
		return super.loadRootTileset(...e).then((e) => {
			let { asset: t } = e;
			switch ((t && t.gltfUpAxis || "y").toLowerCase()) {
				case "x":
					o.RotationYToRef(-Math.PI / 2, this._upRotationMatrix);
					break;
				case "y":
					o.RotationXToRef(Math.PI / 2, this._upRotationMatrix);
					break;
			}
			return e;
		});
	}
	preprocessNode(e, t, n = null) {
		super.preprocessNode(e, t, n);
		let r = o.Identity();
		e.transform && o.FromValuesToRef(...e.transform, r), n && r.multiplyToRef(n.engineData.transform, r);
		let i = o.Identity();
		r.invertToRef(i);
		let a = new TileBoundingVolume();
		"sphere" in e.boundingVolume && a.setSphereData(...e.boundingVolume.sphere, r), "box" in e.boundingVolume && a.setObbData(e.boundingVolume.box, r), e.engineData.transform = r, e.engineData.transformInverse = i, e.engineData.boundingVolume = a, e.engineData.active = !1, e.engineData.scene = null, e.engineData.container = null;
	}
	async parseTile(e, t, n, a, o) {
		let s = t.engineData, c = this.scene, l = r(a), u = this.fetchOptions, d = s.transform, f = this._upRotationMatrix, p = null, m = (i(e) || n).toLowerCase();
		switch (m) {
			case "b3dm": {
				let t = new B3DMLoader(c);
				t.workingPath = l, t.fetchOptions = u, t.adjustmentTransform.copyFrom(f), p = await t.parse(e, a);
				break;
			}
			case "gltf":
			case "glb": {
				let t = new GLTFLoader(c);
				t.workingPath = l, t.fetchOptions = u, t.adjustmentTransform.copyFrom(f), p = await t.parse(e, a, n);
				break;
			}
			default: throw Error(`BabylonTilesRenderer: Content type "${m}" not supported.`);
		}
		let h = p.scene;
		if (h.setEnabled(!1), h.computeWorldMatrix(!0).multiply(d).decompose(h.scaling, h.rotationQuaternion, h.position), o.aborted) {
			p.container.dispose();
			return;
		}
		if (this.checkCollisions) for (let e of h.getChildMeshes()) e.checkCollisions = !0;
		s.scene = h, s.container = p.container, s.metadata = p.metadata || null;
	}
	disposeTile(e) {
		super.disposeTile(e);
		let t = e.engineData;
		t.container && (t.container.dispose(), t.container = null, t.scene = null, t.metadata = null);
	}
	setTileVisible(e, t) {
		let n = e.engineData.scene;
		n && (t ? (n.parent = this.group, n.setEnabled(!0)) : (n.parent = null, n.setEnabled(!1)), super.setTileVisible(e, t));
	}
	calculateBytesUsed(e) {
		return 1;
	}
	calculateTileViewError(e, t) {
		let { scene: n } = this, r = e.engineData.boundingVolume, i = n.activeCamera, a = n.getEngine(), o = a.getHardwareScalingLevel(), s = a.getRenderWidth() * o, u = a.getRenderHeight() * o, d = i.getProjectionMatrix().m, f = d[15] === 1, p, m;
		if (f) {
			let e = 2 / d[0], t = 2 / d[5];
			m = Math.max(t / u, e / s);
		} else p = 2 / d[5] / u;
		this.group.getWorldMatrix().invertToRef(S), c.TransformCoordinatesToRef(i.globalPosition, S, C), l.GetPlanesToRef(i.getTransformationMatrix(!0), w);
		let h = w.map((e) => e.transform(S)), g = r.distanceToPoint(C), _;
		_ = f ? e.geometricError / m : g === 0 ? Infinity : e.geometricError / (g * p), t.inView = r.intersectsFrustum(h), t.error = _, t.distanceFromCamera = g;
	}
	dispose() {
		super.dispose(), this.group.dispose();
	}
};
//#endregion
export { TilesRenderer };

//# sourceMappingURL=index.babylonjs.js.map