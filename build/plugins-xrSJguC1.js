import { D as e, O as t, _ as n, c as r, h as i, k as a, p as o } from "./renderer-DeQJfJ4K.js";
import { c as s, d as c, m as l, o as u, s as d } from "./renderer-Dg5CPeDN.js";
import { i as f, o as p, s as m, t as h } from "./plugins-BE36UzMG.js";
import { BatchedMesh as g, Box2 as _, Box3 as v, Box3Helper as y, BoxGeometry as b, BufferAttribute as x, BufferGeometry as S, CanvasTexture as C, Color as w, CustomBlending as T, DataTexture as E, DefaultLoadingManager as D, DoubleSide as O, EdgesGeometry as k, EventDispatcher as ee, FileLoader as te, Frustum as ne, Group as A, LineBasicMaterial as re, LineSegments as ie, LinearFilter as ae, LinearMipMapLinearFilter as oe, MathUtils as j, Matrix2 as se, Matrix3 as ce, Matrix4 as M, Mesh as N, MeshBasicMaterial as le, MeshStandardMaterial as ue, OneFactor as de, PlaneGeometry as fe, Points as pe, PointsMaterial as me, Quaternion as he, REVISION as ge, RGFormat as _e, Ray as ve, Raycaster as ye, SRGBColorSpace as be, ShaderMaterial as xe, Source as Se, Sphere as P, SphereGeometry as Ce, Texture as we, TextureUtils as Te, Triangle as Ee, UnsignedByteType as De, Vector2 as F, Vector3 as I, Vector4 as Oe, WebGLArrayRenderTarget as ke, WebGLRenderTarget as Ae, WebGLRenderer as je, ZeroFactor as Me } from "three";
import { GLTFLoader as Ne } from "three/addons/loaders/GLTFLoader.js";
import { FullScreenQuad as Pe } from "three/addons/postprocessing/Pass.js";
//#region src/three/plugins/images/utils/getCartographicToMeterDerivative.js
var Fe = /* @__PURE__ */ new I(), Ie = /* @__PURE__ */ new I();
function Le(e, t, n) {
	let r = 1e-5, i = n + r, a = t + r;
	Math.abs(a) > Math.PI / 2 && (a -= r), e.getCartographicToPosition(t, n, 0, Fe), e.getCartographicToPosition(a, n, 0, Ie);
	let o = Fe.distanceTo(Ie) / r;
	return e.getCartographicToPosition(t, i, 0, Ie), [Fe.distanceTo(Ie) / r, o];
}
//#endregion
//#region src/three/plugins/images/utils/ProjectionScheme.js
var L = class {
	get isMercator() {
		return this.scheme === "EPSG:3857";
	}
	get isCartographic() {
		return this.scheme !== "none";
	}
	constructor(e = "EPSG:4326") {
		this.scheme = e, this.tileCountX = 1, this.tileCountY = 1, this.setScheme(e);
	}
	setScheme(e) {
		switch (this.scheme = e, e) {
			case "CRS:84":
			case "EPSG:4326":
				this.tileCountX = 2, this.tileCountY = 1;
				break;
			case "EPSG:3857":
				this.tileCountX = 1, this.tileCountY = 1;
				break;
			case "none":
				this.tileCountX = 1, this.tileCountY = 1;
				break;
			default: throw Error(`ProjectionScheme: Unknown projection scheme "${e}"`);
		}
	}
	convertNormalizedToLatitude(e) {
		if (this.scheme === "none") return e;
		if (this.isMercator) {
			let t = j.mapLinear(e, 0, 1, -1, 1);
			return 2 * Math.atan(Math.exp(t * Math.PI)) - Math.PI / 2;
		} else return j.mapLinear(e, 0, 1, -Math.PI / 2, Math.PI / 2);
	}
	convertNormalizedToLongitude(e) {
		return this.scheme === "none" ? e : j.mapLinear(e, 0, 1, -Math.PI, Math.PI);
	}
	convertLatitudeToNormalized(e) {
		return this.scheme === "none" ? e : this.isMercator ? 1 / 2 + 1 * Math.log(Math.tan(Math.PI / 4 + e / 2)) / (2 * Math.PI) : j.mapLinear(e, -Math.PI / 2, Math.PI / 2, 0, 1);
	}
	convertLongitudeToNormalized(e) {
		return this.scheme === "none" ? e : (e + Math.PI) / (2 * Math.PI);
	}
	getLongitudeDerivativeAtNormalized(e) {
		return this.scheme === "none" ? 1 : 2 * Math.PI;
	}
	getLatitudeDerivativeAtNormalized(e) {
		if (this.scheme === "none") return 1;
		{
			let t = 1e-5, n = e - t;
			return n < 0 && (n = e + t), this.isMercator ? Math.abs(this.convertNormalizedToLatitude(e) - this.convertNormalizedToLatitude(n)) / t : Math.PI;
		}
	}
	getBounds() {
		return this.scheme === "none" ? [
			0,
			0,
			1,
			1
		] : [
			this.convertNormalizedToLongitude(0),
			this.convertNormalizedToLatitude(0),
			this.convertNormalizedToLongitude(1),
			this.convertNormalizedToLatitude(1)
		];
	}
	toNormalizedPoint(e, t) {
		let n = [e, t];
		return n[0] = this.convertLongitudeToNormalized(n[0]), n[1] = this.convertLatitudeToNormalized(n[1]), n;
	}
	toNormalizedRange(e) {
		return [...this.toNormalizedPoint(e[0], e[1]), ...this.toNormalizedPoint(e[2], e[3])];
	}
	toCartographicPoint(e, t) {
		let n = [e, t];
		return n[0] = this.convertNormalizedToLongitude(n[0]), n[1] = this.convertNormalizedToLatitude(n[1]), n;
	}
	toCartographicRange(e) {
		return [...this.toCartographicPoint(e[0], e[1]), ...this.toCartographicPoint(e[2], e[3])];
	}
	clampToBounds(e, t = !1) {
		let n = [...e], r;
		r = t ? [
			0,
			0,
			1,
			1
		] : this.getBounds();
		let [i, a, o, s] = r;
		return n[0] = j.clamp(n[0], i, o), n[2] = j.clamp(n[2], i, o), n[1] = j.clamp(n[1], a, s), n[3] = j.clamp(n[3], a, s), n;
	}
};
//#endregion
//#region src/three/plugins/images/utils/TilingScheme.js
function Re(e, t) {
	let [n, r, i, a] = e, [o, s, c, l] = t;
	return !(n >= c || i <= o || r >= l || a <= s);
}
var ze = class {
	get levelCount() {
		return this._levels.length;
	}
	get maxLevel() {
		return this.levelCount - 1;
	}
	get minLevel() {
		let e = this._levels;
		for (let t = 0; t < e.length; t++) if (e[t] !== null) return t;
		return -1;
	}
	get contentBounds() {
		return this._contentBounds ?? this.projection.getBounds();
	}
	get aspectRatio() {
		let { pixelWidth: e, pixelHeight: t } = this.getLevel(this.maxLevel);
		return e / t;
	}
	constructor() {
		this.flipY = !1, this.pixelOverlap = 0, this._contentBounds = null, this.projection = new L("none"), this._levels = [];
	}
	setLevel(e, t = {}) {
		let n = this._levels;
		for (; n.length < e;) n.push(null);
		let { tileSplitX: r = 2, tileSplitY: i = 2 } = t, { tilePixelWidth: a = 256, tilePixelHeight: o = 256, tileCountX: s = r ** e, tileCountY: c = i ** e, tileBounds: l = null } = t, { pixelWidth: u = a * s, pixelHeight: d = o * c } = t;
		n[e] = {
			tilePixelWidth: a,
			tilePixelHeight: o,
			pixelWidth: u,
			pixelHeight: d,
			tileCountX: s,
			tileCountY: c,
			tileSplitX: r,
			tileSplitY: i,
			tileBounds: l
		};
	}
	generateLevels(e, t, n, r = {}) {
		let { minLevel: i = 0, tilePixelWidth: a = 256, tilePixelHeight: o = 256 } = r, s = e - 1, { pixelWidth: c = a * t * 2 ** s, pixelHeight: l = o * n * 2 ** s } = r;
		for (let t = i; t < e; t++) {
			let n = e - t - 1, r = Math.ceil(c * 2 ** -n), i = Math.ceil(l * 2 ** -n), s = Math.ceil(r / a), u = Math.ceil(i / o);
			this.setLevel(t, {
				tilePixelWidth: a,
				tilePixelHeight: o,
				pixelWidth: r,
				pixelHeight: i,
				tileCountX: s,
				tileCountY: u
			});
		}
	}
	getLevel(e) {
		return this._levels[e];
	}
	setContentBounds(e, t, n, r) {
		this._contentBounds = [
			e,
			t,
			n,
			r
		];
	}
	setProjection(e) {
		this.projection = e;
	}
	getTileAtPoint(e, t, n, r = !1) {
		let { flipY: i } = this, { tileCountY: a, tileBounds: o, pixelHeight: s, pixelWidth: c, tilePixelHeight: l, tilePixelWidth: u } = this.getLevel(n), d = u / c, f = l / s;
		if (r || ([e, t] = this.toNormalizedPoint(e, t)), o) {
			let n = this.toNormalizedRange(o);
			e = j.mapLinear(e, n[0], n[2], 0, 1), t = j.mapLinear(t, n[1], n[3], 0, 1);
		}
		let p = Math.floor(e / d), m = Math.floor(t / f);
		return i && (m = a - 1 - m), [p, m];
	}
	getTilesInRange(e, t, n, r, i, a = !1) {
		let o = [
			e,
			t,
			n,
			r
		], s = this.getContentBounds(a), c = this.getLevel(i).tileBounds;
		if (!Re(o, s) || c && (a && (c = this.toNormalizedRange(c)), !Re(o, s))) return [
			0,
			0,
			-1,
			-1
		];
		let [l, u, d, f] = this.clampToContentBounds(o, a), p = this.getTileAtPoint(l, u, i, a), m = this.getTileAtPoint(d, f, i, a);
		this.flipY && ([p[1], m[1]] = [m[1], p[1]]);
		let { tileCountX: h, tileCountY: g } = this.getLevel(i), [_, v] = p, [y, b] = m;
		return y < 0 || b < 0 || _ >= h || v >= g ? [
			0,
			0,
			-1,
			-1
		] : [
			j.clamp(_, 0, h - 1),
			j.clamp(v, 0, g - 1),
			j.clamp(y, 0, h - 1),
			j.clamp(b, 0, g - 1)
		];
	}
	getTileExists(e, t, n) {
		let [r, i, a, o] = this.contentBounds, [s, c, l, u] = this.getTileBounds(e, t, n);
		return !(s >= l || c >= u) && s <= a && c <= o && l >= r && u >= i;
	}
	getContentBounds(e = !1) {
		let { projection: t } = this, n = [...this.contentBounds];
		return e && (n[0] = t.convertLongitudeToNormalized(n[0]), n[1] = t.convertLatitudeToNormalized(n[1]), n[2] = t.convertLongitudeToNormalized(n[2]), n[3] = t.convertLatitudeToNormalized(n[3])), n;
	}
	getTileContentUVBounds(e, t, n) {
		let [r, i, a, o] = this.getTileBounds(e, t, n, !0, !0), [s, c, l, u] = this.getTileBounds(e, t, n, !0, !1);
		return [
			j.mapLinear(r, s, l, 0, 1),
			j.mapLinear(i, c, u, 0, 1),
			j.mapLinear(a, s, l, 0, 1),
			j.mapLinear(o, c, u, 0, 1)
		];
	}
	getTileBounds(e, t, n, r = !1, i = !0) {
		let { flipY: a, pixelOverlap: o, projection: s } = this, { tilePixelWidth: c, tilePixelHeight: l, pixelWidth: u, pixelHeight: d, tileBounds: f } = this.getLevel(n), p = c * e - o, m = l * t - o, h = p + c + o * 2, g = m + l + o * 2;
		if (p = Math.max(p, 0), m = Math.max(m, 0), h = Math.min(h, u), g = Math.min(g, d), p /= u, h /= u, m /= d, g /= d, a) {
			let e = (g - m) / 2, t = 1 - (m + g) / 2;
			m = t - e, g = t + e;
		}
		let _ = [
			p,
			m,
			h,
			g
		];
		if (f) {
			let e = this.toNormalizedRange(f);
			_[0] = j.mapLinear(_[0], 0, 1, e[0], e[2]), _[2] = j.mapLinear(_[2], 0, 1, e[0], e[2]), _[1] = j.mapLinear(_[1], 0, 1, e[1], e[3]), _[3] = j.mapLinear(_[3], 0, 1, e[1], e[3]);
		}
		return i && (_ = this.clampToBounds(_, !0)), r || (_[0] = s.convertNormalizedToLongitude(_[0]), _[1] = s.convertNormalizedToLatitude(_[1]), _[2] = s.convertNormalizedToLongitude(_[2]), _[3] = s.convertNormalizedToLatitude(_[3])), _;
	}
	toNormalizedPoint(e, t) {
		return this.projection.toNormalizedPoint(e, t);
	}
	toNormalizedRange(e) {
		return this.projection.toNormalizedRange(e);
	}
	toCartographicPoint(e, t) {
		return this.projection.toCartographicPoint(e, t);
	}
	toCartographicRange(e) {
		return this.projection.toCartographicRange(e);
	}
	clampToContentBounds(e, t = !1) {
		let n = [...e], [r, i, a, o] = this.getContentBounds(t);
		return n[0] = j.clamp(n[0], r, a), n[1] = j.clamp(n[1], i, o), n[2] = j.clamp(n[2], r, a), n[3] = j.clamp(n[3], i, o), n;
	}
	clampToBounds(e, t = !1) {
		return this.projection.clampToBounds(e, t);
	}
}, Be = Symbol("TILE_X"), Ve = Symbol("TILE_Y"), R = Symbol("TILE_LEVEL"), He = 30, Ue = 15, We = 20, Ge = Symbol("OVERLAY_RANGE"), Ke = Symbol("OVERLAY_LEVEL"), qe = /* @__PURE__ */ new I(), Je = /* @__PURE__ */ new I(), Ye = /* @__PURE__ */ new P(), Xe = class {
	constructor(e = {}) {
		let { overlay: t = null, shape: n = "ellipsoid", endCaps: r = !0, center: i = !0, useRecommendedSettings: a = !0, applyOverlayTexture: o = !1 } = e;
		this.priority = -10, this.tiles = null, this.overlay = t, this.shape = n, this.endCaps = r, this.center = i, this.useRecommendedSettings = a, this.applyOverlayTexture = o, this._tiling = null;
	}
	init(e) {
		this.useRecommendedSettings && (e.errorTarget = 1), this.tiles = e;
	}
	async loadRootTileset() {
		let { overlay: e } = this;
		return e ? (await e.init(), this._tiling = e.tiling || this._createDefaultTiling()) : this._tiling = this._createDefaultTiling(), this.getTileset();
	}
	async parseToMesh(e, t, n, r, i) {
		if (n !== "generated_surface") return null;
		let a;
		a = this._useEllipsoid() ? this._createEllipsoidMesh(t) : this._createPlanarMesh(t);
		let { overlay: o, applyOverlayTexture: s } = this;
		if (o && s) {
			let e = t[Be], n = t[Ve], r = t[R], s = this._tiling.getTileBounds(e, n, r, !0, !1);
			if (o.hasContent(s, r)) {
				try {
					await o.lockTexture(s, r);
				} catch (e) {
					if (e.name !== "AbortError") throw e;
					return null;
				}
				let e = o.getTexture(s, r);
				if (t[Ge] = s, t[Ke] = r, i.aborted) return o.releaseTexture(s, r), delete t[Ge], delete t[Ke], null;
				a.material.map = e, a.material.needsUpdate = !0;
			}
		}
		return a;
	}
	preprocessNode(e) {
		let t = this._tiling.maxLevel;
		e[R] < t && e.parent !== null && this.expandChildren(e);
	}
	disposeTile(e) {
		let t = e[Ge];
		this.overlay && t && (this.overlay.releaseTexture(t, e[Ke]), delete e[Ge], delete e[Ke]);
	}
	dispose() {
		this.tiles.forEachLoadedModel((e, t) => {
			this.disposeTile(t);
		});
	}
	getCartographicFromPosition(e, t = {}) {
		let { _tiling: n } = this, { projection: r } = n;
		if (!r.isCartographic) throw Error("GeneratedSurfacePlugin: getCartographicFromPosition requires a cartographic projection.");
		if (this._useEllipsoid()) return this.tiles.ellipsoid.getPositionToCartographic(e, t);
		let { center: i } = this, a = e.x / n.aspectRatio + (i ? .5 : 0), o = e.y + (i ? .5 : 0);
		return t.lat = r.convertNormalizedToLatitude(o), t.lon = r.convertNormalizedToLongitude(a), t;
	}
	getPositionFromCartographic(e, t, n = new I()) {
		let { _tiling: r } = this, { projection: i } = r;
		if (!i.isCartographic) throw Error("GeneratedSurfacePlugin: getPositionFromCartographic requires a cartographic projection.");
		if (this._useEllipsoid()) return this.tiles.ellipsoid.getCartographicToPosition(e, t, 0, n);
		let { center: a } = this, o = i.convertLongitudeToNormalized(t), s = i.convertLatitudeToNormalized(e);
		return n.x = (o - (a ? .5 : 0)) * r.aspectRatio, n.y = s - (a ? .5 : 0), n.z = 0, n;
	}
	_useEllipsoid() {
		return this._tiling.projection.isCartographic && this.shape === "ellipsoid";
	}
	_createPlanarMesh(e) {
		let t = e[Be], n = e[Ve], r = e[R], i = e.boundingVolume.box, a = 1, o = 1, s = 0, c = 0, l = 0;
		i && ([s, c, l] = i, a = i[3], o = i[7]);
		let u = new fe(2 * a, 2 * o), d = new N(u, new le());
		d.position.set(s, c, l);
		let f = this._tiling.getTileContentUVBounds(t, n, r), { uv: p } = u.attributes;
		for (let e = 0; e < p.count; e++) p.setXY(e, j.mapLinear(p.getX(e), 0, 1, f[0], f[2]), j.mapLinear(p.getY(e), 0, 1, f[1], f[3]));
		return d;
	}
	_createEllipsoidMesh(e) {
		let { tiles: t, endCaps: n, _tiling: r } = this, { projection: i } = r, a = e[R], o = e[Be], s = e[Ve], [c, l, u, d] = e.boundingVolume.region, f = Math.max(Ue, Math.ceil((d - l) * j.RAD2DEG * .25)), p = Math.max(He, Math.ceil((u - c) * j.RAD2DEG * .25)), m = p + 3, h = f + 3, g = new fe(1, 1, p + 2, f + 2), [_, v, y, b] = r.getTileBounds(o, s, a, !0, !0), x = r.getTileContentUVBounds(o, s, a), { position: S, normal: C, uv: w } = g.attributes, T = S.count;
		e.engineData.boundingVolume.getSphere(Ye);
		for (let r = 0; r < T; r++) {
			let a = r % m, o = Math.floor(r / m), s = a === 0 || a === m - 1 || o === 0 || o === h - 1, c = Math.max(1, Math.min(m - 2, a)), u = Math.max(1, Math.min(h - 2, o)), g = (c - 1) / p, T = 1 - (u - 1) / f, E = i.convertNormalizedToLongitude(j.mapLinear(g, 0, 1, _, y)), D = i.convertNormalizedToLatitude(j.mapLinear(T, 0, 1, v, b));
			if (i.isMercator && n && (b === 1 && T === 1 && (D = Math.PI / 2), v === 0 && T === 0 && (D = -Math.PI / 2)), i.isMercator && T !== 0 && T !== 1) {
				let e = i.convertNormalizedToLatitude(1), t = 1 / f, n = j.mapLinear(T - t, 0, 1, l, d), r = j.mapLinear(T + t, 0, 1, l, d);
				D > e && n < e && (D = e), D < -e && r > -e && (D = -e);
			}
			t.ellipsoid.getCartographicToPosition(D, E, 0, qe).sub(Ye.center), t.ellipsoid.getCartographicToNormal(D, E, Je), s && qe.addScaledVector(Je, -e.geometricError);
			let O = j.mapLinear(i.convertLongitudeToNormalized(E), _, y, x[0], x[2]), k = j.mapLinear(i.convertLatitudeToNormalized(D), v, b, x[1], x[3]);
			S.setXYZ(r, qe.x, qe.y, qe.z), C.setXYZ(r, Je.x, Je.y, Je.z), w.setXY(r, O, k);
		}
		let E = new N(g, new le());
		return E.position.copy(Ye.center), E;
	}
	getTileset() {
		let { tiles: e, _tiling: t } = this, n = t.minLevel, { tileCountX: r, tileCountY: i } = t.getLevel(n), a = [];
		for (let e = 0; e < r; e++) for (let t = 0; t < i; t++) {
			let r = this.createChild(e, t, n);
			r !== null && a.push(r);
		}
		let o = {
			asset: { version: "1.1" },
			geometricError: Infinity,
			root: {
				refine: "REPLACE",
				geometricError: Infinity,
				boundingVolume: this.createBoundingVolume(0, 0, -1),
				children: a,
				[R]: -1,
				[Be]: 0,
				[Ve]: 0
			}
		};
		return e.preprocessTileset(o, ""), o;
	}
	getUrl() {
		return "tile.generated_surface";
	}
	fetchData(e) {
		if (/generated_surface/.test(e)) return /* @__PURE__ */ new ArrayBuffer();
	}
	createBoundingVolume(e, t, n, r = 0) {
		let { _tiling: i } = this, a = n === -1;
		if (this._useEllipsoid()) {
			let { endCaps: o } = this, s, c;
			return a ? (s = i.getContentBounds(!0), c = i.getContentBounds()) : (s = i.getTileBounds(e, t, n, !0, !0), c = i.getTileBounds(e, t, n, !1, !0)), o && (s[3] === 1 && (c[3] = Math.PI / 2), s[1] === 0 && (c[1] = -Math.PI / 2)), { region: [
				...c,
				-r,
				1
			] };
		} else {
			let { center: r } = this, o;
			o = a ? i.getContentBounds(!0) : i.getTileBounds(e, t, n, !0);
			let [s, c, l, u] = o, d = (l - s) / 2, f = (u - c) / 2, p = s + d, m = c + f;
			return r && (p -= .5, m -= .5), p *= i.aspectRatio, d *= i.aspectRatio, { box: [
				p,
				m,
				0,
				d,
				0,
				0,
				0,
				f,
				0,
				0,
				0,
				0
			] };
		}
	}
	createChild(e, t, n) {
		let { _tiling: r } = this, { projection: i } = r;
		if (!r.getTileExists(e, t, n)) return null;
		let a, o = this._useEllipsoid();
		if (o) {
			let [o, s, c, l] = r.getTileBounds(e, t, n, !0), { tilePixelWidth: u, tilePixelHeight: d } = r.getLevel(n), f = (c - o) / u, p = (l - s) / d, [, m, h, g] = r.getTileBounds(e, t, n), _ = m > 0 == g > 0 ? Math.min(Math.abs(m), Math.abs(g)) : 0, v = i.convertLatitudeToNormalized(_), y = i.getLongitudeDerivativeAtNormalized(o), b = i.getLatitudeDerivativeAtNormalized(v), [x, S] = Le(this.tiles.ellipsoid, _, h);
			a = Math.max(f * y * x, p * b * S);
		} else {
			let { pixelWidth: e, pixelHeight: t } = r.getLevel(n);
			a = Math.max(r.aspectRatio / e, 1 / t);
		}
		return {
			refine: "REPLACE",
			geometricError: a,
			boundingVolume: this.createBoundingVolume(e, t, n, o ? a : 0),
			content: { uri: this.getUrl(e, t, n) },
			children: [],
			[Be]: e,
			[Ve]: t,
			[R]: n
		};
	}
	expandChildren(e) {
		let t = e[R], n = e[Be], r = e[Ve], { tileSplitX: i, tileSplitY: a } = this._tiling.getLevel(t);
		for (let o = 0; o < i; o++) for (let s = 0; s < a; s++) {
			let c = this.createChild(i * n + o, a * r + s, t + 1);
			c && e.children.push(c);
		}
	}
	_createDefaultTiling() {
		let e = new ze();
		if (this.shape === "ellipsoid") {
			let t = new L("EPSG:3857");
			e.setProjection(t), e.generateLevels(We, t.tileCountX, t.tileCountY);
		} else {
			let t = new L("none");
			e.setProjection(t), e.generateLevels(We, 1, 1);
		}
		return e;
	}
}, Ze = class extends DOMException {
	constructor() {
		super("DataCache: Item removed", "AbortError");
	}
};
function Qe(...e) {
	return e.join("_");
}
var $e = class {
	constructor() {
		this.cache = {}, this.count = 0, this.cachedBytes = 0, this.active = 0;
	}
	fetchItem(e, t) {}
	disposeItem(e, t) {}
	getMemoryUsage(e) {
		return 0;
	}
	setData(...e) {
		let { cache: t } = this, n = e.pop(), r = Qe(...e);
		if (r in t) throw Error(`DataCache: "${r}" is already present.`);
		return this.cache[r] = {
			abortController: new AbortController(),
			result: n,
			count: 1,
			bytes: this.getMemoryUsage(n)
		}, this.count++, this.cachedBytes += this.cache[r].bytes, n;
	}
	lock(...e) {
		let { cache: t } = this, n = Qe(...e);
		if (n in t) t[n].count++;
		else {
			let t = new AbortController(), r = {
				abortController: t,
				result: null,
				count: 1,
				bytes: 0,
				args: e
			};
			this.active++, r.result = this.fetchItem(e, t.signal), r.result instanceof Promise ? r.result = r.result.then((e) => (t.signal.throwIfAborted(), r.result = e, r.bytes = this.getMemoryUsage(e), this.cachedBytes += r.bytes, e)).finally(() => {
				this.active--;
			}) : (this.active--, r.bytes = this.getMemoryUsage(r.result), this.cachedBytes += r.bytes), this.cache[n] = r, this.count++;
		}
		return t[n].result;
	}
	release(...e) {
		let t = Qe(...e);
		this.releaseViaFullKey(t);
	}
	get(...e) {
		let { cache: t } = this, n = Qe(...e);
		return n in t && t[n].count > 0 ? t[n].result : null;
	}
	has(...e) {
		let { cache: t } = this;
		return Qe(...e) in t;
	}
	forEachItem(e) {
		let { cache: t } = this;
		for (let n in t) {
			let r = t[n];
			r.result instanceof Promise || e(r.result, r.args);
		}
	}
	dispose() {
		let { cache: e } = this;
		for (let t in e) {
			let { abortController: n } = e[t];
			n.abort(new Ze()), this.releaseViaFullKey(t, !0);
		}
		this.cache = {};
	}
	releaseViaFullKey(e, t = !1) {
		let { cache: n } = this;
		if (e in n && n[e].count > 0) {
			let r = n[e];
			if (r.count--, r.count === 0 || t) {
				let i = () => {
					if (n[e] !== r) return;
					let { result: t, abortController: i } = r;
					i.abort(new Ze()), t instanceof Promise ? t.then((e) => {
						this.disposeItem(e, r.args);
					}).catch(() => {
						this.disposeItem(null, r.args);
					}).finally(() => {
						this.count--, this.cachedBytes -= r.bytes;
					}) : (this.disposeItem(t, r.args), this.count--, this.cachedBytes -= r.bytes), delete n[e];
				};
				t ? i() : queueMicrotask(() => {
					r.count === 0 && i();
				});
			}
			return !0;
		}
		throw Error("DataCache: Attempting to release key that does not exist");
	}
}, et = class extends $e {
	constructor(e = {}) {
		super();
		let { fetchOptions: t = {} } = e;
		this.tiling = new ze(), this.fetchOptions = t, this.fetchData = (...e) => fetch(...e);
	}
	init() {}
	async processBufferToTexture(e) {
		let t = new Blob([e]), n = new we(await createImageBitmap(t, {
			premultiplyAlpha: "none",
			colorSpaceConversion: "none",
			imageOrientation: "flipY"
		}));
		return n.generateMipmaps = !1, n.colorSpace = be, n.needsUpdate = !0, n;
	}
	getMemoryUsage(e) {
		let { format: t, type: n, image: r, generateMipmaps: i } = e, { width: a, height: o } = r, s = Te.getByteLength(a, o, t, n);
		return i ? s * 4 / 3 : s;
	}
	fetchItem(e, t) {
		let n = {
			...this.fetchOptions,
			signal: t
		}, r = this.getUrl(...e);
		return this.fetchData(r, n).then((e) => e.arrayBuffer()).then((e) => this.processBufferToTexture(e));
	}
	disposeItem(e) {
		e && (e.dispose(), e.image instanceof ImageBitmap && e.image.close());
	}
	getUrl(...e) {}
}, tt = class extends et {
	constructor(e = {}) {
		let { levels: t = 20, tileDimension: n = 256, projection: r = "EPSG:3857", url: i = null, ...a } = e;
		super(a), this.tileDimension = n, this.levels = t, this.projection = r, this.url = i;
	}
	getUrl(e, t, n) {
		return this.url.replace(/{\s*z\s*}/gi, n).replace(/{\s*x\s*}/gi, e).replace(/{\s*(y|reverseY|-\s*y)\s*}/gi, t);
	}
	init() {
		let { tiling: e, tileDimension: t, levels: n, url: r, projection: i } = this;
		return e.flipY = !/{\s*reverseY|-\s*y\s*}/g.test(r), e.setProjection(new L(i)), e.setContentBounds(...e.projection.getBounds()), Array.isArray(n) ? n.forEach((n, r) => {
			n !== null && e.setLevel(r, {
				tilePixelWidth: t,
				tilePixelHeight: t,
				...n
			});
		}) : e.generateLevels(n, e.projection.tileCountX, e.projection.tileCountY, {
			tilePixelWidth: t,
			tilePixelHeight: t
		}), this.url = r, Promise.resolve();
	}
}, nt = class extends tt {
	constructor(e = {}) {
		let { subdomains: t = ["t0"], ...n } = e;
		super(n), this.subdomains = t, this.subDomainIndex = 0;
	}
	getUrl(e, t, n) {
		return this.url.replace(/{\s*subdomain\s*}/gi, this._getSubdomain()).replace(/{\s*quadkey\s*}/gi, this._tileToQuadKey(e, t, n));
	}
	_tileToQuadKey(e, t, n) {
		let r = "";
		for (let i = n; i > 0; i--) {
			let n = 0, a = 1 << i - 1;
			(e & a) !== 0 && (n += 1), (t & a) !== 0 && (n += 2), r += n.toString();
		}
		return r;
	}
	_getSubdomain() {
		return this.subDomainIndex = (this.subDomainIndex + 1) % this.subdomains.length, this.subdomains[this.subDomainIndex];
	}
}, rt = class extends et {
	constructor(e = {}) {
		let { url: t = null, ...n } = e;
		super(n), this.tileSets = null, this.extension = null, this.url = t;
	}
	getUrl(e, t, n) {
		let { url: r, extension: i, tileSets: a, tiling: o } = this;
		return new URL(`${parseInt(a[n - o.minLevel].href)}/${e}/${t}.${i}`, r).toString();
	}
	init() {
		let { url: e } = this;
		return this.fetchData(new URL("tilemapresource.xml", e), this.fetchOptions).then((e) => e.text()).then((t) => {
			let { tiling: n } = this, r = new DOMParser().parseFromString(t, "text/xml"), i = r.querySelector("BoundingBox"), a = r.querySelector("TileFormat"), o = [...r.querySelector("TileSets").querySelectorAll("TileSet")].map((e) => ({
				href: parseInt(e.getAttribute("href")),
				unitsPerPixel: parseFloat(e.getAttribute("units-per-pixel")),
				order: parseInt(e.getAttribute("order"))
			})).sort((e, t) => e.order - t.order), s = parseFloat(i.getAttribute("minx")) * j.DEG2RAD, c = parseFloat(i.getAttribute("maxx")) * j.DEG2RAD, l = parseFloat(i.getAttribute("miny")) * j.DEG2RAD, u = parseFloat(i.getAttribute("maxy")) * j.DEG2RAD, d = parseInt(a.getAttribute("width")), f = parseInt(a.getAttribute("height")), p = a.getAttribute("extension"), m = r.querySelector("SRS").textContent;
			this.extension = p, this.url = e, this.tileSets = o, n.setProjection(new L(m)), n.setContentBounds(s, l, c, u), o.forEach(({ order: e }) => {
				n.setLevel(e, {
					tileCountX: n.projection.tileCountX * 2 ** e,
					tilePixelWidth: d,
					tilePixelHeight: f
				});
			});
		});
	}
};
//#endregion
//#region src/three/plugins/images/overlays/utils.js
function z(e, t, n, r) {
	let [i, a, o, s] = e;
	a += 1e-8, i += 1e-8, s -= 1e-8, o -= 1e-8;
	let c = Math.max(Math.min(t, n.maxLevel), n.minLevel), [l, u, d, f] = n.getTilesInRange(i, a, o, s, c, !0);
	for (let e = l; e <= d; e++) for (let t = u; t <= f; t++) r(e, t, c);
}
function it(e, t, n) {
	let r = new I(), i = {}, a = [], o = e.getAttribute("position");
	e.computeBoundingBox(), e.boundingBox.getCenter(r).applyMatrix4(t), n.getPositionToCartographic(r, i);
	let s = i.lat || 0, c = i.lon || 0, l = Infinity, u = Infinity, d = Infinity, f = -Infinity, p = -Infinity, m = -Infinity;
	for (let e = 0; e < o.count; e++) r.fromBufferAttribute(o, e).applyMatrix4(t), n.getPositionToCartographic(r, i), Math.abs(Math.abs(i.lat) - Math.PI / 2) < 1e-5 && (i.lon = c), Math.abs(c - i.lon) > Math.PI && (i.lon += Math.sign(c - i.lon) * Math.PI * 2), Math.abs(s - i.lat) > Math.PI && (i.lat += Math.sign(s - i.lat) * Math.PI * 2), a.push(i.lon, i.lat, i.height), l = Math.min(l, i.lat), f = Math.max(f, i.lat), u = Math.min(u, i.lon), p = Math.max(p, i.lon), d = Math.min(d, i.height), m = Math.max(m, i.height);
	let h = [
		u,
		l,
		p,
		f
	];
	return {
		uv: a,
		range: h,
		region: [
			...h,
			d,
			m
		]
	};
}
function at(e, t, n = null, r = null, i = null) {
	let a = Infinity, o = Infinity, s = Infinity, c = -Infinity, l = -Infinity, u = -Infinity, d = [], f = new M();
	if (e.forEach((e) => {
		f.copy(e.matrixWorld), n && f.premultiply(n);
		let { uv: r, region: i } = it(e.geometry, f, t);
		d.push(r), a = Math.min(a, i[1]), c = Math.max(c, i[3]), o = Math.min(o, i[0]), l = Math.max(l, i[2]), s = Math.min(s, i[4]), u = Math.max(u, i[5]);
	}), r !== null) {
		i === null && (i = r.clampToBounds([
			o,
			a,
			l,
			c
		]), i = r.toNormalizedRange(i));
		let [e, t, n, f] = i;
		d.forEach((i) => {
			for (let a = 0, o = i.length; a < o; a += 3) {
				let o = i[a + 0], c = i[a + 1], l = i[a + 2], [d, p] = r.toNormalizedPoint(o, c);
				d = j.clamp(d, 0, 1), p = j.clamp(p, 0, 1), i[a + 0] = j.mapLinear(d, e, n, 0, 1), i[a + 1] = j.mapLinear(p, t, f, 0, 1), i[a + 2] = j.mapLinear(l, s, u, 0, 1);
			}
		});
	}
	return {
		uvs: d,
		range: i,
		region: [
			o,
			a,
			l,
			c,
			s,
			u
		]
	};
}
function ot(e, t) {
	let n = new I(), r = [], i = e.getAttribute("position"), a = Infinity, o = Infinity, s = Infinity, c = -Infinity, l = -Infinity, u = -Infinity;
	for (let e = 0; e < i.count; e++) n.fromBufferAttribute(i, e).applyMatrix4(t), r.push(n.x, n.y, n.z), a = Math.min(a, n.x), c = Math.max(c, n.x), o = Math.min(o, n.y), l = Math.max(l, n.y), s = Math.min(s, n.z), u = Math.max(u, n.z);
	return {
		uv: r,
		range: [
			a,
			o,
			c,
			l
		],
		heightRange: [s, u]
	};
}
function st(e, t) {
	let n = Infinity, r = Infinity, i = Infinity, a = -Infinity, o = -Infinity, s = -Infinity, c = [], l = new M();
	return e.forEach((e) => {
		l.copy(e.matrixWorld), t && l.premultiply(t);
		let { uv: u, range: d, heightRange: f } = ot(e.geometry, l);
		c.push(u), n = Math.min(n, d[0]), a = Math.max(a, d[2]), r = Math.min(r, d[1]), o = Math.max(o, d[3]), i = Math.min(i, f[0]), s = Math.max(s, f[1]);
	}), c.forEach((e) => {
		for (let t = 0, i = e.length; t < i; t += 3) {
			let i = e[t + 0], s = e[t + 1];
			e[t + 0] = j.mapLinear(i, n, a, 0, 1), e[t + 1] = j.mapLinear(s, r, o, 0, 1);
		}
	}), {
		uvs: c,
		range: [
			n,
			r,
			a,
			o
		],
		heightRange: [i, s]
	};
}
//#endregion
//#region src/three/plugins/images/overlays/wrapOverlaysMaterial.js
var ct = Symbol("OVERLAY_PARAMS");
function lt(e, t) {
	if (e[ct]) return e[ct];
	let n = {
		layerMaps: { value: [] },
		layerInfo: { value: [] }
	};
	return e[ct] = n, e.defines = {
		...e.defines || {},
		LAYER_COUNT: 0
	}, e.onBeforeCompile = (e) => {
		t && t(e), e.uniforms = {
			...e.uniforms,
			...n
		}, e.vertexShader = e.vertexShader.replace(/void main\(\s*\)\s*{/, (e) => `

				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							attribute vec3 layer_uv_UNROLLED_LOOP_INDEX;
							varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

						#endif


					}
				#pragma unroll_loop_end

				${e}

				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							v_layer_uv_UNROLLED_LOOP_INDEX = layer_uv_UNROLLED_LOOP_INDEX;

						#endif

					}
				#pragma unroll_loop_end

			`), e.fragmentShader = e.fragmentShader.replace(/void main\(/, (e) => `

				#if LAYER_COUNT != 0
					struct LayerInfo {
						vec3 color;
						float opacity;

						int alphaMask;
						int alphaInvert;
					};

					uniform sampler2D layerMaps[ LAYER_COUNT ];
					uniform LayerInfo layerInfo[ LAYER_COUNT ];
				#endif

				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

						#endif

					}
				#pragma unroll_loop_end

				${e}

			`).replace(/#include <color_fragment>/, (e) => `

				${e}

				#if LAYER_COUNT != 0
				{
					vec4 tint;
					vec3 layerUV;
					float layerOpacity;
					float wOpacity;
					float wDelta;
					#pragma unroll_loop_start
						for ( int i = 0; i < 10; i ++ ) {

							#if UNROLLED_LOOP_INDEX < LAYER_COUNT

								layerUV = v_layer_uv_UNROLLED_LOOP_INDEX;
								tint = texture( layerMaps[ i ], layerUV.xy );

								// discard texture outside 0, 1 on w - offset the stepped value by an epsilon to avoid cases
								// where wDelta is near 0 (eg a flat surface) at the w boundary, resulting in artifacts on some
								// hardware.
								wDelta = max( fwidth( layerUV.z ), 1e-7 );
								wOpacity =
									smoothstep( - wDelta, 0.0, layerUV.z ) *
									smoothstep( 1.0 + wDelta, 1.0, layerUV.z );

								// apply tint & opacity
								tint.rgb *= layerInfo[ i ].color;
								tint.rgba *= layerInfo[ i ].opacity * wOpacity;

								// invert the alpha
								if ( layerInfo[ i ].alphaInvert > 0 ) {

									tint.a = 1.0 - tint.a;

								}

								// apply the alpha across all existing layers if alpha mask is true
								if ( layerInfo[ i ].alphaMask > 0 ) {

									diffuseColor.a *= tint.a;

								} else {

									tint.rgb *= tint.a;
									diffuseColor = tint + diffuseColor * ( 1.0 - tint.a );

								}

							#endif

						}
					#pragma unroll_loop_end
				}
				#endif
			`);
	}, n;
}
//#endregion
//#region src/three/plugins/utilities/GeometryClipper.js
var B = 0, V = [
	"a",
	"b",
	"c"
], H = /* @__PURE__ */ new Oe(), ut = /* @__PURE__ */ new Oe(), dt = /* @__PURE__ */ new Oe(), ft = /* @__PURE__ */ new Oe(), pt = class {
	constructor() {
		this.attributeList = null, this.splitOperations = [], this.trianglePool = new mt();
	}
	forEachSplitPermutation(e) {
		let { splitOperations: t } = this, n = (r = 0) => {
			if (r >= t.length) {
				e();
				return;
			}
			t[r].keepPositive = !0, n(r + 1), t[r].keepPositive = !1, n(r + 1);
		};
		n();
	}
	addSplitOperation(e, t = !0) {
		this.splitOperations.push({
			callback: e,
			keepPositive: t
		});
	}
	clearSplitOperations() {
		this.splitOperations.length = 0;
	}
	clipObject(e) {
		let t = e.clone(), n = [];
		return t.traverse((e) => {
			e.isMesh && (e.geometry = this.clip(e).geometry, (e.geometry.index ? e.geometry.index.count / 3 : e.attributes.position.count / 3) == 0 && n.push(e));
		}), n.forEach((e) => {
			e.removeFromParent();
		}), t;
	}
	clip(e, t = null) {
		let n = this.getClippedData(e, t);
		return this.constructMesh(n.attributes, n.index, e);
	}
	getClippedData(e, t = null, n = {}) {
		let { trianglePool: r, splitOperations: i, attributeList: a } = this, o = e.geometry, s = o.attributes.position, c = o.index, l = 0, u = {};
		n.index = n.index || [], n.vertexIsClipped = n.vertexIsClipped || [], n.attributes = n.attributes || {};
		for (let e in o.attributes) a !== null && (a instanceof Function && !a(e) || Array.isArray(a) && !a.includes(e)) || (n.attributes[e] = []);
		let d = 0, f = c ? c.count : s.count;
		t !== null && (d = t.start, f = t.count);
		for (let t = d, n = d + f; t < n; t += 3) {
			let n = t + 0, a = t + 1, s = t + 2;
			c && (n = c.getX(n), a = c.getX(a), s = c.getX(s));
			let l = r.get();
			l.initFromIndices(n, a, s);
			let u = [l];
			for (let t = 0; t < i.length; t++) {
				let { keepPositive: n, callback: r } = i[t], a = [];
				for (let t = 0; t < u.length; t++) {
					let i = u[t], { indices: s, barycoord: c } = i;
					i.clipValues.a = r(o, s.a, s.b, s.c, c.a, e.matrixWorld), i.clipValues.b = r(o, s.a, s.b, s.c, c.b, e.matrixWorld), i.clipValues.c = r(o, s.a, s.b, s.c, c.c, e.matrixWorld), this.splitTriangle(i, !n, a);
				}
				u = a;
			}
			for (let e = 0, t = u.length; e < t; e++) {
				let t = u[e];
				p(t, o);
			}
			r.reset();
		}
		return n;
		function p(e, t) {
			for (let r = 0; r < 3; r++) {
				let i = e.getVertexHash(r, t);
				i in u || (u[i] = l, l++, e.getVertexData(r, t, n.attributes), n.vertexIsClipped.push(e.clipValues[V[r]] === B));
				let a = u[i];
				n.index.push(a);
			}
		}
	}
	constructMesh(e, t, n) {
		let r = n.geometry, i = new S(), a = e.position.length / 3 > 65535 ? new Uint32Array(t) : new Uint16Array(t);
		i.setIndex(new x(a, 1, !1));
		for (let t in e) {
			let n = r.getAttribute(t), a = new x(new n.array.constructor(e[t]), n.itemSize, n.normalized);
			a.gpuType = n.gpuType, i.setAttribute(t, a);
		}
		let o = new N(i, n.material.clone());
		return o.position.copy(n.position), o.quaternion.copy(n.quaternion), o.scale.copy(n.scale), o;
	}
	splitTriangle(e, t, n) {
		let { trianglePool: r } = this, i = [], a = [], o = [];
		for (let t = 0; t < 3; t++) {
			let n = V[t], r = V[(t + 1) % 3], s = e.clipValues[n], c = e.clipValues[r];
			(s < B != c < B || s === B) && (i.push(t), a.push([n, r]), s === c ? o.push(0) : o.push(j.mapLinear(B, s, c, 0, 1)));
		}
		if (i.length !== 2) Math.min(e.clipValues.a, e.clipValues.b, e.clipValues.c) < B === t && n.push(e);
		else if (i.length === 2) {
			let s = r.get().initFromTriangle(e), c = r.get().initFromTriangle(e), l = r.get().initFromTriangle(e);
			(i[0] + 1) % 3 === i[1] ? (s.lerpVertexFromEdge(e, a[0][0], a[0][1], o[0], "a"), s.copyVertex(e, a[0][1], "b"), s.lerpVertexFromEdge(e, a[1][0], a[1][1], o[1], "c"), s.clipValues.a = B, s.clipValues.c = B, c.lerpVertexFromEdge(e, a[0][0], a[0][1], o[0], "a"), c.copyVertex(e, a[1][1], "b"), c.copyVertex(e, a[0][0], "c"), c.clipValues.a = B, l.lerpVertexFromEdge(e, a[0][0], a[0][1], o[0], "a"), l.lerpVertexFromEdge(e, a[1][0], a[1][1], o[1], "b"), l.copyVertex(e, a[1][1], "c"), l.clipValues.a = B, l.clipValues.b = B) : (s.lerpVertexFromEdge(e, a[0][0], a[0][1], o[0], "a"), s.lerpVertexFromEdge(e, a[1][0], a[1][1], o[1], "b"), s.copyVertex(e, a[0][0], "c"), s.clipValues.a = B, s.clipValues.b = B, c.lerpVertexFromEdge(e, a[0][0], a[0][1], o[0], "a"), c.copyVertex(e, a[0][1], "b"), c.lerpVertexFromEdge(e, a[1][0], a[1][1], o[1], "c"), c.clipValues.a = B, c.clipValues.c = B, l.copyVertex(e, a[0][1], "a"), l.copyVertex(e, a[1][0], "b"), l.lerpVertexFromEdge(e, a[1][0], a[1][1], o[1], "c"), l.clipValues.c = B);
			let u, d;
			u = Math.min(s.clipValues.a, s.clipValues.b, s.clipValues.c), d = u < B, d === t && n.push(s), u = Math.min(c.clipValues.a, c.clipValues.b, c.clipValues.c), d = u < B, d === t && n.push(c), u = Math.min(l.clipValues.a, l.clipValues.b, l.clipValues.c), d = u < B, d === t && n.push(l);
		}
	}
}, mt = class {
	constructor() {
		this.pool = [], this.index = 0;
	}
	get() {
		if (this.index >= this.pool.length) {
			let e = new ht();
			this.pool.push(e);
		}
		let e = this.pool[this.index];
		return this.index++, e;
	}
	reset() {
		this.index = 0;
	}
}, ht = class {
	constructor() {
		this.indices = {
			a: -1,
			b: -1,
			c: -1
		}, this.clipValues = {
			a: -1,
			b: -1,
			c: -1
		}, this.barycoord = new Ee();
	}
	getVertexHash(e, t) {
		let { barycoord: n, indices: r } = this, i = n[V[e]];
		if (i.x === 1) return r[V[0]];
		if (i.y === 1) return r[V[1]];
		if (i.z === 1) return r[V[2]];
		{
			let { attributes: e } = t, n = "";
			for (let t in e) {
				let a = e[t];
				switch (gt(a, r.a, r.b, r.c, i, H), (t === "normal" || t === "tangent" || t === "bitangent") && H.normalize(), a.itemSize) {
					case 4:
						n += _t(H.x, H.y, H.z, H.w);
						break;
					case 3:
						n += _t(H.x, H.y, H.z);
						break;
					case 2:
						n += _t(H.x, H.y);
						break;
					case 1:
						n += _t(H.x);
						break;
				}
				n += "|";
			}
			return n;
		}
	}
	getVertexData(e, t, n) {
		let { barycoord: r, indices: i } = this, a = r[V[e]], { attributes: o } = t;
		for (let e in o) {
			if (!n[e]) continue;
			let t = o[e], r = n[e];
			switch (gt(t, i.a, i.b, i.c, a, H), (e === "normal" || e === "tangent" || e === "bitangent") && H.normalize(), t.itemSize) {
				case 4:
					r.push(H.x, H.y, H.z, H.w);
					break;
				case 3:
					r.push(H.x, H.y, H.z);
					break;
				case 2:
					r.push(H.x, H.y);
					break;
				case 1:
					r.push(H.x);
					break;
			}
		}
	}
	initFromTriangle(e) {
		return this.initFromIndices(e.indices.a, e.indices.b, e.indices.c);
	}
	initFromIndices(e, t, n) {
		return this.indices.a = e, this.indices.b = t, this.indices.c = n, this.clipValues.a = -1, this.clipValues.b = -1, this.clipValues.c = -1, this.barycoord.a.set(1, 0, 0), this.barycoord.b.set(0, 1, 0), this.barycoord.c.set(0, 0, 1), this;
	}
	lerpVertexFromEdge(e, t, n, r, i) {
		this.clipValues[i] = j.lerp(e.clipValues[t], e.clipValues[n], r), this.barycoord[i].lerpVectors(e.barycoord[t], e.barycoord[n], r);
	}
	copyVertex(e, t, n) {
		this.clipValues[n] = e.clipValues[t], this.barycoord[n].copy(e.barycoord[t]);
	}
};
function gt(e, t, n, r, i, a) {
	switch (ut.fromBufferAttribute(e, t), dt.fromBufferAttribute(e, n), ft.fromBufferAttribute(e, r), a.set(0, 0, 0, 0).addScaledVector(ut, i.x).addScaledVector(dt, i.y).addScaledVector(ft, i.z), e.itemSize) {
		case 3:
			H.w = 0;
			break;
		case 2:
			H.w = 0, H.z = 0;
			break;
		case 1:
			H.w = 0, H.z = 0, H.y = 0;
			break;
	}
	return a;
}
function _t(...e) {
	let t = "";
	for (let n = 0, r = e.length; n < r; n++) t += ~~(e[n] * 1e5 + .5), n !== r - 1 && (t += "_");
	return t;
}
//#endregion
//#region src/three/plugins/images/sources/WMTSImageSource.js
var vt = class extends et {
	constructor(e = {}) {
		let { layer: t = null, tileMatrixSet: n = "default", style: r = "default", url: i = null, format: a = "image/jpeg", dimensions: o = null, tileMatrixLabels: s = null, tileMatrices: c = null, projection: l = null, levels: u = 20, tileDimension: d = 256, contentBoundingBox: f = null, ...p } = e;
		super(p), this.layer = t, this.tileMatrixSet = n, this.style = r, this.url = i, this.format = a, this.dimensions = o, this.tileMatrixLabels = s, this.tileMatrices = c, this.projection = l, this.levels = u, this.tileDimension = d, this.contentBoundingBox = f, this._useKvp = !1;
	}
	_detectRequestMode(e) {
		return !/\{/.test(e);
	}
	init() {
		let { tiling: e, tileDimension: t, levels: n, dimensions: r, contentBoundingBox: i, tileMatrices: a, style: o, tileMatrixSet: s } = this, { url: c } = this, l = this.projection || "EPSG:3857";
		if (e.flipY = !0, e.setProjection(new L(l)), i === null ? e.setContentBounds(...e.projection.getBounds()) : e.setContentBounds(i[0], i[1], i[2], i[3]), Array.isArray(a) ? a.forEach((n, r) => {
			let i = n.tileWidth || t, a = n.tileHeight || t;
			e.setLevel(r, {
				tilePixelWidth: i,
				tilePixelHeight: a,
				tileCountX: n.matrixWidth,
				tileCountY: n.matrixHeight,
				tileBounds: n.tileBounds || n.bounds
			});
		}) : e.generateLevels(n, e.projection.tileCountX, e.projection.tileCountY, {
			tilePixelWidth: t,
			tilePixelHeight: t
		}), this._useKvp = this._detectRequestMode(c), !this._useKvp && (c = c.replace(/{\s*TileMatrixSet\s*}/gi, s).replace(/{\s*Style\s*}/gi, o), r)) for (let e in r) c = c.replace(RegExp(`{\\s*${e}\\s*}`, "gi"), r[e]);
		return this.url = c, Promise.resolve();
	}
	getUrl(e, t, n) {
		let { tileMatrices: r, tileMatrixLabels: i } = this, a;
		return a = r !== null && r.length > 0 ? r[n].identifier : i ? i[n] : n.toString(), this._useKvp ? this._buildKvpUrl(e, t, a) : this._buildRestfulUrl(e, t, a);
	}
	_buildRestfulUrl(e, t, n) {
		return this.url.replace(/{\s*TileMatrix\s*}/gi, n).replace(/{\s*TileCol\s*}/gi, e).replace(/{\s*TileRow\s*}/gi, t);
	}
	_buildKvpUrl(e, t, n) {
		let { dimensions: r, format: i } = this, a = this.url, o = new URLSearchParams({
			SERVICE: "WMTS",
			VERSION: "1.0.0",
			REQUEST: "GetTile",
			LAYER: this.layer,
			STYLE: this.style,
			TILEMATRIXSET: this.tileMatrixSet,
			TILEMATRIX: n,
			TILEROW: t,
			TILECOL: e,
			FORMAT: i
		});
		if (r) for (let e in r) o.set(e, r[e]);
		return a + (a.includes("?") ? "&" : "?") + o.toString();
	}
}, yt = class {
	constructor() {
		this.canvas = null, this.context = null, this.range = [
			0,
			0,
			1,
			1
		];
	}
	setTarget(e, t) {
		this.canvas = e.image, this.context = e.image.getContext("2d"), this.range = [...t];
	}
	draw(e, t) {
		let { canvas: n, range: r, context: i } = this, { width: a, height: o } = n, { image: s } = e, c = Math.round(j.mapLinear(t[0], r[0], r[2], 0, a)), l = Math.round(j.mapLinear(t[1], r[1], r[3], 0, o)), u = Math.round(j.mapLinear(t[2], r[0], r[2], 0, a)), d = Math.round(j.mapLinear(t[3], r[1], r[3], 0, o)), f = u - c, p = d - l;
		s instanceof ImageBitmap ? (i.save(), i.translate(c, o - l), i.scale(1, -1), i.drawImage(s, 0, 0, f, p), i.restore()) : i.drawImage(s, c, o - l, f, -p);
	}
	clear() {
		let { context: e, canvas: t } = this;
		e.clearRect(0, 0, t.width, t.height);
	}
}, bt = 1e-10;
function xt(e, t, n = 0) {
	if (e.length !== t.length) return !1;
	for (let r = 0, i = e.length; r < i; r++) if (Math.abs(e[r] - t[r]) > n) return !1;
	return !0;
}
var St = class extends $e {
	hasContent(...e) {
		return !0;
	}
}, Ct = class extends St {
	constructor(e) {
		super(), this.tiledImageSource = e, this.tileComposer = new yt(), this.resolution = 256;
	}
	hasContent(e, t, n, r, i) {
		let a = this.tiledImageSource.tiling, o = 0;
		return z([
			e,
			t,
			n,
			r
		], i, a, () => {
			o++;
		}), o !== 0;
	}
	async fetchItem([e, t, n, r, i], a) {
		let { tiledImageSource: o, tileComposer: s } = this, c = [
			e,
			t,
			n,
			r
		], l = o.tiling;
		await this._markImages(c, i, !1), a?.throwIfAborted();
		let u = null;
		if (z(c, i, l, (e, t, n) => {
			xt(l.getTileBounds(e, t, n, !0, !1), c, bt) && (u = [
				e,
				t,
				n
			]);
		}), u !== null) {
			let [e, t, n] = u;
			return o.get(e, t, n).clone();
		}
		let d = document.createElement("canvas");
		d.width = this.resolution, d.height = this.resolution;
		let f = new C(d);
		return f.colorSpace = be, f.generateMipmaps = !1, s.setTarget(f, c), s.clear(16777215, 0), z(c, i, l, (e, t, n) => {
			let r = l.getTileBounds(e, t, n, !0, !1), i = o.get(e, t, n);
			s.draw(i, r);
		}), f;
	}
	disposeItem(e, [t, n, r, i, a]) {
		e && e.dispose(), this._markImages([
			t,
			n,
			r,
			i
		], a, !0);
	}
	dispose() {
		super.dispose(), this.tiledImageSource.dispose();
	}
	_markImages(e, t, n = !1) {
		let r = this.tiledImageSource, i = r.tiling, a = [];
		z(e, t, i, (e, t, i) => {
			n ? r.release(e, t, i) : a.push(r.lock(e, t, i));
		});
		let o = a.filter((e) => e instanceof Promise);
		return o.length === 0 ? null : Promise.all(o);
	}
}, wt = Object.freeze({
	fill: "#cccccc",
	stroke: "transparent",
	strokeWidth: 1,
	radius: 2,
	order: 0,
	visible: !0
}), Tt = class {
	static get DEFAULT_STYLE() {
		return wt;
	}
	get fill() {
		return this._ctx.fillStyle;
	}
	set fill(e) {
		this._ctx.fillStyle = e;
	}
	get stroke() {
		return this._ctx.strokeStyle;
	}
	set stroke(e) {
		this._ctx.strokeStyle = e;
	}
	get strokeWidth() {
		return this._ctx.lineWidth;
	}
	set strokeWidth(e) {
		this._ctx.lineWidth = e;
	}
	constructor(e = {}) {
		let { getX: t = (e) => e.x, getY: n = (e) => e.y, flipY: r = !1, tileExtent: i = null } = e;
		this.getX = t, this.getY = n, this.flipY = r, this.tileExtent = i, this.radius = wt.radius, this.visible = !0, this._invScale = 1, this._ctx = null;
	}
	setFrame(e, t, n) {
		e.restore();
		let [r, i, a, o] = t, [s, c, l, u] = n, { width: d, height: f } = e.canvas, { flipY: p, tileExtent: m } = this, h = m ?? a - r, g = m ?? o - i, _ = Math.round(d * (r - s) / (l - s)), v = Math.round(d * (a - s) / (l - s)), y = Math.round(f * (u - o) / (u - c)), b = Math.round(f * (u - i) / (u - c)), x = (v - _) / h, S = (p ? -1 : 1) * (b - y) / g, C = m ? 0 : r, w = m ? 0 : p ? o : i, T = _ - C * x, E = y - w * S;
		e.save(), e.setTransform(x, 0, 0, S, T, E), e.beginPath(), e.rect(C, m ? 0 : i, h, g), e.clip(), e.clearRect(C, m ? 0 : i, h, g), this._ctx = e, this._invScale = 1 / x;
	}
	setStyle(e) {
		let { _invScale: t } = this;
		this.fill = e?.fill ?? wt.fill, this.stroke = e?.stroke ?? wt.stroke, this.strokeWidth = (e?.strokeWidth ?? wt.strokeWidth) * t, this.radius = (e?.radius ?? wt.radius) * t, this.visible = e ? e?.visible ?? wt.visible : !1;
	}
	_renderPoints(e, t = 1) {
		let { _ctx: n, radius: r, getX: i, getY: a, visible: o } = this;
		if (o) {
			for (let o of e) for (let e of o) {
				let o = i(e), s = a(e);
				n.beginPath(), n.ellipse(o, s, r / t, r, 0, 0, Math.PI * 2), n.fill();
			}
			n.stroke();
		}
	}
	_renderLines(e) {
		let { _ctx: t, getX: n, getY: r, visible: i } = this;
		if (i) {
			if (e instanceof Path2D) {
				t.stroke(e);
				return;
			}
			t.beginPath();
			for (let i of e) for (let e = 0; e < i.length; e++) e === 0 ? t.moveTo(n(i[e]), r(i[e])) : t.lineTo(n(i[e]), r(i[e]));
			t.stroke();
		}
	}
	_renderPolygons(e) {
		let { _ctx: t, getX: n, getY: r, visible: i } = this;
		if (i) {
			if (e instanceof Path2D) {
				t.fill(e, "evenodd"), t.stroke(e);
				return;
			}
			t.beginPath();
			for (let i of e) {
				for (let e = 0; e < i.length; e++) e === 0 ? t.moveTo(n(i[e]), r(i[e])) : t.lineTo(n(i[e]), r(i[e]));
				t.closePath();
			}
			t.fill("evenodd"), t.stroke();
		}
	}
}, Et = new Set([
	"Point",
	"MultiPoint",
	"LineString",
	"MultiLineString",
	"Polygon",
	"MultiPolygon"
]), Dt = /* @__PURE__ */ new I(), Ot = /* @__PURE__ */ new I();
function kt(e, t, n) {
	let r = .01;
	e.getCartographicToPosition(t, n, 0, Dt), e.getCartographicToPosition(t + r, n, 0, Ot);
	let i = Dt.distanceTo(Ot);
	return e.getCartographicToPosition(t, n + r, 0, Ot), Dt.distanceTo(Ot) / i;
}
var At = class extends St {
	constructor({ geojson: e = null, url: t = null, resolution: n = 256, pointRadius: r = 6, strokeStyle: i = "white", strokeWidth: a = 2, fillStyle: o = "rgba( 255, 255, 255, 0.5 )", getStyle: s = ((e, t) => ({
		fill: t.fillStyle || this.fillStyle,
		stroke: t.strokeStyle || this.strokeStyle,
		strokeWidth: t.strokeWidth || this.strokeWidth,
		radius: t.pointRadius || this.pointRadius
	})), ...c } = {}) {
		super(c), this.geojson = e, this.url = t, this.resolution = n, this.pointRadius = r, this.strokeStyle = i, this.strokeWidth = a, this.fillStyle = o, this.getStyle = s, this.features = null, this.featureBounds = /* @__PURE__ */ new Map(), this.contentBounds = null, this.projection = new L(), this.fetchData = (...e) => fetch(...e), this._canvasRenderer = new Tt({
			flipY: !0,
			getX: (e) => e[0],
			getY: (e) => e[1]
		});
	}
	async init() {
		let { geojson: e, url: t } = this;
		if (!e && t) {
			let e = await this.fetchData(t);
			this.geojson = await e.json();
		}
		this._updateCache(!0);
	}
	hasContent(e, t, n, r) {
		let i = [
			e,
			t,
			n,
			r
		].map((e) => e * Math.RAD2DEG);
		return this._boundsIntersectBounds(i, this.contentBounds);
	}
	fetchItem(e, t) {
		let n = document.createElement("canvas"), r = new C(n);
		return r.colorSpace = be, r.generateMipmaps = !1, this._drawToCanvas(n, e), r.needsUpdate = !0, r;
	}
	disposeItem(e) {
		e && e.dispose();
	}
	redraw(...e) {
		let t = this.get(...e);
		t && (this._drawToCanvas(t.image, e), t.needsUpdate = !0);
	}
	_updateCache(e = !1) {
		let { geojson: t, featureBounds: n } = this;
		if (!t || this.features && !e) return;
		n.clear();
		let r = Infinity, i = Infinity, a = -Infinity, o = -Infinity;
		this.features = this._featuresFromGeoJSON(t);
		for (let e of this.features) {
			let t = this._getFeatureBounds(e);
			n.set(e, t);
			let [s, c, l, u] = t;
			r = Math.min(r, s), i = Math.min(i, c), a = Math.max(a, l), o = Math.max(o, u);
		}
		this.contentBounds = [
			r,
			i,
			a,
			o
		];
	}
	_drawToCanvas(e, t) {
		this._updateCache();
		let [n, r, i, a] = t, { projection: o, resolution: s, features: c, _canvasRenderer: l } = this;
		e.width = s, e.height = s;
		let u = o.convertNormalizedToLongitude(n), d = o.convertNormalizedToLatitude(r), f = o.convertNormalizedToLongitude(i), p = o.convertNormalizedToLatitude(a), m = [
			u * j.RAD2DEG,
			d * j.RAD2DEG,
			f * j.RAD2DEG,
			p * j.RAD2DEG
		], h = e.getContext("2d");
		l.setFrame(h, m, m);
		for (let e of c) this._featureIntersectsTile(e, m) && this._drawFeatureOnCanvas(e, m, s);
	}
	_featureIntersectsTile(e, t) {
		let n = this.featureBounds.get(e);
		return n ? this._boundsIntersectBounds(n, t) : !1;
	}
	_boundsIntersectBounds(e, t) {
		let [n, r, i, a] = e, [o, s, c, l] = t;
		return !(i < o || n > c || a < s || r > l);
	}
	_getFeatureBounds(e) {
		let { geometry: t } = e;
		if (!t) return null;
		let { type: n, coordinates: r } = t, i = Infinity, a = Infinity, o = -Infinity, s = -Infinity, c = (e, t) => {
			i = Math.min(i, e), o = Math.max(o, e), a = Math.min(a, t), s = Math.max(s, t);
		};
		return n === "Point" ? c(r[0], r[1]) : n === "MultiPoint" || n === "LineString" ? r.forEach((e) => c(e[0], e[1])) : n === "MultiLineString" || n === "Polygon" ? r.forEach((e) => e.forEach((e) => c(e[0], e[1]))) : n === "MultiPolygon" && r.forEach((e) => e.forEach((e) => e.forEach((e) => c(e[0], e[1])))), [
			i,
			a,
			o,
			s
		];
	}
	_featuresFromGeoJSON(e) {
		let t = e.type;
		return t === "FeatureCollection" ? e.features : t === "Feature" ? [e] : t === "GeometryCollection" ? e.geometries.map((e) => ({
			type: "Feature",
			geometry: e,
			properties: {}
		})) : Et.has(t) ? [{
			type: "Feature",
			geometry: e,
			properties: {}
		}] : [];
	}
	_drawFeatureOnCanvas(e, t, n) {
		let { geometry: r = null, properties: i = {} } = e;
		if (!r) return;
		let [, a, , o] = t, { _canvasRenderer: s } = this, l = this.getStyle(e, i);
		s.setStyle(l);
		let u = r.type;
		if (u === "Point" || u === "MultiPoint") {
			s.radius = l.radius * (o - a) / n;
			let e = u === "Point" ? [r.coordinates] : r.coordinates;
			for (let t of e) {
				let e = kt(c, t[1] * j.DEG2RAD, t[0] * j.DEG2RAD), n = [t];
				s._renderPoints([n], e);
			}
		} else u === "LineString" ? s._renderLines([r.coordinates]) : u === "MultiLineString" ? s._renderLines(r.coordinates) : u === "Polygon" ? s._renderPolygons(r.coordinates) : u === "MultiPolygon" && r.coordinates.forEach((e) => s._renderPolygons(e));
	}
}, jt = class extends et {
	constructor(e = {}) {
		let { url: t = null, layer: n = null, styles: r = null, contentBoundingBox: i = null, version: a = "1.3.0", crs: o = "EPSG:4326", format: s = "image/png", transparent: c = !1, levels: l = 18, tileDimension: u = 256, ...d } = e;
		super(d), this.url = t, this.layer = n, this.crs = o, this.format = s, this.tileDimension = u, this.styles = r, this.version = a, this.levels = l, this.transparent = c, this.contentBoundingBox = i;
	}
	init() {
		let { tiling: e, levels: t, tileDimension: n, contentBoundingBox: r } = this;
		return e.setProjection(new L(this.crs)), e.flipY = !0, e.generateLevels(t, e.projection.tileCountX, e.projection.tileCountY, {
			tilePixelWidth: n,
			tilePixelHeight: n
		}), r === null ? e.setContentBounds(...e.projection.getBounds()) : e.setContentBounds(...r), Promise.resolve();
	}
	normalizedToMercatorX(e) {
		return j.mapLinear(e, 0, 1, -20037508.342789244, 20037508.342789244);
	}
	normalizedToMercatorY(e) {
		return j.mapLinear(e, 0, 1, -20037508.342789244, 20037508.342789244);
	}
	getUrl(e, t, n) {
		let { tiling: r, layer: i, crs: a, format: o, tileDimension: s, styles: c, version: l, transparent: u } = this, d = l === "1.1.1" ? "SRS" : "CRS", f;
		if (a === "EPSG:3857") {
			let i = r.getTileBounds(e, t, n, !0, !1);
			f = [
				this.normalizedToMercatorX(i[0]),
				this.normalizedToMercatorY(i[1]),
				this.normalizedToMercatorX(i[2]),
				this.normalizedToMercatorY(i[3])
			];
		} else {
			let [i, o, s, c] = r.getTileBounds(e, t, n, !1, !1).map((e) => e * j.RAD2DEG);
			f = a === "EPSG:4326" ? l === "1.1.1" ? [
				i,
				o,
				s,
				c
			] : [
				o,
				i,
				c,
				s
			] : [
				i,
				o,
				s,
				c
			];
		}
		let p = new URLSearchParams({
			SERVICE: "WMS",
			REQUEST: "GetMap",
			VERSION: l,
			LAYERS: i,
			[d]: a,
			BBOX: f.join(","),
			WIDTH: s,
			HEIGHT: s,
			FORMAT: o,
			TRANSPARENT: u ? "TRUE" : "FALSE"
		});
		return c != null && p.set("STYLES", c), new URL("?" + p.toString(), this.url).toString();
	}
}, Mt = class extends et {
	constructor(e = {}) {
		let { url: t = null, ...n } = e;
		super(n), this.url = t, this.format = null, this.stem = null;
	}
	getUrl(e, t, n) {
		return `${this.stem}_files/${n}/${e}_${t}.${this.format}`;
	}
	init() {
		let { url: e } = this;
		return this.fetchData(e, this.fetchOptions).then((e) => e.text()).then((t) => {
			let n = new DOMParser().parseFromString(t, "text/xml");
			if (n.querySelector("DisplayRects") || n.querySelector("Collection")) throw Error("DeepZoomImagesPlugin: DisplayRect and Collection DZI files not supported.");
			let r = n.querySelector("Image"), i = r.querySelector("Size"), a = parseInt(i.getAttribute("Width")), o = parseInt(i.getAttribute("Height")), s = parseInt(r.getAttribute("TileSize")), c = parseInt(r.getAttribute("Overlap")), l = r.getAttribute("Format");
			this.format = l, this.stem = e.split(/\.[^.]+$/g)[0];
			let { tiling: u } = this, d = Math.ceil(Math.log2(Math.max(a, o))) + 1;
			u.flipY = !0, u.pixelOverlap = c, u.generateLevels(d, 1, 1, {
				tilePixelWidth: s,
				tilePixelHeight: s,
				pixelWidth: a,
				pixelHeight: o
			});
		});
	}
}, Nt = /* @__PURE__ */ new M(), Pt = /* @__PURE__ */ new I(), Ft = /* @__PURE__ */ new I(), It = /* @__PURE__ */ new I(), U = /* @__PURE__ */ new I(), Lt = /* @__PURE__ */ new v(), Rt = Symbol("SPLIT_TILE_DATA"), zt = Symbol("SPLIT_HASH"), Bt = Symbol("ORIGINAL_REFINE"), Vt = /* @__PURE__ */ new t();
Vt.maxJobs = 10, Vt.priorityCallback = (e, t) => {
	let n = e.tile, r = t.tile, a = n.internal.renderer, o = r.internal.renderer, s = a.visibleTiles.has(n);
	return s === o.visibleTiles.has(r) ? i(n, r) : s ? 1 : -1;
};
var Ht = class {
	get enableTileSplitting() {
		return this._enableTileSplitting;
	}
	set enableTileSplitting(e) {
		this._enableTileSplitting !== e && (this._enableTileSplitting = e, this._markNeedsUpdate());
	}
	constructor(e = {}) {
		let { overlays: t = [], resolution: n = 256, enableTileSplitting: r = !0 } = e;
		this.name = "IMAGE_OVERLAY_PLUGIN", this.priority = -15, this.resolution = n, this._enableTileSplitting = r, this.overlays = [], this.needsUpdate = !1, this.tiles = null, this.tileComposer = null, this.tileControllers = /* @__PURE__ */ new Map(), this.overlayInfo = /* @__PURE__ */ new Map(), this.meshParams = /* @__PURE__ */ new WeakMap(), this.pendingTiles = /* @__PURE__ */ new Map(), this.processedTiles = /* @__PURE__ */ new Set(), this.processQueue = null, this._onUpdateAfter = null, this._onTileDownloadStart = null, this._onTileVisibilityChange = null, this._virtualChildResetId = 0, this._bytesUsed = /* @__PURE__ */ new WeakMap(), t.forEach((e) => {
			this.addOverlay(e);
		});
	}
	init(e) {
		let t = new yt();
		this.tiles = e, this.tileComposer = t, this.processQueue = Vt, e.forEachLoadedModel((e, t) => {
			this._processTileModel(e, t, !0);
		}), this._onUpdateAfter = async () => {
			let t = !1;
			if (this.overlayInfo.forEach((e, n) => {
				if (!!n.frame != !!e.frame || n.frame && e.frame && !e.frame.equals(n.frame)) {
					let r = e.order;
					this.deleteOverlay(n), this.addOverlay(n, r), t = !0;
				}
			}), t) {
				let { processQueue: t } = this, n = t.maxJobs, r = 0;
				t.items.forEach((t) => {
					e.visibleTiles.has(t.tile) && r++;
				}), t.maxJobs = r + t.currJobs, t.tryRunJobs(), t.maxJobs = n, this.needsUpdate = !0;
			}
			if (this.needsUpdate) {
				this.needsUpdate = !1;
				let { overlays: t, overlayInfo: n } = this;
				t.sort((e, t) => n.get(e).order - n.get(t).order), this.processedTiles.forEach((e) => {
					this._updateLayers(e);
				}), this.resetVirtualChildren(!this.enableTileSplitting), e.recalculateBytesUsed(), e.dispatchEvent({ type: "needs-render" });
			}
		}, this._onTileDownloadStart = ({ tile: e, url: t }) => {
			!/\.json$/i.test(t) && !/\.subtree/i.test(t) && (this.processedTiles.add(e), this._initTileOverlayInfo(e));
		}, this._onTileVisibilityChange = ({ tile: e, visible: t }) => {
			this.overlayInfo.forEach(({ tileInfo: n }, r) => {
				if (n.has(e)) {
					let { range: i } = n.get(e);
					r.setRegionVisible(i, t, e);
				}
			});
		}, e.addEventListener("update-after", this._onUpdateAfter), e.addEventListener("tile-download-start", this._onTileDownloadStart), e.addEventListener("tile-visibility-change", this._onTileVisibilityChange), this.overlays.forEach((e) => {
			this._initOverlay(e);
		});
	}
	_removeVirtualChildren(e) {
		if (!(Bt in e)) return;
		let { tiles: t } = this, { virtualChildCount: n } = e.internal, r = e.children.length, i = r - n;
		for (let n = i; n < r; n++) {
			let r = e.children[n];
			t.processNodeQueue.remove(r), t.lruCache.remove(r), r.parent = null;
		}
		e.children.length -= n, e.internal.virtualChildCount = 0, e.refine = e[Bt], delete e[Bt], delete e[zt];
	}
	disposeTile(e) {
		let { overlayInfo: t, tileControllers: n, processQueue: r, pendingTiles: i, processedTiles: a } = this;
		a.delete(e), this._removeVirtualChildren(e), n.has(e) && (n.get(e).abort(), n.delete(e), i.delete(e)), t.forEach((({ tileInfo: t }, n) => {
			if (t.has(e)) {
				let { meshInfo: r, range: i } = t.get(e);
				i !== null && n.releaseTexture(i), t.delete(e), r.clear();
			}
		})), r.removeByFilter((t) => t.tile === e);
	}
	calculateBytesUsed(e) {
		let { overlayInfo: t } = this, n = this._bytesUsed, r = null;
		return t.forEach(({ tileInfo: t }, n) => {
			if (t.has(e)) {
				let { target: n } = t.get(e);
				r ||= 0, r += u(n);
			}
		}), r === null ? n.has(e) ? n.get(e) : 0 : (n.set(e, r), r);
	}
	processTileModel(e, t) {
		return this._processTileModel(e, t);
	}
	async _processTileModel(e, t, n = !1) {
		let { tileControllers: r, processedTiles: i, pendingTiles: a } = this;
		r.set(t, new AbortController()), n || a.set(t, e), i.add(t), this._wrapMaterials(e), this._initTileOverlayInfo(t), await this._initTileSceneOverlayInfo(e, t), this.expandVirtualChildren(e, t), this._updateLayers(t), a.delete(t);
	}
	dispose() {
		let { tiles: e } = this;
		[...this.overlays].forEach((e) => {
			this.deleteOverlay(e);
		}), this.processedTiles.forEach((e) => {
			this._updateLayers(e), this.disposeTile(e);
		}), e.removeEventListener("update-after", this._onUpdateAfter), e.removeEventListener("tile-download-start", this._onTileDownloadStart), e.removeEventListener("tile-visibility-change", this._onTileVisibilityChange), this.resetVirtualChildren(!0);
	}
	getAttributions(e) {
		this.overlays.forEach((t) => {
			t.opacity > 0 && t.getAttributions(e);
		});
	}
	parseToMesh(e, t, n, r) {
		if (n === "image_overlay_tile_split") return t[Rt];
	}
	async resetVirtualChildren(e = !1) {
		this._virtualChildResetId++;
		let t = this._virtualChildResetId;
		if (await Promise.all(this.overlays.map((e) => e.whenReady())), t !== this._virtualChildResetId) return;
		let { tiles: n } = this, r = [];
		this.processedTiles.forEach((e) => {
			zt in e && r.push(e);
		}), r.sort((e, t) => t.internal.depth - e.internal.depth), r.forEach((t) => {
			let n = t.engineData.scene.clone();
			n.updateMatrixWorld(), (e || t[zt] !== this._getSplitVectors(n, t).hash) && this._removeVirtualChildren(t);
		}), e || n.forEachLoadedModel((e, t) => {
			this.expandVirtualChildren(e, t);
		});
	}
	_getSplitVectors(e, t, n = Ft) {
		let { tiles: r, overlayInfo: i } = this, a = new v();
		a.setFromObject(e), a.getCenter(n);
		let o = [], s = [];
		i.forEach(({ tileInfo: e }, i) => {
			let a = e.get(t);
			if (a && a.target && i.shouldSplit(a.range)) {
				i.frame ? U.set(0, 0, 1).transformDirection(i.frame) : (r.ellipsoid.getPositionToNormal(n, U), U.length() < 1e-6 && U.set(1, 0, 0));
				let e = `${U.x.toFixed(3)},${U.y.toFixed(3)},${U.z.toFixed(3)}_`;
				s.includes(e) || s.push(e);
				let t = Pt.set(0, 0, 1);
				Math.abs(U.dot(t)) > .9999 && t.set(1, 0, 0);
				let a = new I().crossVectors(U, t).normalize(), c = new I().crossVectors(U, a).normalize();
				o.push(a, c);
			}
		});
		let c = [];
		for (; o.length !== 0;) {
			let e = o.pop().clone(), t = e.clone();
			for (let n = 0; n < o.length; n++) {
				let r = o[n], i = e.dot(r);
				Math.abs(i) > Math.cos(Math.PI / 8) && (t.addScaledVector(r, Math.sign(i)), e.copy(t).normalize(), o.splice(n, 1), n--);
			}
			c.push(t.normalize());
		}
		return {
			directions: c,
			hash: s.join("")
		};
	}
	async expandVirtualChildren(e, t) {
		let { refine: n } = t, r = n === "REPLACE" && t.children.length === 0 || n === "ADD", i = t.internal.virtualChildCount !== 0;
		if (this.enableTileSplitting === !1 || !r || i) return;
		let a = e.clone();
		a.updateMatrixWorld();
		let { directions: o, hash: s } = this._getSplitVectors(a, t, Ft);
		if (o.length === 0) return;
		t[zt] = s;
		let c = new pt();
		c.attributeList = (e) => !/^layer_uv_\d+/.test(e), o.map((e) => {
			c.addSplitOperation((t, n, r, i, a, o) => (Ee.getInterpolatedAttribute(t.attributes.position, n, r, i, a, Pt), Pt.applyMatrix4(o).sub(Ft).dot(e)));
		});
		let l = [];
		c.forEachSplitPermutation(() => {
			let e = c.clipObject(a);
			e.matrix.premultiply(t.engineData.transformInverse).decompose(e.position, e.quaternion, e.scale);
			let n = [];
			if (e.traverse((e) => {
				if (e.isMesh) {
					let t = e.material.clone();
					e.material = t;
					for (let e in t) {
						let n = t[e];
						if (n && n.isTexture && n.source.data instanceof ImageBitmap) {
							let r = document.createElement("canvas");
							r.width = n.image.width, r.height = n.image.height;
							let i = r.getContext("2d");
							i.scale(1, -1), i.drawImage(n.source.data, 0, 0, r.width, -r.height);
							let a = new C(r);
							a.mapping = n.mapping, a.wrapS = n.wrapS, a.wrapT = n.wrapT, a.minFilter = n.minFilter, a.magFilter = n.magFilter, a.format = n.format, a.type = n.type, a.anisotropy = n.anisotropy, a.colorSpace = n.colorSpace, a.generateMipmaps = n.generateMipmaps, t[e] = a;
						}
					}
					n.push(e);
				}
			}), n.length === 0) return;
			let r = {};
			if (t.boundingVolume.region && (r.region = at(n, this.tiles.ellipsoid).region), t.boundingVolume.box || t.boundingVolume.sphere) {
				Lt.setFromObject(e, !0).getCenter(It);
				let t = 0;
				e.traverse((e) => {
					let n = e.geometry;
					if (n) {
						let r = n.attributes.position;
						for (let n = 0, i = r.count; n < i; n++) {
							let i = Pt.fromBufferAttribute(r, n).applyMatrix4(e.matrixWorld).distanceToSquared(It);
							t = Math.max(t, i);
						}
					}
				}), r.sphere = [...It, Math.sqrt(t)];
			}
			l.push({
				internal: { isVirtual: !0 },
				refine: "REPLACE",
				geometricError: t.geometricError * .5,
				boundingVolume: r,
				content: { uri: "./child.image_overlay_tile_split" },
				children: [],
				[Rt]: e
			});
		}), t[Bt] = t.refine, t.refine = "REPLACE", t.children.push(...l), t.internal.virtualChildCount += l.length;
	}
	fetchData(e, t) {
		if (/image_overlay_tile_split/.test(e)) return /* @__PURE__ */ new ArrayBuffer();
	}
	addOverlay(e, t = null) {
		let { tiles: n, overlays: r, overlayInfo: i } = this;
		t === null && (t = r.reduce((e, t) => Math.max(e, t.order + 1), 0));
		let a = new AbortController();
		r.push(e), i.set(e, {
			order: t,
			uniforms: {},
			tileInfo: /* @__PURE__ */ new Map(),
			controller: a,
			frame: e.frame ? e.frame.clone() : null
		}), n !== null && this._initOverlay(e);
	}
	setOverlayOrder(e, t) {
		this.overlays.indexOf(e) !== -1 && (this.overlayInfo.get(e).order = t, this._markNeedsUpdate());
	}
	deleteOverlay(e) {
		let { overlays: t, overlayInfo: n, processQueue: r, processedTiles: i, tiles: a } = this, o = t.indexOf(e);
		if (o !== -1) {
			let { tileInfo: s, controller: c } = n.get(e);
			i.forEach((t) => {
				if (!s.has(t)) return;
				let { meshInfo: n, range: r } = s.get(t);
				r !== null && (a.visibleTiles.has(t) && e.setRegionVisible(r, !1), e.releaseTexture(r)), s.delete(t), n.clear();
			}), s.clear(), n.delete(e), c.abort(), r.removeByFilter((t) => t.overlay === e && i.has(t.tile)), t.splice(o, 1), i.forEach((e) => {
				this._updateLayers(e);
			}), this._markNeedsUpdate();
		}
	}
	_initOverlay(e) {
		let { processedTiles: t } = this;
		e.init().then(() => {
			e.setResolution(this.resolution);
		});
		let n = [];
		t.forEach(async (t) => {
			let r = t.engineData.scene;
			this._initTileOverlayInfo(t, e);
			let i = this._initTileSceneOverlayInfo(r, t, e);
			n.push(i), await i, this._updateLayers(t);
		}), Promise.all(n).then(() => {
			this._markNeedsUpdate();
		});
	}
	_wrapMaterials(e) {
		e.traverse((e) => {
			if (e.material) {
				let t = lt(e.material, e.material.onBeforeCompile);
				this.meshParams.set(e, t);
			}
		});
	}
	_initTileOverlayInfo(e, t = this.overlays) {
		if (Array.isArray(t)) {
			t.forEach((t) => this._initTileOverlayInfo(e, t));
			return;
		}
		let { overlayInfo: n } = this;
		if (n.get(t).tileInfo.has(e)) return;
		let r = {
			range: null,
			target: null,
			meshInfo: /* @__PURE__ */ new Map(),
			failed: !1
		};
		if (n.get(t).tileInfo.set(e, r), t.isReady && !t.isPlanarProjection && e.boundingVolume.region) {
			let [n, i, a, o] = e.boundingVolume.region, s = [
				n,
				i,
				a,
				o
			];
			s = t.projection.clampToBounds(s), s = t.projection.toNormalizedRange(s), r.range = s, t.lockTextureSafe(s);
		}
	}
	async _initTileSceneOverlayInfo(e, t, n = this.overlays) {
		if (Array.isArray(n)) return Promise.all(n.map((n) => this._initTileSceneOverlayInfo(e, t, n)));
		let { tiles: r, overlayInfo: i, tileControllers: a } = this, { ellipsoid: o } = r, { controller: s, tileInfo: c } = i.get(n), l = a.get(t);
		if (n.isReady || await n.whenReady(), s.signal.aborted || l.signal.aborted) return;
		let u = [];
		e.updateMatrixWorld(), e.traverse((e) => {
			e.isMesh && u.push(e);
		});
		let { aspectRatio: d, projection: f } = n, p = c.get(t), m, h, g;
		if (n.isPlanarProjection) {
			Nt.makeScale(1 / d, 1, 1).multiply(n.frame), e.parent !== null && Nt.multiply(r.group.matrixWorldInverse);
			let t;
			({range: m, uvs: h, heightRange: t} = st(u, Nt)), g = !(t[0] > 1 || t[1] < 0);
		} else Nt.identity(), e.parent !== null && Nt.copy(r.group.matrixWorldInverse), {range: m, uvs: h} = at(u, o, Nt, f, p.range), g = !0;
		p.range === null && (p.range = m, n.lockTextureSafe(m)), r.visibleTiles.has(t) && n.setRegionVisible(p.range, !0), g && n.hasContent(m) && await this._fetchTileOverlayTexture(t, n, p), u.forEach((e, t) => {
			let n = new x(new Float32Array(h[t]), 3);
			p.meshInfo.set(e, { attribute: n });
		});
	}
	async _fetchTileOverlayTexture(e, t, n) {
		let { tiles: r, overlayInfo: i, tileControllers: a, processQueue: o } = this, { controller: s } = i.get(t), c = a.get(e), { range: l } = n;
		n.target = await o.add({
			tile: e,
			overlay: t
		}, async () => {
			if (s.signal.aborted || c.signal.aborted) return null;
			let e = await t.getTexture(l);
			return s.signal.aborted || c.signal.aborted ? null : e;
		}).catch((i) => i.name === "AbortError" ? null : (n.failed = !0, r.dispatchEvent({
			type: "load-error",
			tile: e,
			overlay: t,
			error: i,
			url: null
		}), null));
	}
	resetFailedOverlays() {
		let { processedTiles: e, overlayInfo: t, overlays: n } = this, r = [];
		e.forEach((e) => {
			n.forEach((n) => {
				let { tileInfo: i } = t.get(n), a = i.get(e);
				a.failed && (a.failed = !1, n.releaseTexture(a.range), r.push({
					tile: e,
					overlay: n,
					info: a
				}));
			});
		}), requestAnimationFrame(() => {
			r.forEach(({ tile: e, overlay: t, info: n }) => {
				t.lockTextureSafe(n.range), this._fetchTileOverlayTexture(e, t, n).then(() => {
					this._updateLayers(e);
				}).catch((e) => {
					if (e.name !== "AbortError") throw e;
				});
			});
		});
	}
	_updateLayers(e) {
		let { overlayInfo: t, overlays: n, tileControllers: r, meshParams: i } = this, a = r.get(e);
		if (this.tiles.recalculateBytesUsed(e), !(!a || a.signal.aborted)) {
			if (n.length === 0) {
				let t = e.engineData && e.engineData.scene;
				t && t.traverse((e) => {
					if (e.material && i.has(e)) {
						let t = i.get(e);
						t.layerMaps.length = 0, t.layerInfo.length = 0, e.material.defines.LAYER_COUNT = 0, e.material.needsUpdate = !0;
					}
				});
				return;
			}
			n.forEach((r, a) => {
				let { tileInfo: o } = t.get(r), { meshInfo: s, target: c } = o.get(e);
				s.forEach(({ attribute: e }, t) => {
					let { geometry: o, material: s } = t, l = i.get(t), u = `layer_uv_${a}`;
					o.getAttribute(u) !== e && (o.setAttribute(u, e), o.dispose()), l.layerMaps.length = n.length, l.layerInfo.length = n.length, l.layerMaps.value[a] = c === null ? null : c, l.layerInfo.value[a] = r, s.defines[`LAYER_${a}_EXISTS`] = Number(c !== null), s.defines[`LAYER_${a}_ALPHA_INVERT`] = Number(r.alphaInvert), s.defines[`LAYER_${a}_ALPHA_MASK`] = Number(r.alphaMask), s.defines.LAYER_COUNT = n.length, s.needsUpdate = !0;
				});
			});
		}
	}
	_markNeedsUpdate() {
		this.needsUpdate === !1 && (this.needsUpdate = !0, this.tiles !== null && this.tiles.dispatchEvent({ type: "needs-update" }));
	}
}, Ut = class {
	get isPlanarProjection() {
		return !!this.frame;
	}
	constructor(e = {}) {
		let { opacity: t = 1, color: n = 16777215, frame: r = null, preprocessURL: i = null, alphaMask: a = !1, alphaInvert: s = !1 } = e;
		this.preprocessURL = i, this.opacity = t, this.color = new w(n), this.frame = r === null ? null : r.clone(), this.alphaMask = a, this.alphaInvert = s, this.downloadQueue = o, this._whenReady = null, this.isReady = !1, this.isInitialized = !1, this._visibleRegionCounts = /* @__PURE__ */ new Map();
	}
	init() {
		return this.isInitialized || (this.isInitialized = !0, this._whenReady = this._init().then(() => this.isReady = !0)), this._whenReady;
	}
	whenReady() {
		return this._whenReady;
	}
	_init() {
		return Promise.resolve();
	}
	fetch(e, t = {}) {
		this.preprocessURL && (e = this.preprocessURL(e));
		let n = { priority: -performance.now() }, r = this.downloadQueue.add(n, () => fetch(e, t));
		return t.signal && t.signal.addEventListener("abort", () => this.downloadQueue.remove(n), { once: !0 }), r;
	}
	getAttributions(e) {}
	hasContent(e, t = null) {
		return !1;
	}
	async getTexture(e, t = null) {
		return null;
	}
	async lockTexture(e, t = null) {
		return null;
	}
	releaseTexture(e, t = null) {}
	shouldSplit(e, t = null) {
		return !1;
	}
	setResolution(e) {}
	setRegionVisible(e, t) {
		let { _visibleRegionCounts: n } = this, r = e.join("_"), i = n.get(r);
		if (i || (i = {
			range: [...e],
			count: 0
		}, n.set(r, i)), i.count += t ? 1 : -1, i.count < 0) throw Error();
		i.count === 0 && n.delete(r);
	}
}, W = class extends Ut {
	get tiling() {
		return this.imageSource.tiling;
	}
	get projection() {
		return this.tiling.projection;
	}
	get aspectRatio() {
		return this.tiling && this.isReady ? this.tiling.aspectRatio : 1;
	}
	get fetchOptions() {
		return this.imageSource.fetchOptions;
	}
	set fetchOptions(e) {
		this.imageSource.fetchOptions = e;
	}
	constructor(e = {}) {
		let { imageSource: t = null, ...n } = e;
		super(n), this.imageSource = t, this.regionImageSource = null;
	}
	_init() {
		return this._initImageSource().then(() => {
			this.imageSource.fetchData = (...e) => this.fetch(...e), this.regionImageSource = new Ct(this.imageSource);
		});
	}
	_initImageSource() {
		return this.imageSource.init();
	}
	calculateLevel(e) {
		let [t, n, r, i] = e, a = r - t, o = i - n, s = 0, c = this.regionImageSource.resolution, l = this.tiling.maxLevel;
		for (; s < l; s++) {
			let e = c / a, t = c / o, n = this.tiling.getLevel(s);
			if (n == null) continue;
			let { pixelWidth: r, pixelHeight: i } = n;
			if (r >= e || i >= t) break;
		}
		return s;
	}
	hasContent(e, t = this.calculateLevel(e)) {
		return this.regionImageSource.hasContent(...e, t);
	}
	getTexture(e, t = this.calculateLevel(e)) {
		return this.regionImageSource.get(...e, t);
	}
	lockTexture(e, t = this.calculateLevel(e)) {
		return this.regionImageSource.lock(...e, t);
	}
	releaseTexture(e, t = this.calculateLevel(e)) {
		this.regionImageSource.release(...e, t);
	}
	shouldSplit(e, t = this.calculateLevel(e)) {
		return this.tiling.maxLevel > t;
	}
	setResolution(e) {
		this.regionImageSource.resolution = e;
	}
}, Wt = class extends W {
	constructor(e = {}) {
		super(e), this.imageSource = new tt(e);
	}
}, Gt = class extends W {
	constructor(e) {
		super(e), this.imageSource = new Mt(e);
	}
}, Kt = class extends Ut {
	get projection() {
		return this.imageSource.projection;
	}
	get aspectRatio() {
		return 2;
	}
	get pointRadius() {
		return this.imageSource.pointRadius;
	}
	set pointRadius(e) {
		this.imageSource.pointRadius = e;
	}
	get strokeStyle() {
		return this.imageSource.strokeStyle;
	}
	set strokeStyle(e) {
		this.imageSource.strokeStyle = e;
	}
	get strokeWidth() {
		return this.imageSource.strokeWidth;
	}
	set strokeWidth(e) {
		this.imageSource.strokeWidth = e;
	}
	get fillStyle() {
		return this.imageSource.fillStyle;
	}
	set fillStyle(e) {
		this.imageSource.fillStyle = e;
	}
	get geojson() {
		return this.imageSource.geojson;
	}
	set geojson(e) {
		this.imageSource.geojson = e;
	}
	constructor(e = {}) {
		super(e), this.imageSource = new At(e), this._redrawQueue = new t(), this._redrawQueue.maxJobs = 4, this._redrawQueue.priorityCallback = () => 0;
	}
	_init() {
		return this.imageSource.init();
	}
	hasContent(e) {
		return this.imageSource.hasContent(...e);
	}
	getTexture(e) {
		return this.imageSource.get(...e);
	}
	lockTexture(e) {
		return this.imageSource.lock(...e);
	}
	lockTextureSafe(e) {
		let t = this.lockTexture(e);
		return t instanceof Promise && t.catch((e) => {
			if (e.name !== "AbortError") throw e;
		}), t;
	}
	releaseTexture(e) {
		this.imageSource.release(...e);
	}
	setResolution(e) {
		this.imageSource.resolution = e;
	}
	shouldSplit(e) {
		return !0;
	}
	setRegionVisible(e, t) {
		if (super.setRegionVisible(e, t), t) {
			let { _redrawQueue: t } = this, n = e.join("_");
			t.has(n) && t.flush(n);
		}
	}
	redraw() {
		let { imageSource: e, _redrawQueue: t, _visibleRegionCounts: n } = this;
		for (let { range: t } of n.values()) e.redraw(...t);
		e.forEachItem((r, i) => {
			let a = i.join("_");
			!n.has(a) && !t.has(a) && t.add(a, () => {
				e.redraw(...i);
			});
		});
	}
}, qt = class extends W {
	constructor(e = {}) {
		super(e), this.imageSource = new jt(e);
	}
}, Jt = class extends W {
	constructor(e = {}) {
		super(e), this.imageSource = new vt(e);
	}
}, Yt = class extends W {
	constructor(e = {}) {
		super(e), this.imageSource = new rt(e);
	}
}, Xt = class extends W {
	constructor(e = {}) {
		super(e);
		let { apiToken: t, autoRefreshToken: n, assetId: r } = e;
		this.options = e, this.assetId = r, this.auth = new m({
			apiToken: t,
			autoRefreshToken: n
		}), this.auth.authURL = `https://api.cesium.com/v1/assets/${r}/endpoint`, this._attributions = [], this.externalType = !1;
	}
	_initImageSource() {
		return this.auth.refreshToken().then(async (e) => {
			if (this._attributions = e.attributions.map((e) => ({
				value: e.html,
				type: "html",
				collapsible: e.collapsible
			})), e.type !== "IMAGERY") throw Error("CesiumIonOverlay: Only IMAGERY is supported as overlay type.");
			switch (this.externalType = !!e.externalType, e.externalType) {
				case "GOOGLE_2D_MAPS": {
					let { url: t, session: n, key: r, tileWidth: i } = e.options, a = `${t}/v1/2dtiles/{z}/{x}/{y}?session=${n}&key=${r}`;
					this.imageSource = new tt({
						...this.options,
						url: a,
						tileDimension: i,
						levels: 22
					});
					break;
				}
				case "BING": {
					let { url: t, mapStyle: n, key: r } = e.options, i = `${t}/REST/v1/Imagery/Metadata/${n}?incl=ImageryProviders&key=${r}&uriScheme=https`, a = (await fetch(i).then((e) => e.json())).resourceSets[0].resources[0];
					this.imageSource = new nt({
						...this.options,
						url: a.imageUrl,
						subdomains: a.imageUrlSubdomains,
						tileDimension: a.tileWidth,
						levels: a.zoomMax
					});
					break;
				}
				default: this.imageSource = new rt({
					...this.options,
					url: e.url
				});
			}
			return this.imageSource.fetchData = (...e) => this.fetch(...e), this.imageSource.init();
		});
	}
	fetch(e, t = {}) {
		if (this.externalType) return super.fetch(e, t);
		this.preprocessURL && (e = this.preprocessURL(e));
		let n = { priority: -performance.now() }, r = this.downloadQueue.add(n, () => this.auth.fetch(e, t));
		return t.signal && t.signal.addEventListener("abort", () => this.downloadQueue.remove(n), { once: !0 }), r;
	}
	getAttributions(e) {
		e.push(...this._attributions);
	}
}, Zt = class extends W {
	constructor(e = {}) {
		super(e);
		let { apiToken: t, sessionOptions: n, autoRefreshToken: r, logoUrl: i } = e;
		this.logoUrl = i, this.auth = new p({
			apiToken: t,
			sessionOptions: n,
			autoRefreshToken: r
		}), this.imageSource = new tt(), this.imageSource.fetchData = (...e) => this.fetch(...e), this._logoAttribution = {
			value: "",
			type: "image",
			collapsible: !1
		};
	}
	_initImageSource() {
		return this.auth.refreshToken().then((e) => (this.imageSource.tileDimension = e.tileWidth, this.imageSource.url = "https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}", this.imageSource.init()));
	}
	fetch(e, t = {}) {
		this.preprocessURL && (e = this.preprocessURL(e));
		let n = { priority: -performance.now() }, r = this.downloadQueue.add(n, () => this.auth.fetch(e, t));
		return t.signal && t.signal.addEventListener("abort", () => this.downloadQueue.remove(n), { once: !0 }), r;
	}
	getAttributions(e) {
		this.logoUrl && (this._logoAttribution.value = this.logoUrl, e.push(this._logoAttribution));
	}
}, Qt = /* @__PURE__ */ new I(), $t = /* @__PURE__ */ new Ee(), G = /* @__PURE__ */ new I(), K = /* @__PURE__ */ new I(), en = class extends h {
	constructor(e = D) {
		super(), this.manager = e, this.ellipsoid = new l(), this.skirtLength = 1e3, this.smoothSkirtNormals = !0, this.generateNormals = !0, this.solid = !1, this.minLat = -Math.PI / 2, this.maxLat = Math.PI / 2, this.minLon = -Math.PI, this.maxLon = Math.PI;
	}
	parse(e) {
		let { ellipsoid: t, solid: n, skirtLength: r, smoothSkirtNormals: i, generateNormals: a, minLat: o, maxLat: s, minLon: c, maxLon: l } = this, { header: u, indices: d, vertexData: f, edgeIndices: p, extensions: m } = super.parse(e), h = new S(), g = new ue(), _ = new N(h, g);
		_.position.set(...u.center);
		let v = "octvertexnormals" in m, y = v || a, b = f.u.length, C = [], w = [], T = [], D = [], O = 0, k = 0;
		for (let e = 0; e < b; e++) te(e, G), ne(G.x, G.y, G.z, K), w.push(G.x, G.y), C.push(...K);
		for (let e = 0, t = d.length; e < t; e++) T.push(d[e]);
		if (y) if (v) {
			let e = m.octvertexnormals.normals;
			for (let t = 0, n = e.length; t < n; t++) D.push(e[t]);
		} else {
			let e = new S(), t = d.length > 21845 ? new Uint32Array(d) : new Uint16Array(d);
			e.setIndex(new x(t, 1, !1)), e.setAttribute("position", new x(new Float32Array(C), 3, !1)), e.computeVertexNormals();
			let n = e.getAttribute("normal").array;
			m.octvertexnormals = { normals: n };
			for (let e = 0, t = n.length; e < t; e++) D.push(n[e]);
		}
		if (h.addGroup(O, d.length, k), O += d.length, k++, n) {
			let e = C.length / 3;
			for (let e = 0; e < b; e++) te(e, G), ne(G.x, G.y, G.z, K, -r), w.push(G.x, G.y), C.push(...K);
			for (let t = d.length - 1; t >= 0; t--) T.push(d[t] + e);
			if (y) {
				let e = m.octvertexnormals.normals;
				for (let t = 0, n = e.length; t < n; t++) D.push(-e[t]);
			}
			h.addGroup(O, d.length, k), O += d.length, k++;
		}
		if (r > 0) {
			let { westIndices: e, eastIndices: t, southIndices: n, northIndices: r } = p, i, a = A(e);
			i = C.length / 3, w.push(...a.uv), C.push(...a.positions);
			for (let e = 0, t = a.indices.length; e < t; e++) T.push(a.indices[e] + i);
			let o = A(t);
			i = C.length / 3, w.push(...o.uv), C.push(...o.positions);
			for (let e = 0, t = o.indices.length; e < t; e++) T.push(o.indices[e] + i);
			let s = A(n);
			i = C.length / 3, w.push(...s.uv), C.push(...s.positions);
			for (let e = 0, t = s.indices.length; e < t; e++) T.push(s.indices[e] + i);
			let c = A(r);
			i = C.length / 3, w.push(...c.uv), C.push(...c.positions);
			for (let e = 0, t = c.indices.length; e < t; e++) T.push(c.indices[e] + i);
			y && (D.push(...a.normals), D.push(...o.normals), D.push(...s.normals), D.push(...c.normals)), h.addGroup(O, d.length, k), O += d.length, k++;
		}
		for (let e = 0, t = C.length; e < t; e += 3) C[e + 0] -= u.center[0], C[e + 1] -= u.center[1], C[e + 2] -= u.center[2];
		let ee = C.length / 3 > 65535 ? new Uint32Array(T) : new Uint16Array(T);
		if (h.setIndex(new x(ee, 1, !1)), h.setAttribute("position", new x(new Float32Array(C), 3, !1)), h.setAttribute("uv", new x(new Float32Array(w), 2, !1)), y && h.setAttribute("normal", new x(new Float32Array(D), 3, !1)), "watermask" in m) {
			let { mask: e, size: t } = m.watermask, n = new Uint8Array(2 * t * t);
			for (let t = 0, r = e.length; t < r; t++) {
				let r = e[t] === 255 ? 0 : 255;
				n[2 * t + 0] = r, n[2 * t + 1] = r;
			}
			let r = new E(n, t, t, _e, De);
			r.flipY = !0, r.minFilter = oe, r.magFilter = ae, r.needsUpdate = !0, g.roughnessMap = r;
		}
		return _.userData.minHeight = u.minHeight, _.userData.maxHeight = u.maxHeight, "metadata" in m && (_.userData.metadata = m.metadata.json), _;
		function te(e, t) {
			return t.x = f.u[e], t.y = f.v[e], t.z = f.height[e], t;
		}
		function ne(e, n, r, i, a = 0) {
			let d = j.lerp(u.minHeight, u.maxHeight, r), f = j.lerp(c, l, e), p = j.lerp(o, s, n);
			return t.getCartographicToPosition(p, f, d + a, i), i;
		}
		function A(e) {
			let t = [], n = [], a = [], o = [], s = [];
			for (let i = 0, s = e.length; i < s; i++) te(e[i], G), t.push(G.x, G.y), a.push(G.x, G.y), ne(G.x, G.y, G.z, K), n.push(...K), ne(G.x, G.y, G.z, K, -r), o.push(...K);
			let c = e.length - 1;
			for (let t = 0; t < c; t++) {
				let n = t, r = t + 1, i = t + e.length, a = t + e.length + 1;
				s.push(n, i, r), s.push(r, i, a);
			}
			let l = null;
			if (y) {
				let t = (n.length + o.length) / 3;
				if (i) {
					l = Array(t * 3);
					let n = m.octvertexnormals.normals, r = l.length / 2;
					for (let i = 0, a = t / 2; i < a; i++) {
						let t = e[i], a = 3 * i, o = n[3 * t + 0], s = n[3 * t + 1], c = n[3 * t + 2];
						l[a + 0] = o, l[a + 1] = s, l[a + 2] = c, l[r + a + 0] = o, l[r + a + 1] = s, l[r + a + 2] = c;
					}
				} else {
					l = [], $t.a.fromArray(n, 0), $t.b.fromArray(o, 0), $t.c.fromArray(n, 3), $t.getNormal(Qt);
					for (let e = 0; e < t; e++) l.push(...Qt);
				}
			}
			return {
				uv: [...t, ...a],
				positions: [...n, ...o],
				indices: s,
				normals: l
			};
		}
	}
}, tn = {}, nn = /* @__PURE__ */ new I(), rn = /* @__PURE__ */ new I(), an = /* @__PURE__ */ new I(), on = /* @__PURE__ */ new I(), sn = /* @__PURE__ */ new I(), q = /* @__PURE__ */ new I(), cn = /* @__PURE__ */ new I(), J = /* @__PURE__ */ new F(), Y = /* @__PURE__ */ new F(), ln = /* @__PURE__ */ new F(), un = class extends pt {
	constructor() {
		super(), this.ellipsoid = new l(), this.skirtLength = 1e3, this.smoothSkirtNormals = !0, this.solid = !1, this.minLat = -Math.PI / 2, this.maxLat = Math.PI / 2, this.minLon = -Math.PI, this.maxLon = Math.PI, this.attributeList = [
			"position",
			"normal",
			"uv"
		];
	}
	clipToQuadrant(e, t, n) {
		let { solid: r, skirtLength: i, ellipsoid: a, smoothSkirtNormals: o } = this;
		this.clearSplitOperations(), this.addSplitOperation(dn("x"), !t), this.addSplitOperation(dn("y"), !n);
		let s, c, l = e.geometry.groups[0], u = this.getClippedData(e, l);
		if (this.adjustVertices(u, e.position, 0), r) {
			s = {
				index: u.index.slice().reverse(),
				attributes: {}
			};
			for (let e in u.attributes) s.attributes[e] = u.attributes[e].slice();
			let t = s.attributes.normal;
			if (t) for (let e = 0; e < t.length; e += 3) t[e + 0] *= -1, t[e + 1] *= -1, t[e + 2] *= -1;
			this.adjustVertices(s, e.position, -i);
		}
		if (i > 0) {
			c = {
				index: [],
				attributes: {
					position: [],
					normal: [],
					uv: []
				}
			};
			let t = 0, n = {}, r = (e, r, i) => {
				let a = _t(...e, ...i, ...r);
				a in n || (n[a] = t, t++, c.attributes.position.push(...e), c.attributes.normal.push(...i), c.attributes.uv.push(...r)), c.index.push(n[a]);
			}, s = u.index, l = u.attributes.uv, d = u.attributes.position, f = u.attributes.normal, p = u.index.length / 3;
			for (let t = 0; t < p; t++) {
				let n = 3 * t;
				for (let t = 0; t < 3; t++) {
					let c = (t + 1) % 3, u = s[n + t], p = s[n + c];
					if (J.fromArray(l, u * 2), Y.fromArray(l, p * 2), J.x === Y.x && (J.x === 0 || J.x === .5 || J.x === 1) || J.y === Y.y && (J.y === 0 || J.y === .5 || J.y === 1)) {
						rn.fromArray(d, u * 3), an.fromArray(d, p * 3);
						let t = rn, n = an, s = on.copy(rn), c = sn.copy(an);
						q.copy(s).add(e.position), a.getPositionToNormal(q, q), s.addScaledVector(q, -i), q.copy(c).add(e.position), a.getPositionToNormal(q, q), c.addScaledVector(q, -i), o && f ? (q.fromArray(f, u * 3), cn.fromArray(f, p * 3)) : (q.subVectors(t, n), cn.subVectors(t, s).cross(q).normalize(), q.copy(cn)), r(n, Y, cn), r(t, J, q), r(s, J, q), r(n, Y, cn), r(s, J, q), r(c, Y, cn);
					}
				}
			}
		}
		let d = u.index.length, f = u;
		if (s) {
			let { index: e, attributes: t } = s, n = f.attributes.position.length / 3;
			for (let t = 0, r = e.length; t < r; t++) f.index.push(e[t] + n);
			for (let e in u.attributes) f.attributes[e].push(...t[e]);
		}
		if (c) {
			let { index: e, attributes: t } = c, n = f.attributes.position.length / 3;
			for (let t = 0, r = e.length; t < r; t++) f.index.push(e[t] + n);
			for (let e in u.attributes) f.attributes[e].push(...t[e]);
		}
		let p = t ? 0 : -.5, m = n ? 0 : -.5, h = f.attributes.uv;
		for (let e = 0, t = h.length; e < t; e += 2) h[e] = (h[e] + p) * 2, h[e + 1] = (h[e + 1] + m) * 2;
		let g = this.constructMesh(f.attributes, f.index, e);
		g.userData.minHeight = e.userData.minHeight, g.userData.maxHeight = e.userData.maxHeight;
		let _ = 0, v = 0;
		return g.geometry.addGroup(v, d, _), v += d, _++, s && (g.geometry.addGroup(v, s.index.length, _), v += s.index.length, _++), c && (g.geometry.addGroup(v, c.index.length, _), v += c.index.length, _++), g;
	}
	adjustVertices(e, t, n) {
		let { ellipsoid: r, minLat: i, maxLat: a, minLon: o, maxLon: s } = this, { attributes: c, vertexIsClipped: l } = e, u = c.position, d = c.uv, f = u.length / 3;
		for (let e = 0; e < f; e++) {
			let c = J.fromArray(d, e * 2);
			l && l[e] && (Math.abs(c.x - .5) < 1e-10 && (c.x = .5), Math.abs(c.y - .5) < 1e-10 && (c.y = .5), J.toArray(d, e * 2));
			let f = j.lerp(i, a, c.y), p = j.lerp(o, s, c.x), m = nn.fromArray(u, e * 3).add(t);
			r.getPositionToCartographic(m, tn), r.getCartographicToPosition(f, p, tn.height + n, m), m.sub(t), m.toArray(u, e * 3);
		}
	}
};
function dn(e) {
	return (t, n, r, i, a) => {
		let o = t.attributes.uv;
		return J.fromBufferAttribute(o, n), Y.fromBufferAttribute(o, r), ln.fromBufferAttribute(o, i), J[e] * a.x + Y[e] * a.y + ln[e] * a.z - .5;
	};
}
//#endregion
//#region src/three/plugins/QuantizedMeshPlugin.js
var fn = Symbol("TILE_X"), pn = Symbol("TILE_Y"), mn = Symbol("TILE_LEVEL"), hn = Symbol("TILE_AVAILABLE"), gn = Symbol("TILE_SPLIT_SOURCE_SCENE"), _n = 1e4, vn = /* @__PURE__ */ new I();
function yn(e, t, n, r) {
	if (e && t < e.length) {
		let i = e[t];
		for (let e = 0, t = i.length; e < t; e++) {
			let { startX: t, startY: a, endX: o, endY: s } = i[e];
			if (n >= t && n <= o && r >= a && r <= s) return !0;
		}
	}
	return !1;
}
function bn(e) {
	let { available: t = null, maxzoom: n = null } = e;
	return n === null ? t.length - 1 : n;
}
function xn(e) {
	let { metadataAvailability: t = -1 } = e;
	return t;
}
function Sn(e, t) {
	let n = e[mn], r = xn(t);
	return n < bn(t) && r !== -1 && n % r === 0;
}
function Cn(e, t, n, r, i) {
	return i.tiles[0].replace(/{\s*z\s*}/g, n).replace(/{\s*x\s*}/g, e).replace(/{\s*y\s*}/g, t).replace(/{\s*version\s*}/g, r);
}
var wn = class {
	constructor(e = {}) {
		let { useRecommendedSettings: t = !0, skirtLength: n = null, smoothSkirtNormals: r = !0, generateNormals: i = !0, solid: a = !1 } = e;
		this.name = "QUANTIZED_MESH_PLUGIN", this.priority = -1e3, this.tiles = null, this.layer = null, this.useRecommendedSettings = t, this.skirtLength = n, this.smoothSkirtNormals = r, this.solid = a, this.generateNormals = i, this.attribution = null, this.tiling = new ze(), this.projection = new L();
	}
	init(e) {
		e.fetchOptions.headers = e.fetchOptions.headers || {}, e.fetchOptions.headers.Accept = "application/vnd.quantized-mesh,application/octet-stream;q=0.9", this.useRecommendedSettings && (e.errorTarget = 2), this.tiles = e;
	}
	loadRootTileset() {
		let { tiles: e } = this, t = new URL("layer.json", new URL(e.rootURL, location.href));
		return e.invokeAllPlugins((e) => t = e.preprocessURL ? e.preprocessURL(t, null) : t), e.invokeOnePlugin((e) => e.fetchData && e.fetchData(t, this.tiles.fetchOptions)).then((e) => e.json()).then((e) => {
			this.layer = e;
			let { projection: t = "EPSG:4326", extensions: n = [], attribution: r = "", available: i = null } = e, { tiling: a, tiles: o, projection: s } = this;
			r && (this.attribution = {
				value: r,
				type: "string",
				collapsible: !0
			}), n.length > 0 && (o.fetchOptions.headers.Accept += `;extensions=${n.join("-")}`), s.setScheme(t);
			let { tileCountX: c, tileCountY: l } = s;
			a.setProjection(s), a.generateLevels(bn(e) + 1, c, l);
			let u = [];
			for (let e = 0; e < c; e++) {
				let t = this.createChild(0, e, 0, i);
				t && u.push(t);
			}
			let d = {
				asset: { version: "1.1" },
				geometricError: Infinity,
				root: {
					refine: "REPLACE",
					geometricError: Infinity,
					boundingVolume: { region: [
						...this.tiling.getContentBounds(),
						-1e4,
						_n
					] },
					children: u,
					[hn]: i,
					[mn]: -1
				}
			}, f = o.rootURL;
			return o.invokeAllPlugins((e) => f = e.preprocessURL ? e.preprocessURL(f, null) : f), o.preprocessTileset(d, f), d;
		});
	}
	parseToMesh(e, t, n, r) {
		let { skirtLength: i, solid: a, smoothSkirtNormals: o, generateNormals: s, tiles: c } = this, l = c.ellipsoid, u;
		if (n === "quantized_tile_split") {
			let e = new URL(r).searchParams, n = e.get("left") === "true", s = e.get("bottom") === "true", c = new un();
			c.ellipsoid.copy(l), c.solid = a, c.smoothSkirtNormals = o, c.skirtLength = i === null ? t.geometricError : i;
			let [d, f, p, m] = t.parent.boundingVolume.region;
			c.minLat = f, c.maxLat = m, c.minLon = d, c.maxLon = p;
			let h = t.parent.engineData.scene || t.parent[gn];
			u = c.clipToQuadrant(h, n, s);
		} else if (n === "terrain") {
			let n = new en(c.manager);
			n.ellipsoid.copy(l), n.solid = a, n.smoothSkirtNormals = o, n.generateNormals = s, n.skirtLength = i === null ? t.geometricError : i;
			let [r, d, f, p] = t.boundingVolume.region;
			n.minLat = d, n.maxLat = p, n.minLon = r, n.maxLon = f, u = n.parse(e);
		} else return;
		let { minHeight: d, maxHeight: f, metadata: p } = u.userData;
		return t.boundingVolume.region[4] = d, t.boundingVolume.region[5] = f, t.engineData.boundingVolume.setRegionData(l, ...t.boundingVolume.region), p && ("geometricerror" in p && (t.geometricError = p.geometricerror), Sn(t, this.layer) && "available" in p && t.children.length === 0 && (t[hn] = [...Array(t[mn] + 1).fill(null), ...p.available])), t[gn] = u, this.expandChildren(t), u;
	}
	getAttributions(e) {
		this.attribution && e.push(this.attribution);
	}
	createChild(e, t, n, r) {
		let { tiles: i, layer: a, tiling: o, projection: s } = this, c = i.ellipsoid, l = r === null && e === 0 || yn(r, e, t, n), u = Cn(t, n, e, 1, a), d = [
			...o.getTileBounds(t, n, e),
			-1e4,
			_n
		], [, f, , p, , m] = d, h = f > 0 == p > 0 ? Math.min(Math.abs(f), Math.abs(p)) : 0;
		c.getCartographicToPosition(h, 0, m, vn), vn.z = 0;
		let g = s.tileCountX, _ = Math.max(...c.radius) * 2 * Math.PI * .25 / (65 * g) / 2 ** e, v = {
			[hn]: null,
			[mn]: e,
			[fn]: t,
			[pn]: n,
			refine: "REPLACE",
			geometricError: _,
			boundingVolume: { region: d },
			content: l ? { uri: u } : null,
			children: []
		};
		return Sn(v, a) || (v[hn] = r), v;
	}
	expandChildren(e) {
		let t = e[mn], n = e[fn], r = e[pn], i = e[hn];
		if (t >= this.tiling.maxLevel) return;
		let a = !1;
		for (let o = 0; o < 2; o++) for (let s = 0; s < 2; s++) {
			let c = this.createChild(t + 1, 2 * n + o, 2 * r + s, i);
			c.content === null ? (c.content = { uri: `tile.quantized_tile_split?bottom=${s === 0}&left=${o === 0}` }, c.internal = { isVirtual: !0 }, e.internal.virtualChildCount++, e.children.push(c)) : (e.children.push(c), a = !0);
		}
		a || (e.children.length -= e.internal.virtualChildCount, e.internal.virtualChildCount = 0);
	}
	fetchData(e, t) {
		if (/quantized_tile_split/.test(e)) return /* @__PURE__ */ new ArrayBuffer();
	}
	disposeTile(e) {
		let { tiles: t, layer: n } = this;
		if (delete e[gn], Sn(e, n) && (e[hn] = null), hn in e) {
			let { virtualChildCount: n } = e.internal, r = e.children.length, i = r - n;
			for (let n = i; n < r; n++) t.processNodeQueue.remove(e.children[n]);
			e.children.length = 0, e.internal.virtualChildCount = 0;
		}
	}
}, Tn = class extends f {
	constructor(e = {}) {
		super({
			assetTypeHandler: (e, t, n) => {
				if (e === "TERRAIN" && t.getPluginByName("QUANTIZED_MESH_PLUGIN") === null) t.registerPlugin(new wn({ useRecommendedSettings: this.useRecommendedSettings }));
				else if (e === "IMAGERY" && t.getPluginByName("GENERATED_SURFACE_PLUGIN") === null) {
					let e = new Yt({ url: t.rootURL });
					t.registerPlugin(new Xe({
						shape: "ellipsoid",
						overlay: e
					}));
				} else console.warn(`CesiumIonAuthPlugin: Cesium Ion asset type "${e}" unhandled.`);
			},
			...e
		});
	}
}, En = /* @__PURE__ */ new M(), Dn = class {
	constructor() {
		this.name = "UPDATE_ON_CHANGE_PLUGIN", this.tiles = null, this.needsUpdate = !1, this.cameraMatrices = /* @__PURE__ */ new Map();
	}
	init(e) {
		this.tiles = e, this._needsUpdateCallback = () => {
			this.needsUpdate = !0;
		}, this._onCameraAdd = ({ camera: e }) => {
			this.needsUpdate = !0, this.cameraMatrices.set(e, new M());
		}, this._onCameraDelete = ({ camera: e }) => {
			this.needsUpdate = !0, this.cameraMatrices.delete(e);
		}, e.addEventListener("needs-update", this._needsUpdateCallback), e.addEventListener("add-camera", this._onCameraAdd), e.addEventListener("delete-camera", this._onCameraDelete), e.addEventListener("camera-resolution-change", this._needsUpdateCallback), e.cameras.forEach((e) => {
			this._onCameraAdd({ camera: e });
		});
	}
	doTilesNeedUpdate() {
		let e = this.tiles, t = !1;
		this.cameraMatrices.forEach((n, r) => {
			En.copy(e.group.matrixWorld).premultiply(r.matrixWorldInverse).premultiply(r.projectionMatrixInverse), t ||= !En.equals(n), n.copy(En);
		});
		let n = this.needsUpdate;
		return this.needsUpdate = !1, n || t;
	}
	preprocessNode() {
		this.needsUpdate = !0;
	}
	dispose() {
		let e = this.tiles;
		e.removeEventListener("camera-resolution-change", this._needsUpdateCallback), e.removeEventListener("needs-update", this._needsUpdateCallback), e.removeEventListener("add-camera", this._onCameraAdd), e.removeEventListener("delete-camera", this._onCameraDelete);
	}
}, On = /* @__PURE__ */ new I();
function kn(e, t) {
	if (e.isInterleavedBufferAttribute || e.array instanceof t) return e;
	let n = t === Int8Array || t === Int16Array || t === Int32Array ? -1 : 0, r = new x(new t(e.count * e.itemSize), e.itemSize, !0), i = e.itemSize, a = e.count;
	for (let t = 0; t < a; t++) for (let a = 0; a < i; a++) {
		let i = j.clamp(e.getComponent(t, a), n, 1);
		r.setComponent(t, a, i);
	}
	return r;
}
function An(e, t = Int16Array) {
	let n = e.geometry, r = n.attributes, i = r.position;
	if (i.isInterleavedBufferAttribute || i.array instanceof t) return i;
	let a = new x(new t(i.count * i.itemSize), i.itemSize, !1), o = i.itemSize, s = i.count;
	n.computeBoundingBox();
	let c = n.boundingBox, { min: l, max: u } = c, d = 2 ** (8 * t.BYTES_PER_ELEMENT - 1) - 1, f = -d;
	for (let e = 0; e < s; e++) for (let t = 0; t < o; t++) {
		let n = t === 0 ? "x" : t === 1 ? "y" : "z", r = l[n], o = u[n], s = j.mapLinear(i.getComponent(e, t), r, o, f, d);
		a.setComponent(e, t, s);
	}
	c.getCenter(On).multiply(e.scale).applyQuaternion(e.quaternion), e.position.add(On), e.scale.x *= .5 * (u.x - l.x) / d, e.scale.y *= .5 * (u.y - l.y) / d, e.scale.z *= .5 * (u.z - l.z) / d, r.position = a, e.geometry.boundingBox = null, e.geometry.boundingSphere = null, e.updateMatrixWorld();
}
var jn = class {
	constructor(e) {
		this._options = {
			generateNormals: !1,
			disableMipmaps: !0,
			compressIndex: !0,
			compressNormals: !1,
			compressUvs: !1,
			compressPosition: !1,
			uvType: Int8Array,
			normalType: Int8Array,
			positionType: Int16Array,
			...e
		}, this.name = "TILES_COMPRESSION_PLUGIN", this.priority = -100;
	}
	processTileModel(e, t) {
		let { generateNormals: n, disableMipmaps: r, compressIndex: i, compressUvs: a, compressNormals: o, compressPosition: s, uvType: c, normalType: l, positionType: u } = this._options;
		e.traverse((e) => {
			if (e.material && r) {
				let t = e.material;
				for (let e in t) {
					let n = t[e];
					n && n.isTexture && n.generateMipmaps && (n.generateMipmaps = !1, n.minFilter = ae);
				}
			}
			if (e.geometry) {
				let t = e.geometry, r = t.attributes;
				if (a) {
					let { uv: e, uv1: t, uv2: n, uv3: i } = r;
					e && (r.uv = kn(e, c)), t && (r.uv1 = kn(t, c)), n && (r.uv2 = kn(n, c)), i && (r.uv3 = kn(i, c));
				}
				if (n && !r.normals && t.computeVertexNormals(), o && r.normals && (r.normals = kn(r.normals, l)), s && An(e, u), i && t.index) {
					let e = r.position.count, n = t.index, i = e > 65535 ? Uint32Array : e > 255 ? Uint16Array : Uint8Array;
					if (!(n.array instanceof i)) {
						let e = new i(t.index.count);
						e.set(n.array);
						let r = new x(e, 1);
						t.setIndex(r);
					}
				}
			}
		});
	}
};
//#endregion
//#region src/three/plugins/gltf/metadata/utilities/ClassPropertyHelpers.js
function X(e, t, n) {
	return e && t in e ? e[t] : n;
}
function Mn(e) {
	return e !== "BOOLEAN" && e !== "STRING" && e !== "ENUM";
}
function Nn(e) {
	return /^FLOAT/.test(e);
}
function Pn(e) {
	return /^VEC/.test(e);
}
function Fn(e) {
	return /^MAT/.test(e);
}
function In(e, t, n, r = null) {
	return Fn(n) || Pn(n) ? r.fromArray(e, t) : e[t];
}
function Ln(e) {
	let { type: t, componentType: n } = e;
	switch (t) {
		case "SCALAR": return n === "INT64" ? 0n : 0;
		case "VEC2": return new F();
		case "VEC3": return new I();
		case "VEC4": return new Oe();
		case "MAT2": return new se();
		case "MAT3": return new ce();
		case "MAT4": return new M();
		case "BOOLEAN": return !1;
		case "STRING": return "";
		case "ENUM": return 0;
	}
}
function Rn(e, t) {
	if (t == null) return !1;
	switch (e) {
		case "SCALAR": return typeof t == "number" || typeof t == "bigint";
		case "VEC2": return t.isVector2;
		case "VEC3": return t.isVector3;
		case "VEC4": return t.isVector4;
		case "MAT2": return t.isMatrix2;
		case "MAT3": return t.isMatrix3;
		case "MAT4": return t.isMatrix4;
		case "BOOLEAN": return typeof t == "boolean";
		case "STRING": return typeof t == "string";
		case "ENUM": return typeof t == "number" || typeof t == "bigint";
	}
	throw Error("ClassProperty: invalid type.");
}
function zn(e, t = null) {
	switch (e) {
		case "INT8": return Int8Array;
		case "INT16": return Int16Array;
		case "INT32": return Int32Array;
		case "INT64": return BigInt64Array;
		case "UINT8": return Uint8Array;
		case "UINT16": return Uint16Array;
		case "UINT32": return Uint32Array;
		case "UINT64": return BigUint64Array;
		case "FLOAT32": return Float32Array;
		case "FLOAT64": return Float64Array;
	}
	switch (t) {
		case "BOOLEAN": return Uint8Array;
		case "STRING": return Uint8Array;
	}
	throw Error("ClassProperty: invalid type.");
}
function Bn(e, t = null) {
	if (e.array) {
		t = t && Array.isArray(t) ? t : [], t.length = e.count;
		for (let n = 0, r = t.length; n < r; n++) t[n] = Vn(e, t[n]);
	} else t = Vn(e, t);
	return t;
}
function Vn(e, t = null) {
	let n = e.default, r = e.type;
	if (t ||= Ln(e), n === null) {
		switch (r) {
			case "SCALAR": return 0;
			case "VEC2": return t.set(0, 0);
			case "VEC3": return t.set(0, 0, 0);
			case "VEC4": return t.set(0, 0, 0, 0);
			case "MAT2": return t.identity();
			case "MAT3": return t.identity();
			case "MAT4": return t.identity();
			case "BOOLEAN": return !1;
			case "STRING": return "";
			case "ENUM": return "";
		}
		throw Error("ClassProperty: invalid type.");
	} else if (Fn(r)) t.fromArray(n);
	else if (Pn(r)) t.fromArray(n);
	else return n;
}
function Hn(e, t) {
	if (e.noData === null) return t;
	let n = e.noData, r = e.type;
	if (Array.isArray(t)) for (let e = 0, n = t.length; e < n; e++) t[e] = i(t[e]);
	else t = i(t);
	return t;
	function i(t) {
		return a(t) && (t = Vn(e, t)), t;
	}
	function a(e) {
		if (Fn(r)) {
			let t = e.elements;
			for (let e = 0, r = n.length; e < r; e++) if (n[e] !== t[e]) return !1;
			return !0;
		} else if (Pn(r)) {
			for (let t = 0, r = n.length; t < r; t++) if (n[t] !== e.getComponent(t)) return !1;
			return !0;
		} else return n === e;
	}
}
function Un(e, t) {
	switch (e) {
		case "INT8": return Math.max(t / 127, -1);
		case "INT16": return Math.max(t, 32767, -1);
		case "INT32": return Math.max(t / 2147483647, -1);
		case "INT64": return Math.max(Number(t) / 0x8000000000000000, -1);
		case "UINT8": return t / 255;
		case "UINT16": return t / 65535;
		case "UINT32": return t / 4294967295;
		case "UINT64": return Number(t) / 0x10000000000000000;
	}
}
function Wn(e, t) {
	let { type: n, componentType: r, scale: i, offset: a, normalized: o } = e;
	if (Array.isArray(t)) for (let e = 0, n = t.length; e < n; e++) t[e] = s(t[e]);
	else t = s(t);
	return t;
	function s(e) {
		return e = Fn(n) ? l(e) : Pn(n) ? c(e) : u(e), e;
	}
	function c(e) {
		return e.x = u(e.x), e.y = u(e.y), "z" in e && (e.z = u(e.z)), "w" in e && (e.w = u(e.w)), e;
	}
	function l(e) {
		let t = e.elements;
		for (let e = 0, n = t.length; e < n; e++) t[e] = u(t[e]);
		return e;
	}
	function u(e) {
		return o && (e = Un(r, e)), (o || Nn(r)) && (e = e * i + a), e;
	}
}
function Gn(e, t, n = null) {
	if (e.array) {
		Array.isArray(t) || (t = Array(e.count || 0)), t.length = n === null ? e.count : n;
		for (let n = 0, r = t.length; n < r; n++) Rn(e.type, t[n]) || (t[n] = Ln(e));
	} else Rn(e.type, t) || (t = Ln(e));
	return t;
}
function Kn(e, t) {
	for (let n in t) n in e || delete t[n];
	for (let n in e) {
		let r = e[n];
		t[n] = Gn(r, t[n]);
	}
}
function qn(e) {
	switch (e) {
		case "ENUM": return 1;
		case "SCALAR": return 1;
		case "VEC2": return 2;
		case "VEC3": return 3;
		case "VEC4": return 4;
		case "MAT2": return 4;
		case "MAT3": return 9;
		case "MAT4": return 16;
		case "BOOLEAN": return -1;
		case "STRING": return -1;
		default: return -1;
	}
}
//#endregion
//#region src/three/plugins/gltf/metadata/classes/ClassProperty.js
var Jn = class {
	constructor(e, t, n = null) {
		this.name = t.name || null, this.description = t.description || null, this.type = t.type, this.componentType = t.componentType || null, this.enumType = t.enumType || null, this.array = t.array || !1, this.count = t.count || 0, this.normalized = t.normalized || !1, this.offset = t.offset || 0, this.scale = X(t, "scale", 1), this.max = X(t, "max", Infinity), this.min = X(t, "min", -Infinity), this.required = t.required || !1, this.noData = X(t, "noData", null), this.default = X(t, "default", null), this.semantic = X(t, "semantic", null), this.enumSet = null, this.accessorProperty = n, n && (this.offset = X(n, "offset", this.offset), this.scale = X(n, "scale", this.scale), this.max = X(n, "max", this.max), this.min = X(n, "min", this.min)), t.type === "ENUM" && (this.enumSet = e[this.enumType], this.componentType === null && (this.componentType = X(this.enumSet, "valueType", "UINT16")));
	}
	shapeToProperty(e, t = null) {
		return Gn(this, e, t);
	}
	resolveDefaultElement(e) {
		return Vn(this, e);
	}
	resolveDefault(e) {
		return Bn(this, e);
	}
	resolveNoData(e) {
		return Hn(this, e);
	}
	resolveEnumsToStrings(e) {
		let t = this.enumSet;
		if (this.type === "ENUM") if (Array.isArray(e)) for (let t = 0, r = e.length; t < r; t++) e[t] = n(e[t]);
		else e = n(e);
		return e;
		function n(e) {
			let n = t.values.find((t) => t.value === e);
			return n === null ? "" : n.name;
		}
	}
	adjustValueScaleOffset(e) {
		return Mn(this.type) ? Wn(this, e) : e;
	}
}, Yn = class {
	constructor(e, t = {}, n = {}, r = null) {
		this.definition = e, this.class = t[e.class], this.className = e.class, this.enums = n, this.data = r, this.name = "name" in e ? e.name : null, this.properties = null;
	}
	getPropertyNames() {
		return Object.keys(this.class.properties);
	}
	includesData(e) {
		return !!this.definition.properties[e];
	}
	dispose() {}
	_initProperties(e = Jn) {
		let t = {};
		for (let n in this.class.properties) t[n] = new e(this.enums, this.class.properties[n], this.definition.properties[n]);
		this.properties = t;
	}
}, Xn = class extends Jn {
	constructor(e, t, n = null) {
		super(e, t, n), this.attribute = n?.attribute ?? null;
	}
}, Zn = class extends Yn {
	constructor(...e) {
		super(...e), this.isPropertyAttributeAccessor = !0, this._initProperties(Xn);
	}
	getData(e, t, n = {}) {
		let r = this.properties;
		Kn(r, n);
		for (let i in r) n[i] = this.getPropertyValue(i, e, t, n[i]);
		return n;
	}
	getPropertyValue(e, t, n, r = null) {
		if (t >= this.count) throw Error("PropertyAttributeAccessor: Requested index is outside the range of the buffer.");
		let i = this.properties[e], a = i.type;
		if (!i) throw Error("PropertyAttributeAccessor: Requested class property does not exist.");
		if (!this.definition.properties[e]) return i.resolveDefault(r);
		r = i.shapeToProperty(r);
		let o = n.getAttribute(i.attribute.toLowerCase());
		if (Fn(a)) {
			let e = r.elements;
			for (let n = e.length; 0 < n;) e[0] = o.getComponent(t, 0);
		} else if (Pn(a)) r.fromBufferAttribute(o, t);
		else if (a === "SCALAR" || a === "ENUM") r = o.getX(t);
		else throw Error("StructuredMetadata.PropertyAttributeAccessor: BOOLEAN and STRING types are not supported by property attributes.");
		return r = i.adjustValueScaleOffset(r), r = i.resolveEnumsToStrings(r), r = i.resolveNoData(r), r;
	}
}, Qn = class extends Jn {
	constructor(e, t, n = null) {
		super(e, t, n), this.values = n?.values ?? null, this.valueLength = qn(this.type), this.arrayOffsets = X(n, "arrayOffsets", null), this.stringOffsets = X(n, "stringOffsets", null), this.arrayOffsetType = X(n, "arrayOffsetType", "UINT32"), this.stringOffsetType = X(n, "stringOffsetType", "UINT32");
	}
	getArrayLengthFromId(e, t) {
		let n = this.count;
		if (this.arrayOffsets !== null) {
			let { arrayOffsets: r, arrayOffsetType: i } = this, a = new (zn(i))(e[r]);
			n = a[t + 1] - a[t];
		}
		return n;
	}
	getIndexOffsetFromId(e, t) {
		let n = t;
		if (this.arrayOffsets) {
			let { arrayOffsets: t, arrayOffsetType: r } = this;
			n = new (zn(r))(e[t])[n];
		} else this.array && (n *= this.count);
		return n;
	}
}, $n = class extends Yn {
	constructor(...e) {
		super(...e), this.isPropertyTableAccessor = !0, this.count = this.definition.count, this._initProperties(Qn);
	}
	getData(e, t = {}) {
		let n = this.properties;
		Kn(n, t);
		for (let r in n) t[r] = this.getPropertyValue(r, e, t[r]);
		return t;
	}
	_readValueAtIndex(e, t, n, r = null) {
		let i = this.properties[e], { componentType: a, type: o } = i, s = this.data, c = s[i.values], l = new (zn(a, o))(c), u = i.getIndexOffsetFromId(s, t);
		if (Mn(o) || o === "ENUM") return In(l, (u + n) * i.valueLength, o, r);
		if (o === "STRING") {
			let e = u + n, t = 0;
			if (i.stringOffsets !== null) {
				let { stringOffsets: n, stringOffsetType: r } = i, a = new (zn(r))(s[n]);
				t = a[e + 1] - a[e], e = a[e];
			}
			let a = new Uint8Array(l.buffer, e, t);
			r = new TextDecoder().decode(a);
		} else if (o === "BOOLEAN") {
			let e = u + n, t = Math.floor(e / 8), i = e % 8;
			r = (l[t] >> i & 1) == 1;
		}
		return r;
	}
	getPropertyValue(e, t, n = null) {
		if (t >= this.count) throw Error("PropertyTableAccessor: Requested index is outside the range of the table.");
		let r = this.properties[e];
		if (!r) throw Error("PropertyTableAccessor: Requested property does not exist.");
		if (!this.definition.properties[e]) return r.resolveDefault(n);
		let i = r.array, a = this.data, o = r.getArrayLengthFromId(a, t);
		if (n = r.shapeToProperty(n, o), i) for (let r = 0, i = n.length; r < i; r++) n[r] = this._readValueAtIndex(e, t, r, n[r]);
		else n = this._readValueAtIndex(e, t, 0, n);
		return n = r.adjustValueScaleOffset(n), n = r.resolveEnumsToStrings(n), n = r.resolveNoData(n), n;
	}
}, er = /* @__PURE__ */ new _(), tr = class {
	constructor() {
		this._renderer = new je(), this._target = new Ae(1, 1), this._texTarget = new Ae(), this._quad = new Pe(new xe({
			blending: T,
			blendDst: Me,
			blendSrc: de,
			uniforms: {
				map: { value: null },
				pixel: { value: new F() }
			},
			vertexShader: "\n				void main() {\n\n					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n				}\n			",
			fragmentShader: "\n				uniform sampler2D map;\n				uniform ivec2 pixel;\n\n				void main() {\n\n					gl_FragColor = texelFetch( map, pixel, 0 );\n\n				}\n			"
		}));
	}
	increaseSizeTo(e) {
		this._target.setSize(Math.max(this._target.width, e), 1);
	}
	readDataAsync(e) {
		let { _renderer: t, _target: n } = this;
		return t.readRenderTargetPixelsAsync(n, 0, 0, e.length / 4, 1, e);
	}
	readData(e) {
		let { _renderer: t, _target: n } = this;
		t.readRenderTargetPixels(n, 0, 0, e.length / 4, 1, e);
	}
	renderPixelToTarget(e, t, n) {
		let { _renderer: r, _target: i } = this;
		er.min.copy(t), er.max.copy(t), er.max.x += 1, er.max.y += 1, r.initRenderTarget(i), r.copyTextureToTexture(e, i.texture, er, n, 0);
	}
}, nr = /* @__PURE__ */ new class {
	constructor() {
		let e = null;
		Object.getOwnPropertyNames(tr.prototype).forEach((t) => {
			t !== "constructor" && (this[t] = (...n) => (e ||= new tr(), e[t](...n)));
		});
	}
}(), rr = /* @__PURE__ */ new F(), ir = /* @__PURE__ */ new F(), ar = /* @__PURE__ */ new F();
function or(e, t) {
	return t === 0 ? e.getAttribute("uv") : e.getAttribute(`uv${t}`);
}
function sr(e, t, n = [
	,
	,
	,
]) {
	let r = 3 * t, i = 3 * t + 1, a = 3 * t + 2;
	return e.index && (r = e.index.getX(r), i = e.index.getX(i), a = e.index.getX(a)), n[0] = r, n[1] = i, n[2] = a, n;
}
function cr(e, t, n, r, i) {
	let [a, o, s] = r, c = or(e, t);
	rr.fromBufferAttribute(c, a), ir.fromBufferAttribute(c, o), ar.fromBufferAttribute(c, s), i.set(0, 0, 0).addScaledVector(rr, n.x).addScaledVector(ir, n.y).addScaledVector(ar, n.z);
}
function lr(e, t, n, r) {
	let i = e.x - Math.floor(e.x), a = e.y - Math.floor(e.y), o = Math.floor(i * t % t), s = Math.floor(a * n % n);
	return r.set(o, s), r;
}
//#endregion
//#region src/three/plugins/gltf/metadata/classes/PropertyTextureAccessor.js
var ur = /* @__PURE__ */ new F(), dr = /* @__PURE__ */ new F(), fr = /* @__PURE__ */ new F(), pr = class extends Jn {
	constructor(e, t, n = null) {
		super(e, t, n), this.channels = X(n, "channels", [0]), this.index = X(n, "index", null), this.texCoord = X(n, "texCoord", null), this.valueLength = parseInt(this.type.replace(/[^0-9]/g, "")) || 1;
	}
	readDataFromBuffer(e, t, n = null) {
		let r = this.type;
		if (r === "BOOLEAN" || r === "STRING") throw Error("PropertyTextureAccessor: BOOLEAN and STRING types not supported.");
		return In(e, t * this.valueLength, r, n);
	}
}, mr = class extends Yn {
	constructor(...e) {
		super(...e), this.isPropertyTextureAccessor = !0, this._asyncRead = !1, this._initProperties(pr);
	}
	getData(e, t, n, r = {}) {
		let i = this.properties;
		Kn(i, r);
		let a = Object.keys(i), o = a.map((e) => r[e]);
		return this.getPropertyValuesAtTexel(a, e, t, n, o), a.forEach((e, t) => r[e] = o[t]), r;
	}
	async getDataAsync(e, t, n, r = {}) {
		let i = this.properties;
		Kn(i, r);
		let a = Object.keys(i), o = a.map((e) => r[e]);
		return await this.getPropertyValuesAtTexelAsync(a, e, t, n, o), a.forEach((e, t) => r[e] = o[t]), r;
	}
	getPropertyValuesAtTexelAsync(...e) {
		this._asyncRead = !0;
		let t = this.getPropertyValuesAtTexel(...e);
		return this._asyncRead = !1, t;
	}
	getPropertyValuesAtTexel(e, t, n, r, i = []) {
		for (; i.length < e.length;) i.push(null);
		i.length = e.length, nr.increaseSizeTo(i.length);
		let a = this.data, o = this.definition.properties, s = this.properties, c = sr(r, t);
		for (let t = 0, i = e.length; t < i; t++) {
			let i = e[t];
			if (!o[i]) continue;
			let l = s[i], u = a[l.index];
			cr(r, l.texCoord, n, c, ur), lr(ur, u.image.width, u.image.height, dr), fr.set(t, 0), nr.renderPixelToTarget(u, dr, fr);
		}
		let l = new Uint8Array(e.length * 4);
		if (this._asyncRead) return nr.readDataAsync(l).then(() => (u.call(this), i));
		return nr.readData(l), u.call(this), i;
		function u() {
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t], r = s[n], a = r.type;
				if (i[t] = Gn(r, i[t]), !r) throw Error("PropertyTextureAccessor: Requested property does not exist.");
				if (!o[n]) {
					i[t] = r.resolveDefault(i);
					continue;
				}
				let c = r.valueLength * (r.count || 1), u = r.channels.map((e) => l[4 * t + e]), d = r.componentType, f = new (zn(d, a))(c);
				if (new Uint8Array(f.buffer).set(u), r.array) {
					let e = i[t];
					for (let t = 0, n = e.length; t < n; t++) e[t] = r.readDataFromBuffer(f, t, e[t]);
				} else i[t] = r.readDataFromBuffer(f, 0, i[t]);
				i[t] = r.adjustValueScaleOffset(i[t]), i[t] = r.resolveEnumsToStrings(i[t]), i[t] = r.resolveNoData(i[t]);
			}
		}
	}
	dispose() {
		this.data.forEach((e) => {
			e && (e.dispose(), e.image instanceof ImageBitmap && e.image.close());
		});
	}
}, hr = class {
	constructor(e, t, n, r = null, i = null) {
		let { schema: a, propertyTables: o = [], propertyTextures: s = [], propertyAttributes: c = [] } = e, { enums: l, classes: u } = a, d = o.map((e) => new $n(e, u, l, n)), f = [], p = [];
		r && (r.propertyTextures && (f = r.propertyTextures.map((e) => new mr(s[e], u, l, t))), r.propertyAttributes && (p = r.propertyAttributes.map((e) => new Zn(c[e], u, l)))), this.schema = a, this.tableAccessors = d, this.textureAccessors = f, this.attributeAccessors = p, this.object = i, this.textures = t, this.nodeMetadata = r;
	}
	getPropertyTableData(e, t, n = null) {
		if (!Array.isArray(e)) n ||= {}, n = this.tableAccessors[e].getData(t, n);
		else {
			n ||= [];
			let r = Math.min(e.length, t.length);
			n.length = r;
			for (let i = 0; i < r; i++) {
				let r = this.tableAccessors[e[i]];
				n[i] = r.getData(t[i], n[i]);
			}
		}
		if (Array.isArray(e) !== Array.isArray(n) || Array.isArray(e) !== Array.isArray(t)) throw Error("StructuralMetadata: Scalar and array inputs cannot be mixed.");
		return n;
	}
	getPropertyTableInfo(e = null) {
		if (e === null && (e = this.tableAccessors.map((e, t) => t)), Array.isArray(e)) return e.map((e) => {
			let t = this.tableAccessors[e];
			return {
				name: t.name,
				className: t.definition.class
			};
		});
		{
			let t = this.tableAccessors[e];
			return {
				name: t.name,
				className: t.definition.class
			};
		}
	}
	getPropertyTextureData(e, t, n = []) {
		let r = this.textureAccessors;
		n.length = r.length;
		for (let i = 0; i < r.length; i++) n[i] = r[i].getData(e, t, this.object.geometry, n[i]);
		return n;
	}
	async getPropertyTextureDataAsync(e, t, n = []) {
		let r = this.textureAccessors;
		n.length = r.length;
		let i = [];
		for (let a = 0; a < r.length; a++) {
			let o = r[a].getDataAsync(e, t, this.object.geometry, n[a]).then((e) => {
				n[a] = e;
			});
			i.push(o);
		}
		return await Promise.all(i), n;
	}
	getPropertyTextureInfo() {
		return this.textureAccessors;
	}
	getPropertyAttributeData(e, t = []) {
		let n = this.attributeAccessors;
		t.length = n.length;
		for (let r = 0; r < n.length; r++) t[r] = n[r].getData(e, this.object.geometry, t[r]);
		return t;
	}
	getPropertyAttributeInfo() {
		return this.attributeAccessors.map((e) => ({
			name: e.name,
			className: e.definition.class
		}));
	}
	dispose() {
		this.textureAccessors.forEach((e) => e.dispose()), this.tableAccessors.forEach((e) => e.dispose()), this.attributeAccessors.forEach((e) => e.dispose());
	}
}, gr = "EXT_structural_metadata";
function _r(e, t = []) {
	let n = e.json.textures?.length || 0, r = Array(n).fill(null);
	return t.forEach(({ properties: t }) => {
		for (let n in t) {
			let { index: i } = t[n];
			r[i] === null && (r[i] = e.loadTexture(i));
		}
	}), Promise.all(r);
}
function vr(e, t = []) {
	let n = e.json.bufferViews?.length || 0, r = Array(n).fill(null);
	return t.forEach(({ properties: t }) => {
		for (let n in t) {
			let { values: i, arrayOffsets: a, stringOffsets: o } = t[n];
			r[i] === null && (r[i] = e.loadBufferView(i)), r[a] === null && (r[a] = e.loadBufferView(a)), r[o] === null && (r[o] = e.loadBufferView(o));
		}
	}), Promise.all(r);
}
var yr = class {
	constructor(e) {
		this.parser = e, this.name = gr;
	}
	async afterRoot({ scene: e, parser: t }) {
		let n = t.json.extensionsUsed;
		if (!n || !n.includes(gr)) return;
		let r = null, i = t.json.extensions[gr];
		if (i.schemaUri) {
			let { manager: e, path: n, requestHeader: a, crossOrigin: o } = t.options, s = new URL(i.schemaUri, n).toString(), c = new te(e);
			c.setCrossOrigin(o), c.setResponseType("json"), c.setRequestHeader(a), r = c.loadAsync(s).then((e) => {
				i = {
					...i,
					schema: e
				};
			});
		}
		let [a, o] = await Promise.all([
			_r(t, i.propertyTextures),
			vr(t, i.propertyTables),
			r
		]), s = new hr(i, a, o);
		e.userData.structuralMetadata = s, e.traverse((e) => {
			if (t.associations.has(e)) {
				let { meshes: n, primitives: r } = t.associations.get(e), c = t.json.meshes[n]?.primitives[r];
				if (c && c.extensions && c.extensions[gr]) {
					let t = c.extensions[gr];
					e.userData.structuralMetadata = new hr(i, a, o, t, e);
				} else e.userData.structuralMetadata = s;
			}
		});
	}
}, br = /* @__PURE__ */ new F(), xr = /* @__PURE__ */ new F(), Sr = /* @__PURE__ */ new F();
function Cr(e) {
	return e.x > e.y && e.x > e.z ? 0 : e.y > e.z ? 1 : 2;
}
var wr = class {
	constructor(e, t, n) {
		this.geometry = e, this.textures = t, this.data = n, this._asyncRead = !1, this.featureIds = n.featureIds.map((e) => {
			let { texture: t, ...n } = e, r = {
				label: null,
				propertyTable: null,
				nullFeatureId: null,
				...n
			};
			return t && (r.texture = {
				texCoord: 0,
				channels: [0],
				...t
			}), r;
		});
	}
	getTextures() {
		return this.textures;
	}
	getFeatureInfo() {
		return this.featureIds;
	}
	getFeaturesAsync(...e) {
		this._asyncRead = !0;
		let t = this.getFeatures(...e);
		return this._asyncRead = !1, t;
	}
	getFeatures(e, t) {
		let { geometry: n, textures: r, featureIds: i } = this, a = Array(i.length).fill(null), o = i.length;
		nr.increaseSizeTo(o);
		let s = sr(n, e), c = s[Cr(t)];
		for (let e = 0, o = i.length; e < o; e++) {
			let o = i[e], l = "nullFeatureId" in o ? o.nullFeatureId : null;
			if ("texture" in o) {
				let i = r[o.texture.index];
				cr(n, o.texture.texCoord, t, s, br), lr(br, i.image.width, i.image.height, xr), Sr.set(e, 0), nr.renderPixelToTarget(r[o.texture.index], xr, Sr);
			} else if ("attribute" in o) {
				let t = n.getAttribute(`_feature_id_${o.attribute}`).getX(c);
				t !== l && (a[e] = t);
			} else {
				let t = c;
				t !== l && (a[e] = t);
			}
		}
		let l = new Uint8Array(o * 4);
		if (this._asyncRead) return nr.readDataAsync(l).then(() => (u(), a));
		return nr.readData(l), u(), a;
		function u() {
			let e = new Uint32Array(1);
			for (let t = 0, n = i.length; t < n; t++) {
				let n = i[t], r = "nullFeatureId" in n ? n.nullFeatureId : null;
				if ("texture" in n) {
					let { channels: i } = n.texture, o = i.map((e) => l[4 * t + e]);
					new Uint8Array(e.buffer).set(o);
					let s = e[0];
					s !== r && (a[t] = s);
				}
			}
		}
	}
	dispose() {
		this.textures.forEach((e) => {
			e && (e.dispose(), e.image instanceof ImageBitmap && e.image.close());
		});
	}
}, Tr = "EXT_mesh_features";
function Er(e, t, n) {
	e.traverse((e) => {
		if (t.associations.has(e)) {
			let { meshes: r, primitives: i } = t.associations.get(e), a = t.json.meshes[r]?.primitives[i];
			a && a.extensions && a.extensions[Tr] && n(e, a.extensions[Tr]);
		}
	});
}
var Dr = class {
	constructor(e) {
		this.parser = e, this.name = Tr;
	}
	async afterRoot({ scene: e, parser: t }) {
		let n = t.json.extensionsUsed;
		if (!n || !n.includes(Tr)) return;
		let r = t.json.textures?.length || 0, i = Array(r).fill(null);
		Er(e, t, (e, { featureIds: n }) => {
			n.forEach((e) => {
				if (e.texture && i[e.texture.index] === null) {
					let n = e.texture.index;
					i[n] = t.loadTexture(n);
				}
			});
		});
		let a = await Promise.all(i);
		Er(e, t, (e, t) => {
			e.userData.meshFeatures = new wr(e.geometry, a, t);
		});
	}
}, Or = class {
	constructor() {
		this.name = "CESIUM_RTC";
	}
	afterRoot(e) {
		if (e.parser.json.extensions && e.parser.json.extensions.CESIUM_RTC) {
			let { center: t } = e.parser.json.extensions.CESIUM_RTC;
			t && (e.scene.position.x += t[0], e.scene.position.y += t[1], e.scene.position.z += t[2]);
		}
	}
}, kr = class {
	constructor(e) {
		e = {
			metadata: !0,
			rtc: !0,
			plugins: [],
			dracoLoader: null,
			ktxLoader: null,
			meshoptDecoder: null,
			autoDispose: !0,
			...e
		}, this.tiles = null, this.metadata = e.metadata, this.rtc = e.rtc, this.plugins = e.plugins, this.dracoLoader = e.dracoLoader, this.ktxLoader = e.ktxLoader, this.meshoptDecoder = e.meshoptDecoder, this._gltfRegex = /\.(gltf|glb)$/g, this._dracoRegex = /\.drc$/g, this._loader = null;
	}
	init(e) {
		let t = new Ne(e.manager);
		this.dracoLoader && (t.setDRACOLoader(this.dracoLoader), e.manager.addHandler(this._dracoRegex, this.dracoLoader)), this.ktxLoader && t.setKTX2Loader(this.ktxLoader), this.meshoptDecoder && t.setMeshoptDecoder(this.meshoptDecoder), this.rtc && t.register(() => new Or()), this.metadata && (t.register(() => new yr()), t.register(() => new Dr())), this.plugins.forEach((e) => t.register(e)), e.manager.addHandler(this._gltfRegex, t), this.tiles = e, this._loader = t;
	}
	dispose() {
		this.tiles.manager.removeHandler(this._gltfRegex), this.tiles.manager.removeHandler(this._dracoRegex), this.autoDispose && (this.ktxLoader.dispose(), this.dracoLoader.dispose());
	}
}, Ar = /* @__PURE__ */ new P(), jr = class {
	constructor(e) {
		e = {
			up: "+z",
			recenter: !0,
			lat: null,
			lon: null,
			height: 0,
			azimuth: 0,
			elevation: 0,
			roll: 0,
			...e
		}, this.tiles = null, this.up = e.up.toLowerCase().replace(/\s+/, ""), this.lat = e.lat, this.lon = e.lon, this.height = e.height, this.azimuth = e.azimuth, this.elevation = e.elevation, this.roll = e.roll, this.recenter = e.recenter, this._callback = null;
	}
	init(e) {
		this.tiles = e, this._callback = () => {
			let { up: t, lat: n, lon: r, height: i, azimuth: a, elevation: o, roll: s, recenter: c } = this;
			if (n !== null && r !== null) this.transformLatLonHeightToOrigin(n, r, i, a, o, s);
			else {
				let { ellipsoid: n } = e, r = Math.min(...n.radius);
				if (e.getBoundingSphere(Ar), Ar.center.length() > r * .5) {
					let e = {};
					n.getPositionToCartographic(Ar.center, e), this.transformLatLonHeightToOrigin(e.lat, e.lon, e.height);
				} else {
					let n = e.group;
					switch (n.rotation.set(0, 0, 0), t) {
						case "x":
						case "+x":
							n.rotation.z = Math.PI / 2;
							break;
						case "-x":
							n.rotation.z = -Math.PI / 2;
							break;
						case "y":
						case "+y": break;
						case "-y":
							n.rotation.z = Math.PI;
							break;
						case "z":
						case "+z":
							n.rotation.x = -Math.PI / 2;
							break;
						case "-z":
							n.rotation.x = Math.PI / 2;
							break;
					}
					e.group.position.copy(Ar.center).applyEuler(n.rotation).multiplyScalar(-1);
				}
			}
			c || e.group.position.setScalar(0), e.removeEventListener("load-root-tileset", this._callback);
		}, e.addEventListener("load-root-tileset", this._callback), e.root && this._callback();
	}
	transformLatLonHeightToOrigin(e, t, n = 0, r = 0, i = 0, a = 0) {
		let { group: o, ellipsoid: s } = this.tiles;
		s.getObjectFrame(e, t, n, r, i, a, o.matrix, 2), o.matrix.invert().decompose(o.position, o.quaternion, o.scale), o.updateMatrixWorld();
	}
	dispose() {
		let { group: e } = this.tiles;
		e.position.setScalar(0), e.quaternion.identity(), e.scale.set(1, 1, 1), this.tiles.removeEventListener("load-root-tileset", this._callback);
	}
}, Mr = class {
	set delay(e) {
		this.deferCallbacks.delay = e;
	}
	get delay() {
		return this.deferCallbacks.delay;
	}
	set bytesTarget(e) {
		this.lruCache.minBytesSize = e;
	}
	get bytesTarget() {
		return this.lruCache.minBytesSize;
	}
	get estimatedGpuBytes() {
		return this.lruCache.cachedBytes;
	}
	constructor(e = {}) {
		let { delay: t = 0, bytesTarget: n = 0 } = e;
		this.name = "UNLOAD_TILES_PLUGIN", this.tiles = null, this.lruCache = new a(), this.deferCallbacks = new Nr(), this.delay = t, this.bytesTarget = n;
	}
	init(e) {
		this.tiles = e;
		let { lruCache: t, deferCallbacks: n } = this, r = (t) => {
			let n = t.engineData.scene;
			e.visibleTiles.has(t) || e.invokeOnePlugin((e) => e.unloadTileFromGPU && e.unloadTileFromGPU(n, t));
		};
		this._onUpdateBefore = () => {
			t.unloadPriorityCallback = e.lruCache.unloadPriorityCallback, t.minSize = Infinity, t.maxSize = Infinity, t.maxBytesSize = Infinity, t.unloadPercent = 1, t.autoMarkUnused = !1;
		}, this._onVisibilityChangeCallback = ({ tile: i, scene: a, visible: o }) => {
			o ? (t.add(i, r), t.setMemoryUsage(i, e.calculateBytesUsed(i, a) || 1), e.markTileUsed(i), n.cancel(i)) : n.run(i);
		}, this._onDisposeModel = ({ tile: e }) => {
			t.remove(e), n.cancel(e);
		}, n.callback = (e) => {
			t.markUnused(e), t.scheduleUnload();
		}, e.forEachLoadedModel((t, n) => {
			let r = e.visibleTiles.has(n);
			this._onVisibilityChangeCallback({
				tile: n,
				visible: r
			});
		}), e.addEventListener("tile-visibility-change", this._onVisibilityChangeCallback), e.addEventListener("update-before", this._onUpdateBefore), e.addEventListener("dispose-model", this._onDisposeModel);
	}
	unloadTileFromGPU(e, t) {
		e && e.traverse((e) => {
			if (e.material) {
				let t = e.material;
				t.dispose();
				for (let e in t) {
					let n = t[e];
					n && n.isTexture && n.dispose();
				}
			}
			e.geometry && e.geometry.dispose();
		});
	}
	dispose() {
		let { lruCache: e, tiles: t, deferCallbacks: n } = this;
		t.removeEventListener("tile-visibility-change", this._onVisibilityChangeCallback), t.removeEventListener("update-before", this._onUpdateBefore), t.removeEventListener("dispose-model", this._onDisposeModel), n.cancelAll(), e.minBytesSize = 0, e.minSize = 0, e.maxSize = 0, e.markAllUnused(), e.scheduleUnload();
	}
}, Nr = class {
	constructor(e = () => {}) {
		this.map = /* @__PURE__ */ new Map(), this.callback = e, this.delay = 0;
	}
	run(e) {
		let { map: t, delay: n } = this;
		if (t.has(e)) throw Error("DeferCallbackManager: Callback already initialized.");
		n === 0 ? this.callback(e) : t.set(e, setTimeout(() => {
			this.callback(e), t.delete(e);
		}, n));
	}
	cancel(e) {
		let { map: t } = this;
		t.has(e) && (clearTimeout(t.get(e)), t.delete(e));
	}
	cancelAll() {
		this.map.forEach((e, t) => {
			this.cancel(t);
		});
	}
}, { clamp: Pr } = j, Fr = class {
	constructor() {
		this.duration = 250, this.fadeCount = 0, this._lastTick = -1, this._fadeState = /* @__PURE__ */ new Map(), this.onFadeComplete = null, this.onFadeStart = null, this.onFadeSetComplete = null, this.onFadeSetStart = null;
	}
	deleteObject(e) {
		e && this.completeFade(e);
	}
	guaranteeState(e) {
		let t = this._fadeState;
		return t.has(e) ? !1 : (t.set(e, {
			fadeInTarget: 0,
			fadeOutTarget: 0,
			fadeIn: 0,
			fadeOut: 0
		}), !0);
	}
	completeFade(e) {
		let t = this._fadeState;
		if (!t.has(e)) return;
		let n = t.get(e).fadeOutTarget === 0;
		t.delete(e), this.fadeCount--, this.onFadeComplete && this.onFadeComplete(e, n), this.fadeCount === 0 && this.onFadeSetComplete && this.onFadeSetComplete();
	}
	completeAllFades() {
		this._fadeState.forEach((e, t) => {
			this.completeFade(t);
		});
	}
	forEachObject(e) {
		this._fadeState.forEach((t, n) => {
			e(n, t);
		});
	}
	fadeIn(e) {
		let t = this.guaranteeState(e), n = this._fadeState.get(e);
		n.fadeInTarget = 1, n.fadeOutTarget = 0, n.fadeOut = 0, t && (this.fadeCount++, this.fadeCount === 1 && this.onFadeSetStart && this.onFadeSetStart(), this.onFadeStart && this.onFadeStart(e));
	}
	fadeOut(e) {
		let t = this.guaranteeState(e), n = this._fadeState.get(e);
		n.fadeOutTarget = 1, t && (n.fadeInTarget = 1, n.fadeIn = 1, this.fadeCount++, this.fadeCount === 1 && this.onFadeSetStart && this.onFadeSetStart(), this.onFadeStart && this.onFadeStart(e));
	}
	isFading(e) {
		return this._fadeState.has(e);
	}
	isFadingOut(e) {
		let t = this._fadeState.get(e);
		return t && t.fadeOutTarget === 1;
	}
	update() {
		let e = window.performance.now();
		this._lastTick === -1 && (this._lastTick = e);
		let t = Pr((e - this._lastTick) / this.duration, 0, 1);
		this._lastTick = e, this._fadeState.forEach((e, n) => {
			let { fadeOutTarget: r, fadeInTarget: i } = e, { fadeOut: a, fadeIn: o } = e, s = Math.sign(i - o);
			o = Pr(o + s * t, 0, 1);
			let c = Math.sign(r - a);
			a = Pr(a + c * t, 0, 1), e.fadeIn = o, e.fadeOut = a, ((a === 1 || a === 0) && (o === 1 || o === 0) || a >= o) && this.completeFade(n);
		});
	}
}, Ir = Symbol("FADE_PARAMS");
function Lr(e, t) {
	if (e[Ir]) return e[Ir];
	let n = {
		fadeIn: { value: 0 },
		fadeOut: { value: 0 },
		fadeTexture: { value: null }
	};
	return e[Ir] = n, e.defines = {
		...e.defines || {},
		FEATURE_FADE: 0
	}, e.onBeforeCompile = (e) => {
		t && t(e), e.uniforms = {
			...e.uniforms,
			...n
		}, e.vertexShader = e.vertexShader.replace(/void\s+main\(\)\s+{/, (e) => `
					#ifdef USE_BATCHING_FRAG

					varying float vBatchId;

					#endif

					${e}

						#ifdef USE_BATCHING_FRAG

						// add 0.5 to the value to avoid floating error that may cause flickering
						vBatchId = getIndirectIndex( gl_DrawID ) + 0.5;

						#endif
				`), e.fragmentShader = e.fragmentShader.replace(/void main\(/, (e) => `
				#if FEATURE_FADE

				// adapted from https://www.shadertoy.com/view/Mlt3z8
				float bayerDither2x2( vec2 v ) {

					return mod( 3.0 * v.y + 2.0 * v.x, 4.0 );

				}

				float bayerDither4x4( vec2 v ) {

					vec2 P1 = mod( v, 2.0 );
					vec2 P2 = floor( 0.5 * mod( v, 4.0 ) );
					return 4.0 * bayerDither2x2( P1 ) + bayerDither2x2( P2 );

				}

				// the USE_BATCHING define is not available in fragment shaders
				#ifdef USE_BATCHING_FRAG

				// functions for reading the fade state of a given batch id
				uniform sampler2D fadeTexture;
				varying float vBatchId;
				vec2 getFadeValues( const in float i ) {

					int size = textureSize( fadeTexture, 0 ).x;
					int j = int( i );
					int x = j % size;
					int y = j / size;
					return texelFetch( fadeTexture, ivec2( x, y ), 0 ).rg;

				}

				#else

				uniform float fadeIn;
				uniform float fadeOut;

				#endif

				#endif

				${e}
			`).replace(/#include <dithering_fragment>/, (e) => `

				${e}

				#if FEATURE_FADE

				#ifdef USE_BATCHING_FRAG

				vec2 fadeValues = getFadeValues( vBatchId );
				float fadeIn = fadeValues.r;
				float fadeOut = fadeValues.g;

				#endif

				float bayerValue = bayerDither4x4( floor( mod( gl_FragCoord.xy, 4.0 ) ) );
				float bayerBins = 16.0;
				float dither = ( 0.5 + bayerValue ) / bayerBins;
				if ( dither >= fadeIn ) {

					discard;

				}

				if ( dither < fadeOut ) {

					discard;

				}

				#endif

			`);
	}, n;
}
//#endregion
//#region src/three/plugins/fade/FadeMaterialManager.js
var Rr = class {
	constructor() {
		this._fadeParams = /* @__PURE__ */ new WeakMap(), this.fading = 0;
	}
	setFade(e, t, n) {
		if (!e) return;
		let r = this._fadeParams;
		e.traverse((e) => {
			let i = e.material;
			if (i && r.has(i)) {
				let e = r.get(i);
				e.fadeIn.value = t, e.fadeOut.value = n;
				let a = Number(!(t === 0 || t === 1) || !(n === 0 || n === 1));
				i.defines.FEATURE_FADE !== a && (this.fading += a === 1 ? 1 : -1, i.defines.FEATURE_FADE = a, i.needsUpdate = !0);
			}
		});
	}
	prepareScene(e) {
		e.traverse((e) => {
			e.material && this.prepareMaterial(e.material);
		});
	}
	deleteScene(e) {
		if (!e) return;
		this.setFade(e, 1, 0);
		let t = this._fadeParams;
		e.traverse((e) => {
			let n = e.material;
			n && t.delete(n);
		});
	}
	prepareMaterial(e) {
		let t = this._fadeParams;
		t.has(e) || t.set(e, Lr(e, e.onBeforeCompile));
	}
}, zr = class {
	constructor(e, t = new le()) {
		this.other = e, this.material = t, this.visible = !0, this.parent = null, this._instanceInfo = [], this._visibilityChanged = !0;
		let n = new Proxy(this, {
			get(t, r) {
				if (r in t) return t[r];
				{
					let i = e[r];
					return i instanceof Function ? (...e) => (t.syncInstances(), i.call(n, ...e)) : e[r];
				}
			},
			set(t, n, r) {
				return n in t ? t[n] = r : e[n] = r, !0;
			},
			deleteProperty(t, n) {
				return n in t ? delete t[n] : delete e[n];
			}
		});
		return n;
	}
	syncInstances() {
		let e = this._instanceInfo, t = this.other._instanceInfo;
		for (; t.length > e.length;) {
			let n = e.length;
			e.push(new Proxy({ visible: !1 }, {
				get(e, r) {
					return r in e ? e[r] : t[n][r];
				},
				set(e, r, i) {
					return r in e ? e[r] = i : t[n][r] = i, !0;
				}
			}));
		}
	}
}, Br = class extends zr {
	constructor(...e) {
		super(...e);
		let t = this.material, n = Lr(t, t.onBeforeCompile);
		t.defines.FEATURE_FADE = 1, t.defines.USE_BATCHING_FRAG = 1, t.needsUpdate = !0, this.fadeTexture = null, this._fadeParams = n;
	}
	setFadeAt(e, t, n) {
		this._initFadeTexture(), this.fadeTexture.setValueAt(e, t * 255, n * 255);
	}
	_initFadeTexture() {
		let e = Math.sqrt(this._maxInstanceCount);
		e = Math.ceil(e);
		let t = e * e * 2, n = this.fadeTexture;
		if (!n || n.image.data.length !== t) {
			let r = new Vr(new Uint8Array(t), e, e, _e, De);
			if (n) {
				n.dispose();
				let e = n.image.data, t = this.fadeTexture.image.data, r = Math.min(e.length, t.length);
				t.set(new e.constructor(e.buffer, 0, r));
			}
			this.fadeTexture = r, this._fadeParams.fadeTexture.value = r, r.needsUpdate = !0;
		}
	}
	dispose() {
		this.fadeTexture && this.fadeTexture.dispose();
	}
}, Vr = class extends E {
	setValueAt(e, ...t) {
		let { data: n, width: r, height: i } = this.image, a = Math.floor(n.length / (r * i)), o = !1;
		for (let r = 0; r < a; r++) {
			let i = e * a + r, s = n[i], c = t[r] || 0;
			s !== c && (n[i] = c, o = !0);
		}
		o && (this.needsUpdate = !0);
	}
}, Hr = Symbol("HAS_POPPED_IN");
function Ur(e) {
	let t = e;
	for (; t;) {
		if (t.traversal.wasSetActive) return t.traversal.wasInFrustum;
		t = t.parent;
	}
	return !1;
}
var Wr = /* @__PURE__ */ new I(), Gr = /* @__PURE__ */ new I(), Kr = /* @__PURE__ */ new he(), qr = /* @__PURE__ */ new he(), Jr = /* @__PURE__ */ new I();
function Yr() {
	let e = this._fadeManager, t = this._fadeMaterialManager, n = this._fadingBefore, r = this._prevCameraTransforms, { tiles: i, maximumFadeOutTiles: a, batchedMesh: o } = this, { cameras: s } = i;
	e.update();
	let c = e.fadeCount;
	if (n !== 0 && c !== 0 && (i.dispatchEvent({ type: "fade-change" }), i.dispatchEvent({ type: "needs-render" })), a < this._fadingOutCount) {
		let t = !0;
		s.forEach((e) => {
			if (!r.has(e)) return;
			let n = e.matrixWorld, i = r.get(e);
			n.decompose(Gr, qr, Jr), i.decompose(Wr, Kr, Jr);
			let a = qr.angleTo(Kr), o = Gr.distanceTo(Wr);
			t &&= a > .25 || o > .1;
		}), t && e.completeAllFades();
	}
	if (s.forEach((e) => {
		r.get(e).copy(e.matrixWorld);
	}), e.forEachObject((e, { fadeIn: n, fadeOut: r }) => {
		let a = e.engineData.scene;
		i.markTileUsed(e), a && t.setFade(a, n, r), this.forEachBatchIds(e, (e, t, i) => {
			t.setFadeAt(e, n, r), t.setVisibleAt(e, !0), i.batchedMesh.setVisibleAt(e, !1);
		});
	}), o) {
		let e = i.getPluginByName("BATCHED_TILES_PLUGIN").batchedMesh.material;
		o.material.map = e.map;
	}
}
var Xr = class {
	get fadeDuration() {
		return this._fadeManager.duration;
	}
	set fadeDuration(e) {
		this._fadeManager.duration = Number(e);
	}
	get fadingTiles() {
		return this._fadeManager.fadeCount;
	}
	constructor(e) {
		e = {
			maximumFadeOutTiles: 50,
			fadeRootTiles: !1,
			fadeDuration: 250,
			...e
		}, this.name = "FADE_TILES_PLUGIN", this.priority = -2, this.tiles = null, this.batchedMesh = null, this._quickFadeTiles = /* @__PURE__ */ new Set(), this._fadeManager = new Fr(), this._fadeMaterialManager = new Rr(), this._prevCameraTransforms = null, this._fadingOutCount = 0, this.maximumFadeOutTiles = e.maximumFadeOutTiles, this.fadeRootTiles = e.fadeRootTiles, this.fadeDuration = e.fadeDuration;
	}
	init(e) {
		this._onLoadModel = ({ scene: e }) => {
			this._fadeMaterialManager.prepareScene(e);
		}, this._onDisposeModel = ({ tile: e, scene: t }) => {
			this.tiles.visibleTiles.has(e) && this._quickFadeTiles.add(e.parent), this._fadeManager.deleteObject(e), this._fadeMaterialManager.deleteScene(t);
		}, this._onAddCamera = ({ camera: e }) => {
			this._prevCameraTransforms.set(e, new M());
		}, this._onDeleteCamera = ({ camera: e }) => {
			this._prevCameraTransforms.delete(e);
		}, this._onTileVisibilityChange = ({ tile: e }) => {
			this.forEachBatchIds(e, (e, t, n) => {
				t.setFadeAt(e, 0, 0), t.setVisibleAt(e, !1), n.batchedMesh.setVisibleAt(e, !1);
			});
		}, this._onUpdateBefore = () => {
			this._fadingBefore = this._fadeManager.fadeCount;
		}, this._onUpdateAfter = () => {
			Yr.call(this);
		}, e.addEventListener("load-model", this._onLoadModel), e.addEventListener("dispose-model", this._onDisposeModel), e.addEventListener("add-camera", this._onAddCamera), e.addEventListener("delete-camera", this._onDeleteCamera), e.addEventListener("update-before", this._onUpdateBefore), e.addEventListener("update-after", this._onUpdateAfter), e.addEventListener("tile-visibility-change", this._onTileVisibilityChange);
		let t = this._fadeManager;
		t.onFadeSetStart = () => {
			e.dispatchEvent({ type: "fade-start" }), e.dispatchEvent({ type: "needs-render" });
		}, t.onFadeSetComplete = () => {
			e.dispatchEvent({ type: "fade-end" }), e.dispatchEvent({ type: "needs-render" });
		}, t.onFadeComplete = (t, n) => {
			this._fadeMaterialManager.setFade(t.engineData.scene, 0, 0), this.forEachBatchIds(t, (e, t, r) => {
				t.setFadeAt(e, 0, 0), t.setVisibleAt(e, !1), r.batchedMesh.setVisibleAt(e, n);
			}), n || (e.invokeOnePlugin((e) => e !== this && e.setTileVisible && e.setTileVisible(t, !1)), this._fadingOutCount--);
		};
		let n = /* @__PURE__ */ new Map();
		e.cameras.forEach((e) => {
			n.set(e, new M());
		}), e.forEachLoadedModel((e, t) => {
			this._onLoadModel({ scene: e });
		}), this.tiles = e, this._fadeManager = t, this._prevCameraTransforms = n;
	}
	initBatchedMesh() {
		let e = this.tiles.getPluginByName("BATCHED_TILES_PLUGIN")?.batchedMesh;
		if (e) {
			if (this.batchedMesh === null) {
				this._onBatchedMeshDispose = () => {
					this.batchedMesh.dispose(), this.batchedMesh.removeFromParent(), this.batchedMesh = null, e.removeEventListener("dispose", this._onBatchedMeshDispose);
				};
				let t = e.material.clone();
				t.onBeforeCompile = e.material.onBeforeCompile, this.batchedMesh = new Br(e, t), this.tiles.group.add(this.batchedMesh);
			}
		} else this.batchedMesh !== null && (this._onBatchedMeshDispose(), this._onBatchedMeshDispose = null);
	}
	setTileVisible(e, t) {
		let n = this._fadeManager, r = n.isFading(e);
		if (!Ur(e)) return r && n.completeFade(e), !1;
		if (n.isFadingOut(e) && this._fadingOutCount--, t ? e.internal.depthFromRenderedParent === 1 ? ((e[Hr] || this.fadeRootTiles) && this._fadeManager.fadeIn(e), e[Hr] = !0) : this._fadeManager.fadeIn(e) : (this._fadingOutCount++, n.fadeOut(e)), this._quickFadeTiles.has(e) && (this._fadeManager.completeFade(e), this._quickFadeTiles.delete(e)), r) return !0;
		let i = this._fadeManager.isFading(e);
		return !!(!t && i);
	}
	dispose() {
		let e = this.tiles;
		this._fadeManager.completeAllFades(), this.batchedMesh !== null && this._onBatchedMeshDispose(), e.removeEventListener("load-model", this._onLoadModel), e.removeEventListener("dispose-model", this._onDisposeModel), e.removeEventListener("add-camera", this._onAddCamera), e.removeEventListener("delete-camera", this._onDeleteCamera), e.removeEventListener("update-before", this._onUpdateBefore), e.removeEventListener("update-after", this._onUpdateAfter), e.removeEventListener("tile-visibility-change", this._onTileVisibilityChange), e.forEachLoadedModel((e, t) => {
			this._fadeManager.deleteObject(t);
		});
	}
	forEachBatchIds(e, t) {
		if (this.initBatchedMesh(), this.batchedMesh) {
			let n = this.tiles.getPluginByName("BATCHED_TILES_PLUGIN"), r = n.getTileBatchIds(e);
			r && r.forEach((e) => {
				t(e, this.batchedMesh, n);
			});
		}
	}
}, Zr = /* @__PURE__ */ new M(), Qr = /* @__PURE__ */ new I(), $r = /* @__PURE__ */ new I(), ei = class extends g {
	constructor(...e) {
		super(...e), this.resetDistance = 1e4, this._matricesTextureHandle = null, this._lastCameraPos = new M(), this._forceUpdate = !0, this._matrices = [];
	}
	setMatrixAt(e, t) {
		super.setMatrixAt(e, t), this._forceUpdate = !0;
		let n = this._matrices;
		for (; n.length <= e;) n.push(new M());
		n[e].copy(t);
	}
	setInstanceCount(...e) {
		super.setInstanceCount(...e);
		let t = this._matrices;
		for (; t.length > this.instanceCount;) t.pop();
	}
	onBeforeRender(e, t, n, r, i, a) {
		super.onBeforeRender(e, t, n, r, i, a), Qr.setFromMatrixPosition(n.matrixWorld), $r.setFromMatrixPosition(this._lastCameraPos);
		let o = this._matricesTexture, s = this._modelViewMatricesTexture;
		if ((!s || s.image.width !== o.image.width || s.image.height !== o.image.height) && (s && s.dispose(), s = o.clone(), s.source = new Se({
			...s.image,
			data: s.image.data.slice()
		}), this._modelViewMatricesTexture = s), this._forceUpdate || Qr.distanceTo($r) > this.resetDistance) {
			let e = this._matrices, t = s.image.data;
			for (let r = 0; r < this.maxInstanceCount; r++) {
				let i = e[r];
				i ? Zr.copy(i) : Zr.identity(), Zr.premultiply(this.matrixWorld).premultiply(n.matrixWorldInverse).toArray(t, r * 16);
			}
			s.needsUpdate = !0, this._lastCameraPos.copy(n.matrixWorld), this._forceUpdate = !1;
		}
		this._matricesTextureHandle = this._matricesTexture, this._matricesTexture = this._modelViewMatricesTexture, this.matrixWorld.copy(this._lastCameraPos);
	}
	onAfterRender() {
		this.updateMatrixWorld(), this._matricesTexture = this._matricesTextureHandle, this._matricesTextureHandle = null;
	}
	onAfterShadow(e, t, n, r, i, a) {
		this.onAfterRender(e, null, r, i, a);
	}
	dispose() {
		super.dispose(), this._modelViewMatricesTexture && this._modelViewMatricesTexture.dispose();
	}
}, Z = /* @__PURE__ */ new N(), ti = [], ni = class extends ei {
	constructor(...e) {
		super(...e), this.expandPercent = .25, this.maxInstanceExpansionSize = Infinity, this._freeGeometryIds = [];
	}
	findFreeId(e, t, n) {
		let r = !!this.geometry.index, i = Math.max(r ? e.index.count : -1, n), a = Math.max(e.attributes.position.count, t), o = -1, s = Infinity, c = this._freeGeometryIds;
		if (c.forEach((e, t) => {
			let { reservedIndexCount: n, reservedVertexCount: r } = this.getGeometryRangeAt(e);
			if (n >= i && r >= a) {
				let e = i - n + (a - r);
				e < s && (o = t, s = e);
			}
		}), o !== -1) {
			let e = c[o];
			return c.splice(o, 1), e;
		} else return -1;
	}
	addGeometry(e, t, n) {
		let r = !!this.geometry.index;
		n = Math.max(r ? e.index.count : -1, n), t = Math.max(e.attributes.position.count, t);
		let { expandPercent: i, _freeGeometryIds: a } = this, o = this.findFreeId(e, t, n);
		if (o !== -1) this.setGeometryAt(o, e);
		else {
			let r = () => {
				let e = this.unusedVertexCount < t, r = this.unusedIndexCount < n;
				return e || r;
			}, s = e.index, c = e.attributes.position;
			if (t = Math.max(t, c.count), n = Math.max(n, s ? s.count : 0), r() && (a.forEach((e) => this.deleteGeometry(e)), a.length = 0, this.optimize(), r())) {
				let e = this.geometry.index, r = this.geometry.attributes.position, a, o;
				if (e) {
					let t = Math.ceil(i * e.count);
					a = Math.max(t, n, s.count) + e.count;
				} else a = Math.max(this.unusedIndexCount, n);
				if (r) {
					let e = Math.ceil(i * r.count);
					o = Math.max(e, t, c.count) + r.count;
				} else o = Math.max(this.unusedVertexCount, t);
				this.setGeometrySize(o, a);
			}
			o = super.addGeometry(e, t, n);
		}
		return o;
	}
	addInstance(e) {
		if (this.maxInstanceCount === this.instanceCount) {
			let e = Math.ceil(this.maxInstanceCount * (1 + this.expandPercent));
			this.setInstanceCount(Math.min(e, this.maxInstanceExpansionSize));
		}
		return super.addInstance(e);
	}
	deleteInstance(e) {
		let t = this.getGeometryIdAt(e);
		return t !== -1 && this._freeGeometryIds.push(t), super.deleteInstance(e);
	}
	raycastInstance(e, t, n) {
		let r = this.geometry, i = this.getGeometryIdAt(e);
		Z.material = this.material, Z.geometry.index = r.index, Z.geometry.attributes = r.attributes;
		let a = this.getGeometryRangeAt(i);
		Z.geometry.setDrawRange(a.start, a.count), Z.geometry.boundingBox === null && (Z.geometry.boundingBox = new v()), Z.geometry.boundingSphere === null && (Z.geometry.boundingSphere = new P()), this.getMatrixAt(e, Z.matrixWorld).premultiply(this.matrixWorld), this.getBoundingBoxAt(i, Z.geometry.boundingBox), this.getBoundingSphereAt(i, Z.geometry.boundingSphere), Z.raycast(t, ti);
		for (let t = 0, r = ti.length; t < r; t++) {
			let r = ti[t];
			r.object = this, r.batchId = e, n.push(r);
		}
		ti.length = 0;
	}
};
//#endregion
//#region src/three/plugins/batched/utilities.js
function ri(e) {
	return e.r === 1 && e.g === 1 && e.b === 1;
}
function ii(e) {
	e.needsUpdate = !0, e.onBeforeCompile = (e) => {
		e.vertexShader = e.vertexShader.replace("#include <common>", "\n				#include <common>\n				varying float texture_index;\n				").replace("#include <uv_vertex>", "\n				#include <uv_vertex>\n				texture_index = getIndirectIndex( gl_DrawID );\n				"), e.fragmentShader = e.fragmentShader.replace("#include <map_pars_fragment>", "\n				#ifdef USE_MAP\n				precision highp sampler2DArray;\n				uniform sampler2DArray map;\n				varying float texture_index;\n				#endif\n				").replace("#include <map_fragment>", "\n				#ifdef USE_MAP\n					diffuseColor *= texture( map, vec3( vMapUv, texture_index ) );\n				#endif\n				");
	};
}
//#endregion
//#region src/three/plugins/batched/BatchedTilesPlugin.js
var ai = new Pe(new le()), oi = new E(new Uint8Array([
	255,
	255,
	255,
	255
]), 1, 1);
oi.needsUpdate = !0;
var si = class {
	constructor(e = {}) {
		if (parseInt(ge) < 170) throw Error("BatchedTilesPlugin: Three.js revision 170 or higher required.");
		e = {
			instanceCount: 500,
			vertexCount: 750,
			indexCount: 2e3,
			expandPercent: .25,
			maxInstanceCount: Infinity,
			discardOriginalContent: !0,
			textureSize: null,
			material: null,
			renderer: null,
			...e
		}, this.name = "BATCHED_TILES_PLUGIN", this.priority = -1;
		let t = e.renderer.getContext();
		this.instanceCount = e.instanceCount, this.vertexCount = e.vertexCount, this.indexCount = e.indexCount, this.material = e.material ? e.material.clone() : null, this.expandPercent = e.expandPercent, this.maxInstanceCount = Math.min(e.maxInstanceCount, t.getParameter(t.MAX_3D_TEXTURE_SIZE)), this.renderer = e.renderer, this.discardOriginalContent = e.discardOriginalContent, this.textureSize = e.textureSize, this.batchedMesh = null, this.arrayTarget = null, this.tiles = null, this._tileToInstanceId = /* @__PURE__ */ new Map();
	}
	init(e) {
		this.tiles = e;
	}
	initTextureArray(e) {
		if (this.arrayTarget !== null || e.material.map === null) return;
		let { instanceCount: t, renderer: n, textureSize: r, batchedMesh: i } = this, a = e.material.map, o = {
			colorSpace: a.colorSpace,
			wrapS: a.wrapS,
			wrapT: a.wrapT,
			wrapR: a.wrapS,
			magFilter: a.magFilter
		}, s = new ke(r || a.image.width, r || a.image.height, t);
		Object.assign(s.texture, o), n.initRenderTarget(s), i.material.map = s.texture, this.arrayTarget = s, this._tileToInstanceId.forEach((e) => {
			e.forEach((e) => {
				this.assignTextureToLayer(oi, e);
			});
		});
	}
	initBatchedMesh(e) {
		if (this.batchedMesh !== null) return;
		let { instanceCount: t, vertexCount: n, indexCount: r, tiles: i } = this, a = this.material ? this.material : new e.material.constructor(), o = new ni(t, t * n, t * r, a);
		o.name = "BatchTilesPlugin", o.frustumCulled = !1, i.group.add(o), o.updateMatrixWorld(), ii(o.material), this.batchedMesh = o;
	}
	setTileVisible(e, t) {
		let n = e.engineData.scene;
		if (t && this.addSceneToBatchedMesh(n, e), this._tileToInstanceId.has(e)) {
			this._tileToInstanceId.get(e).forEach((e) => {
				this.batchedMesh.setVisibleAt(e, t);
			});
			let r = this.tiles;
			return t ? r.visibleTiles.add(e) : r.visibleTiles.delete(e), r.dispatchEvent({
				type: "tile-visibility-change",
				scene: n,
				tile: e,
				visible: t
			}), !0;
		}
		return !1;
	}
	disposeTile(e) {
		this.removeSceneFromBatchedMesh(e);
	}
	unloadTileFromGPU(e, t) {
		return !this.discardOriginalContent && this._tileToInstanceId.has(t) ? (this.removeSceneFromBatchedMesh(t), !0) : !1;
	}
	assignTextureToLayer(e, t) {
		if (!this.arrayTarget) return;
		this.expandArrayTargetIfNeeded();
		let { renderer: n } = this, r = n.getRenderTarget();
		n.setRenderTarget(this.arrayTarget, t), ai.material.map = e, ai.render(n), n.setRenderTarget(r), ai.material.map = null, e.dispose();
	}
	expandArrayTargetIfNeeded() {
		let { batchedMesh: e, arrayTarget: t, renderer: n } = this, r = Math.min(e.maxInstanceCount, this.maxInstanceCount);
		if (r > t.depth) {
			let i = {
				colorSpace: t.texture.colorSpace,
				wrapS: t.texture.wrapS,
				wrapT: t.texture.wrapT,
				generateMipmaps: t.texture.generateMipmaps,
				minFilter: t.texture.minFilter,
				magFilter: t.texture.magFilter
			}, a = new ke(t.width, t.height, r);
			Object.assign(a.texture, i), n.initRenderTarget(a), n.copyTextureToTexture(t.texture, a.texture), t.dispose(), e.material.map = a.texture, this.arrayTarget = a;
		}
	}
	removeSceneFromBatchedMesh(e) {
		if (this._tileToInstanceId.has(e)) {
			let t = this._tileToInstanceId.get(e);
			this._tileToInstanceId.delete(e), t.forEach((e) => {
				this.batchedMesh.deleteInstance(e);
			});
		}
	}
	addSceneToBatchedMesh(e, t) {
		if (this._tileToInstanceId.has(t)) return;
		let n = [];
		e.traverse((e) => {
			e.isMesh && n.push(e);
		});
		let r = !0;
		n.forEach((e) => {
			if (this.batchedMesh && r) {
				let t = e.geometry.attributes, n = this.batchedMesh.geometry.attributes;
				for (let e in n) if (!(e in t)) {
					r = !1;
					return;
				}
			}
		});
		let i = !this.batchedMesh || this.batchedMesh.instanceCount + n.length <= this.maxInstanceCount;
		if (r && i) {
			e.updateMatrixWorld();
			let r = [];
			this._tileToInstanceId.set(t, r), n.forEach((e) => {
				this.initBatchedMesh(e), this.initTextureArray(e);
				let { geometry: t, material: n } = e, { batchedMesh: i, expandPercent: a } = this;
				i.expandPercent = a;
				let o = i.addGeometry(t, this.vertexCount, this.indexCount), s = i.addInstance(o);
				r.push(s), i.setMatrixAt(s, e.matrixWorld), i.setVisibleAt(s, !1), ri(n.color) || (n.color.setHSL(Math.random(), .5, .5), i.setColorAt(s, n.color));
				let c = n.map;
				c ? this.assignTextureToLayer(c, s) : this.assignTextureToLayer(oi, s);
			}), this.discardOriginalContent && (t.engineData.textures.forEach((e) => {
				e.image instanceof ImageBitmap && e.image.close();
			}), t.engineData.scene = null, t.engineData.materials = [], t.engineData.geometries = [], t.engineData.textures = []);
		}
	}
	raycastTile(e, t, n, r) {
		return this._tileToInstanceId.has(e) ? (this._tileToInstanceId.get(e).forEach((e) => {
			this.batchedMesh.raycastInstance(e, n, r);
		}), !0) : !1;
	}
	dispose() {
		let { arrayTarget: e, batchedMesh: t } = this;
		e && e.dispose(), t && (t.material.dispose(), t.geometry.dispose(), t.dispose(), t.removeFromParent());
	}
	getTileBatchIds(e) {
		return this._tileToInstanceId.get(e);
	}
}, ci = /* @__PURE__ */ new P(), li = /* @__PURE__ */ new I(), ui = /* @__PURE__ */ new M(), di = /* @__PURE__ */ new M(), fi = /* @__PURE__ */ new ye(), pi = /* @__PURE__ */ new le({ side: O }), mi = /* @__PURE__ */ new v(), hi = 1e5;
function gi(e, t) {
	return e.isBufferGeometry ? (e.boundingSphere === null && e.computeBoundingSphere(), t.copy(e.boundingSphere)) : (mi.setFromObject(e), mi.getBoundingSphere(t), t);
}
var _i = class {
	constructor() {
		this.name = "TILE_FLATTENING_PLUGIN", this.priority = -100, this.tiles = null, this.shapes = /* @__PURE__ */ new Map(), this.positionsMap = /* @__PURE__ */ new Map(), this.positionsUpdated = /* @__PURE__ */ new Set(), this.needsUpdate = !1;
	}
	init(e) {
		this.tiles = e, this.needsUpdate = !0, this._updateBeforeCallback = () => {
			this.needsUpdate &&= (this._updateTiles(), !1);
		}, this._disposeModelCallback = ({ tile: e }) => {
			this.positionsMap.delete(e), this.positionsUpdated.delete(e);
		}, e.addEventListener("update-before", this._updateBeforeCallback), e.addEventListener("dispose-model", this._disposeModelCallback);
	}
	setTileActive(e, t) {
		t && !this.positionsUpdated.has(e) && this._updateTile(e);
	}
	_updateTile(e) {
		let { positionsUpdated: t, positionsMap: n, shapes: r, tiles: i } = this;
		t.add(e);
		let a = e.engineData.scene;
		if (n.has(e)) {
			let t = n.get(e);
			a.traverse((e) => {
				if (e.geometry) {
					let n = t.get(e.geometry);
					n && (e.geometry.attributes.position.array.set(n), e.geometry.attributes.position.needsUpdate = !0);
				}
			});
		} else {
			let t = /* @__PURE__ */ new Map();
			n.set(e, t), a.traverse((e) => {
				e.geometry && t.set(e.geometry, e.geometry.attributes.position.array.slice());
			});
		}
		a.updateMatrixWorld(!0), a.traverse((e) => {
			let { geometry: t } = e;
			t && (ui.copy(e.matrixWorld), a.parent !== null && ui.premultiply(i.group.matrixWorldInverse), di.copy(ui).invert(), gi(t, ci).applyMatrix4(ui), r.forEach(({ shape: e, direction: n, sphere: r, thresholdMode: i, threshold: a, flattenRange: o }) => {
				li.subVectors(ci.center, r.center), li.addScaledVector(n, -n.dot(li));
				let s = (ci.radius + r.radius) ** 2;
				if (li.lengthSq() > s) return;
				let { position: c } = t.attributes, { ray: l } = fi;
				l.direction.copy(n).multiplyScalar(-1);
				for (let t = 0, r = c.count; t < r; t++) {
					l.origin.fromBufferAttribute(c, t).applyMatrix4(ui).addScaledVector(n, hi), fi.far = hi;
					let r = fi.intersectObject(e)[0];
					if (r) {
						let e = (hi - r.distance) / a, n = e >= 1;
						(!n || n && i === "flatten") && (e = Math.min(e, 1), r.point.addScaledVector(l.direction, j.mapLinear(e, 0, 1, -o, 0)), r.point.applyMatrix4(di), c.setXYZ(t, ...r.point));
					}
				}
			}));
		}), this.tiles.dispatchEvent({ type: "needs-render" });
	}
	_updateTiles() {
		this.positionsUpdated.clear(), this.tiles.activeTiles.forEach((e) => this._updateTile(e));
	}
	hasShape(e) {
		return this.shapes.has(e);
	}
	addShape(e, t = new I(0, 0, -1), n = {}) {
		if (this.hasShape(e)) throw Error("TileFlatteningPlugin: Shape is already used.");
		typeof n == "number" && (console.warn("TileFlatteningPlugin: \"addShape\" function signature has changed. Please use an options object, instead."), n = { threshold: n }), this.needsUpdate = !0;
		let r = e.clone();
		r.updateMatrixWorld(!0), r.traverse((e) => {
			e.material &&= pi;
		});
		let i = gi(r, new P());
		this.shapes.set(e, {
			shape: r,
			direction: t.clone(),
			sphere: i,
			thresholdMode: "none",
			threshold: Infinity,
			flattenRange: 0,
			...n
		});
	}
	updateShape(e) {
		if (!this.hasShape(e)) throw Error("TileFlatteningPlugin: Shape is not present.");
		let { direction: t, threshold: n, thresholdMode: r, flattenRange: i } = this.shapes.get(e);
		this.deleteShape(e), this.addShape(e, t, {
			threshold: n,
			thresholdMode: r,
			flattenRange: i
		});
	}
	deleteShape(e) {
		return this.needsUpdate = !0, this.shapes.delete(e);
	}
	clearShapes() {
		this.shapes.size !== 0 && (this.needsUpdate = !0, this.shapes.clear());
	}
	dispose() {
		this.tiles.removeEventListener("before-update", this._updateBeforeCallback), this.tiles.removeEventListener("dispose-model", this._disposeModelCallback), this.positionsMap.forEach((e) => {
			e.forEach((e, t) => {
				let { position: n } = t.attributes;
				n.array.set(e), n.needsUpdate = !0;
			});
		});
	}
}, vi = class {
	constructor(e = {}) {
		let { regions: t = [] } = e;
		this.name = "LOAD_REGION_PLUGIN", this.regions = [], this.tiles = null, t.forEach((e) => this.addRegion(e));
	}
	init(e) {
		this.tiles = e;
	}
	addRegion(e) {
		this.regions.indexOf(e) === -1 && this.regions.push(e);
	}
	removeRegion(e) {
		let t = this.regions.indexOf(e);
		t !== -1 && this.regions.splice(t, 1);
	}
	hasRegion(e) {
		return this.regions.indexOf(e) !== -1;
	}
	clearRegions() {
		this.regions = [];
	}
	calculateTileViewError(e, t) {
		let n = e.engineData.boundingVolume, { regions: r, tiles: i } = this, a = !1, o = null, s = 0, c = Infinity;
		for (let t of r) {
			let r = t.intersectsTile(n, e, i);
			a ||= r, r && (s = Math.max(t.calculateError(e, i), s), c = Math.min(t.calculateDistance(n, e, i), c)), t.mask && (o ||= r);
		}
		return t.inView = a && o !== !1, t.error = s, t.distance = c, t.inView || o !== null;
	}
	dispose() {
		this.regions = [];
	}
}, yi = class {
	constructor(e = {}) {
		let { errorTarget: t = 10, mask: n = !1 } = e;
		this.errorTarget = t, this.mask = n;
	}
	intersectsTile(e, t, n) {
		return !1;
	}
	calculateDistance(e, t, n) {
		return Infinity;
	}
	calculateError(e, t) {
		return e.geometricError - this.errorTarget + t.errorTarget;
	}
}, bi = class extends yi {
	constructor(e = {}) {
		let { sphere: t = new P() } = e;
		super(e), this.sphere = t.clone();
	}
	intersectsTile(e) {
		return e.intersectsSphere(this.sphere);
	}
}, xi = class extends yi {
	constructor(e = {}) {
		let { ray: t = new ve() } = e;
		super(e), this.ray = t.clone();
	}
	intersectsTile(e) {
		return e.intersectsRay(this.ray);
	}
}, Si = class extends yi {
	constructor(e = {}) {
		let { obb: t = new s() } = e;
		super(e), this.obb = t.clone(), this.obb.update();
	}
	intersectsTile(e) {
		return e.intersectsOBB(this.obb);
	}
}, Q = /* @__PURE__ */ new I(), Ci = [
	"x",
	"y",
	"z"
], wi = class extends ie {
	constructor(e, t = 16776960, n = 40) {
		let r = new S(), i = [];
		for (let e = 0; e < 3; e++) {
			let t = Ci[e], r = Ci[(e + 1) % 3];
			Q.set(0, 0, 0);
			for (let e = 0; e < n; e++) {
				let a;
				a = 2 * Math.PI * e / (n - 1), Q[t] = Math.sin(a), Q[r] = Math.cos(a), i.push(Q.x, Q.y, Q.z), a = 2 * Math.PI * (e + 1) / (n - 1), Q[t] = Math.sin(a), Q[r] = Math.cos(a), i.push(Q.x, Q.y, Q.z);
			}
		}
		r.setAttribute("position", new x(new Float32Array(i), 3)), r.computeBoundingSphere(), super(r, new re({
			color: t,
			toneMapped: !1
		})), this.sphere = e, this.type = "SphereHelper";
	}
	updateMatrixWorld(e) {
		let t = this.sphere;
		this.position.copy(t.center), this.scale.setScalar(t.radius), super.updateMatrixWorld(e);
	}
}, Ti = /* @__PURE__ */ new I(), Ei = /* @__PURE__ */ new I(), $ = /* @__PURE__ */ new I(), Di = /* @__PURE__ */ new I(), Oi = /* @__PURE__ */ new I();
function ki(e) {
	e = e.toNonIndexed();
	let { groups: t } = e, { position: n, normal: r } = e.attributes, i = [], a = [];
	for (let e of t) {
		let { start: t, count: o } = e;
		for (let e = t, s = t + o; e < s; e++) Di.fromBufferAttribute(n, e), Oi.fromBufferAttribute(r, e), a.push(...Di), i.push(...Oi);
	}
	let o = new S();
	return o.setAttribute("position", new x(new Float32Array(a), 3)), o.setAttribute("normal", new x(new Float32Array(i), 3)), o;
}
function Ai(e, { computeNormals: t = !1 } = {}) {
	let { latStart: n = -Math.PI / 2, latEnd: r = Math.PI / 2, lonStart: i = 0, lonEnd: a = 2 * Math.PI, heightStart: o = 0, heightEnd: s = 0 } = e, c = new b(1, 1, 1, 32, 32), { normal: l, position: u } = c.attributes, d = u.clone();
	for (let t = 0, c = u.count; t < c; t++) {
		$.fromBufferAttribute(u, t);
		let c = j.mapLinear($.x, -.5, .5, n, r), l = j.mapLinear($.y, -.5, .5, i, a), d = o;
		e.getCartographicToNormal(c, l, Ti), $.z < 0 && (d = s), e.getCartographicToPosition(c, l, d, $), u.setXYZ(t, ...$);
	}
	t && c.computeVertexNormals();
	for (let t = 0, o = d.count; t < o; t++) {
		$.fromBufferAttribute(d, t);
		let o = j.mapLinear($.x, -.5, .5, n, r), s = j.mapLinear($.y, -.5, .5, i, a);
		Ti.fromBufferAttribute(l, t), e.getCartographicToNormal(o, s, Ei), Math.abs(Ti.dot(Ei)) > .1 && ($.z > 0 && Ei.multiplyScalar(-1), l.setXYZ(t, ...Ei));
	}
	return c;
}
var ji = class extends ie {
	constructor(e = new d(), t = 16776960) {
		super(), this.ellipsoidRegion = e, this.material.color.set(t), this.update();
	}
	update() {
		let e = Ai(this.ellipsoidRegion);
		this.geometry.dispose(), this.geometry = new k(e, 80);
	}
	dispose() {
		this.geometry.dispose(), this.material.dispose();
	}
}, Mi = class extends N {
	constructor(e = new d(), t = 16776960) {
		super(), this.ellipsoidRegion = e, this.material.color.set(t), this.update();
	}
	update() {
		this.geometry.dispose();
		let e = Ai(this.ellipsoidRegion, { computeNormals: !0 }), { lonStart: t, lonEnd: n } = this;
		n - t >= 2 * Math.PI ? (e.groups.splice(2, 2), this.geometry = ki(e)) : this.geometry = e;
	}
	dispose() {
		this.geometry.dispose(), this.material.dispose();
	}
}, Ni = Symbol("ORIGINAL_MATERIAL"), Pi = Symbol("HAS_RANDOM_COLOR"), Fi = Symbol("HAS_RANDOM_NODE_COLOR"), Ii = Symbol("LOAD_TIME"), Li = Symbol("PARENT_BOUND_REF_COUNT"), Ri = /* @__PURE__ */ new P(), zi = () => {}, Bi = {};
function Vi(e) {
	if (!Bi[e]) {
		let t = Math.random(), n = .5 + Math.random() * .5, r = .375 + Math.random() * .25;
		Bi[e] = new w().setHSL(t, n, r);
	}
	return Bi[e];
}
var Hi = 0, Ui = 1, Wi = 2, Gi = 3, Ki = 4, qi = 5, Ji = 6, Yi = 7, Xi = 8, Zi = 9, Qi = 10, $i = 11, ea = Object.freeze({
	NONE: Hi,
	SCREEN_ERROR: Ui,
	GEOMETRIC_ERROR: Wi,
	DISTANCE: Gi,
	DEPTH: Ki,
	RELATIVE_DEPTH: qi,
	IS_LEAF: Ji,
	RANDOM_COLOR: Yi,
	RANDOM_NODE_COLOR: Xi,
	CUSTOM_COLOR: Zi,
	LOAD_ORDER: Qi,
	INDEXED_COLOR: $i
}), ta = class {
	static get ColorModes() {
		return ea;
	}
	get wireframe() {
		return this._wireframe;
	}
	set wireframe(e) {
		e !== this._wireframe && (this._wireframe = e, this.materialsNeedUpdate = !0);
	}
	get unlit() {
		return this._unlit;
	}
	set unlit(e) {
		e !== this._unlit && (this._unlit = e, this.materialsNeedUpdate = !0);
	}
	get colorMode() {
		return this._colorMode;
	}
	set colorMode(e) {
		e !== this._colorMode && (this._colorMode = e, this.materialsNeedUpdate = !0);
	}
	get boundsColorMode() {
		return this._boundsColorMode;
	}
	set boundsColorMode(e) {
		e !== this._boundsColorMode && (this._boundsColorMode = e, this.materialsNeedUpdate = !0);
	}
	get enabled() {
		return this._enabled;
	}
	set enabled(e) {
		e !== this._enabled && this.tiles !== null && (this._enabled = e, e ? this.init(this.tiles) : this.dispose());
	}
	get displayParentBounds() {
		return this._displayParentBounds;
	}
	set displayParentBounds(e) {
		this._displayParentBounds !== e && (this._displayParentBounds = e, e ? this.tiles.traverse((e) => {
			e.traversal.visible && this._onTileVisibilityChange(e, !0);
		}) : this.tiles.traverse((e) => {
			e[Li] = null, this._onTileVisibilityChange(e, e.traversal.visible);
		}));
	}
	constructor(e) {
		e = {
			displayParentBounds: !1,
			displayBoxBounds: !1,
			displaySphereBounds: !1,
			displayRegionBounds: !1,
			colorMode: Hi,
			boundsColorMode: Hi,
			maxDebugDepth: -1,
			maxDebugDistance: -1,
			maxDebugError: -1,
			customColorCallback: null,
			unlit: !1,
			enabled: !0,
			...e
		}, this.name = "DEBUG_TILES_PLUGIN", this.tiles = null, this._colorMode = null, this._boundsColorMode = null, this._unlit = null, this._wireframe = null, this.materialsNeedUpdate = !1, this.extremeDebugDepth = -1, this.extremeDebugError = -1, this.boxGroup = null, this.sphereGroup = null, this.regionGroup = null, this._enabled = e.enabled, this._displayParentBounds = e.displayParentBounds, this.displayBoxBounds = e.displayBoxBounds, this.displaySphereBounds = e.displaySphereBounds, this.displayRegionBounds = e.displayRegionBounds, this.colorMode = e.colorMode, this.boundsColorMode = e.boundsColorMode, this.maxDebugDepth = e.maxDebugDepth, this.maxDebugDistance = e.maxDebugDistance, this.maxDebugError = e.maxDebugError, this.customColorCallback = e.customColorCallback, this.unlit = e.unlit, this.wireframe = e.wireframe, this.getDebugColor = (e, t) => {
			t.setRGB(e, e, e);
		};
	}
	init(e) {
		if (this.tiles = e, !this.enabled) return;
		let t = e.group;
		this.boxGroup = new A(), this.boxGroup.name = "DebugTilesRenderer.boxGroup", t.add(this.boxGroup), this.boxGroup.updateMatrixWorld(), this.sphereGroup = new A(), this.sphereGroup.name = "DebugTilesRenderer.sphereGroup", t.add(this.sphereGroup), this.sphereGroup.updateMatrixWorld(), this.regionGroup = new A(), this.regionGroup.name = "DebugTilesRenderer.regionGroup", t.add(this.regionGroup), this.regionGroup.updateMatrixWorld(), this._onLoadTilesetCB = () => {
			this._initExtremes();
		}, this._onLoadModelCB = ({ scene: e, tile: t }) => {
			this._onLoadModel(e, t);
		}, this._onDisposeModelCB = ({ tile: e }) => {
			this._onDisposeModel(e);
		}, this._onUpdateAfterCB = () => {
			this.update();
		}, this._onTileVisibilityChangeCB = ({ scene: e, tile: t, visible: n }) => {
			this._onTileVisibilityChange(t, n);
		}, e.addEventListener("load-tileset", this._onLoadTilesetCB), e.addEventListener("load-model", this._onLoadModelCB), e.addEventListener("dispose-model", this._onDisposeModelCB), e.addEventListener("update-after", this._onUpdateAfterCB), e.addEventListener("tile-visibility-change", this._onTileVisibilityChangeCB), this._initExtremes(), e.traverse((e) => {
			e.engineData.scene && this._onLoadModel(e.engineData.scene, e);
		}), e.visibleTiles.forEach((e) => {
			this._onTileVisibilityChange(e, !0);
		});
	}
	getTileFromObject3D(e) {
		let t = null;
		return this.tiles.activeTiles.forEach((n) => {
			if (t) return;
			let r = n.engineData.scene;
			r && r.traverse((r) => {
				r === e && (t = n);
			});
		}), t;
	}
	setEmptyTileVisible(e, t) {
		this._onTileVisibilityChange(e, t);
	}
	_initExtremes() {
		if (!(this.tiles && this.tiles.root)) return;
		let e = -1, t = -1;
		this.tiles.traverse(null, (n, r, i) => {
			e = Math.max(e, i), t = Math.max(t, n.geometricError);
		}, !1), this.extremeDebugDepth = e, this.extremeDebugError = t;
	}
	update() {
		let { tiles: e, colorMode: t, boundsColorMode: n } = this;
		if (!e.root) return;
		this.materialsNeedUpdate &&= (e.forEachLoadedModel((e) => {
			this._updateMaterial(e);
		}), !1), this.boxGroup.visible = this.displayBoxBounds, this.sphereGroup.visible = this.displaySphereBounds, this.regionGroup.visible = this.displayRegionBounds;
		let r = -1;
		r = this.maxDebugDepth === -1 ? this.extremeDebugDepth : this.maxDebugDepth;
		let i = -1;
		i = this.maxDebugError === -1 ? this.extremeDebugError : this.maxDebugError;
		let a = -1;
		this.maxDebugDistance === -1 ? (e.getBoundingSphere(Ri), a = Ri.radius) : a = this.maxDebugDistance;
		let { errorTarget: o, visibleTiles: s } = e, c;
		(t === Qi || n === Qi) && (c = Array.from(s).sort((e, t) => e[Ii] - t[Ii]));
		let l = (e, t, n, s, l, u) => {
			switch (e !== Yi && delete n.material[Pi], e !== Xi && delete n.material[Fi], e) {
				case Ki: {
					let e = t.internal.depth / r;
					this.getDebugColor(e, n.material.color);
					break;
				}
				case qi: {
					let e = t.internal.depthFromRenderedParent / r;
					this.getDebugColor(e, n.material.color);
					break;
				}
				case Ui: {
					let e = t.traversal.error / o;
					e > 1 ? n.material.color.setRGB(1, 0, 0) : this.getDebugColor(e, n.material.color);
					break;
				}
				case Wi: {
					let e = Math.min(t.geometricError / i, 1);
					this.getDebugColor(e, n.material.color);
					break;
				}
				case Gi: {
					let e = Math.min(t.traversal.distanceFromCamera / a, 1);
					this.getDebugColor(e, n.material.color);
					break;
				}
				case Ji:
					!t.children || t.children.length === 0 ? this.getDebugColor(1, n.material.color) : this.getDebugColor(0, n.material.color);
					break;
				case Xi:
					n.material[Fi] || (n.material.color.setHSL(s, l, u), n.material[Fi] = !0);
					break;
				case Yi:
					n.material[Pi] || (n.material.color.setHSL(s, l, u), n.material[Pi] = !0);
					break;
				case Zi:
					this.customColorCallback ? this.customColorCallback(t, n) : console.warn("DebugTilesRenderer: customColorCallback not defined");
					break;
				case Qi: {
					let e = c.indexOf(t);
					this.getDebugColor(e / (c.length - 1), n.material.color);
					break;
				}
				case $i:
					n.material.color.copy(Vi(t.internal.depth)), delete n.material[Pi], delete n.material[Fi];
					break;
			}
		};
		s.forEach((e) => {
			let n = e.engineData.scene, r, i, a;
			t === Yi && (r = Math.random(), i = .5 + Math.random() * .5, a = .375 + Math.random() * .25), n.traverse((n) => {
				t === Xi && (r = Math.random(), i = .5 + Math.random() * .5, a = .375 + Math.random() * .25), n.material && l(t, e, n, r, i, a);
			});
		});
		let u = n === Hi ? $i : n, d = [
			this.boxGroup,
			this.sphereGroup,
			this.regionGroup
		];
		for (let e of d) for (let t of e.children) {
			let e = t.userData.tile, n, r, i;
			u === Yi && (n = Math.random(), r = .5 + Math.random() * .5, i = .375 + Math.random() * .25), t.traverse((t) => {
				u === Xi && (n = Math.random(), r = .5 + Math.random() * .5, i = .375 + Math.random() * .25), t.material && l(u, e, t, n, r, i);
			});
		}
	}
	_onTileVisibilityChange(e, t) {
		this.displayParentBounds ? n(e, (n) => {
			n[Li] ?? (n[Li] = 0), t ? n[Li]++ : n[Li] > 0 && n[Li]--;
			let r = n === e && t || this.displayParentBounds && n[Li] > 0;
			this._updateBoundHelper(n, r);
		}) : this._updateBoundHelper(e, t);
	}
	_createBoundHelper(e) {
		let t = this.tiles, n = e.engineData, { sphere: r, obb: i, region: a } = n.boundingVolume;
		if (i) {
			let r = new A();
			r.name = "DebugTilesRenderer.boxHelperGroup", r.matrix.copy(i.transform), r.matrixAutoUpdate = !1, r.userData.tile = e, n.boxHelperGroup = r;
			let a = new y(i.box, Vi(e.internal.depth));
			a.raycast = zi, r.add(a);
			let o = new N(new b(), new le({
				color: Vi(e.internal.depth),
				transparent: !0,
				depthWrite: !1,
				opacity: .05,
				side: O
			}));
			i.box.getSize(o.scale), o.raycast = zi, r.add(o), t.visibleTiles.has(e) && this.displayBoxBounds && (this.boxGroup.add(r), r.updateMatrixWorld(!0));
		}
		if (r) {
			let i = new wi(r, Vi(e.internal.depth));
			i.raycast = zi, i.userData.tile = e;
			let a = new N(new Ce(1), new le({
				color: Vi(e.internal.depth),
				transparent: !0,
				depthWrite: !1,
				opacity: .05,
				side: O
			}));
			a.raycast = zi, i.add(a), n.sphereHelper = i, t.visibleTiles.has(e) && this.displaySphereBounds && (this.sphereGroup.add(i), i.updateMatrixWorld(!0));
		}
		if (a) {
			let r = new ji(a, Vi(e.internal.depth));
			r.raycast = zi, r.userData.tile = e;
			let i = new Mi(a, Vi(e.internal.depth));
			i.material.transparent = !0, i.material.depthWrite = !1, i.material.opacity = .05, i.material.side = O, i.raycast = zi, r.add(i);
			let o = new P();
			a.getBoundingSphere(o), r.position.copy(o.center), o.center.multiplyScalar(-1), r.geometry.translate(...o.center), i.geometry.translate(...o.center), n.regionHelper = r, t.visibleTiles.has(e) && this.displayRegionBounds && (this.regionGroup.add(r), r.updateMatrixWorld(!0));
		}
	}
	_updateHelperMaterials(e, t) {
		t.traverse((t) => {
			let { material: n } = t;
			if (!n) return;
			e.traversal.visible || !this.displayParentBounds ? n.opacity = t.isMesh ? .05 : 1 : n.opacity = t.isMesh ? .01 : .2;
			let r = n.transparent;
			n.transparent = n.opacity < 1, n.transparent !== r && (n.needsUpdate = !0);
		});
	}
	_updateBoundHelper(e, t) {
		let n = e.engineData;
		if (!n) return;
		let r = this.sphereGroup, i = this.boxGroup, a = this.regionGroup;
		t && n.boxHelperGroup == null && n.sphereHelper == null && n.regionHelper == null && this._createBoundHelper(e);
		let o = n.boxHelperGroup, s = n.sphereHelper, c = n.regionHelper;
		t ? (o && (i.add(o), o.updateMatrixWorld(!0), this._updateHelperMaterials(e, o)), s && (r.add(s), s.updateMatrixWorld(!0), this._updateHelperMaterials(e, s)), c && (a.add(c), c.updateMatrixWorld(!0), this._updateHelperMaterials(e, c))) : (o && i.remove(o), s && r.remove(s), c && a.remove(c));
	}
	_updateMaterial(e) {
		let { colorMode: t, unlit: n, wireframe: r } = this;
		e.traverse((e) => {
			if (!e.material) return;
			let i = e.material, a = e[Ni];
			if (i !== a && i.dispose(), t !== Hi || n) {
				if (e.isPoints) {
					let t = new me();
					t.size = a.size, t.sizeAttenuation = a.sizeAttenuation, e.material = t;
				} else n ? e.material = new le({ wireframe: r }) : (e.material = new ue({ wireframe: r }), e.material.flatShading = !0);
				t === Hi && (e.material.map = a.map, e.material.color.set(a.color));
			} else e.material = a;
		});
	}
	_onLoadModel(e, t) {
		t[Ii] = performance.now(), e.traverse((e) => {
			let t = e.material;
			t && (e[Ni] = t);
		}), this._updateMaterial(e);
	}
	_onDisposeModel(e) {
		let t = e.engineData;
		t?.boxHelperGroup && (t.boxHelperGroup.traverse((e) => {
			e.geometry && (e.geometry.dispose(), e.material.dispose());
		}), delete t.boxHelperGroup), t?.sphereHelper && (t.sphereHelper.traverse((e) => {
			e.geometry && (e.geometry.dispose(), e.material.dispose());
		}), delete t.sphereHelper), t?.regionHelper && (t.regionHelper.traverse((e) => {
			e.geometry && (e.geometry.dispose(), e.material.dispose());
		}), delete t.regionHelper);
	}
	dispose() {
		let e = this.tiles;
		e.removeEventListener("load-tileset", this._onLoadTilesetCB), e.removeEventListener("load-model", this._onLoadModelCB), e.removeEventListener("dispose-model", this._onDisposeModelCB), e.removeEventListener("update-after", this._onUpdateAfterCB), e.removeEventListener("tile-visibility-change", this._onTileVisibilityChangeCB), this.colorMode = Hi, this.boundsColorMode = Hi, this.unlit = !1, e.forEachLoadedModel((e) => {
			this._updateMaterial(e);
		}), e.traverse((e) => {
			this._onDisposeModel(e);
		}, null, !1), this.boxGroup?.removeFromParent(), this.sphereGroup?.removeFromParent(), this.regionGroup?.removeFromParent();
	}
}, na = 0, ra = 1, ia = 2, aa = 3, oa = 150;
function sa(e, t) {
	return e * 1 | t * 2;
}
function ca(e, t, n) {
	return `${e}_${t}_${n}`;
}
var la = class {
	constructor() {
		this.parent = null, this.x = 0, this.y = 0, this.level = 0, this.children = [
			,
			,
			,
			,
		].fill(null), this.childCount = 0, this.loadingState = na, this.visible = !1, this.target = 0, this.showTimer = 0, this.hideTimer = 0, this._key = null, this._index = null;
	}
	getKey() {
		return this._key === null && (this._key = `${this.x}_${this.y}_${this.level}`), this._key;
	}
	getIndex() {
		return this._index === null && (this._index = sa(this.x % 2, this.y % 2)), this._index;
	}
	addChild(e) {
		let t = e.getIndex();
		if (this.children[t] || e.x >> 1 !== this.x || e.y >> 1 !== this.y || e.level - 1 !== this.level) throw Error();
		e.parent = this, this.children[t] = e, this.childCount++;
	}
	remove() {
		if (this.childCount > 0) throw Error();
		this.parent.childCount--, this.parent.children[this.getIndex()] = null, this.parent = null;
	}
}, ua = /* @__PURE__ */ new Set(), da = class extends ee {
	constructor() {
		super(), this.root = new la(), this.cache = { [this.root.getKey()]: this.root }, this.contentCache = null, this._lastTime = -1;
	}
	update() {
		let e = performance.now(), t = e - (this._lastTime === -1 ? e : this._lastTime);
		this._lastTime = e;
		let { root: n } = this, r = this;
		i(n), ua.forEach((e) => this._deleteTile(e)), ua.clear();
		function i(e, n = !1) {
			let a = e.visible && n;
			e.target > 0 || a ? (e.showTimer += t, e.showTimer = Math.min(e.showTimer, oa), e.showTimer === oa && (e.hideTimer = 0)) : (e.visible || e.showTimer > 0) && (e.hideTimer += t, e.hideTimer = Math.min(e.hideTimer, oa), e.hideTimer === oa && (e.showTimer = 0, e.hideTimer = 0, e.loadingState !== na && (r.contentCache.release(e.x, e.y, e.level), e.loadingState = na)));
			let o = (e.target > 0 ? e.showTimer === oa : e.showTimer > 0) || a;
			if (o && e.loadingState === na) {
				e.loadingState = ra;
				let { x: t, y: n, level: i } = e, a = r.contentCache.lock(t, n, i);
				a instanceof Promise ? a.then((t) => {
					e.loadingState === ra && (e.loadingState = ia);
				}).catch((t) => {
					e.loadingState === ra && (e.loadingState = t.name === "AbortError" ? na : aa);
				}) : e.loadingState = a === null ? aa : ia;
			}
			let s = !1;
			(e.target > 0 || a) && (e.loadingState === ia ? (s = !0, n = !1) : o && (n = !0));
			let { children: c } = e, l = e.visible || e.target > 0 || e.showTimer > 0, u = !1;
			for (let e = 0, t = c.length; e < t; e++) {
				let t = c[e];
				t !== null && (l = i(t, n) || l, u ||= t.target > 0 && !t.visible);
			}
			return u && e.loadingState === ia && (s = !0), s !== e.visible && (e.visible = s, r.dispatchEvent({
				type: "toggle",
				visible: s,
				x: e.x,
				y: e.y,
				level: e.level
			})), e !== r.root && !l && ua.add(e), l;
		}
	}
	getVisibleTiles() {
		let e = [];
		for (let t in this.cache) {
			let n = this.cache[t];
			n.visible && e.push(n);
		}
		return e;
	}
	setTargetState(e, t, n, r) {
		if (r) {
			let r = this._ensureTile(e, t, n);
			r.target++;
		} else {
			let r = this.cache[ca(e, t, n)];
			if (!r || r.target <= 0) throw Error("MVTHierarchy: target ref count went negative — mismatched calls.");
			r.target--;
		}
	}
	_deleteTile(e) {
		if (e === this.root) throw Error();
		let { cache: t } = this, { x: n, y: r, level: i } = e, a = ca(n, r, i);
		if (!(a in t)) throw Error();
		t[a].remove(), delete t[a];
	}
	_ensureTile(e, t, n) {
		let { cache: r } = this, i = ca(e, t, n);
		if (i in r) return r[i];
		let a = new la();
		a.x = e, a.y = t, a.level = n;
		let o = e >> 1, s = t >> 1, c = n - 1;
		return this._ensureTile(o, s, c).addChild(a), r[a.getKey()] = a, a;
	}
}, fa = /* @__PURE__ */ new M(), pa = /* @__PURE__ */ new M(), ma = /* @__PURE__ */ new I(), ha = class {
	constructor() {
		this.id = "", this.layer = "", this.properties = null, this.ready = !1, this.lodLevel = 0, this.visibleDuration = Infinity, this.visibleTime = Infinity, this.visible = !1, this.screenPos = new I();
	}
	updateTransform(e, t, n) {}
	evaluate(e) {
		return !1;
	}
	copyPosition(e) {}
}, ga = class extends ee {
	constructor() {
		super(), this.camera = null, this.matrix = new M(), this.resolution = new F(1, 1), this.size = 12, this.cells = new Uint32Array(1), this._totalResolution = new F(), this.buffer = .15, this.items = [], this.visible = /* @__PURE__ */ new Set(), this.prevVisible = /* @__PURE__ */ new Set(), this.added = /* @__PURE__ */ new Set(), this._itemSet = /* @__PURE__ */ new Set(), this._itemsNeedsUpdate = !1, this._id = -1, this.handle = {
			test: (e, t, n) => {
				let { cells: r, _id: i } = this, a = !1;
				return this._cellRange(e, t, n, (e, t, n) => (a = !0, r[n] !== 0 && r[n] !== i)) || !a;
			},
			mark: (e, t, n) => {
				let { cells: r, _id: i } = this;
				return this._cellRange(e, t, n, (e, t, n) => (r[n] = i, !1));
			}
		}, this.sortCallback = () => 0;
	}
	_cellRange(e, t, n, r) {
		let { size: i, resolution: a, buffer: o } = this, s = a.width, c = a.height, l = s * o, u = c * o, { width: d, height: f } = this._totalResolution, p = e + l, m = t + u, h = Math.max(0, Math.floor((p - n) / i)), g = Math.max(0, Math.floor((m - n) / i)), _ = Math.min(d - 1, Math.floor((p + n) / i)), v = Math.min(f - 1, Math.floor((m + n) / i)), y = n * n;
		for (let e = g; e <= v; e++) for (let t = h; t <= _; t++) {
			let n = Math.max(t * i, Math.min(p, (t + 1) * i)), a = Math.max(e * i, Math.min(m, (e + 1) * i)), o = p - n, s = m - a;
			if (o * o + s * s <= y && r(t, e, e * d + t) === !0) return !0;
		}
		return !1;
	}
	syncItems() {
		let { items: e, _itemSet: t } = this;
		if (this._itemsNeedsUpdate) {
			this._itemsNeedsUpdate = !1, e.length = t.size;
			let n = 0;
			for (let r of t.values()) e[n] = r, n++;
		}
	}
	update() {
		let { camera: e, matrix: t, resolution: n, size: r, added: i, handle: a, sortCallback: o, buffer: s, items: c } = this, l = null, u = null;
		e !== null && (fa.copy(t).premultiply(e.matrixWorldInverse).premultiply(e.projectionMatrix), l = fa, pa.copy(t).invert(), ma.setFromMatrixPosition(e.matrixWorld).applyMatrix4(pa), u = ma), this.syncItems(), [this.visible, this.prevVisible] = [this.prevVisible, this.visible];
		let { visible: d, prevVisible: f } = this;
		d.clear(), i.clear(), this._totalResolution.copy(n).multiplyScalar(1 + 2 * s).multiplyScalar(1 / r).ceil();
		let { width: p, height: m } = this._totalResolution;
		if (this.cells.length === p * m ? this.cells.fill(0) : this.cells = new Uint8Array(p * m), l !== null) for (let e = 0, t = c.length; e < t; e++) c[e].updateTransform(l, n, u);
		c.sort(o);
		for (let e = 0, t = c.length; e < t; e++) {
			let t = c[e];
			this._id = e + 1, l !== null && t.evaluate(a) && (d.add(t), f.has(t) ? (t.visible = !1, f.delete(t)) : (t.visible = !0, i.add(t)));
		}
		(i.size > 0 || f.size > 0) && this.dispatchEvent({
			type: "change",
			added: i,
			removed: f
		});
	}
	register(e) {
		this._itemSet.add(e), this._itemsNeedsUpdate = !0;
	}
	unregister(e) {
		this._itemSet.delete(e), this._itemsNeedsUpdate = !0;
	}
}, _a = class extends ee {
	get camera() {
		return this.manager.camera;
	}
	set camera(e) {
		this.manager.camera = e;
	}
	get matrix() {
		return this.manager.matrix;
	}
	get resolution() {
		return this.manager.resolution;
	}
	get size() {
		return this.manager.size;
	}
	set size(e) {
		this.manager.size = e;
	}
	get cells() {
		return this.manager.cells;
	}
	get hasPendingWork() {
		return this._showTimers.size > 0 || this._hideTimers.size > 0;
	}
	get sortCallback() {
		return this.manager.sortCallback;
	}
	set sortCallback(e) {
		this.manager.sortCallback = e;
	}
	get buffer() {
		return this.manager.buffer;
	}
	set buffer(e) {
		this.manager.buffer = e;
	}
	constructor() {
		super(), this.manager = new ga(), this.visible = /* @__PURE__ */ new Set(), this.showDelay = .5, this.hideDelay = .5, this._showTimers = /* @__PURE__ */ new Map(), this._hideTimers = /* @__PURE__ */ new Map(), this._lastUpdateTime = -1, this.added = /* @__PURE__ */ new Set(), this.removed = /* @__PURE__ */ new Set(), this.manager.addEventListener("change", ({ added: e, removed: t }) => {
			let { _showTimers: n, _hideTimers: r, visible: i } = this;
			for (let t of e) r.delete(t), i.has(t) || n.set(t, 0);
			for (let e of t) n.delete(e), i.has(e) && r.set(e, 0);
		});
	}
	register(e) {
		return this.manager.register(e);
	}
	unregister(e) {
		this.manager.unregister(e);
	}
	syncItems() {
		this.manager.syncItems();
	}
	update() {
		let e = performance.now() / 1e3, t = this._lastUpdateTime < 0 ? 0 : Math.min(e - this._lastUpdateTime, .1);
		this._lastUpdateTime = e, this.manager.update();
		let { _showTimers: n, _hideTimers: r, visible: i, added: a, removed: o, showDelay: s, hideDelay: c } = this;
		a.clear(), o.clear();
		let l = performance.now();
		for (let [e, r] of n) {
			let o = r + t;
			o >= s ? (n.delete(e), i.add(e), a.add(e), e.visibleTime = l) : n.set(e, o);
		}
		for (let [e, n] of r) {
			let a = n + t;
			a >= c ? (r.delete(e), i.delete(e), o.add(e)) : r.set(e, a);
		}
		for (let e of i.values()) e.visibleDuration = l - e.visibleTime;
		(a.size > 0 || o.size > 0) && this.dispatchEvent({
			type: "change",
			added: a,
			removed: o
		});
	}
}, va = class extends ha {
	get count() {
		return this.lat.length;
	}
	get anchorCount() {
		return this.anchorPositions.length;
	}
	constructor() {
		super(), this.range = null, this.lat = [], this.lon = [], this.positions = [], this.anchorPositions = [];
	}
	copyPosition() {
		throw Error();
	}
	evaluate() {
		throw Error();
	}
	generateAnchors(e) {
		let { lat: t, lon: n } = this, r = [], i = 0;
		for (let e = 0, a = t.length - 1; e < a; e++) {
			let a = t[e], o = t[e + 1], s = n[e], c = n[e + 1], l = .5 * (a + o), u = o - a, d = (c - s) * Math.cos(l), f = Math.sqrt(u * u + d * d);
			r.push(f), i += f;
		}
		let a = e * .5;
		a > i && (a = i * .5);
		let o = 0, s = 0, c = [];
		for (; a <= i;) {
			for (; s < r.length && o + r[s] < a;) o += r[s], s++;
			if (s >= r.length) break;
			let i = s, l = s + 1, u = r[i], d = u > 0 ? (a - o) / u : 0;
			c.push({
				i0: i,
				i1: l,
				alpha: d,
				ref: null,
				lat: j.lerp(t[i], t[l], d),
				lon: j.lerp(n[i], n[l], d)
			}), a += e;
		}
		this.anchorPositions = c;
	}
};
function ya(e, t) {
	let n = [];
	for (let r = 0, i = e.length - 1; r < i; r++) {
		let i = e[r], a = e[r + 1];
		n.push(i);
		let o = a.x - i.x, s = a.y - i.y, c = Math.sqrt(o * o + s * s), l = Math.ceil(c / t);
		for (let e = 1; e < l; e++) {
			let t = e / l;
			n.push({
				x: j.lerp(i.x, a.x, t),
				y: j.lerp(i.y, a.y, t)
			});
		}
	}
	return n.push(e[e.length - 1]), n;
}
function ba(e, t, n, r, i, a, o = []) {
	let [s, c, l, u] = i.getTileBounds(t, n, r, !0, !1), { flipY: d } = i, f = i.getTileBounds(t, n, r, !1, !1);
	for (let t in e.layers) {
		let n = e.layers[t], p = n.extent, m = p * .015625, h = [];
		for (let e = 0; e < n.length; e++) {
			let r = n.feature(e);
			if (r.type !== 2 || !a(t, r.properties, r.type)) continue;
			let i = `${t}:${r.properties.name || r.id}`, o = r.loadGeometry();
			for (let e of o) h.push({
				key: i,
				id: i,
				properties: r.properties,
				points: e
			});
		}
		for (let e of h) {
			let n = ya(e.points, m), a = new va();
			a.id = e.id, a.layer = t, a.properties = e.properties, a.lodLevel = r, a.range = f;
			for (let e of n) {
				let t = j.lerp(s, l, e.x / p), n = e.y / p, r = d ? j.lerp(u, c, n) : j.lerp(c, u, n), [o, f] = i.toCartographicPoint(t, r);
				a.lon.push(o), a.lat.push(f), a.positions.push(new I());
			}
			a.generateAnchors(.0783927971443699 * (f[2] - f[0])), o.push(a);
		}
	}
	return o;
}
//#endregion
//#region src/three/plugins/mvt/SettlingManager.js
var xa = 1e-10, Sa = /* @__PURE__ */ new ye();
function Ca(e, t) {
	let { ray: n } = e, { planes: r } = t, i = 0, a = e.far;
	for (let e = 0; e < 6; e++) {
		let t = r[e], o = t.normal.dot(n.direction);
		if (Math.abs(o) < xa) {
			if (t.distanceToPoint(n.origin) < 0) return !1;
		} else {
			let e = n.distanceToPlane(t);
			if (o > 0) e !== null && e > i && (i = e);
			else {
				if (e === null) return !1;
				e < a && (a = e);
			}
			if (i > a) return !1;
		}
	}
	return !0;
}
var wa = class {
	get hasPendingWork() {
		return this._queue.size > 0;
	}
	constructor() {
		this.tiles = null, this.occupancy = null, this.camera = null, this.maxSettleTimeMs = 5, this._queue = /* @__PURE__ */ new Set(), this._items = /* @__PURE__ */ new Set(), this.needsUpdate = !1, this._task = null, this._deadline = 0;
	}
	register(e) {
		this._items.add(e), this._queue.add(e);
	}
	unregister(e) {
		this._items.delete(e), this._queue.delete(e);
	}
	update() {
		if (this.needsUpdate) {
			this.needsUpdate = !1;
			for (let e of this._items.values()) this._queue.add(e);
		}
		this._task === null && (this._task = this._settleGenerator()), this._task.next();
	}
	_deadlineExpired() {
		return performance.now() >= this._deadline;
	}
	_resetDeadline() {
		this._deadline = performance.now() + this.maxSettleTimeMs;
	}
	_getSettlingRay(e, t) {
		let { tiles: n } = this, { origin: r, direction: i } = Sa.ray;
		n.ellipsoid.getCartographicToPosition(e, t, 1e8, r), n.ellipsoid.getCartographicToPosition(e, t, 0, i), i.sub(r).normalize(), Sa.far = 2 * 1e8, Sa.firstHitOnly = !0;
	}
	_settleSample(e, t, n) {
		let { tiles: r } = this, { origin: i, direction: a } = Sa.ray;
		this._getSettlingRay(e, t), i.applyMatrix4(r.group.matrixWorld), a.transformDirection(r.group.matrixWorld);
		let o = Sa.intersectObject(r.group);
		o.length > 0 ? n.copy(o[0].point).applyMatrix4(r.group.matrixWorldInverse) : r.ellipsoid.getCartographicToPosition(e, t, 0, n);
	}
	*_settleGenerator() {
		let e = new M(), t = new ne(), n = /* @__PURE__ */ new Set(), r = [
			[],
			[],
			[],
			[]
		];
		for (this._resetDeadline();;) {
			let { _queue: i, _items: a, tiles: o, camera: s, occupancy: c } = this;
			if (s !== null) {
				e.copy(o.group.matrixWorld).premultiply(s.matrixWorldInverse).premultiply(s.projectionMatrix), t.setFromProjectionMatrix(e);
				for (let e of i) if (!c.visible.has(e)) {
					if (e instanceof va) {
						let { anchorPositions: r } = e, i = r[r.length >> 1];
						if (this._getSettlingRay(i.lat, i.lon), Ca(Sa, t)) {
							n.add(e);
							break;
						}
					} else this._getSettlingRay(e.lat, e.lon), Ca(Sa, t) && n.add(e);
					this._deadlineExpired() && (yield, this._resetDeadline());
				}
			}
			for (let e of i) {
				let t = n.has(e), i = 0;
				!e.ready && t ? i = 3 : c.visible.has(e) ? i = 2 : t && (i = 1), r[i].push(e), this._deadlineExpired() && (yield, this._resetDeadline());
			}
			for (let e = r.length - 1; e >= 0; e--) {
				let t = r[e];
				for (; t.length > 0;) {
					let e = t.pop();
					i.delete(e), a.has(e) && (yield* this._settleItem(e), this._deadlineExpired() && (yield, this._resetDeadline()));
				}
			}
			n.clear(), r.forEach((e) => e.length = 0), yield, this._resetDeadline();
		}
	}
	*_settleItem(e) {
		if (e instanceof va) {
			let { _items: t } = this, { lat: n, lon: r, positions: i } = e;
			for (let a = 0, o = n.length; a < o; a++) if (this._settleSample(n[a], r[a], i[a]), this._deadlineExpired() && (yield, this._resetDeadline(), !t.has(e))) return;
		} else this._settleSample(e.lat, e.lon, e.position);
		e.ready = !0;
	}
}, Ta = 0, Ea = class extends ha {
	get lat() {
		return this.getActiveReference().lat;
	}
	get lon() {
		return this.getActiveReference().lon;
	}
	get ready() {
		return this.getActiveReference().line.ready;
	}
	set ready(e) {}
	get properties() {
		return this.getActiveReference().line.properties;
	}
	set properties(e) {}
	constructor(e) {
		super(), this.id = `${e}_${Ta++}`, this.referencePaths = [], this._lastUsed = null;
	}
	getPosition(e) {
		let { i0: t, i1: n, alpha: r, line: i } = this.getActiveReference();
		return e.lerpVectors(i.positions[t], i.positions[n], r);
	}
	getActiveReference() {
		let { referencePaths: e, _lastUsed: t } = this, n = e[0] ?? null;
		if (n?.line.ready) return this._lastUsed = n, n;
		{
			let r = n;
			for (let t of e) if (t.line.ready) {
				r = t;
				break;
			}
			return r ??= t, t && t.line.ready && t.line.lodLevel > r.line.lodLevel && (r = t), this._lastUsed = r, r;
		}
	}
	addLine(e, t) {
		let n = e.anchorPositions[t], { referencePaths: r } = this;
		return r.push({
			line: e,
			i0: n.i0,
			i1: n.i1,
			alpha: n.alpha,
			lat: n.lat,
			lon: n.lon
		}), r.sort((e, t) => t.line.lodLevel - e.line.lodLevel), t;
	}
	removeLine(e) {
		let { referencePaths: t } = this;
		for (let n = 0; n < t.length; n++) t[n].line === e && (t.splice(n, 1), n--);
	}
};
//#endregion
//#region src/three/plugins/mvt/TextAnchorManager.js
function Da(e, t, n) {
	let [r, i, a, o] = e;
	return n >= r && n <= a && t >= i && t <= o;
}
var Oa = class {
	constructor() {
		this.added = /* @__PURE__ */ new Set(), this.removed = /* @__PURE__ */ new Set(), this._anchorsById = /* @__PURE__ */ new Map(), this._linesById = /* @__PURE__ */ new Map();
	}
	reset() {
		this.added.clear(), this.removed.clear();
	}
	update() {
		let { _anchorsById: e, removed: t } = this;
		e.forEach((n, r) => {
			n.forEach((e) => {
				e.referencePaths.length === 0 && (n.delete(e), t.add(e));
			}), n.size === 0 && e.delete(r);
		});
	}
	getLines() {
		let e = [];
		return this._linesById.forEach((t) => {
			t.forEach((t) => {
				e.push(t);
			});
		}), e;
	}
	getAnchors() {
		let e = [];
		return this._anchorsById.forEach((t) => {
			t.forEach((t) => {
				e.push(t);
			});
		}), e;
	}
	addLines(e) {
		let { _anchorsById: t, _linesById: n, added: r } = this, i = /* @__PURE__ */ new Map();
		e.forEach((e) => {
			i.has(e.id) || i.set(e.id, []), i.get(e.id).push(e);
		}), i.forEach((e, i) => {
			t.has(i) || t.set(i, /* @__PURE__ */ new Set()), n.has(i) || n.set(i, /* @__PURE__ */ new Set());
			let { range: a, lodLevel: o } = e[0], s = t.get(i);
			s.forEach((t) => {
				let n = Infinity, r = null, i = -1;
				!Da(a, t.lat, t.lon) || t.referencePaths.find((e) => e.line.lodLevel === o) || (e.forEach((e) => {
					e.anchorPositions.forEach((a, o) => {
						if (a.ref === null) {
							let s = t.lat - a.lat, c = t.lon - a.lon, l = s * s + c * c;
							l < n && (n = l, r = e, i = o);
						}
					});
				}), r && (t.addLine(r, i), r.anchorPositions[i].ref = t));
			}), e.forEach((e) => {
				e.anchorPositions.forEach((t, n) => {
					if (t.ref === null) {
						let a = new Ea(i);
						a.addLine(e, n), Da(e.range, a.lat, a.lon) && (t.ref = a, s.add(a), r.add(a));
					}
				});
			});
		}), i.forEach((e, t) => {
			let r = n.get(t);
			e.forEach((e) => {
				r.add(e);
			});
		});
	}
	deleteLines(e) {
		e.forEach((e) => this.deleteLine(e));
	}
	deleteLine(e) {
		let { _anchorsById: t, _linesById: n } = this, r = e.id;
		n.get(r).delete(e), n.get(r).size === 0 && n.delete(r);
		let i = t.get(r);
		i && i.forEach((t) => {
			t.removeLine(e);
		});
	}
}, ka = class {
	constructor(e) {
		this.enabled = !1, this.canvas = null, this.occupancyManager = e;
	}
	update() {
		let { occupancyManager: e, enabled: t } = this;
		if (!t) {
			this.dispose();
			return;
		}
		if (this.canvas === null) {
			let e = document.createElement("canvas");
			e.style.cssText = "position:fixed;top:0;left:0;pointer-events:none;opacity:0.5;", document.body.appendChild(e), this.canvas = e;
		}
		let { canvas: n } = this, { cells: r, size: i, resolution: a, buffer: o } = e, s = window.devicePixelRatio, c = a.width * o, l = a.height * o, u = Math.ceil((a.width + 2 * c) / i), d = Math.ceil((a.height + 2 * l) / i);
		n.width = Math.round(s * (a.width + 2 * c)), n.height = Math.round(s * (a.height + 2 * l)), n.style.width = `${a.width + 2 * c}px`, n.style.height = `${a.height + 2 * l}px`, n.style.left = `${-c}px`, n.style.top = `${-l}px`;
		let f = i * s, p = n.getContext("2d");
		p.clearRect(0, 0, n.width, n.height);
		for (let e = 0; e < d; e++) for (let t = 0; t < u; t++) {
			let n = r[e * u + t] !== 0;
			p.fillStyle = n ? "rgba( 255, 80, 80, 0.6 )" : "rgba( 80, 255, 80, 0.15 )", p.fillRect(t * f + .5, e * f + .5, f - 1, f - 1), p.strokeStyle = n ? "rgba( 255, 80, 80, 1 )" : "rgba( 80, 255, 80, 0.25 )", p.lineWidth = 1, p.strokeRect(t * f + .5, e * f + .5, f - 1, f - 1);
		}
	}
	dispose() {
		this.canvas !== null && (this.canvas.remove(), this.canvas = null);
	}
}, Aa = new class {
	constructor() {
		this._cache = {};
	}
	getColor(...e) {
		let t = e.pop(), n = e.join("_"), { _cache: r } = this;
		return n in r || (t.setHSL(Math.random(), 1, .5), r[n] = t.getHex()), t.set(r[n]);
	}
}(), ja = {
	NONE: 0,
	ID: 1,
	LEVEL: 2,
	TILE: 3,
	NAME: 4
}, Ma = /* @__PURE__ */ new I(), Na = /* @__PURE__ */ new I(), Pa = /* @__PURE__ */ new w();
function Fa() {
	let e = new E(new Uint8Array(1024 * 4), 32, 32);
	for (let t = 0; t < 32; t++) for (let n = 0; n < 32; n++) {
		let r = (t - 16) / 16, i = (n - 16) / 16, a = Math.sqrt(r * r + i * i), o = n * 32 + t;
		e.image.data[4 * o + 0] = 255, e.image.data[4 * o + 1] = 255, e.image.data[4 * o + 2] = 255, e.image.data[4 * o + 3] = a < 1 ? 255 : 0;
	}
	return e.needsUpdate = !0, e;
}
var Ia = class {
	get ColorMode() {
		return ja;
	}
	constructor(e) {
		this.enabled = !1, this.colorMode = ja.NONE, this.displayLines = !0, this.displayAnchors = !0, this.camera = null, this.anchorManager = e, this.group = null, this._lines = null, this._points = null;
	}
	update() {
		let { enabled: e, group: t, camera: n, anchorManager: r, displayAnchors: i, displayLines: a } = this;
		if (!e) {
			this.dispose();
			return;
		}
		if (this._lines === null) {
			let e = new ie();
			e.material.transparent = !0, e.material.depthTest = !1, e.material.depthWrite = !1, e.material.vertexColors = !0, e.frustumCulled = !1, e.raycast = () => {};
			let n = new pe();
			n.material.transparent = !0, n.material.depthTest = !1, n.material.depthWrite = !1, n.material.map = Fa(), n.material.size = 6, n.material.sizeAttenuation = !1, n.material.vertexColors = !0, n.frustumCulled = !1, n.raycast = () => {}, t.add(e, n), this._lines = e, this._points = n;
		}
		let { _lines: o, _points: s } = this;
		n === null ? Ma.set(0, 0, 0) : (Ma.setFromMatrixPosition(n.matrixWorld), t.worldToLocal(Ma));
		let c = r.getLines().filter((e) => e instanceof va && e.ready), l = 0;
		for (let e of c) l += e.count - 1;
		let u = new x(new Float32Array(l * 2 * 3), 3), d = new x(new Float32Array(l * 2 * 3), 3), f = 0;
		for (let e of c) {
			this._getColor(e, Pa);
			let t = e.positions;
			for (let e = 0, n = t.length - 1; e < n; e++) u.setXYZ(f + 0, ...Na.copy(t[e]).sub(Ma)), u.setXYZ(f + 1, ...Na.copy(t[e + 1]).sub(Ma)), d.setXYZ(f + 0, ...Pa), d.setXYZ(f + 1, ...Pa), f += 2;
		}
		let p = r.getAnchors().filter((e) => e.ready), m = new x(new Float32Array(p.length * 3), 3), h = new x(new Float32Array(p.length * 2 * 3), 3);
		f = 0;
		for (let e of p) e.getPosition(Na).sub(Ma), m.setXYZ(f, ...Na), this._getColor(e.getActiveReference().line, Pa), h.setXYZ(f, ...Pa), f++;
		o.geometry.dispose(), o.geometry.setAttribute("position", u), o.geometry.setAttribute("color", d), o.position.copy(Ma), o.updateMatrixWorld(), o.visible = a, s.geometry.dispose(), s.geometry.setAttribute("position", m), s.geometry.setAttribute("color", h), s.position.copy(Ma), s.updateMatrixWorld(), s.visible = i;
	}
	dispose() {
		this._lines !== null && (this._lines.removeFromParent(), this._lines.geometry.dispose(), this._lines.material.dispose(), this._lines = null), this._points !== null && (this._points.removeFromParent(), this._points.geometry.dispose(), this._points.material.dispose(), this._points.material.map.dispose(), this._points = null);
	}
	_getColor(e, t) {
		switch (this.colorMode) {
			case ja.ID:
				Aa.getColor(e.id, t);
				break;
			case ja.LEVEL:
				Aa.getColor(e.lodLevel, t);
				break;
			case ja.NAME:
				Aa.getColor(e.properties.name, t);
				break;
			case ja.TILE:
				Aa.getColor(...e.range, t);
				break;
			default:
				t.set(16777215);
				break;
		}
	}
}, La = /* @__PURE__ */ new I(), Ra = Math.acos(.1), za = class extends ha {
	constructor() {
		super(), this.position = new I(), this.lat = 0, this.lon = 0, this.radius = 32, this.screenPos = new I(), this._facingAngle = 0;
	}
	updateTransform(e, t, n) {
		let { position: r } = this, i = this.screenPos;
		i.copy(r).applyMatrix4(e), i.x = (i.x * .5 + .5) * t.width, i.y = (-i.y * .5 + .5) * t.height, i.z = +(i.z < -1 || i.z > 1), n === null ? this._facingAngle = 0 : (La.subVectors(n, r), this._facingAngle = r.lengthSq() > 0 ? r.angleTo(La) : 0);
	}
	copyPosition(e) {
		this.position.copy(e.position), this.ready = e.ready;
	}
	evaluate(e) {
		let { screenPos: t, radius: n, _facingAngle: r } = this;
		return !this.ready || t.z !== 0 || r > Ra || e.test(t.x, t.y, n) ? !1 : (e.mark(t.x, t.y, n), !0);
	}
};
function Ba(e, t, n, r, i, a, o = []) {
	let [s, c, l, u] = i.getTileBounds(t, n, r, !0, !1);
	for (let t in e.layers) {
		let n = e.layers[t], d = n.extent;
		for (let e = 0; e < n.length; e++) {
			let f = n.feature(e);
			if (f.type !== 1 || !a(t, f.properties, f.type)) continue;
			let p = f.loadGeometry();
			for (let [e] of p) {
				let n = j.lerp(s, l, e.x / d), a = e.y / d, p = i.flipY ? j.lerp(u, c, a) : j.lerp(c, u, a), [m, h] = i.toCartographicPoint(n, p), g = new za();
				g.id = `${t}:${f.id}`, g.layer = t, g.properties = f.properties, g.lat = h, g.lon = m, g.lodLevel = r, o.push(g);
			}
		}
	}
	return o;
}
//#endregion
//#region src/three/plugins/mvt/debug/HierarchyOverlay.js
var Va = {
	NONE: 0,
	LEVEL: 1,
	TILE: 2
}, Ha = class {
	get ColorMode() {
		return Va;
	}
	constructor() {
		this.enabled = !1, this._wasEnabled = !1, this.hierarchy = null, this.tiles = null, this.tiling = null, this.colorMode = Va.NONE, this._regions = {}, this._onToggleCallback = ({ x: e, y: t, level: n, visible: r }) => {
			let i = `${e}_${t}_${n}`;
			if (r) {
				let { ellipsoid: r, group: a } = this.tiles, [o, s, c, l] = this.tiling.getTileBounds(e, t, n, !1, !1), u = new d(...r.radius, s, l, o, c, 600, 700), f = new ji(u);
				f.material.depthWrite = !1, f.material.depthTest = !1, f.material.transparent = !0;
				let p = new Mi(u);
				p.material.transparent = !0, p.material.opacity = .1, p.material.depthWrite = !1;
				let m = new A();
				m.add(f, p), a.add(m), m.updateMatrixWorld(!0), this._regions[i] = {
					helper: m,
					x: e,
					y: t,
					level: n
				};
			} else {
				let { helper: e } = this._regions[i];
				e.children.forEach((e) => e.dispose()), e.removeFromParent(), delete this._regions[i];
			}
		};
	}
	update() {
		let { enabled: e, hierarchy: t, _regions: n } = this;
		if (e !== this._wasEnabled && (this._wasEnabled = e, e ? (t.getVisibleTiles().forEach((e) => {
			this._onToggleCallback(e);
		}), t.addEventListener("toggle", this._onToggleCallback)) : this.dispose()), e) for (let e in n) {
			let { x: t, y: r, level: i, helper: a } = n[e];
			a.children.forEach((e) => {
				let { color: n } = e.material;
				switch (this.colorMode) {
					case Va.NONE:
						n.set(16777215);
						break;
					case Va.LEVEL:
						Aa.getColor(i, n);
						break;
					case Va.TILE:
						Aa.getColor(t, r, i, n);
						break;
				}
			});
		}
	}
	dispose() {
		let { hierarchy: e } = this;
		e.getVisibleTiles().forEach((e) => {
			this._onToggleCallback({
				...e,
				visible: !1
			});
		}), e.removeEventListener("toggle", this._onToggleCallback);
	}
}, Ua = class {
	constructor() {
		this.added = /* @__PURE__ */ new Set(), this.removed = /* @__PURE__ */ new Set(), this.annotations = /* @__PURE__ */ new Map();
	}
	add(e) {
		let { annotations: t, added: n } = this, { id: r } = e;
		t.has(r) || (t.set(r, {
			annotation: e,
			ref: 0
		}), n.add(e)), t.get(r).ref++;
	}
	delete(e) {
		let { annotations: t } = this, { id: n } = e, r = t.get(n);
		r.ref--;
	}
	update() {
		let { removed: e, annotations: t } = this;
		t.forEach((n, r) => {
			n.ref === 0 && (e.add(n.annotation), t.delete(r));
		});
	}
	reset() {
		this.added.clear(), this.removed.clear();
	}
}, Wa = /* @__PURE__ */ new M();
function Ga(e) {
	let t = [];
	return e.traverse((e) => {
		e.isMesh && t.push(e);
	}), t;
}
var Ka = class {
	get contentCache() {
		return this.overlay.imageSource._contentCache;
	}
	constructor(e = {}) {
		this.priority = Infinity, this.name = "MVT_ANNOTATIONS_PLUGIN";
		let { overlay: t, sortCallback: n = (e, t) => (e.properties.rank ?? 1e10) - (t.properties.rank ?? 1e10), filterAnnotation: r = () => !1, onAnnotationsUpdate: i = () => {}, camera: a = null } = e;
		this.overlay = t, this.camera = a, this.sortCallback = n, this.filterAnnotation = r, this.onAnnotationsUpdate = i, this.hierarchy = new da(), this.occupancy = new _a(), this.anchorManager = new Oa(), this.pointManager = new Ua(), this.settlingManager = new wa(), this.tileLoadState = /* @__PURE__ */ new Map(), this.vectorTileInfo = /* @__PURE__ */ new Map(), this.debug = {
			occupancy: new ka(this.occupancy),
			paths: new Ia(this.anchorManager),
			hierarchy: new Ha()
		};
	}
	async init(e) {
		this.tiles = e;
		let { overlay: t, occupancy: n, debug: r, hierarchy: i, settlingManager: a, contentCache: o, pointManager: s, anchorManager: c } = this;
		r.paths.group = e.group, r.hierarchy.hierarchy = i, r.hierarchy.tiles = e, r.hierarchy.tiling = t.tiling, a.occupancy = n, a.tiles = e, i.contentCache = o, t.init(), t.isReady || await t.whenReady(), n.sortCallback = (e, t) => {
			let r = n.visible.has(e);
			if (r !== n.visible.has(t)) return r ? -1 : 1;
			let i = this.sortCallback(e, t);
			if (i !== 0) return i;
			if (e.lodLevel !== t.lodLevel) return t.lodLevel - e.lodLevel;
			let a = e.visibleDuration < 5e3 || t.visibleDuration < 5e3;
			return r && a && e.visibleTime !== t.visibleTime ? e.visibleTime < t.visibleTime ? -1 : 1 : t.screenPos.y === e.screenPos.y ? e.id > t.id ? 1 : -1 : t.screenPos.y - e.screenPos.y;
		}, this._onVisibilityChange = ({ scene: e, tile: t, visible: n }) => {
			a.needsUpdate = !0, this._markVectorTile(t, n);
		}, this._onUpdateAfter = () => {
			let { camera: t } = this;
			t !== null && (e.getResolution(t, n.resolution), n.matrix.copy(e.group.matrixWorld)), i.update(), s.update(), s.added.forEach((e) => {
				n.register(e), a.register(e);
			}), s.removed.forEach((e) => {
				n.unregister(e), a.unregister(e);
			}), s.reset(), c.update(), c.added.forEach((e) => {
				n.register(e);
			}), c.removed.forEach((e) => {
				n.unregister(e);
			}), c.reset(), a.camera = t, a.update(), n.camera = t, n.update(), this.onAnnotationsUpdate(n.added, n.removed), (n.added.size > 0 || n.removed.size > 0) && e.dispatchEvent({ type: "needs-render" }), (n.hasPendingWork || a.hasPendingWork) && e.dispatchEvent({ type: "needs-update" }), r.paths.camera = this.camera, r.occupancy.update(), r.paths.update(), r.hierarchy.update();
		}, this._onVectorTileToggle = ({ x: n, y: r, level: i, visible: a }) => {
			e.dispatchEvent({ type: "needs-update" });
			let { contentCache: o, filterAnnotation: s, vectorTileInfo: c, settlingManager: l, anchorManager: u, pointManager: d } = this, f = `${n}_${r}_${i}`;
			if (a) {
				let { tiling: e } = t, a = o.get(n, r, i);
				if (!a) {
					c.set(f, { annotations: [] });
					return;
				}
				let p = [];
				Ba(a, n, r, i, e, s, p), ba(a, n, r, i, e, s, p), c.set(f, { annotations: p });
				for (let e of p) e instanceof va ? l.register(e) : d.add(e);
				u.addLines(p.filter((e) => e instanceof va));
			} else {
				let { annotations: e } = c.get(f);
				c.delete(f);
				for (let t of e) t instanceof va ? l.unregister(t) : d.delete(t);
				u.deleteLines(e.filter((e) => e instanceof va));
			}
		}, this._onDisposeModel = ({ tile: e }) => {
			this.tileLoadState.delete(e);
		}, i.addEventListener("toggle", this._onVectorTileToggle), e.addEventListener("update-after", this._onUpdateAfter), e.addEventListener("tile-visibility-change", this._onVisibilityChange), e.addEventListener("dispose-model", this._onDisposeModel), e.forEachLoadedModel((t, n) => {
			this.processTileModel(t, n), e.visibleTiles.has(n) && this._markVectorTile(n, !0);
		});
	}
	dispose() {
		let { debug: e, tiles: t, hierarchy: n, tileLoadState: r } = this;
		e.occupancy.dispose(), e.paths.dispose(), n.removeEventListener("toggle", this._onVectorTileToggle), t.removeEventListener("update-after", this._onUpdateAfter), t.removeEventListener("tile-visibility-change", this._onVisibilityChange), t.removeEventListener("dispose-model", this._onDisposeModel), r.forEach((e, t) => {
			e.active && this._markVectorTile(t, !1);
		});
	}
	processTileModel(e, t) {
		let { tiles: n, overlay: r } = this;
		Wa.identity(), e.parent !== null && Wa.copy(n.group.matrixWorldInverse), e.updateMatrixWorld();
		let { range: i } = at(Ga(e), n.ellipsoid, Wa, r.projection);
		this.tileLoadState.set(t, {
			range: i,
			active: !1
		});
	}
	_markVectorTile(e, t) {
		let { tileLoadState: n } = this, r = n.get(e);
		r.active = t, this._forEachTileInBounds(r.range, (e, n, r) => {
			this.hierarchy.setTargetState(e, n, r, t);
		});
	}
	_forEachTileInBounds(e, t) {
		let { overlay: n } = this, { tiling: r } = n, i = n.calculateLevel(e);
		if (!n.isReady) throw Error("MVTAnnotationsPlugin: overlay is not ready.");
		z(e, i, r, t);
	}
}, qa = null;
function Ja() {
	return qa ??= Promise.all([import("@mapbox/vector-tile"), import("pbf")]).then(([{ VectorTile: e }, { default: t }]) => ({
		VectorTile: e,
		Protobuf: t
	}));
}
var Ya = class extends $e {
	constructor(e = {}) {
		super();
		let { url: t = null, levels: n = 20, projection: r = "EPSG:3857" } = e;
		this.url = t, this.levels = n, this.projectionId = r, this.tiling = new ze(), this.fetchData = (...e) => fetch(...e), this.fetchOptions = {};
	}
	init() {
		let { tiling: e, levels: t, url: n, projectionId: r } = this;
		return e.flipY = !/{\s*reverseY|-\s*y\s*}/g.test(n), e.setProjection(new L(r)), e.setContentBounds(...e.projection.getBounds()), Array.isArray(t) ? t.forEach((t, n) => {
			t !== null && e.setLevel(n, {
				tilePixelWidth: 512,
				tilePixelHeight: 512,
				...t
			});
		}) : e.generateLevels(t, e.projection.tileCountX, e.projection.tileCountY, {
			tilePixelWidth: 512,
			tilePixelHeight: 512
		}), Promise.resolve();
	}
	async fetchItem([e, t, n], r) {
		let i = this.getUrl(e, t, n), a = await (await this.fetchData(i, {
			...this.fetchOptions,
			signal: r
		})).arrayBuffer();
		return this._parseVectorTile(a);
	}
	async _parseVectorTile(e) {
		if (!e || e.byteLength === 0) return null;
		let { VectorTile: t, Protobuf: n } = await Ja();
		return new t(new n(e));
	}
	disposeItem() {}
	getUrl(e, t, n) {
		return this.url.replace(/{\s*z\s*}/gi, n).replace(/{\s*x\s*}/gi, e).replace(/{\s*(y|reverseY|-\s*y)\s*}/gi, t);
	}
}, Xa = class extends St {
	get tiling() {
		return this._contentCache.tiling;
	}
	get fetchData() {
		return this._contentCache.fetchData;
	}
	set fetchData(e) {
		this._contentCache.fetchData = e;
	}
	get fetchOptions() {
		return this._contentCache.fetchOptions;
	}
	set fetchOptions(e) {
		this._contentCache.fetchOptions = e;
	}
	constructor(e = {}) {
		let { resolution: t = 512, getStyle: n = () => null, contentCache: r, ...i } = e;
		super(), this.resolution = t, this.getStyle = n, this._canvasRenderer = new Tt({ tileExtent: 4096 }), this._contentCache = r ?? new Ya(i);
	}
	init() {
		return this._contentCache.init();
	}
	hasContent(e, t, n, r, i) {
		let a = 0;
		return z([
			e,
			t,
			n,
			r
		], i, this._contentCache.tiling, () => a++), a > 0;
	}
	async fetchItem([e, t, n, r, i], a) {
		let { resolution: o, _contentCache: s } = this, c = document.createElement("canvas");
		c.width = o, c.height = o;
		let l = [
			e,
			t,
			n,
			r
		], u = [];
		z(l, i, s.tiling, (e, t, n) => {
			u.push(s.lock(e, t, n));
		}), await Promise.all(u), a?.throwIfAborted(), this._drawToCanvas(c, l, i);
		let d = new C(c);
		return d.colorSpace = be, d.generateMipmaps = !1, d.needsUpdate = !0, d;
	}
	disposeItem(e, [t, n, r, i, a]) {
		z([
			t,
			n,
			r,
			i
		], a, this._contentCache.tiling, (e, t, n) => {
			this._contentCache.release(e, t, n);
		}), e && e.dispose();
	}
	redraw(...e) {
		let [t, n, r, i, a] = e, o = this.get(t, n, r, i, a);
		o && (this._drawToCanvas(o.image, [
			t,
			n,
			r,
			i
		], a), o.needsUpdate = !0);
	}
	dispose() {
		super.dispose(), this._contentCache.dispose();
	}
	_drawToCanvas(e, t, n) {
		let { _contentCache: r, _canvasRenderer: i } = this, a = e.getContext("2d");
		z(t, n, r.tiling, (e, n, o) => {
			let s = r.tiling.getTileBounds(e, n, o, !0, !1);
			i.setFrame(a, s, t);
			let c = r.get(e, n, o);
			c && this._renderVectorTile(c);
		});
	}
	_renderVectorTile(e) {
		let { _canvasRenderer: t, getStyle: n } = this, r = [...Object.keys(e.layers)].sort((e, t) => {
			if (n) {
				let r = n(e, null)?.order ?? Tt.DEFAULT_STYLE.order, i = n(t, null)?.order ?? Tt.DEFAULT_STYLE.order;
				if (r !== i) return r - i;
			}
			return e.localeCompare(t);
		});
		for (let i of r) {
			let r = e.layers[i];
			for (let e = 0; e < r.length; e++) {
				let a = r.feature(e), { properties: o, type: s } = a, c = n(i, o);
				t.setStyle(c);
				let l = a.loadGeometry();
				s === 1 ? t._renderPoints(l) : s === 2 ? t._renderLines(l) : s === 3 && t._renderPolygons(l);
			}
		}
	}
}, Za = Math.PI / 180, Qa = null;
function $a() {
	return Qa ??= import("pmtiles").then((e) => e.PMTiles);
}
var eo = class extends et {
	constructor(e, t) {
		super(), this.instance = e, this.tiling = t;
	}
	async fetchItem([e, t, n], r) {
		let i = await this.instance.getZxy(n, e, t, r);
		return !i || !i.data || i.data.byteLength === 0 ? null : this.processBufferToTexture(i.data);
	}
}, to = class extends Ya {
	constructor(e = {}) {
		super(e), this.instance = null, this.tileType = 1;
	}
	async init() {
		let { tiling: e } = this, t = await $a();
		this.instance = new t({
			getKey: () => this.url,
			getBytes: async (e, t, n) => {
				let { fetchOptions: r, url: i } = this, a = await this.fetchData(i, {
					...r,
					signal: n,
					headers: {
						...r.headers,
						range: `bytes=${e}-${e + t - 1}`
					}
				});
				if (!a.ok) throw Error(`PMTilesImageSource: Bad response code: ${a.status}`);
				if (a.status !== 206) throw Error("PMTilesImageSource: Server does not support HTTP Byte Serving.");
				return {
					data: await a.arrayBuffer(),
					etag: a.headers.get("ETag"),
					cacheControl: a.headers.get("Cache-Control"),
					expires: a.headers.get("Expires")
				};
			}
		});
		let n = await this.instance.getHeader();
		this.tileType = n.tileType;
		let r = new L("EPSG:3857");
		e.flipY = !0, e.setProjection(r), e.setContentBounds(Za * n.minLon, Za * n.minLat, Za * n.maxLon, Za * n.maxLat), e.generateLevels(n.maxZoom + 1, r.tileCountX, r.tileCountY, {
			tilePixelWidth: 512,
			tilePixelHeight: 512,
			minLevel: n.minZoom
		});
	}
	async fetchItem([e, t, n], r) {
		let i = await this.instance.getZxy(n, e, t, r);
		return this._parseVectorTile(i ? i.data : null);
	}
}, no = class extends St {
	get tiling() {
		return this._contentCache.tiling;
	}
	get fetchData() {
		return this._contentCache.fetchData;
	}
	set fetchData(e) {
		this._contentCache.fetchData = e;
	}
	get resolution() {
		return this._resolution;
	}
	set resolution(e) {
		this._resolution = e, this._deferredSource && (this._deferredSource.resolution = e);
	}
	get fetchOptions() {
		return this._contentCache.fetchOptions;
	}
	set fetchOptions(e) {
		this._contentCache.fetchOptions = e;
	}
	constructor(e = {}) {
		super();
		let { resolution: t = 512, getStyle: n = () => null } = e;
		this._resolution = t, this._getStyle = n, this._contentCache = new to(e), this._deferredSource = null, this.isVectorTile = !1;
	}
	async init() {
		await this._contentCache.init();
		let { _contentCache: e } = this;
		if (this.isVectorTile = e.tileType === 1, this.isVectorTile) this._deferredSource = new Xa({
			resolution: this._resolution,
			getStyle: this._getStyle,
			contentCache: e
		});
		else {
			let t = new eo(e.instance, e.tiling);
			this._deferredSource = new Ct(t), this._deferredSource.resolution = this._resolution;
		}
	}
	hasContent(e, t, n, r, i) {
		return this._deferredSource.hasContent(e, t, n, r, i);
	}
	lock(...e) {
		return this._deferredSource.lock(...e);
	}
	release(...e) {
		this._deferredSource.release(...e);
	}
	get(...e) {
		return this._deferredSource.get(...e);
	}
	redraw(...e) {
		this._deferredSource instanceof Xa && this._deferredSource.redraw(...e);
	}
	forEachItem(...e) {
		return this._deferredSource.forEachItem(...e);
	}
	dispose() {
		super.dispose(), this._contentCache.dispose(), this._deferredSource && this._deferredSource.dispose();
	}
}, ro = class extends Ut {
	get tiling() {
		return this.imageSource.tiling;
	}
	get projection() {
		return this.tiling.projection;
	}
	get aspectRatio() {
		return this.tiling && this.isReady ? this.tiling.aspectRatio : 1;
	}
	get fetchOptions() {
		return this.imageSource.fetchOptions;
	}
	set fetchOptions(e) {
		this.imageSource.fetchOptions = e;
	}
	constructor(e = {}) {
		super(e), this.imageSource = e.imageSource ?? new Xa(e), this._redrawQueue = new t(), this._redrawQueue.maxJobs = 4, this._redrawQueue.priorityCallback = () => 0;
	}
	_init() {
		return this.imageSource.fetchData = (...e) => this.fetch(...e), this.imageSource.init();
	}
	calculateLevel(e) {
		let [t, n, r, i] = e, a = r - t, o = i - n, s = this.imageSource.resolution, c = this.tiling.maxLevel, l = 0;
		for (; l < c; l++) {
			let e = this.tiling.getLevel(l);
			if (e == null) continue;
			let { pixelWidth: t, pixelHeight: n } = e;
			if (t >= s / a || n >= s / o) break;
		}
		return l;
	}
	hasContent(e) {
		return this.imageSource.hasContent(...e, this.calculateLevel(e));
	}
	getTexture(e) {
		return this.imageSource.get(...e, this.calculateLevel(e));
	}
	lockTexture(e) {
		return this.imageSource.lock(...e, this.calculateLevel(e));
	}
	releaseTexture(e) {
		this.imageSource.release(...e, this.calculateLevel(e));
	}
	setResolution(e) {
		this.imageSource.resolution = e;
	}
	shouldSplit(e) {
		return !0;
	}
	setRegionVisible(e, t) {
		if (super.setRegionVisible(e, t), t) {
			let { _redrawQueue: t } = this, n = e.join("_") + "_" + this.calculateLevel(e);
			t.has(n) && t.flush(n);
		}
	}
	redraw() {
		let { imageSource: e, _redrawQueue: t, _visibleRegionCounts: n } = this;
		for (let { range: t } of n.values()) e.redraw(...t, this.calculateLevel(t));
		e.forEachItem((r, i) => {
			let a = i.join("_");
			!n.has(a) && !t.has(a) && t.add(a, () => {
				e.redraw(...i);
			});
		});
	}
}, io = class extends ro {
	constructor(e = {}) {
		super({
			...e,
			imageSource: new no(e)
		});
	}
	shouldSplit(e) {
		return this.imageSource.isVectorTile ? !0 : this.tiling.maxLevel > this.calculateLevel(e);
	}
}, ao = class extends C {
	get isFull() {
		return this._freeList.length === 0 && this._nextIndex >= this._capacity;
	}
	constructor(e, t) {
		super(null), this.slotSize = 0, this._slots = /* @__PURE__ */ new Map(), this._freeList = [], this._nextIndex = 0, this._capacity = 0, this._columns = 0, this.resize(e, t), this.colorSpace = be;
	}
	has(e) {
		return this._slots.has(e);
	}
	get(e) {
		let { _slots: t } = this;
		return t.has(e) ? this._indexToSlot(t.get(e)) : null;
	}
	getSlotSize(e) {
		let { slotSize: t, image: n } = this;
		return e.set(t / n.width, t / n.height);
	}
	getUV(e) {
		let t = this.get(e);
		if (t === null) return null;
		let { width: n, height: r } = this.image;
		return {
			x: t.x / n,
			y: (r - t.y) / r,
			w: this.slotSize / n,
			h: this.slotSize / r
		};
	}
	drawChar(e, t, n = {}) {
		let { font: r = "", color: i = "white" } = n;
		return this._draw(e, (e, n, a, o, s) => {
			e.font = r, e.fillStyle = i, e.textAlign = "center", e.textBaseline = "middle", e.fillText(t, n + o / 2, a + s / 2);
		});
	}
	drawImage(e, t) {
		return this._draw(e, (e, n, r, i, a) => {
			e.drawImage(t, n, r, i, a);
		});
	}
	drawPath(e, t, n = {}) {
		let { fillStyle: r = null, strokeStyle: i = null, lineWidth: a = 1 } = n;
		return this._draw(e, (e, n, o) => {
			e.save(), e.translate(n, o), r !== null && (e.fillStyle = r, e.fill(t)), i !== null && (e.strokeStyle = i, e.lineWidth = a, e.stroke(t)), e.restore();
		});
	}
	drawSVG(e, t, n = {}) {
		let { fillStyle: r = "white", strokeStyle: i = null, strokeWidth: a = 1, iconScale: o = 1 } = n, s = new DOMParser().parseFromString(t, "image/svg+xml").documentElement, c = (s.getAttribute("viewBox") ?? "0 0 15 15").trim().split(/[\s,]+/), l = parseFloat(c[2]), u = parseFloat(c[3]), d = [...s.querySelectorAll("path")].map((e) => e.getAttribute("d")).filter(Boolean).map((e) => new Path2D(e));
		return this._draw(e, (e, t, n, s, c) => {
			let f = s * o, p = c * o, m = Math.min(f / l, p / u), h = t + (s - l * m) / 2, g = n + (c - u * m) / 2;
			if (e.save(), e.translate(h, g), e.scale(m, m), e.lineJoin = "round", e.lineCap = "round", i !== null) {
				e.lineWidth = a / m, e.strokeStyle = i;
				for (let t of d) e.stroke(t);
			}
			if (r !== null) {
				e.fillStyle = r;
				for (let t of d) e.fill(t);
			}
			e.restore();
		});
	}
	release(e) {
		let { _slots: t, _freeList: n } = this;
		if (!t.has(e)) return;
		let r = t.get(e);
		n.push(r), t.delete(e);
	}
	resize(e, t = this.slotSize) {
		let n = this.image, r = this._columns, i = this.slotSize, a = Math.ceil(Math.sqrt(e)), o = document.createElement("canvas");
		o.width = a * t, o.height = a * t;
		let s = o.getContext("2d");
		for (let e of this._slots.values()) {
			let o = e % r * i, c = Math.floor(e / r) * i, l = e % a * t, u = Math.floor(e / a) * t;
			s.drawImage(n, o, c, i, i, l, u, t, t);
		}
		this.image = o, this.ctx = s, this.slotSize = t, this._columns = a, this._capacity = e, this.needsUpdate = !0;
	}
	clear() {
		this._slots.clear(), this._freeList.length = 0, this._nextIndex = 0, this.ctx.clearRect(0, 0, this.image.width, this.image.height), this.needsUpdate = !0;
	}
	_draw(e, t) {
		let { ctx: n, _freeList: r, _capacity: i, _slots: a } = this, o;
		if (a.has(e)) o = a.get(e);
		else {
			if (r.length > 0) o = r.pop();
			else if (this._nextIndex < i) o = this._nextIndex++;
			else throw Error("GlyphAtlasTexture: atlas is full. Call resize() to increase capacity.");
			a.set(e, o);
		}
		let s = this._indexToSlot(o);
		return n.save(), n.beginPath(), n.rect(s.x, s.y, s.w, s.h), n.clip(), t(n, s.x, s.y, s.w, s.h), n.restore(), this.needsUpdate = !0, s;
	}
	_indexToSlot(e) {
		let { _columns: t, slotSize: n } = this;
		return {
			x: e % t * n,
			y: Math.floor(e / t) * n,
			w: n,
			h: n
		};
	}
}, oo = e * Math.PI * 2, so = /* @__PURE__ */ new L("EPSG:3857");
function co(e) {
	return /:4326$/i.test(e);
}
function lo(e) {
	return /:3857$/i.test(e);
}
function uo(e) {
	return e.trim().split(/\s+/).map((e) => parseFloat(e));
}
function fo(e, t) {
	co(t) && ([e[1], e[0]] = [e[0], e[1]]);
}
function po(e, t) {
	if (lo(t)) return e[0] = so.convertNormalizedToLongitude(.5 + e[0] / oo), e[1] = so.convertNormalizedToLatitude(.5 + e[1] / oo), e[0] *= j.RAD2DEG, e[1] *= j.RAD2DEG, e;
}
function mo(e) {
	e[0] *= j.DEG2RAD, e[1] *= j.DEG2RAD;
}
var ho = class extends r {
	parse(e) {
		let t = new TextDecoder("utf-8").decode(new Uint8Array(e)), n = new DOMParser().parseFromString(t, "text/xml"), r = n.querySelector("Contents"), i = wo(r, "TileMatrixSet").map((e) => So(e)), a = wo(r, "Layer").map((e) => _o(e)), o = go(n.querySelector("ServiceIdentification"));
		return a.forEach((e) => {
			e.tileMatrixSets = e.tileMatrixSetLinks.map((e) => i.find((t) => t.identifier === e));
		}), {
			serviceIdentification: o,
			tileMatrixSets: i,
			layers: a
		};
	}
};
function go(e) {
	return {
		title: e.querySelector("Title").textContent,
		abstract: e.querySelector("Abstract")?.textContent || "",
		serviceType: e.querySelector("ServiceType").textContent,
		serviceTypeVersion: e.querySelector("ServiceTypeVersion").textContent
	};
}
function _o(e) {
	let t = e.querySelector("Title").textContent, n = e.querySelector("Identifier").textContent, r = e.querySelector("Format").textContent, i = wo(e, "ResourceURL").map((e) => vo(e)), a = wo(e, "TileMatrixSetLink").map((e) => wo(e, "TileMatrixSet")[0].textContent), o = wo(e, "Style").map((e) => xo(e)), s = wo(e, "Dimension").map((e) => yo(e)), c = bo(e.querySelector("WGS84BoundingBox"));
	return c ||= bo(e.querySelector("BoundingBox")), {
		title: t,
		identifier: n,
		format: r,
		dimensions: s,
		tileMatrixSetLinks: a,
		styles: o,
		boundingBox: c,
		resourceUrls: i
	};
}
function vo(e) {
	return {
		template: e.getAttribute("template"),
		format: e.getAttribute("format"),
		resourceType: e.getAttribute("resourceType")
	};
}
function yo(e) {
	return {
		identifier: e.querySelector("Identifier").textContent,
		uom: e.querySelector("UOM")?.textContent || "",
		defaultValue: e.querySelector("Default").textContent,
		current: e.querySelector("Current")?.textContent === "true",
		values: wo(e, "Value").map((e) => e.textContent)
	};
}
function bo(e) {
	if (!e) return null;
	let t = e.nodeName.endsWith("WGS84BoundingBox") ? "urn:ogc:def:crs:CRS::84" : e.getAttribute("crs"), n = uo(e.querySelector("LowerCorner").textContent), r = uo(e.querySelector("UpperCorner").textContent);
	return fo(n, t), fo(r, t), po(n, t), po(r, t), mo(n), mo(r), {
		crs: t,
		lowerCorner: n,
		upperCorner: r,
		bounds: [...n, ...r]
	};
}
function xo(e) {
	return {
		title: e.querySelector("Title")?.textContent || null,
		identifier: e.querySelector("Identifier").textContent,
		isDefault: e.getAttribute("isDefault") === "true"
	};
}
function So(e) {
	let t = e.querySelector("SupportedCRS").textContent, n = e.querySelector("Title")?.textContent || "", r = e.querySelector("Identifier").textContent, i = e.querySelector("Abstract")?.textContent || "", a = [];
	return e.querySelectorAll("TileMatrix").forEach((e, n) => {
		let r = Co(e), i = 28e-5 * r.scaleDenominator, o = r.tileWidth * r.matrixWidth * i, s = r.tileHeight * r.matrixHeight * i, c;
		fo(r.topLeftCorner, t), c = lo(t) ? [r.topLeftCorner[0] + o, r.topLeftCorner[1] - s] : [r.topLeftCorner[0] + 360 * o / oo, r.topLeftCorner[1] - 360 * s / oo], po(c, t), po(r.topLeftCorner, t), mo(c), mo(r.topLeftCorner), r.bounds = [...r.topLeftCorner, ...c], [r.bounds[1], r.bounds[3]] = [r.bounds[3], r.bounds[1]], a.push(r);
	}), {
		title: n,
		identifier: r,
		abstract: i,
		supportedCRS: t,
		tileMatrices: a
	};
}
function Co(e) {
	return {
		identifier: e.querySelector("Identifier").textContent,
		tileWidth: parseFloat(e.querySelector("TileWidth").textContent),
		tileHeight: parseFloat(e.querySelector("TileHeight").textContent),
		matrixWidth: parseFloat(e.querySelector("MatrixWidth").textContent),
		matrixHeight: parseFloat(e.querySelector("MatrixHeight").textContent),
		scaleDenominator: parseFloat(e.querySelector("ScaleDenominator").textContent),
		topLeftCorner: uo(e.querySelector("TopLeftCorner").textContent),
		bounds: null
	};
}
function wo(e, t) {
	return [...e.children].filter((e) => e.tagName === t);
}
//#endregion
//#region src/three/plugins/loaders/WMSCapabilitiesLoader.js
var To = e * Math.PI * 2, Eo = /* @__PURE__ */ new L("EPSG:3857");
function Do(e) {
	return /:4326$/i.test(e);
}
function Oo(e) {
	return /:3857$/i.test(e);
}
function ko(e, t) {
	return Oo(t) && (e[0] = Eo.convertNormalizedToLongitude(.5 + e[0] / (Math.PI * 2 * To)), e[1] = Eo.convertNormalizedToLatitude(.5 + e[1] / (Math.PI * 2 * To)), e[0] *= j.RAD2DEG, e[1] *= j.RAD2DEG), e;
}
function Ao(e, t, n) {
	let [r, i] = n.split(".").map((e) => parseInt(e)), a = r === 1 && i < 3 || r < 1;
	Do(t) && a && ([e[0], e[1]] = [e[1], e[0]]);
}
function jo(e) {
	e[0] *= j.DEG2RAD, e[1] *= j.DEG2RAD;
}
function Mo(e, t) {
	if (!e) return null;
	let n = e.getAttribute("CRS") || e.getAttribute("crs") || e.getAttribute("SRS") || "", r = parseFloat(e.getAttribute("minx")), i = parseFloat(e.getAttribute("miny")), a = parseFloat(e.getAttribute("maxx")), o = parseFloat(e.getAttribute("maxy")), s = [r, i], c = [a, o];
	return Ao(s, n, t), Ao(c, n, t), ko(s, n), ko(c, n), jo(s), jo(c), {
		crs: n,
		bounds: [...s, ...c]
	};
}
function No(e) {
	let t = parseFloat(e.querySelector("westBoundLongitude").textContent), n = parseFloat(e.querySelector("eastBoundLongitude").textContent), r = parseFloat(e.querySelector("southBoundLatitude").textContent), i = parseFloat(e.querySelector("northBoundLatitude").textContent), a = [t, r], o = [n, i];
	return jo(a), jo(o), [...a, ...o];
}
function Po(e) {
	let t = parseFloat(e.getAttribute("minx").textContent), n = parseFloat(e.getAttribute("maxx").textContent), r = parseFloat(e.getAttribute("miny").textContent), i = parseFloat(e.getAttribute("maxy").textContent), a = [t, r], o = [n, i];
	return jo(a), jo(o), [...a, ...o];
}
function Fo(e) {
	return {
		name: e.querySelector("Name").textContent,
		title: e.querySelector("Title").textContent,
		legends: [...e.querySelectorAll("LegendURL")].map((e) => ({
			width: parseInt(e.getAttribute("width")),
			height: parseInt(e.getAttribute("height")),
			format: e.querySelector("Format").textContent,
			url: Ro(e.querySelector("OnlineResource"))
		}))
	};
}
function Io(e, t, n = {}) {
	let { styles: r = [], crs: i = [], contentBoundingBox: a = null, queryable: o = !1, opaque: s = !1 } = n, c = e.querySelector(":scope > Name")?.textContent || null, l = e.querySelector(":scope > Title")?.textContent || "", u = e.querySelector(":scope > Abstract")?.textContent || "", d = [...e.querySelectorAll(":scope > Keyword")].map((e) => e.textContent), f = [...e.querySelectorAll(":scope > BoundingBox")].map((e) => Mo(e, t));
	i = [...i, ...Array.from(e.querySelectorAll("CRS")).map((e) => e.textContent)], r = [...r, ...Array.from(e.querySelectorAll(":scope > Style")).map((e) => Fo(e))], e.hasAttribute("queryable") && (o = e.getAttribute("queryable") === "1"), e.hasAttribute("opaque") && (s = e.getAttribute("opaque") === "1"), e.querySelector("EX_GeographicBoundingBox") ? a = No(e.querySelector("EX_GeographicBoundingBox")) : e.querySelector("LatLonBoundingBox") && (a = Po(e.querySelector("LatLonBoundingBox")));
	let p = Array.from(e.querySelectorAll(":scope > Layer")).map((e) => Io(e, t, {
		styles: r,
		crs: i,
		contentBoundingBox: a,
		queryable: o,
		opaque: s
	}));
	return {
		name: c,
		title: l,
		abstract: u,
		queryable: o,
		opaque: s,
		keywords: d,
		crs: i,
		boundingBoxes: f,
		contentBoundingBox: a,
		styles: r,
		subLayers: p
	};
}
function Lo(e) {
	return {
		name: e.querySelector("Name")?.textContent || "",
		title: e.querySelector("Title")?.textContent || "",
		abstract: e.querySelector("Abstract")?.textContent || "",
		keywords: Array.from(e.querySelectorAll("Keyword")).map((e) => e.textContent),
		maxWidth: parseFloat(e.querySelector("MaxWidth")) || null,
		maxHeight: parseFloat(e.querySelector("MaxHeight")) || null,
		layerLimit: parseFloat(e.querySelector("LayerLimit")) || null
	};
}
function Ro(e) {
	return e ? (e.getAttribute("xlink:href") || e.getAttributeNS("http://www.w3.org/1999/xlink", "href") || "").trim() : "";
}
function zo(e) {
	let t = Array.from(e.querySelectorAll("Format")).map((e) => e.textContent.trim()), n = Array.from(e.querySelectorAll("DCPType")).map((e) => {
		let t = e.querySelector("HTTP"), n = t.querySelector("Get OnlineResource") || t.querySelector("Get > OnlineResource") || t.querySelector("Get"), r = t.querySelector("Post OnlineResource") || t.querySelector("Post > OnlineResource") || t.querySelector("Post");
		return {
			type: "HTTP",
			get: Ro(n),
			post: Ro(r)
		};
	});
	return {
		formats: t,
		dcp: n,
		href: n[0].get
	};
}
function Bo(e) {
	let t = {};
	return Array.from(e.querySelectorAll(":scope > *")).forEach((e) => {
		let n = e.localName;
		t[n] = zo(e);
	}), t;
}
function Vo(e, t = []) {
	return e.forEach((e) => {
		e.name !== null && t.push(e), Vo(e.subLayers, t);
	}), t;
}
var Ho = class extends r {
	parse(e) {
		let t = new TextDecoder("utf-8").decode(new Uint8Array(e)), n = new DOMParser().parseFromString(t, "text/xml"), r = (n.querySelector("WMS_Capabilities") || n.querySelector("WMT_MS_Capabilities")).getAttribute("version"), i = n.querySelector("Capability"), a = Lo(n.querySelector(":scope > Service")), o = Bo(i.querySelector(":scope > Request"));
		return {
			version: r,
			service: a,
			layers: Vo(Array.from(i.querySelectorAll(":scope > Layer")).map((e) => Io(e, r))),
			request: o
		};
	}
};
//#endregion
export { Kt as A, R as B, hr as C, wn as D, Tn as E, W as F, Ve as H, qt as I, Jt as L, Ut as M, Ht as N, Xt as O, Yt as P, Wt as R, yr as S, Dn as T, Be as V, jr as _, io as a, Dr as b, yi as c, xi as d, bi as f, Mr as g, Xr as h, ro as i, Zt as j, Gt as k, vi as l, si as m, ho as n, Ka as o, _i as p, ao as r, ta as s, Ho as t, Si as u, kr as v, jn as w, wr as x, Or as y, Xe as z };

//# sourceMappingURL=plugins-xrSJguC1.js.map