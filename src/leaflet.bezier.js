L.SVG.include({
  _updateCurve(layer: any): any {
    const svg_path = this._curvePointsToPath(layer._points);
    this._setPath(layer, svg_path);

    return svg_path;
  },
  _curvePointsToPath(points: any): any {
    let point; let curCommand; let
      str = '';
    for (let i = 0; i < points.length; i++) {
      point = points[i];
      if (typeof point === 'string' || point instanceof String) {
        curCommand = point;
        str += curCommand;
      } else { str += `${point.x},${point.y} `; }
    }
    return str || 'M0 0';
  },
});

const Bezier = L.Path.extend({
  options: {},
  initialize(path: any, options: {}) {
    if (!path.mid || path.mid[0] === undefined) {
      path.mid = this.getMidPoint(
        path.from,
        path.to,
        (path.from.deep ? path.from.deep : 4),
        path.from.slide,
      );
    }

    L.setOptions(this, options);
    this._initialUpdate = true;
    this.setPath(path);
  },
  onAdd(map: any) {
    this._renderer._initPath(this);
    this._reset();
    this._renderer._addPath(this);
  },
  onRemove() {
    this._renderer._removePath(this);
  },
  getPath(): any {
    return this._coords;
  },
  setPath(path: any): any {
    this._setPath(path);
    return this.redraw();
  },
  getBounds(): any {
    return this._bounds;
  },
  getMidPoint(from: any, to: any, deep: any, round_side: string = 'LEFT_ROUND') {
    let offset = 3.14;

    if (round_side === 'RIGHT_ROUND') {
      offset *= -1;
    }

    const latlng1 = from;
    const latlng2 = to;

    const offsetX = latlng2.lng - latlng1.lng;
    const offsetY = latlng2.lat - latlng1.lat;

    const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
    const theta = Math.atan2(offsetY, offsetX);

    const thetaOffset = (offset / (deep || 4));

    const r2 = (r / 2) / (Math.cos(thetaOffset));
    const theta2 = theta + thetaOffset;

    const midpointX = (r2 * Math.cos(theta2)) + latlng1.lng;
    const midpointY = (r2 * Math.sin(theta2)) + latlng1.lat;

    return [midpointY, midpointX];
  },
  _setPath(path: any) {
    this._coords = path;
    this._bounds = this._computeBounds();
  },
  _computeBounds(): any {
    const bound = new L.LatLngBounds();

    bound.extend(this._coords.from);
    bound.extend(this._coords.to);// for single destination
    bound.extend(this._coords.mid);

    return bound;
  },
  getCenter(): any {
    return this._bounds.getCenter();
  },
  _update() {
    if (!this._map) {
      return;
    }
    this._updatePath();
  },
  _updatePath() {
    const path = this._renderer._updateCurve(this);

  },
  _project() {
    this._points = [];

    this._points.push('M');

    let curPoint = this._map.latLngToLayerPoint(this._coords.from);
    this._points.push(curPoint);

    if (this._coords.mid) {
      this._points.push('Q');
      curPoint = this._map.latLngToLayerPoint(this._coords.mid);
      this._points.push(curPoint);
    }
    curPoint = this._map.latLngToLayerPoint(this._coords.to);
    this._points.push(curPoint);
  },
});

L.bezier = (config: {}, options: {}) => {
  const paths = [];
  for (let i = 0; config.path.length > i; i++) {
    let lastDestination = false;
    for (let c = 0; config.path[i].length > c; c++) {
      const currentDestination = config.path[i][c];
      if (lastDestination) {
        const path_pair = { from: lastDestination, to: currentDestination };
        paths.push(new Bezier(path_pair, options));
      }
      lastDestination = config.path[i][c];
    }
  }
  return L.layerGroup(paths);
};
