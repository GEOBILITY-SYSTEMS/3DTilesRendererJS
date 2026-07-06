import { Scheduler as e } from "./renderer-BcKWXcM-.js";
import { CameraTransitionManager as t, Ellipsoid as n, EnvironmentControls as r, GlobeControls as i, TilesRenderer as a, WGS84_ELLIPSOID as o } from "./renderer-CrROfuUq.js";
import { BackSide as s, EventDispatcher as c, Line3 as l, Matrix4 as u, Object3D as d, OrthographicCamera as f, Ray as p, Raycaster as m, Scene as h, Vector2 as g, Vector3 as _ } from "three";
import { StrictMode as v, cloneElement as y, createContext as b, forwardRef as x, useCallback as S, useContext as C, useEffect as w, useLayoutEffect as T, useMemo as E, useReducer as ee, useRef as D, useState as O } from "react";
import { createPortal as te, useFrame as k, useThree as A } from "@react-three/fiber";
import { Fragment as j, jsx as M, jsxs as N } from "react/jsx-runtime";
import { createRoot as ne } from "react-dom/client";
//#region src/r3f/utilities/useObjectDep.js
function areObjectsEqual(e, t) {
	if (e === t) return !0;
	if (!e || !t) return e === t;
	for (let n in e) if (e[n] !== t[n]) return !1;
	for (let n in t) if (e[n] !== t[n]) return !1;
	return !0;
}
function useObjectDep(e) {
	let t = D();
	return areObjectsEqual(t.current, e) || (t.current = e), t.current;
}
//#endregion
//#region src/r3f/utilities/useOptions.js
function isEventName(e) {
	return /^on/g.test(e);
}
function getEventName(e) {
	return e.replace(/^on/, "").replace(/[a-z][A-Z]/g, (e) => `${e[0]}-${e[1]}`).toLowerCase();
}
function getPath(e) {
	return e.split("-");
}
function getValueAtPath(e, t) {
	let n = e, r = [...t];
	for (; r.length !== 0;) {
		let e = r.shift();
		n = n[e];
	}
	return n;
}
function setValueAtPath(e, t, n) {
	let r = [...t], i = r.pop();
	getValueAtPath(e, r)[i] = n;
}
function useDeepOptions(e, t, n = !1) {
	T(() => {
		if (e === null) return;
		let r = {}, i = {};
		for (let a in t) if (isEventName(a) && e.addEventListener && !(a in e)) {
			let n = getEventName(a);
			i[n] = t[a], e.addEventListener(n, t[a]);
		} else {
			let i = n ? [a] : getPath(a);
			r[a] = getValueAtPath(e, i), setValueAtPath(e, i, t[a]);
		}
		return () => {
			for (let t in i) e.removeEventListener(t, i[t]);
			for (let t in r) setValueAtPath(e, n ? [t] : getPath(t), r[t]);
		};
	}, [e, useObjectDep(t)]);
}
function useShallowOptions(e, t) {
	useDeepOptions(e, t, !0);
}
//#endregion
//#region src/r3f/utilities/useApplyRefs.js
function useApplyRefs(e, ...t) {
	w(() => {
		t.forEach((t) => {
			t && (t instanceof Function ? t(e) : t.current = e);
		});
	}, [e, ...t]);
}
//#endregion
//#region src/r3f/components/TilesRenderer.jsx
var P = b(null), F = b(null), I = b(null);
function TileSetRoot({ children: e }) {
	let t = C(P), n = D();
	return w(() => {
		t && (n.current.matrixWorld = t.group.matrixWorld);
	}, [t]), /* @__PURE__ */ M("group", {
		ref: n,
		matrixWorldAutoUpdate: !1,
		matrixAutoUpdate: !1,
		children: e
	});
}
function EastNorthUpFrame(e) {
	let { lat: t = 0, lon: n = 0, height: r = 0, az: i = 0, el: a = 0, roll: s = 0, ellipsoid: c = o.clone(), children: l } = e, u = C(P), f = A((e) => e.invalidate), [p, m] = O(null), h = S(() => {
		if (p === null) return;
		let e = u && u.ellipsoid || c || null;
		p.matrix.identity(), p.visible = !!(u && u.root || c), e !== null && (e.getOrientedEastNorthUpFrame(t, n, r, i, a, s, p.matrix), p.matrix.decompose(p.position, p.quaternion, p.scale), p.updateMatrixWorld(), f());
	}, [
		f,
		u,
		t,
		n,
		r,
		i,
		a,
		s,
		c,
		p,
		useObjectDep(c.radius)
	]);
	return w(() => {
		if (u !== null && p !== null) return p.updateMatrixWorld = function(e) {
			this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.matrixWorld.multiplyMatrices(u.group.matrixWorld, this.matrix), e = !0);
			let t = this.children;
			for (let n = 0, r = t.length; n < r; n++) t[n].updateMatrixWorld(e);
		}, () => {
			p.updateMatrixWorld = d.prototype.updateMatrixWorld;
		};
	}, [u, p]), w(() => {
		h();
	}, [h]), w(() => {
		if (u !== null) return u.addEventListener("load-tileset", h), () => {
			u.removeEventListener("load-tileset", h);
		};
	}, [u, h]), /* @__PURE__ */ M("group", {
		ref: m,
		children: l
	});
}
var re = x(function TilesPlugin(e, t) {
	let { plugin: n, args: r, children: i, ...a } = e, o = C(P), [s, c] = O(null), [, l] = ee((e) => e + 1, 0);
	if (T(() => {
		if (o === null) return;
		let e;
		return e = Array.isArray(r) ? new n(...r) : new n(r), c(e), () => {
			c(null);
		};
	}, [
		n,
		o,
		useObjectDep(r)
	]), useDeepOptions(s, a), T(() => {
		if (s !== null) return o.registerPlugin(s), l(), () => {
			o.unregisterPlugin(s);
		};
	}, [s]), useApplyRefs(s, t), !(!s || !o.plugins.includes(s))) return /* @__PURE__ */ M(F.Provider, {
		value: s,
		children: i
	});
}), ie = x(function TilesRenderer(e, t) {
	let { url: n, group: r = {}, enabled: i = !0, children: o, ...s } = e, [c, l, u] = A((e) => [
		e.camera,
		e.gl,
		e.invalidate
	]), [d, f] = O(null);
	w(() => {
		let needsRender = () => u(), e = new a(n);
		return e.addEventListener("needs-render", needsRender), e.addEventListener("needs-update", needsRender), f(e), () => {
			e.removeEventListener("needs-render", needsRender), e.removeEventListener("needs-update", needsRender), e.dispose(), f(null);
		};
	}, [n, u]), k(() => {
		d === null || !i || (c.updateMatrixWorld(), d.setResolutionFromRenderer(c, l), d.update());
	}), T(() => {
		if (d !== null) return d.setCamera(c), () => {
			d.deleteCamera(c);
		};
	}, [d, c]), useApplyRefs(d, t), useDeepOptions(d, s);
	let p = E(() => d ? {
		ellipsoid: d.ellipsoid,
		frame: d.group
	} : null, [d?.ellipsoid, d?.group]);
	return d ? /* @__PURE__ */ N(j, { children: [/* @__PURE__ */ M("primitive", {
		object: d.group,
		...r
	}), /* @__PURE__ */ M(P.Provider, {
		value: d,
		children: /* @__PURE__ */ M(I.Provider, {
			value: p,
			children: /* @__PURE__ */ M(TileSetRoot, { children: o })
		})
	})] }) : null;
}), L = x(function CanvasDOMOverlay({ children: e, ...t }, n) {
	let [r] = A((e) => [e.gl]), [i, a] = O(null), o = E(() => document.createElement("div"), []);
	w(() => (o.style.pointerEvents = "none", o.style.position = "absolute", o.style.width = "100%", o.style.height = "100%", o.style.left = 0, o.style.top = 0, r.domElement.parentNode.appendChild(o), () => {
		o.remove();
	}), [o, r.domElement.parentNode]), w(() => {
		let e = ne(o);
		return a(e), () => {
			e.unmount();
		};
	}, [o]), i !== null && i.render(/* @__PURE__ */ M(v, { children: /* @__PURE__ */ M("div", {
		...t,
		ref: n,
		children: e
	}) }));
});
//#endregion
//#region src/r3f/components/TilesAttributionOverlay.jsx
function randomID() {
	return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}
function TilesAttributionOverlay({ children: e, style: t, generateAttributions: n, ...r }) {
	let i = C(P), [a, o] = O([]);
	w(() => {
		if (!i) return;
		let e = !1, callback = () => {
			e || (e = !0, queueMicrotask(() => {
				o(i.getAttributions()), e = !1;
			}));
		};
		return i.addEventListener("tile-visibility-change", callback), i.addEventListener("load-tileset", callback), () => {
			i.removeEventListener("tile-visibility-change", callback), i.removeEventListener("load-tileset", callback);
		};
	}, [i]);
	let s = E(() => "class_" + randomID(), []), c = E(() => `
		#${s} a {
			color: white;
		}

		#${s} img {
			max-width: 125px;
			display: block;
			margin: 5px 0;
		}
	`, [s]), l;
	if (n) l = n(a, s);
	else {
		let e = [];
		a.forEach((t, n) => {
			let r = null;
			t.type === "string" ? r = /* @__PURE__ */ M("div", { children: t.value }, n) : t.type === "html" ? r = /* @__PURE__ */ M("div", {
				dangerouslySetInnerHTML: { __html: t.value },
				style: { pointerEvents: "all" }
			}, n) : t.type === "image" && (r = /* @__PURE__ */ M("div", { children: /* @__PURE__ */ M("img", { src: t.value }) }, n)), r && e.push(r);
		}), l = /* @__PURE__ */ N(j, { children: [/* @__PURE__ */ M("style", { children: c }), e] });
	}
	return /* @__PURE__ */ N(L, {
		id: s,
		style: {
			position: "absolute",
			bottom: 0,
			left: 0,
			padding: "10px",
			color: "rgba( 255, 255, 255, 0.75 )",
			fontSize: "10px",
			...t
		},
		...r,
		children: [e, l]
	});
}
//#endregion
//#region src/r3f/components/CameraControls.jsx
var R = x(function ControlsBaseComponent(e, t) {
	let { controlsConstructor: n, domElement: r, scene: i, camera: a, ellipsoid: o, ellipsoidFrame: s, ...c } = e, [l] = A((e) => [e.camera]), [u] = A((e) => [e.gl]), [d] = A((e) => [e.scene]), [f] = A((e) => [e.invalidate]), [p] = A((e) => [e.get]), [m] = A((e) => [e.set]), h = C(I), g = a || l || null, _ = i || d || null, v = r || u.domElement || null, y = o || h?.ellipsoid || null, b = s || h?.frame || null, x = E(() => new n(), [n]);
	useApplyRefs(x, t), w(() => {
		let callback = () => f();
		return x.addEventListener("change", callback), x.addEventListener("start", callback), x.addEventListener("end", callback), () => {
			x.removeEventListener("change", callback), x.removeEventListener("start", callback), x.removeEventListener("end", callback);
		};
	}, [x, f]), w(() => {
		x.setCamera(g);
	}, [x, g]), w(() => {
		x.setScene(_);
	}, [x, _]), w(() => {
		x.isGlobeControls && x.setEllipsoid(y, b);
	}, [
		x,
		y,
		b
	]), w(() => (x.attach(v), () => {
		x.detach();
	}), [x, v]), w(() => {
		let e = p().controls;
		return m({ controls: x }), () => m({ controls: e });
	}, [
		x,
		p,
		m
	]), k(() => {
		x.update();
	}, -1), useShallowOptions(x, c);
}), ae = x(function EnvironmentControls(e, t) {
	return /* @__PURE__ */ M(R, {
		...e,
		ref: t,
		controlsConstructor: r
	});
}), oe = x(function GlobeControls(e, t) {
	return /* @__PURE__ */ M(R, {
		...e,
		ref: t,
		controlsConstructor: i
	});
}), z = /*@__PURE__*/ new _(), B = /*@__PURE__*/ new _(), V = /*@__PURE__*/ new _(), H = /*@__PURE__*/ new u(), U = /*@__PURE__*/ new u(), W = /*@__PURE__*/ new p(), G = {};
function getCameraFocusPoint(e, t, n, r) {
	W.origin.copy(e.position), W.direction.set(0, 0, -1).transformDirection(e.matrixWorld), W.applyMatrix4(n.matrixWorldInverse), t.closestPointToRayEstimate(W, V), V.applyMatrix4(n.matrixWorld), B.set(0, 0, -1).transformDirection(e.matrixWorld);
	let i = V.sub(e.position).dot(B);
	return r.copy(e.position).addScaledVector(B, i), r;
}
function RenderPortal(e) {
	let { defaultScene: t, defaultCamera: n, overrideRenderLoop: r = !0, renderPriority: i = 1 } = e, a = E(() => new f(), []), [o, s, c, l] = A((e) => [
		e.set,
		e.size,
		e.gl,
		e.scene
	]);
	w(() => {
		o({ camera: a });
	}, [o, a]), w(() => {
		a.left = -s.width / 2, a.right = s.width / 2, a.top = s.height / 2, a.bottom = -s.height / 2, a.near = 0, a.far = 2e3, a.position.z = a.far / 2, a.updateProjectionMatrix();
	}, [a, s]), k(() => {
		r && c.render(t, n);
		let e = c.autoClear;
		c.autoClear = !1, c.clearDepth(), c.render(l, a), c.autoClear = e;
	}, i);
}
function TriangleGeometry() {
	let e = D();
	return w(() => {
		let t = e.current.attributes.position;
		for (let e = 0, n = t.count; e < n; e++) z.fromBufferAttribute(t, e), z.y > 0 && (z.x = 0, t.setXYZ(e, ...z));
	}), /* @__PURE__ */ M("boxGeometry", { ref: e });
}
function CompassGraphic({ northColor: e = 15684432, southColor: t = 16777215 }) {
	let [n, r] = O(), i = D();
	return w(() => {
		r(i.current);
	}, []), /* @__PURE__ */ N("group", {
		scale: .5,
		ref: i,
		children: [
			/* @__PURE__ */ M("ambientLight", { intensity: 1 }),
			/* @__PURE__ */ M("directionalLight", {
				position: [
					0,
					2,
					3
				],
				intensity: 3,
				target: n
			}),
			/* @__PURE__ */ M("directionalLight", {
				position: [
					0,
					-2,
					-3
				],
				intensity: 3,
				target: n
			}),
			/* @__PURE__ */ N("mesh", { children: [/* @__PURE__ */ M("sphereGeometry", {}), /* @__PURE__ */ M("meshBasicMaterial", {
				color: 0,
				opacity: .3,
				transparent: !0,
				side: s
			})] }),
			/* @__PURE__ */ N("group", {
				scale: [
					.5,
					1,
					.15
				],
				children: [/* @__PURE__ */ N("mesh", {
					"position-y": .5,
					children: [/* @__PURE__ */ M(TriangleGeometry, {}), /* @__PURE__ */ M("meshStandardMaterial", { color: e })]
				}), /* @__PURE__ */ N("mesh", {
					"position-y": -.5,
					"rotation-x": Math.PI,
					children: [/* @__PURE__ */ M(TriangleGeometry, {}), /* @__PURE__ */ M("meshStandardMaterial", { color: t })]
				})]
			})
		]
	});
}
function CompassGizmo({ children: e, overrideRenderLoop: t, mode: n = "3d", margin: r = 10, scale: i = 35, visible: a = !0, ...o }) {
	let [s, c, l] = A((e) => [
		e.camera,
		e.scene,
		e.size
	]), u = C(I), d = D(null), f = E(() => new h(), []), p, m;
	return Array.isArray(r) ? (p = r[0], m = r[1]) : (p = r, m = r), k(() => {
		let e = u?.ellipsoid, t = u?.frame;
		if (!e || !t || d.current === null) return null;
		let r = d.current;
		if (getCameraFocusPoint(s, e, t, V).applyMatrix4(t.matrixWorldInverse), e.getPositionToCartographic(V, G), e.getEastNorthUpFrame(G.lat, G.lon, 0, U).premultiply(t.matrixWorld), U.invert(), H.copy(s.matrixWorld).premultiply(U), n.toLowerCase() === "3d") r.quaternion.setFromRotationMatrix(H).invert();
		else if (z.set(0, 1, 0).transformDirection(H).normalize(), z.z = 0, z.normalize(), z.length() === 0) r.quaternion.identity();
		else {
			let e = B.set(0, 1, 0).angleTo(z);
			B.cross(z).normalize(), r.quaternion.setFromAxisAngle(B, -e);
		}
	}), e ||= /* @__PURE__ */ M(CompassGraphic, {}), a ? te(/* @__PURE__ */ N(j, { children: [/* @__PURE__ */ M("group", {
		ref: d,
		scale: i,
		position: [
			l.width / 2 - p - i / 2,
			-l.height / 2 + m + i / 2,
			0
		],
		...o,
		children: e
	}), /* @__PURE__ */ M(RenderPortal, {
		defaultCamera: s,
		defaultScene: c,
		overrideRenderLoop: t,
		renderPriority: 10
	})] }), f, { events: { priority: 10 } }) : null;
}
//#endregion
//#region src/r3f/components/CameraTransition.jsx
var se = x(function CameraTransition(e, n) {
	let { mode: r = "perspective", onBeforeToggle: i, perspectiveCamera: a, orthographicCamera: o, ...s } = e, [c, l, u, d, f, p] = A((e) => [
		e.set,
		e.get,
		e.invalidate,
		e.controls,
		e.camera,
		e.size
	]), m = E(() => {
		let e = new t();
		return e.autoSync = !1, f.isOrthographicCamera ? (e.orthographicCamera.copy(f), e.mode = "orthographic") : e.perspectiveCamera.copy(f), e.syncCameras(), e.mode = r, e;
	}, []);
	w(() => {
		let { perspectiveCamera: e, orthographicCamera: t } = m, n = p.width / p.height;
		e.aspect = n, e.updateProjectionMatrix(), t.left = -t.top * n, t.right = -t.left, e.updateProjectionMatrix();
	}, [m, p]), useApplyRefs(m, n), w(() => {
		let cameraCallback = ({ camera: e }) => {
			c(() => ({ camera: e }));
		};
		return c(() => ({ camera: m.camera })), m.addEventListener("camera-change", cameraCallback), () => {
			m.removeEventListener("camera-change", cameraCallback);
		};
	}, [m, c]), w(() => {
		let e = m.perspectiveCamera, t = m.orthographicCamera;
		return m.perspectiveCamera = a || e, m.orthographicCamera = o || t, c(() => ({ camera: m.camera })), () => {
			m.perspectiveCamera = e, m.orthographicCamera = t;
		};
	}, [
		a,
		o,
		m,
		c
	]), w(() => {
		if (r !== m.mode) {
			let e = r === "orthographic" ? m.orthographicCamera : m.perspectiveCamera;
			i ? i(m, e) : d && d.isEnvironmentControls ? (d.getPivotPoint(m.fixedPoint), m.syncCameras(), d.adjustCamera(m.perspectiveCamera), d.adjustCamera(m.orthographicCamera)) : (m.fixedPoint.set(0, 0, -1).transformDirection(m.camera.matrixWorld).multiplyScalar(50).add(m.camera.position), m.syncCameras()), m.toggle(), u();
		}
	}, [
		r,
		m,
		u,
		d,
		i
	]), w(() => {
		let callback = () => u();
		return m.addEventListener("transition-start", callback), m.addEventListener("change", callback), m.addEventListener("transition-end", callback), () => {
			m.removeEventListener("transition-start", callback), m.removeEventListener("change", callback), m.removeEventListener("transition-end", callback);
		};
	}, [m, u]), useDeepOptions(m, s), k(() => {
		m.update(), d && (d.enabled = !m.animating);
		let { camera: e, size: t } = l();
		if (!o && e === m.orthographicCamera) {
			let e = t.width / t.height, n = m.orthographicCamera;
			e !== n.right && (n.bottom = -1, n.top = 1, n.left = -e, n.right = e, n.updateProjectionMatrix());
		}
		m.animating && u();
	}, -1);
});
//#endregion
//#region src/r3f/utilities/useMultipleRefs.js
function useMultipleRefs(...e) {
	return S((t) => {
		e.forEach((e) => {
			e && (typeof e == "function" ? e(t) : e.current = t);
		});
	}, e);
}
//#endregion
//#region src/r3f/utilities/SceneObserver.js
function traverse(e, t) {
	t(e) || e.children.forEach((e) => {
		traverse(e, t);
	});
}
var SceneObserver = class extends c {
	constructor() {
		super(), this.objects = /* @__PURE__ */ new Set(), this.observed = /* @__PURE__ */ new Set(), this._addedCallback = ({ child: e }) => {
			traverse(e, (t) => this.observed.has(t) ? !0 : (this.objects.add(t), t.addEventListener("childadded", this._addedCallback), t.addEventListener("childremoved", this._removedCallback), this.dispatchEvent({
				type: "childadded",
				child: e
			}), !1));
		}, this._removedCallback = ({ child: e }) => {
			traverse(e, (t) => this.observed.has(t) ? !0 : (this.objects.delete(t), t.removeEventListener("childadded", this._addedCallback), t.removeEventListener("childremoved", this._removedCallback), this.dispatchEvent({
				type: "childremoved",
				child: e
			}), !1));
		};
	}
	observe(e) {
		let { observed: t } = this;
		this._addedCallback({ child: e }), t.add(e);
	}
	unobserve(e) {
		let { observed: t } = this;
		t.delete(e), this._removedCallback({ child: e });
	}
	dispose() {
		this.observed.forEach((e) => {
			this.unobserve(e);
		});
	}
}, K = /* @__PURE__ */ new m(), q = /* @__PURE__ */ new l(), J = /* @__PURE__ */ new l(), Y = /* @__PURE__ */ new g(), X = /* @__PURE__ */ new _(), ce = /* @__PURE__ */ new u(), QueryManager = class extends c {
	constructor() {
		super(), this.autoRun = !0, this.queryMap = /* @__PURE__ */ new Map(), this.index = 0, this.queued = [], this.scheduled = !1, this.duration = 1, this.objects = [], this.observer = new SceneObserver(), this.ellipsoid = new n(), this.frame = new u(), this.cameras = /* @__PURE__ */ new Set();
		let e = (() => {
			let e = !1;
			return () => {
				e || (e = !0, queueMicrotask(() => {
					this.queryMap.forEach((e) => this._enqueue(e)), e = !1;
				}));
			};
		})();
		this.observer.addEventListener("childadded", e), this.observer.addEventListener("childremoved", e);
	}
	_enqueue(e) {
		e.queued || (this.queued.push(e), e.queued = !0, this._scheduleRun());
	}
	_runJobs() {
		let { queued: e, cameras: t, duration: n } = this, r = performance.now();
		for (t.forEach((t, n) => {
			ce.copy(t.matrixWorldInverse).premultiply(t.projectionMatrix), X.set(0, 0, -1).transformDirection(t.matrixWorld), q.start.setFromMatrixPosition(t.matrixWorld), q.end.addVectors(X, q.start);
			for (let t = 0, r = e.length; t < r; t++) {
				let r = e[t], { ray: i } = r;
				if (r.point === null) J.start.copy(i.origin), i.at(1, J.end), le(q, J, Y), r.distance = Y.x * (1 - Math.abs(X.dot(i.direction))), r.inFrustum = !0;
				else {
					let e = J.start;
					e.copy(r.point).applyMatrix4(ce), e.x > -1 && e.x < 1 && e.y > -1 && e.y < 1 && e.z > -1 && e.z < 1 ? (r.distance = e.subVectors(r.point, q.start).dot(X), r.inFrustum = !0) : (r.distance = 0, r.inFrustum = !1);
				}
				n === 0 ? (r.distance = void 0, r.inFrustum = void 0) : (r.inFrustum = r.inFrustum || void 0, r.distance = Math.min(r.distance, void 0));
			}
		}), t.length !== 0 && e.sort((e, t) => e.point === null == (t.point === null) ? e.inFrustum === t.inFrustum ? e.distance < 0 == t.distance < 0 ? t.distance - e.distance : e.distance < 0 ? -1 : 1 : e.inFrustum ? 1 : -1 : e.point === null ? 1 : -1); e.length !== 0 && performance.now() - r < n;) {
			let t = e.pop();
			t.queued = !1, this._updateQuery(t);
		}
		e.length !== 0 && this._scheduleRun();
	}
	_scheduleRun() {
		this.autoRun && !this.scheduled && (this.scheduled = !0, e.requestAnimationFrame(() => {
			this.scheduled = !1, this._runJobs();
		}));
	}
	_updateQuery(e) {
		K.ray.copy(e.ray), K.far = "lat" in e ? 1e4 + Math.max(...this.ellipsoid.radius) : Infinity;
		let t = K.intersectObjects(this.objects)[0] || null;
		t !== null && (e.point === null ? e.point = t.point.clone() : e.point.copy(t.point)), e.callback(t);
	}
	addCamera(e) {
		let { queryMap: t, cameras: n } = this;
		n.add(e), t.forEach((e) => this._enqueue(e));
	}
	deleteCamera(e) {
		let { cameras: t } = this;
		t.delete(e);
	}
	runIfNeeded(e) {
		let { queryMap: t, queued: n } = this, r = t.get(e);
		r.queued && (this._updateQuery(r), r.queued = !1, n.splice(n.indexOf(r), 1));
	}
	setScene(...e) {
		let { observer: t } = this;
		t.dispose(), e.forEach((e) => t.observe(e)), this.objects = e, this._scheduleRun();
	}
	setEllipsoidFromTilesRenderer(e) {
		let { queryMap: t, ellipsoid: n, frame: r } = this;
		(!n.radius.equals(e.ellipsoid.radius) || !r.equals(e.group.matrixWorld)) && (n.copy(e.ellipsoid), r.copy(e.group.matrixWorld), t.forEach((e) => {
			if ("lat" in e) {
				let { lat: t, lon: i, ray: a } = e;
				n.getCartographicToPosition(t, i, 1e4, a.origin).applyMatrix4(r), n.getCartographicToNormal(t, i, a.direction).transformDirection(r).multiplyScalar(-1);
			}
			this._enqueue(e);
		}));
	}
	registerRayQuery(e, t) {
		let n = this.index++, r = {
			ray: e.clone(),
			callback: t,
			queued: !1,
			distance: -1,
			point: null
		};
		return this.queryMap.set(n, r), this._enqueue(r), n;
	}
	registerLatLonQuery(e, t, n) {
		let { ellipsoid: r, frame: i } = this, a = this.index++, o = new p();
		r.getCartographicToPosition(e, t, 1e4, o.origin).applyMatrix4(i), r.getCartographicToNormal(e, t, o.direction).transformDirection(i).multiplyScalar(-1);
		let s = {
			ray: o.clone(),
			lat: e,
			lon: t,
			callback: n,
			queued: !1,
			distance: -1,
			point: null
		};
		return this.queryMap.set(a, s), this._enqueue(s), a;
	}
	unregisterQuery(e) {
		let { queued: t, queryMap: n } = this, r = n.get(e);
		n.delete(e), r && r.queued && (r.queued = !1, t.splice(t.indexOf(r), 1));
	}
	dispose() {
		this.queryMap.clear(), this.queued.length = 0, this.objects.length = 0, this.observer.dispose();
	}
}, le = (function() {
	let e = new _(), t = new _(), n = new _();
	return function closestPointLineToLine(r, i, a) {
		let o = r.start, s = e, c = i.start, l = t;
		n.subVectors(o, c), e.subVectors(r.end, r.start), t.subVectors(i.end, i.start);
		let u = n.dot(l), d = l.dot(s), f = l.dot(l), p = n.dot(s), m = s.dot(s) * f - d * d, h, g;
		h = m === 0 ? 0 : (u * d - p * f) / m, g = (u + h * d) / f, a.x = h, a.y = g;
	};
})(), Z = b(null), Q = /* @__PURE__ */ new u(), $ = /* @__PURE__ */ new p(), ue = x(function AnimatedSettledObject(e, t) {
	let { interpolationFactor: n = .025, onQueryUpdate: r = null, ...i } = e, a = C(P), o = C(Z), s = A(({ invalidate: e }) => e), c = E(() => new _(), []), l = E(() => ({ value: !1 }), []), u = E(() => ({ value: !1 }), []), d = D(null), f = S((e) => {
		if (a === null || e === null || d.current === null) return;
		let { lat: t, lon: n, rayorigin: l, raydirection: f } = i;
		t !== null && n !== null ? (c.copy(e.point), u.value = !0, o.ellipsoid.getObjectFrame(t, n, 0, 0, 0, 0, Q, 2).premultiply(a.group.matrixWorld), d.current.quaternion.setFromRotationMatrix(Q), s()) : l !== null && f !== null && (c.copy(e.point), u.value = !0, d.current.quaternion.identity(), s()), r && r(e);
	}, [
		s,
		u,
		o.ellipsoid,
		i,
		c,
		a,
		r
	]);
	return k((e, t) => {
		if (d.current && (d.current.visible = l.value), d.current && u.value) if (l.value === !1) l.value = !0, d.current.position.copy(c);
		else {
			let e = 1 - 2 ** (-t / n);
			d.current.position.distanceToSquared(c) > 1e-6 ? (d.current.position.lerp(c, n === 0 ? 1 : e), s()) : d.current.position.copy(c);
		}
	}), /* @__PURE__ */ M(de, {
		ref: useMultipleRefs(d, t),
		onQueryUpdate: f,
		...i
	});
}), de = x(function SettledObject(e, t) {
	let { component: n = /* @__PURE__ */ M("group", {}), lat: r = null, lon: i = null, rayorigin: a = null, raydirection: o = null, onQueryUpdate: s = null, ...c } = e, l = D(null), u = C(P), d = C(Z), f = A(({ invalidate: e }) => e);
	return w(() => {
		let callback = (e) => {
			s ? s(e) : u && e !== null && l.current !== null && (r !== null && i !== null ? (l.current.position.copy(e.point), d.ellipsoid.getObjectFrame(r, i, 0, 0, 0, 0, Q, 2).premultiply(u.group.matrixWorld), l.current.quaternion.setFromRotationMatrix(Q), f()) : a !== null && o !== null && (l.current.position.copy(e.point), l.current.quaternion.identity(), f()));
		};
		if (r !== null && i !== null) {
			let e = d.registerLatLonQuery(r, i, callback);
			return () => d.unregisterQuery(e);
		} else if (a !== null && o !== null) {
			$.origin.copy(a), $.direction.copy(o);
			let e = d.registerRayQuery($, callback);
			return () => d.unregisterQuery(e);
		}
	}, [
		r,
		i,
		a,
		o,
		d,
		u,
		f,
		E(() => new _(), []),
		s
	]), y(n, {
		...c,
		ref: useMultipleRefs(l, t),
		raycast: () => !1
	});
}), fe = x(function SettledObjects(e, t) {
	let n = A(({ scene: e }) => e), { scene: r = n, children: i, ...a } = e, o = C(P), s = E(() => new QueryManager(), []), c = A(({ camera: e }) => e);
	return useDeepOptions(s, a), w(() => () => s.dispose(), [s]), w(() => {
		s.setScene(...Array.isArray(r) ? r : [r]);
	}, [s, r]), w(() => {
		s.addCamera(c);
	}, [s, c]), k(() => {
		o && s.setEllipsoidFromTilesRenderer(o);
	}), useApplyRefs(s, t), /* @__PURE__ */ M(Z.Provider, {
		value: s,
		children: /* @__PURE__ */ M("group", {
			matrixAutoUpdate: !1,
			matrixWorldAutoUpdate: !1,
			children: i
		})
	});
});
//#endregion
export { ue as AnimatedSettledObject, se as CameraTransition, L as CanvasDOMOverlay, CompassGizmo, EastNorthUpFrame, I as EllipsoidContext, ae as EnvironmentControls, oe as GlobeControls, de as SettledObject, fe as SettledObjects, TilesAttributionOverlay, re as TilesPlugin, F as TilesPluginContext, ie as TilesRenderer, P as TilesRendererContext };

//# sourceMappingURL=index.r3f.js.map