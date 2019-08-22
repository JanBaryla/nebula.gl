"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _mjolnir = require("mjolnir.js");

var _reactMapGl = require("react-map-gl");

var _uuid = _interopRequireDefault(require("uuid"));

var _circleToPolygon = _interopRequireDefault(require("circle-to-polygon"));

var _feature2 = _interopRequireDefault(require("./feature"));

var _style = require("./style");

var _constants = require("./constants");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultProps = {
  mode: _constants.MODES.READ_ONLY,
  clickRadius: 0,
  getEditHandleStyle: _style.getEditHandleStyle,
  getFeatureStyle: _style.getFeatureStyle,
  getFeatureShape: 'circle',
  getEditHandleShape: 'circle',
  onSelect: function onSelect() {}
};
var UNCOMMITTED_ID = 'uncommitted';

var Editor =
/*#__PURE__*/
function (_PureComponent) {
  _inherits(Editor, _PureComponent);

  function Editor(props) {
    var _this;

    _classCallCheck(this, Editor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Editor).call(this, props));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_containerRef", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_events", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_context", void 0);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_update", function (features) {
      if (features) {
        _this.props.onUpdate(features.map(function (f) {
          return f.toFeature();
        }));
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_updateRectangle", function (feature, options) {
      var vertexIndex = options.vertexIndex,
          lngLat = options.lngLat;
      /*
      *   p0.x, p0.y   ----------  diagonal.x, p0.y
      *       |                             |
      *       |                             |
      *   p0.x, diagonal.y ----- diagonal.x, diagonal.y
      */

      var diagonal = vertexIndex;
      var p0 = feature.points[(diagonal + 2) % 4];
      feature.replacePoint(diagonal, [lngLat[0], lngLat[1]]);
      feature.replacePoint((diagonal + 1) % 4, [lngLat[0], p0[1]]);
      feature.replacePoint((diagonal + 3) % 4, [p0[0], lngLat[1]]);

      _this._update(_this.state.features);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_updateFeature", function (feature, mode, options) {
      switch (mode) {
        case 'vertex':
          if (feature.renderType === _constants.RENDER_TYPE.RECTANGLE) {
            _this._updateRectangle(feature, options);
          } else {
            feature.replacePoint(options.vertexIndex, [options.lngLat[0], options.lngLat[1]]);

            _this._update(_this.state.features);
          }

          break;

        case 'feature':
          var dx = options.dx,
              dy = options.dy;
          feature.points = feature.points.map(function (lngLat) {
            var pixels = _this._project(lngLat);

            if (pixels) {
              pixels[0] += dx;
              pixels[1] += dy;
              return _this._unproject(pixels);
            }

            return null;
          }).filter(Boolean);

          _this._update(_this.state.features);

          break;

        case 'Rectangle':
          _this._updateRectangle(feature, options);

          break;

        default:
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_addPoint", function (x, y, feature) {
      var isNew = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      feature = feature || _this._getSelectedFeature();

      if (!feature) {
        return;
      }

      var lngLat = _this._unproject([x, y]);

      if (!lngLat) {
        return;
      }

      feature.addPoint([lngLat[0], lngLat[1]]);
      var features = _this.state.features || [];

      if (isNew) {
        features.push(feature);
      }

      var validPath = feature.points && feature.points.length >= 2;
      var _this$props = _this.props,
          mode = _this$props.mode,
          onSelect = _this$props.onSelect;

      if (mode === _constants.MODES.DRAW_POINT || mode === _constants.MODES.DRAW_PATH && validPath) {
        _this._update(features);

        onSelect({
          selectedFeatureId: feature && feature.id
        });
      } else {
        _this.setState({
          features: _toConsumableArray(features),
          selectedFeatureId: feature && feature.id
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_clearCache", function () {
      _this.setState({
        selectedFeatureId: null,
        uncommittedLngLat: null,
        hoveredFeatureId: null,
        hoveredLngLat: null,
        hoveredVertexIndex: -1,
        draggingVertexIndex: -1,
        startDragPos: null,
        isDragging: false,
        didDrag: false
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_closePath", function () {
      var selectedFeature = _this._getSelectedFeature();

      if (selectedFeature) {
        selectedFeature.closePath();

        _this._update(_this.state.features);
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_addFeature", function (mode, point) {
      var type = _constants.MODE_TO_GEOJSON_TYPE[mode];
      var renderType = _constants.MODE_TO_RENDER_TYPE[mode];
      var feature = new _feature2.default({
        id: (0, _uuid.default)(),
        type: type,
        renderType: renderType
      });

      if (mode === _constants.MODES.DRAW_5MILE_CIRCLE || mode === _constants.MODES.DRAW_3MILE_CIRCLE || mode === _constants.MODES.DRAW_1MILE_CIRCLE) {
        var radius = mode === _constants.MODES.DRAW_5MILE_CIRCLE ? 8046.72 : mode === _constants.MODES.DRAW_3MILE_CIRCLE ? 4828.032 : 1609.344;
        feature.isClosed = true;
        var polygon = (0, _circleToPolygon.default)(_this._unproject([point.x, point.y]), radius, 36);
        var newFirstPoint = [polygon.coordinates[0][0][0], polygon.coordinates[0][0][1]];
        newFirstPoint = _this._project(newFirstPoint);

        _this._addPoint(newFirstPoint[0], newFirstPoint[1], feature, true);

        for (var i = 1; i < polygon.coordinates[0].length; i++) {
          var newPoint = [polygon.coordinates[0][i][0], polygon.coordinates[0][i][1]];
          newPoint = _this._project(newPoint);

          _this._addPoint(newPoint[0], newPoint[1], feature, false);
        }

        _this._update(_this.state.features);

        return;
      }

      _this._addPoint(point.x, point.y, feature, true);

      if (mode === _constants.MODES.DRAW_RECTANGLE) {
        for (var _i = 0; _i < 3; _i++) {
          _this._addPoint(point.x, point.y, feature, false);
        }
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onEvent", function (handler, evt, stopPropagation) {
      var mode = _this.props.mode;

      if (mode === _constants.MODES.READ_ONLY) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        args[_key - 3] = arguments[_key];
      }

      handler.apply(void 0, [evt].concat(args));

      if (stopPropagation) {
        evt.stopImmediatePropagation();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onMouseUp", function (evt) {
      _this.setState({
        isDragging: false,
        didDrag: false
      });

      var draggingVertexIndex = _this.state.draggingVertexIndex;

      if (Number(draggingVertexIndex) >= 0) {
        _this.setState({
          draggingVertexIndex: -1
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onMouseDown", function (evt) {
      var _this$_getEventPositi = _this._getEventPosition(evt),
          x = _this$_getEventPositi.x,
          y = _this$_getEventPositi.y;

      var attributes = (0, _utils.parseElemDataAttributes)(evt.target); // click segment

      if (attributes && attributes.type === _constants.ELEMENT_TYPE.VERTEX) {
        var vertexIndex = attributes.vertexIndex;

        _this.setState({
          draggingVertexIndex: vertexIndex,
          startDragPos: {
            x: x,
            y: y
          },
          isDragging: true
        }); // click selected feature

      } else if (_this._matchesFeature(attributes, _this._getSelectedFeature())) {
        _this.setState({
          startDragPos: {
            x: x,
            y: y
          },
          isDragging: true
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onMouseMove", function (evt) {
      var attributes = (0, _utils.parseElemDataAttributes)(evt.target) || {};
      var vertexIndex = attributes.vertexIndex,
          featureIndex = attributes.featureIndex,
          type = attributes.type;
      var _this$state = _this.state,
          startDragPos = _this$state.startDragPos,
          isDragging = _this$state.isDragging,
          didDrag = _this$state.didDrag;
      var mode = _this.props.mode;

      var _this$_getEventPositi2 = _this._getEventPosition(evt),
          x = _this$_getEventPositi2.x,
          y = _this$_getEventPositi2.y;

      var lngLat = _this._unproject([x, y]);

      if (isDragging && !didDrag && startDragPos) {
        var dx = x - startDragPos.x;
        var dy = y - startDragPos.y;

        if (dx * dx + dy * dy > 5) {
          _this.setState({
            didDrag: true
          });
        }
      }

      var selectedFeature = _this._getSelectedFeature();

      var isDrawing = _constants.DRAWING_MODES.indexOf(mode) !== -1;
      var isEditing = mode === _constants.MODES.EDIT_VERTEX;

      if (selectedFeature) {
        // dragging
        if (didDrag && startDragPos) {
          var draggingVertexIndex = Number(_this.state.draggingVertexIndex);

          if (draggingVertexIndex >= 0) {
            // dragging vertex
            _this._updateFeature(selectedFeature, 'vertex', {
              vertexIndex: draggingVertexIndex,
              lngLat: lngLat
            });
          } else {
            // dragging feature
            var _dx = x - startDragPos.x;

            var _dy = y - startDragPos.y;

            _this.setState({
              startDragPos: {
                x: x,
                y: y
              }
            });

            _this._updateFeature(selectedFeature, 'feature', {
              dx: _dx,
              dy: _dy
            });
          }
        } else if (mode === _constants.MODES.DRAW_RECTANGLE) {
          // drawing rectangle
          _this._updateFeature(selectedFeature, 'Rectangle', {
            vertexIndex: 2,
            lngLat: lngLat
          });
        } else if (isDrawing) {
          // drawing other shapes
          _this.setState({
            uncommittedLngLat: lngLat
          });
        } else if (isEditing) {
          if ((selectedFeature.renderType === _constants.RENDER_TYPE.LINE_STRING || selectedFeature.renderType === _constants.RENDER_TYPE.POLYGON) && type === _constants.ELEMENT_TYPE.SEGMENT) {
            // segmentId is start vertexIndex
            var uncommittedLngLat = null;

            if (lngLat && typeof vertexIndex === 'number') {
              uncommittedLngLat = _this._getClosestPositionOnSegment(vertexIndex, lngLat, selectedFeature);
            }

            _this.setState({
              uncommittedLngLat: uncommittedLngLat
            });
          } else {
            _this.setState({
              uncommittedLngLat: null
            });
          }
        }
      }

      var _this$state2 = _this.state,
          features = _this$state2.features,
          selectedFeatureId = _this$state2.selectedFeatureId;

      if (selectedFeatureId && type === _constants.ELEMENT_TYPE.VERTEX && typeof featureIndex === 'number') {
        var feature = features && features[featureIndex];

        if (selectedFeatureId === (feature && feature.id)) {
          _this.setState({
            hoveredVertexIndex: vertexIndex
          });
        }
      } else if (type !== _constants.ELEMENT_TYPE.VERTEX) {
        _this.setState({
          hoveredVertexIndex: null
        });
      }

      if (type === _constants.ELEMENT_TYPE.FEATURE && typeof featureIndex === 'number') {
        var _feature = features && features[featureIndex];

        _this.setState({
          hoveredFeatureId: _feature && _feature.id
        });
      } else {
        _this.setState({
          hoveredFeatureId: null
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onClickFeature", function (evt, attributes) {
      var featureIndex = attributes.featureIndex;
      var features = _this.state.features;
      var selectedFeature = features && typeof featureIndex === 'number' && features[featureIndex];

      if (selectedFeature) {
        _this.props.onSelect({
          selectedFeatureId: selectedFeature.id,
          sourceEvent: evt
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onClickVertex", function (evt, attributes) {
      var mode = _this.props.mode;
      var operation = attributes.operation;

      if (operation === _constants.OPERATIONS.INTERSECT || operation === _constants.OPERATIONS.SET && mode === _constants.MODES.DRAW_RECTANGLE) {
        _this._closePath();

        _this._clearCache();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onClickSegment", function (evt, attributes) {
      var feature = _this._getSelectedFeature();

      if (feature && (feature.renderType === _constants.RENDER_TYPE.POLYGON || feature.renderType === _constants.RENDER_TYPE.LINE_STRING) && attributes) {
        var vertexIndex = attributes.vertexIndex;
        var uncommittedLngLat = _this.state.uncommittedLngLat;
        var lngLat = uncommittedLngLat;

        if (!lngLat && typeof vertexIndex === 'number') {
          var _this$_getEventPositi3 = _this._getEventPosition(evt),
              x = _this$_getEventPositi3.x,
              y = _this$_getEventPositi3.y;

          lngLat = _this._unproject([x, y]);
          lngLat = _this._getClosestPositionOnSegment(vertexIndex, lngLat, feature);
        }

        if (lngLat) {
          var insertPosition = (vertexIndex + 1) % feature.points.length;
          feature.insertPoint(lngLat, insertPosition);

          _this._update(_this.state.features);
        }

        _this.setState({
          uncommittedLngLat: null,
          hoveredLngLat: null
        });
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onClick", function (evt) {
      var mode = _this.props.mode;
      var attributes = (0, _utils.parseElemDataAttributes)(evt.target);

      if (attributes && attributes.type === _constants.ELEMENT_TYPE.VERTEX) {
        _this._onClickVertex(evt, attributes);

        return;
      }

      if (mode === _constants.MODES.EDIT_VERTEX && attributes && attributes.type === _constants.ELEMENT_TYPE.SEGMENT) {
        _this._onClickSegment(evt, attributes);

        return;
      }

      if ((mode === _constants.MODES.SELECT_FEATURE || mode === _constants.MODES.EDIT_VERTEX) && attributes && attributes.type === _constants.ELEMENT_TYPE.FEATURE) {
        _this._onClickFeature(evt, attributes);

        return;
      }

      var selectedFeature = _this._getSelectedFeature();

      var _this$_getEventPositi4 = _this._getEventPosition(evt),
          x = _this$_getEventPositi4.x,
          y = _this$_getEventPositi4.y;

      switch (mode) {
        case _constants.MODES.EDIT_VERTEX:
          if (selectedFeature) {
            _this.props.onSelect({
              selectedFeatureId: null,
              sourceEvent: evt
            });
          }

          break;

        case _constants.MODES.DRAW_POINT:
        case _constants.MODES.DRAW_5MILE_CIRCLE:
        case _constants.MODES.DRAW_3MILE_CIRCLE:
        case _constants.MODES.DRAW_1MILE_CIRCLE:
          _this._addFeature(mode, {
            x: x,
            y: y
          });

          _this._clearCache();

          break;

        case _constants.MODES.DRAW_PATH:
        case _constants.MODES.DRAW_POLYGON:
          if (selectedFeature && selectedFeature.isClosed) {
            // clicked outside
            _this._clearCache();
          } else if (selectedFeature) {
            _this._addPoint(x, y, selectedFeature);
          } else {
            _this._addFeature(mode, {
              x: x,
              y: y
            });
          }

          break;

        case _constants.MODES.DRAW_RECTANGLE:
          if (selectedFeature && selectedFeature.isClosed) {
            // clicked outside
            _this._clearCache();

            _this.props.onSelect({
              selectedFeatureId: null,
              sourceEvent: evt
            });
          } else {
            _this._addFeature(mode, {
              x: x,
              y: y
            });
          }

          break;

        default:
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onPan", function (evt) {
      var attributes = (0, _utils.parseElemDataAttributes)(evt.target);
      var type = attributes && attributes.type;

      if (type === _constants.ELEMENT_TYPE.VERTEX || type === _constants.ELEMENT_TYPE.SEGMENT || _this.state.isDragging || _this.state.uncommittedLngLat !== null) {
        evt.stopImmediatePropagation();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_project", function (pt) {
      return _this._context && _this._context.viewport && _this._context.viewport.project(pt);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_unproject", function (pt) {
      return _this._context && _this._context.viewport && _this._context.viewport.unproject(pt);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_matchesFeature", function (attributes, feature) {
      if (!attributes || attributes.type !== _constants.ELEMENT_TYPE.FEATURE || !feature) {
        return false;
      }

      var featureIndex = attributes.featureIndex;
      var features = _this.props.features;
      var elemFeature = features && features[featureIndex];
      return elemFeature && feature.id === elemFeature.id;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getClosestPositionOnSegment", function (vertexIndex, pointLngLat, feature) {
      var points = feature && feature.points;

      if (!points || !points.length) {
        return null;
      } // segmentId is start vertexIndex


      var startPos = points[vertexIndex];
      var endPos = points[(vertexIndex + 1) % points.length];
      return (0, _utils.findClosestPointOnLineSegment)(startPos, endPos, pointLngLat);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getEventPosition", function (evt) {
      var _evt$offsetCenter = evt.offsetCenter,
          x = _evt$offsetCenter.x,
          y = _evt$offsetCenter.y;
      return {
        x: Number(x),
        y: Number(y)
      };
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getSelectedFeature", function () {
      var _this$state3 = _this.state,
          features = _this$state3.features,
          selectedFeatureId = _this$state3.selectedFeatureId;
      return features && features.find(function (f) {
        return f.id === selectedFeatureId;
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getEditHandleState", function (index, renderState) {
      var mode = _this.props.mode;
      var _this$state4 = _this.state,
          draggingVertexIndex = _this$state4.draggingVertexIndex,
          hoveredVertexIndex = _this$state4.hoveredVertexIndex;

      var selectedFeature = _this._getSelectedFeature();

      var isSelected = index === draggingVertexIndex || selectedFeature && selectedFeature.renderType === _constants.RENDER_TYPE.POINT;
      var isClosing = mode === _constants.MODES.DRAW_POLYGON && hoveredVertexIndex === 0 && index === -1;

      if (renderState) {
        return renderState;
      }

      if (isClosing) {
        return _constants.RENDER_STATE.CLOSING;
      }

      if (isSelected) {
        return _constants.RENDER_STATE.SELECTED;
      }

      switch (index) {
        case hoveredVertexIndex:
          return _constants.RENDER_STATE.HOVERED;

        case UNCOMMITTED_ID:
          return _constants.RENDER_STATE.UNCOMMITTED;

        default:
          return _constants.RENDER_STATE.INACTIVE;
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_getFeatureRenderState", function (id, renderState) {
      var _this$state5 = _this.state,
          selectedFeatureId = _this$state5.selectedFeatureId,
          hoveredFeatureId = _this$state5.hoveredFeatureId;

      if (renderState) {
        return renderState;
      }

      switch (id) {
        case selectedFeatureId:
          return _constants.RENDER_STATE.SELECTED;

        case hoveredFeatureId:
          return _constants.RENDER_STATE.HOVERED;

        case UNCOMMITTED_ID:
          return _constants.RENDER_STATE.UNCOMMITTED;

        default:
          return _constants.RENDER_STATE.INACTIVE;
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderVertex", function (position, featureIndex, vertexIndex, operation, style, shape) {
      /* eslint-enable max-params */
      var p = _this._project(position);

      if (!p) {
        return null;
      }

      var clickRadius = _this.props.clickRadius;
      var elemKey = "".concat(_constants.ELEMENT_TYPE.VERTEX, ".").concat(featureIndex, ".").concat(vertexIndex, ".").concat(operation); // first <circle|rect> is to make path easily interacted with

      switch (shape) {
        case 'circle':
          return _react.default.createElement("g", {
            key: elemKey,
            transform: "translate(".concat(p[0], ", ").concat(p[1], ")")
          }, _react.default.createElement("circle", {
            "data-type": _constants.ELEMENT_TYPE.VERTEX,
            "data-feature-index": featureIndex,
            "data-vertex-index": vertexIndex,
            "data-operation": operation,
            key: "".concat(elemKey, ".hidden"),
            style: _objectSpread({}, style, _style.HIDDEN_CLICKABLE_STYLE, {
              stroke: 'none'
            }),
            cx: 0,
            cy: 0,
            r: clickRadius
          }), _react.default.createElement("circle", {
            "data-type": _constants.ELEMENT_TYPE.VERTEX,
            "data-feature-index": featureIndex,
            "data-vertex-index": vertexIndex,
            "data-operation": operation,
            key: elemKey,
            style: style,
            cx: 0,
            cy: 0
          }));

        case 'rect':
          return _react.default.createElement("g", {
            key: "vertex.".concat(vertexIndex),
            transform: "translate(".concat(p[0], ", ").concat(p[1], ")")
          }, _react.default.createElement("rect", {
            "data-type": _constants.ELEMENT_TYPE.VERTEX,
            "data-feature-index": featureIndex,
            "data-vertex-index": vertexIndex,
            "data-operation": operation,
            key: "".concat(elemKey, ".hidden"),
            style: _objectSpread({}, style, _style.HIDDEN_CLICKABLE_STYLE, {
              width: clickRadius,
              height: clickRadius
            })
          }), _react.default.createElement("rect", {
            "data-type": _constants.ELEMENT_TYPE.VERTEX,
            "data-feature-index": featureIndex,
            "data-vertex-index": vertexIndex,
            "data-operation": operation,
            key: elemKey,
            style: style
          }));

        default:
          return null;
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderSegment", function (featureIndex, startVertexId, startPos, endPos) {
      var style = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var clickRadius = _this.props.clickRadius;

      var projected = _this._getProjectedData([startPos, endPos], _constants.RENDER_TYPE.LINE_STRING);

      var radius = style.radius,
          others = _objectWithoutProperties(style, ["radius"]);

      var elemKey = "".concat(_constants.ELEMENT_TYPE.SEGMENT, ".").concat(featureIndex, ".").concat(startVertexId);
      return _react.default.createElement("g", {
        key: elemKey
      }, _react.default.createElement("path", {
        "data-type": _constants.ELEMENT_TYPE.SEGMENT,
        "data-feature-index": featureIndex,
        "data-vertex-index": startVertexId,
        key: "".concat(elemKey, ".hidden"),
        style: _objectSpread({}, others, {
          strokeWidth: clickRadius || radius,
          opacity: 0
        }),
        d: projected
      }), _react.default.createElement("path", {
        "data-type": _constants.ELEMENT_TYPE.SEGMENT,
        "data-feature-index": featureIndex,
        "data-vertex-index": startVertexId,
        key: elemKey,
        style: others,
        d: projected
      }));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderCommittedStroke", function (featureIndex, feature, style) {
      var points = feature.points,
          isClosed = feature.isClosed,
          renderType = feature.renderType;

      if (!points || points.length < 2 || renderType === _constants.RENDER_TYPE.RECTANGLE && !isClosed) {
        return null;
      }

      var segments = [];

      for (var i = 0; i < points.length - 1; i++) {
        segments.push(_this._renderSegment(featureIndex, i, points[i], points[i + 1], style));
      }

      if (isClosed) {
        var lastIndex = points.length - 1;
        segments.push(_this._renderSegment(featureIndex, lastIndex, points[lastIndex], points[0], style));
      }

      return _react.default.createElement("g", {
        key: "committed group"
      }, segments);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderUncommittedStrokes", function (featureIndex, feature, style) {
      var points = feature.points,
          isClosed = feature.isClosed,
          renderType = feature.renderType;
      var mode = _this.props.mode;
      var uncommittedLngLat = _this.state.uncommittedLngLat;

      var isDrawing = _constants.DRAWING_MODES.find(function (m) {
        return m === mode;
      });

      if (!points || isClosed || !isDrawing) {
        return null;
      }

      var uncommittedSegments = [];

      if (renderType === _constants.RENDER_TYPE.RECTANGLE) {
        for (var i = 0; i < points.length - 1; i++) {
          uncommittedSegments.push(_this._renderSegment(featureIndex, i, points[i], points[i + 1], style));
        }

        if (points.length === 4) {
          uncommittedSegments.push(_this._renderSegment(featureIndex, 3, points[3], points[0], style));
        }
      }

      if (!uncommittedLngLat) {
        return uncommittedSegments.length ? uncommittedSegments : null;
      }
      /* eslint-disable no-inline-comments */


      uncommittedSegments.push(_this._renderSegment(featureIndex, points.length - 1, // id
      points.slice(-1)[0], // startPos
      uncommittedLngLat, // endPos
      style));
      /* eslint-enable no-inline-comments */

      return uncommittedSegments.filter(Boolean);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderClosingStroke", function (featureIndex, feature, style) {
      var points = feature.points,
          isClosed = feature.isClosed;
      var mode = _this.props.mode;
      var uncommittedLngLat = _this.state.uncommittedLngLat;

      if (uncommittedLngLat && mode === _constants.MODES.DRAW_POLYGON && points.length > 2 && !isClosed) {
        // from uncommitted position to the first point of the polygon
        return _this._renderSegment(featureIndex, 'uncommitted-close', uncommittedLngLat, points[0], style);
      }

      return null;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderFill", function (index, feature, style) {
      var mode = _this.props.mode;

      var isDrawing = _constants.DRAWING_MODES.find(function (m) {
        return m === mode;
      });

      var points = feature.points,
          renderType = feature.renderType,
          isClosed = feature.isClosed;

      if (renderType !== _constants.RENDER_TYPE.POLYGON && renderType !== _constants.RENDER_TYPE.RECTANGLE) {
        return null;
      }

      var uncommittedLngLat = _this.state.uncommittedLngLat;
      var fillPoints = points;

      if (uncommittedLngLat && isDrawing) {
        fillPoints = _toConsumableArray(points).concat([uncommittedLngLat]);
      }

      var fillPath = _this._getProjectedData(fillPoints, renderType, isClosed);

      return _react.default.createElement("path", {
        "data-type": _constants.ELEMENT_TYPE.FEATURE,
        "data-feature-index": index,
        key: "".concat(_constants.ELEMENT_TYPE.FEATURE, ".").concat(index, ".fill"),
        style: _objectSpread({}, style, {
          stroke: 'none'
        }),
        d: fillPath
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderCurrentPath", function (feature, index) {
      var points = feature.points,
          renderType = feature.renderType;

      if (!points || !points.length || renderType === _constants.RENDER_TYPE.POINT) {
        return null;
      }

      var getFeatureStyle = _this.props.getFeatureStyle;
      var geoJson = feature.toFeature();
      var committedStyle = getFeatureStyle({
        feature: geoJson,
        state: _constants.RENDER_STATE.SELECTED
      });
      var uncommittedStyle = getFeatureStyle({
        feature: geoJson,
        state: _constants.RENDER_STATE.UNCOMMITTED
      });
      var closingStyle = getFeatureStyle({
        feature: geoJson,
        state: _constants.RENDER_STATE.CLOSING
      });

      var committedStroke = _this._renderCommittedStroke(index, feature, committedStyle);

      var uncommittedStrokes = _this._renderUncommittedStrokes(index, feature, uncommittedStyle) || [];

      var closingStroke = _this._renderClosingStroke(index, feature, closingStyle);

      var fill = _this._renderFill(index, feature, uncommittedStyle);

      return [fill, committedStroke].concat(_toConsumableArray(uncommittedStrokes), [closingStroke]).filter(Boolean);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderCommittedVertices", function (featureIndex, feature, geoJson) {
      var _this$props2 = _this.props,
          mode = _this$props2.mode,
          getEditHandleStyle = _this$props2.getEditHandleStyle,
          getEditHandleShape = _this$props2.getEditHandleShape;
      var isClosed = feature.isClosed,
          points = feature.points;
      var committedVertices = [];

      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var operation = _constants.OPERATIONS.SET;
        var style = getEditHandleStyle({
          feature: geoJson,
          index: i,
          state: _this._getEditHandleState(i)
        });
        var shape = typeof getEditHandleShape === 'function' ? getEditHandleShape({
          feature: geoJson,
          index: i,
          state: _this._getEditHandleState(i)
        }) : getEditHandleShape;

        if (isClosed) {
          committedVertices.push(_this._renderVertex(p, featureIndex, i, operation, style, shape));
        } else {
          if (mode === _constants.MODES.DRAW_POLYGON && i === 0 && points.length > 2) {
            operation = _constants.OPERATIONS.INTERSECT;
          }

          committedVertices.push(_this._renderVertex(p, featureIndex, i, operation, style, shape));
        }
      }

      return committedVertices;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderUncommittedVertex", function (featureIndex, feature, geoJson) {
      var _this$props3 = _this.props,
          getEditHandleStyle = _this$props3.getEditHandleStyle,
          getEditHandleShape = _this$props3.getEditHandleShape;
      var _this$state6 = _this.state,
          selectedFeatureId = _this$state6.selectedFeatureId,
          uncommittedLngLat = _this$state6.uncommittedLngLat;
      var id = feature.id;
      var uncommittedVertex = null;

      if (selectedFeatureId === id && uncommittedLngLat) {
        var style = getEditHandleStyle({
          feature: geoJson,
          index: 'uncommitted',
          state: _this._getEditHandleState(-1, _constants.RENDER_STATE.UNCOMMITTED)
        });
        var shape = typeof getEditHandleShape === 'function' ? getEditHandleShape({
          feature: geoJson,
          index: null,
          state: _this._getEditHandleState(-1)
        }) : getEditHandleShape;
        uncommittedVertex = _this._renderVertex(uncommittedLngLat, featureIndex, 'uncommitted', _constants.OPERATIONS.INSERT, _objectSpread({}, style, {
          pointerEvents: 'none'
        }), shape);
      }

      return uncommittedVertex;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderCurrentVertices", function (feature, featureIndex) {
      var points = feature.points;

      if (!points || !points.length) {
        return null;
      }

      var geoJson = feature.toFeature();

      var committedVertices = _this._renderCommittedVertices(featureIndex, feature, geoJson);

      var uncommittedVertex = _this._renderUncommittedVertex(featureIndex, feature, geoJson);

      return _react.default.createElement("g", {
        key: "edit-handles"
      }, committedVertices, uncommittedVertex);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderCurrent", function () {
      var features = _this.state.features;

      var feature = _this._getSelectedFeature();

      if (!features || !feature || !feature.points) {
        return null;
      }

      var mode = _this.props.mode;
      var index = features.findIndex(function (f) {
        return f.id === feature.id;
      });
      return _react.default.createElement("g", {
        key: "feature current",
        style: mode === _constants.MODES.READ_ONLY || mode === _constants.MODES.SELECT_FEATURE ? _constants.STATIC_STYLE : null
      }, _this._renderCurrentPath(feature, index), _this._renderCurrentVertices(feature, index));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderFeature", function (feature, index) {
      if (feature === _this._getSelectedFeature()) {
        return null;
      }

      var clickRadius = _this.props.clickRadius;
      var id = feature.id,
          points = feature.points,
          renderType = feature.renderType,
          isClosed = feature.isClosed;

      if (!points || !points.length) {
        return null;
      }

      var projected = _this._getProjectedData(points, renderType, isClosed);

      if (!projected) {
        return null;
      }

      var geoJson = feature.toFeature();

      var renderState = _this._getFeatureRenderState(id);

      var _this$props4 = _this.props,
          getFeatureStyle = _this$props4.getFeatureStyle,
          getFeatureShape = _this$props4.getFeatureShape;
      var style = getFeatureStyle({
        feature: geoJson,
        state: renderState
      });
      var shape = typeof getFeatureShape === 'function' ? getFeatureShape({
        feature: geoJson,
        state: renderState
      }) : getFeatureShape;
      var elemKey = "".concat(_constants.ELEMENT_TYPE.FEATURE, ".").concat(index);

      switch (renderType) {
        case _constants.RENDER_TYPE.POINT:
          if (shape === 'rect') {
            return _react.default.createElement("g", {
              key: elemKey,
              transform: "translate(".concat(projected[0][0], ", ").concat(projected[0][1], ")")
            }, _react.default.createElement("rect", {
              "data-type": _constants.ELEMENT_TYPE.FEATURE,
              "data-feature-index": index,
              key: "".concat(elemKey, ".hidden"),
              style: _objectSpread({}, style, _style.HIDDEN_CLICKABLE_STYLE, {
                width: clickRadius,
                height: clickRadius
              })
            }), _react.default.createElement("rect", {
              "data-type": _constants.ELEMENT_TYPE.FEATURE,
              "data-feature-index": index,
              key: elemKey,
              style: style
            }));
          }

          return _react.default.createElement("g", {
            key: elemKey,
            transform: "translate(".concat(projected[0][0], ", ").concat(projected[0][1], ")")
          }, _react.default.createElement("circle", {
            "data-type": _constants.ELEMENT_TYPE.FEATURE,
            "data-feature-index": index,
            key: "".concat(elemKey, ".hidden"),
            style: _objectSpread({}, style, {
              opacity: 0
            }),
            cx: 0,
            cy: 0,
            r: clickRadius
          }), _react.default.createElement("circle", {
            "data-type": _constants.ELEMENT_TYPE.FEATURE,
            "data-feature-index": index,
            key: "feature.".concat(index),
            style: style,
            cx: 0,
            cy: 0
          }));
        // first <path> is to make path easily interacted with

        case _constants.RENDER_TYPE.LINE_STRING:
          return _react.default.createElement("g", {
            key: elemKey
          }, _react.default.createElement("path", {
            "data-type": _constants.ELEMENT_TYPE.FEATURE,
            "data-feature-index": index,
            key: "".concat(elemKey, ".hidden"),
            style: _objectSpread({}, style, {
              strokeWidth: clickRadius,
              opacity: 0
            }),
            d: projected
          }), _react.default.createElement("path", {
            "data-type": _constants.ELEMENT_TYPE.FEATURE,
            "data-feature-index": index,
            key: elemKey,
            style: style,
            d: projected
          }));

        case 'Polygon':
        case 'Rectangle':
          return _react.default.createElement("path", {
            "data-type": _constants.ELEMENT_TYPE.FEATURE,
            "data-feature-index": index,
            key: elemKey,
            style: style,
            d: projected
          });

        default:
          return null;
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderFeatures", function () {
      var features = _this.state.features;
      return features && features.map(_this._renderFeature);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderCanvas", function () {
      var _this$state7 = _this.state,
          selectedFeatureId = _this$state7.selectedFeatureId,
          features = _this$state7.features;
      return _react.default.createElement("svg", {
        key: "draw-canvas",
        width: "100%",
        height: "100%"
      }, features && features.length > 0 && _react.default.createElement("g", {
        key: "feature-group"
      }, _this._renderFeatures()), selectedFeatureId && _this._renderCurrent());
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_renderEditor", function () {
      var viewport = _this._context && _this._context.viewport || {};
      var style = _this.props.style;
      var width = viewport.width,
          height = viewport.height;
      return _react.default.createElement("div", {
        id: "editor",
        style: _objectSpread({
          width: width,
          height: height
        }, style),
        ref: function ref(_) {
          _this._containerRef = _;
        }
      }, _this._renderCanvas());
    });

    _this.state = {
      features: props.features ? props.features.map(function (f) {
        return _feature2.default.fromFeature(f);
      }).filter(Boolean) : null,
      selectedFeatureId: -1,
      hoveredFeatureId: null,
      hoveredLngLat: null,
      hoveredVertexIndex: -1,
      // intermediate mouse position when drawing
      uncommittedLngLat: null,
      draggingVertexIndex: -1,
      startDragPos: null,
      isDragging: false,
      didDrag: false
    };
    _this._containerRef = null;
    _this._events = {};
    _this._context = null;
    return _this;
  }

  _createClass(Editor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.mode && this.props.mode !== _constants.MODES.READ_ONLY) {
        this._setupEvents();
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.mode !== nextProps.mode) {
        if (!nextProps.mode || nextProps.mode === _constants.MODES.READ_ONLY) {
          this._removeEvents();
        }

        if (!this.props.mode || this.props.mode === _constants.MODES.READ_ONLY) {
          this._setupEvents();
        }
      }

      if (this.props.mode !== nextProps.mode || this.props.features !== nextProps.features) {
        this.setState({
          features: nextProps.features && nextProps.features.map(function (f) {
            return _feature2.default.fromFeature(f);
          }).filter(Boolean)
        });
      }

      if (this.props.mode !== nextProps.mode || this.props.selectedFeatureId !== nextProps.selectedFeatureId) {
        this._clearCache();

        this.setState({
          selectedFeatureId: nextProps.selectedFeatureId
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._removeEvents();
    }
  }, {
    key: "_setupEvents",

    /* EVENTS */
    value: function _setupEvents() {
      var _this2 = this;

      var ref = this._containerRef;

      if (!ref || !this._context || !this._context.eventManager) {
        return;
      }

      this._events = {
        anyclick: function anyclick(evt) {
          return _this2._onEvent(_this2._onClick, evt, true);
        },
        click: function click(evt) {
          return evt.stopImmediatePropagation();
        },
        pointermove: function pointermove(evt) {
          return _this2._onEvent(_this2._onMouseMove, evt, true);
        },
        pointerdown: function pointerdown(evt) {
          return _this2._onEvent(_this2._onMouseDown, evt, true);
        },
        pointerup: function pointerup(evt) {
          return _this2._onEvent(_this2._onMouseUp, evt, true);
        },
        panmove: function panmove(evt) {
          return _this2._onEvent(_this2._onPan, evt, false);
        },
        panstart: function panstart(evt) {
          return _this2._onEvent(_this2._onPan, evt, false);
        },
        panend: function panend(evt) {
          return _this2._onEvent(_this2._onPan, evt, false);
        }
      };

      this._context.eventManager.on(this._events, ref);
    }
  }, {
    key: "_removeEvents",
    value: function _removeEvents() {
      if (!this._context || !this._context.eventManager || !this._events) {
        return;
      }

      this._context.eventManager.off(this._events);

      this._events = null;
    }
  }, {
    key: "_getProjectedData",
    value: function _getProjectedData(points, renderType) {
      var _this3 = this;

      var isClosed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (points.length === 0) {
        return '';
      }

      var projected = points.map(function (p) {
        return _this3._project(p);
      });

      switch (renderType) {
        case _constants.RENDER_TYPE.POINT:
          return projected;

        case _constants.RENDER_TYPE.LINE_STRING:
        case _constants.RENDER_TYPE.POLYGON:
        case _constants.RENDER_TYPE.RECTANGLE:
          var pathString = projected.map(function (p) {
            return "".concat(p[0], ",").concat(p[1]);
          }).join('L');
          return "M ".concat(pathString, " ").concat(isClosed ? 'z' : '');

        default:
          return null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      return _react.default.createElement(_reactMapGl._MapContext.Consumer, null, function (context) {
        _this4._context = context;
        var viewport = context && context.viewport;

        if (!viewport || viewport.height <= 0 || viewport.width <= 0) {
          return null;
        }

        return _this4._renderEditor();
      });
    }
  }]);

  return Editor;
}(_react.PureComponent);

exports.default = Editor;

_defineProperty(Editor, "defaultProps", defaultProps);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lZGl0b3IuanMiXSwibmFtZXMiOlsiZGVmYXVsdFByb3BzIiwibW9kZSIsIk1PREVTIiwiUkVBRF9PTkxZIiwiY2xpY2tSYWRpdXMiLCJnZXRFZGl0SGFuZGxlU3R5bGUiLCJkZWZhdWx0R2V0RWRpdEhhbmRsZVN0eWxlIiwiZ2V0RmVhdHVyZVN0eWxlIiwiZGVmYXVsdEdldEZlYXR1cmVTdHlsZSIsImdldEZlYXR1cmVTaGFwZSIsImdldEVkaXRIYW5kbGVTaGFwZSIsIm9uU2VsZWN0IiwiVU5DT01NSVRURURfSUQiLCJFZGl0b3IiLCJwcm9wcyIsImZlYXR1cmVzIiwib25VcGRhdGUiLCJtYXAiLCJmIiwidG9GZWF0dXJlIiwiZmVhdHVyZSIsIm9wdGlvbnMiLCJ2ZXJ0ZXhJbmRleCIsImxuZ0xhdCIsImRpYWdvbmFsIiwicDAiLCJwb2ludHMiLCJyZXBsYWNlUG9pbnQiLCJfdXBkYXRlIiwic3RhdGUiLCJyZW5kZXJUeXBlIiwiUkVOREVSX1RZUEUiLCJSRUNUQU5HTEUiLCJfdXBkYXRlUmVjdGFuZ2xlIiwiZHgiLCJkeSIsInBpeGVscyIsIl9wcm9qZWN0IiwiX3VucHJvamVjdCIsImZpbHRlciIsIkJvb2xlYW4iLCJ4IiwieSIsImlzTmV3IiwiX2dldFNlbGVjdGVkRmVhdHVyZSIsImFkZFBvaW50IiwicHVzaCIsInZhbGlkUGF0aCIsImxlbmd0aCIsIkRSQVdfUE9JTlQiLCJEUkFXX1BBVEgiLCJzZWxlY3RlZEZlYXR1cmVJZCIsImlkIiwic2V0U3RhdGUiLCJ1bmNvbW1pdHRlZExuZ0xhdCIsImhvdmVyZWRGZWF0dXJlSWQiLCJob3ZlcmVkTG5nTGF0IiwiaG92ZXJlZFZlcnRleEluZGV4IiwiZHJhZ2dpbmdWZXJ0ZXhJbmRleCIsInN0YXJ0RHJhZ1BvcyIsImlzRHJhZ2dpbmciLCJkaWREcmFnIiwic2VsZWN0ZWRGZWF0dXJlIiwiY2xvc2VQYXRoIiwicG9pbnQiLCJ0eXBlIiwiTU9ERV9UT19HRU9KU09OX1RZUEUiLCJNT0RFX1RPX1JFTkRFUl9UWVBFIiwiRmVhdHVyZSIsIkRSQVdfNU1JTEVfQ0lSQ0xFIiwiRFJBV18zTUlMRV9DSVJDTEUiLCJEUkFXXzFNSUxFX0NJUkNMRSIsInJhZGl1cyIsImlzQ2xvc2VkIiwicG9seWdvbiIsIm5ld0ZpcnN0UG9pbnQiLCJjb29yZGluYXRlcyIsIl9hZGRQb2ludCIsImkiLCJuZXdQb2ludCIsIkRSQVdfUkVDVEFOR0xFIiwiaGFuZGxlciIsImV2dCIsInN0b3BQcm9wYWdhdGlvbiIsImFyZ3MiLCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24iLCJOdW1iZXIiLCJfZ2V0RXZlbnRQb3NpdGlvbiIsImF0dHJpYnV0ZXMiLCJ0YXJnZXQiLCJFTEVNRU5UX1RZUEUiLCJWRVJURVgiLCJfbWF0Y2hlc0ZlYXR1cmUiLCJmZWF0dXJlSW5kZXgiLCJpc0RyYXdpbmciLCJEUkFXSU5HX01PREVTIiwiaW5kZXhPZiIsImlzRWRpdGluZyIsIkVESVRfVkVSVEVYIiwiX3VwZGF0ZUZlYXR1cmUiLCJMSU5FX1NUUklORyIsIlBPTFlHT04iLCJTRUdNRU5UIiwiX2dldENsb3Nlc3RQb3NpdGlvbk9uU2VnbWVudCIsIkZFQVRVUkUiLCJzb3VyY2VFdmVudCIsIm9wZXJhdGlvbiIsIk9QRVJBVElPTlMiLCJJTlRFUlNFQ1QiLCJTRVQiLCJfY2xvc2VQYXRoIiwiX2NsZWFyQ2FjaGUiLCJpbnNlcnRQb3NpdGlvbiIsImluc2VydFBvaW50IiwiX29uQ2xpY2tWZXJ0ZXgiLCJfb25DbGlja1NlZ21lbnQiLCJTRUxFQ1RfRkVBVFVSRSIsIl9vbkNsaWNrRmVhdHVyZSIsIl9hZGRGZWF0dXJlIiwiRFJBV19QT0xZR09OIiwicHQiLCJfY29udGV4dCIsInZpZXdwb3J0IiwicHJvamVjdCIsInVucHJvamVjdCIsImVsZW1GZWF0dXJlIiwicG9pbnRMbmdMYXQiLCJzdGFydFBvcyIsImVuZFBvcyIsIm9mZnNldENlbnRlciIsImZpbmQiLCJpbmRleCIsInJlbmRlclN0YXRlIiwiaXNTZWxlY3RlZCIsIlBPSU5UIiwiaXNDbG9zaW5nIiwiUkVOREVSX1NUQVRFIiwiQ0xPU0lORyIsIlNFTEVDVEVEIiwiSE9WRVJFRCIsIlVOQ09NTUlUVEVEIiwiSU5BQ1RJVkUiLCJwb3NpdGlvbiIsInN0eWxlIiwic2hhcGUiLCJwIiwiZWxlbUtleSIsIkhJRERFTl9DTElDS0FCTEVfU1RZTEUiLCJzdHJva2UiLCJ3aWR0aCIsImhlaWdodCIsInN0YXJ0VmVydGV4SWQiLCJwcm9qZWN0ZWQiLCJfZ2V0UHJvamVjdGVkRGF0YSIsIm90aGVycyIsInN0cm9rZVdpZHRoIiwib3BhY2l0eSIsInNlZ21lbnRzIiwiX3JlbmRlclNlZ21lbnQiLCJsYXN0SW5kZXgiLCJtIiwidW5jb21taXR0ZWRTZWdtZW50cyIsInNsaWNlIiwiZmlsbFBvaW50cyIsImZpbGxQYXRoIiwiZ2VvSnNvbiIsImNvbW1pdHRlZFN0eWxlIiwidW5jb21taXR0ZWRTdHlsZSIsImNsb3NpbmdTdHlsZSIsImNvbW1pdHRlZFN0cm9rZSIsIl9yZW5kZXJDb21taXR0ZWRTdHJva2UiLCJ1bmNvbW1pdHRlZFN0cm9rZXMiLCJfcmVuZGVyVW5jb21taXR0ZWRTdHJva2VzIiwiY2xvc2luZ1N0cm9rZSIsIl9yZW5kZXJDbG9zaW5nU3Ryb2tlIiwiZmlsbCIsIl9yZW5kZXJGaWxsIiwiY29tbWl0dGVkVmVydGljZXMiLCJfZ2V0RWRpdEhhbmRsZVN0YXRlIiwiX3JlbmRlclZlcnRleCIsInVuY29tbWl0dGVkVmVydGV4IiwiSU5TRVJUIiwicG9pbnRlckV2ZW50cyIsIl9yZW5kZXJDb21taXR0ZWRWZXJ0aWNlcyIsIl9yZW5kZXJVbmNvbW1pdHRlZFZlcnRleCIsImZpbmRJbmRleCIsIlNUQVRJQ19TVFlMRSIsIl9yZW5kZXJDdXJyZW50UGF0aCIsIl9yZW5kZXJDdXJyZW50VmVydGljZXMiLCJfZ2V0RmVhdHVyZVJlbmRlclN0YXRlIiwiX3JlbmRlckZlYXR1cmUiLCJfcmVuZGVyRmVhdHVyZXMiLCJfcmVuZGVyQ3VycmVudCIsIl8iLCJfY29udGFpbmVyUmVmIiwiX3JlbmRlckNhbnZhcyIsImZyb21GZWF0dXJlIiwiX2V2ZW50cyIsIl9zZXR1cEV2ZW50cyIsIm5leHRQcm9wcyIsIl9yZW1vdmVFdmVudHMiLCJyZWYiLCJldmVudE1hbmFnZXIiLCJhbnljbGljayIsIl9vbkV2ZW50IiwiX29uQ2xpY2siLCJjbGljayIsInBvaW50ZXJtb3ZlIiwiX29uTW91c2VNb3ZlIiwicG9pbnRlcmRvd24iLCJfb25Nb3VzZURvd24iLCJwb2ludGVydXAiLCJfb25Nb3VzZVVwIiwicGFubW92ZSIsIl9vblBhbiIsInBhbnN0YXJ0IiwicGFuZW5kIiwib24iLCJvZmYiLCJwYXRoU3RyaW5nIiwiam9pbiIsImNvbnRleHQiLCJfcmVuZGVyRWRpdG9yIiwiUHVyZUNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUVBOztBQUVBOztBQU1BOztBQVdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUNBLElBQU1BLFlBQVksR0FBRztBQUNuQkMsRUFBQUEsSUFBSSxFQUFFQyxpQkFBTUMsU0FETztBQUVuQkMsRUFBQUEsV0FBVyxFQUFFLENBRk07QUFHbkJDLEVBQUFBLGtCQUFrQixFQUFFQyx5QkFIRDtBQUluQkMsRUFBQUEsZUFBZSxFQUFFQyxzQkFKRTtBQUtuQkMsRUFBQUEsZUFBZSxFQUFFLFFBTEU7QUFNbkJDLEVBQUFBLGtCQUFrQixFQUFFLFFBTkQ7QUFPbkJDLEVBQUFBLFFBQVEsRUFBRSxvQkFBTSxDQUFFO0FBUEMsQ0FBckI7QUFVQSxJQUFNQyxjQUFjLEdBQUcsYUFBdkI7O0lBRXFCQyxNOzs7OztBQUduQixrQkFBWUMsS0FBWixFQUFnQztBQUFBOztBQUFBOztBQUM5QixnRkFBTUEsS0FBTjs7QUFEOEI7O0FBQUE7O0FBQUE7O0FBQUEsc0ZBc0V0QixVQUFDQyxRQUFELEVBQStCO0FBQ3ZDLFVBQUlBLFFBQUosRUFBYztBQUNaLGNBQUtELEtBQUwsQ0FBV0UsUUFBWCxDQUFvQkQsUUFBUSxD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SSxHQURnQixDQUNaLFVBQUFnSSxDQUFDLEVBQUk7QUFDUiw2QkFBVUEsQ0FBQyxDQUFDLENBQUQsQ0FBWCxjQUFrQkEsQ0FBQyxDQUFDLENBQUQsQ0FBbkI7QUFDRCxXQUhnQixFQUloQjJFLElBSmdCLENBSVgsR0FKVyxDQUFuQjtBQUtBLDZCQUFZRCxVQUFaLGNBQTBCbEosUUFBUSxHQUFHLEdBQUgsR0FBUyxFQUEzQzs7QUFDRjtBQUNFLGlCQUFPLElBQVA7QUFiSjtBQWVEOzs7NkJBd2pCUTtBQUFBOztBQUNQLGFBQ0UsNkJBQUMsdUJBQUQsQ0FBWSxRQUFaLFFBQ0csVUFBQW9KLE9BQU8sRUFBSTtBQUNWLFFBQUEsTUFBSSxDQUFDcEcsUUFBTCxHQUFnQm9HLE9BQWhCO0FBQ0EsWUFBTW5HLFFBQVEsR0FBR21HLE9BQU8sSUFBSUEsT0FBTyxDQUFDbkcsUUFBcEM7O0FBRUEsWUFBSSxDQUFDQSxRQUFELElBQWFBLFFBQVEsQ0FBQzRCLE1BQVQsSUFBbUIsQ0FBaEMsSUFBcUM1QixRQUFRLENBQUMyQixLQUFULElBQWtCLENBQTNELEVBQThEO0FBQzVELGlCQUFPLElBQVA7QUFDRDs7QUFFRCxlQUFPLE1BQUksQ0FBQ3lFLGFBQUwsRUFBUDtBQUNELE9BVkgsQ0FERjtBQWNEOzs7O0VBanJDaUNDLG9COzs7O2dCQUFmbE4sTSxrQkFDR2IsWSIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5pbXBvcnQgUmVhY3QsIHsgUHVyZUNvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IE1qb2xuaXJFdmVudCB9IGZyb20gJ21qb2xuaXIuanMnO1xuaW1wb3J0IHR5cGUgeyBQb3NpdGlvbiwgRmVhdHVyZSBhcyBHZW9Kc29uIH0gZnJvbSAnQG5lYnVsYS5nbC9lZGl0LW1vZGVzJztcbmltcG9ydCB7IF9NYXBDb250ZXh0IGFzIE1hcENvbnRleHQgfSBmcm9tICdyZWFjdC1tYXAtZ2wnO1xuaW1wb3J0IHV1aWQgZnJvbSAndXVpZCc7XG5pbXBvcnQgY2lyY2xlVG9Qb2x5Z29uIGZyb20gJ2NpcmNsZS10by1wb2x5Z29uJztcblxuaW1wb3J0IEZlYXR1cmUgZnJvbSAnLi9mZWF0dXJlJztcbmltcG9ydCB0eXBlIHsgSWQsIFNjcmVlbkNvb3JkaW5hdGVzLCBPcGVyYXRpb24sIFJlbmRlclR5cGUgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7XG4gIGdldEVkaXRIYW5kbGVTdHlsZSBhcyBkZWZhdWx0R2V0RWRpdEhhbmRsZVN0eWxlLFxuICBnZXRGZWF0dXJlU3R5bGUgYXMgZGVmYXVsdEdldEZlYXR1cmVTdHlsZSxcbiAgSElEREVOX0NMSUNLQUJMRV9TVFlMRVxufSBmcm9tICcuL3N0eWxlJztcblxuaW1wb3J0IHtcbiAgT1BFUkFUSU9OUyxcbiAgTU9ERVMsXG4gIERSQVdJTkdfTU9ERVMsXG4gIE1PREVfVE9fR0VPSlNPTl9UWVBFLFxuICBNT0RFX1RPX1JFTkRFUl9UWVBFLFxuICBSRU5ERVJfU1RBVEUsXG4gIFJFTkRFUl9UWVBFLFxuICBTVEFUSUNfU1RZTEUsXG4gIEVMRU1FTlRfVFlQRVxufSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBwYXJzZUVsZW1EYXRhQXR0cmlidXRlcywgZmluZENsb3Nlc3RQb2ludE9uTGluZVNlZ21lbnQgfSBmcm9tICcuL3V0aWxzJztcblxudHlwZSBFZGl0b3JQcm9wcyA9IHtcbiAgZmVhdHVyZXM6ID9BcnJheTxHZW9Kc29uPixcbiAgc2VsZWN0ZWRGZWF0dXJlSWQ6ID9JZCxcbiAgbW9kZTogc3RyaW5nLFxuICBjbGlja1JhZGl1czogP251bWJlcixcbiAgc3R5bGU6ID9PYmplY3QsXG5cbiAgb25TZWxlY3Q6IEZ1bmN0aW9uLFxuICBvblVwZGF0ZTogRnVuY3Rpb24sXG5cbiAgZ2V0RWRpdEhhbmRsZVN0eWxlOiBGdW5jdGlvbixcbiAgZ2V0RmVhdHVyZVN0eWxlOiBGdW5jdGlvbixcbiAgZ2V0RmVhdHVyZVNoYXBlOiBGdW5jdGlvbiB8IHN0cmluZyxcbiAgZ2V0RWRpdEhhbmRsZVNoYXBlOiBGdW5jdGlvbiB8IHN0cmluZ1xufTtcblxudHlwZSBFZGl0b3JTdGF0ZSA9IHtcbiAgZmVhdHVyZXM6ID9BcnJheTxGZWF0dXJlPixcbiAgc2VsZWN0ZWRGZWF0dXJlSWQ6ID9JZCxcbiAgdW5jb21taXR0ZWRMbmdMYXQ6ID9Qb3NpdGlvbixcblxuICBob3ZlcmVkRmVhdHVyZUlkOiA/SWQsXG4gIGhvdmVyZWRMbmdMYXQ6ID9Qb3NpdGlvbixcbiAgaG92ZXJlZFZlcnRleEluZGV4OiA/SWQsXG5cbiAgZHJhZ2dpbmdWZXJ0ZXhJbmRleDogP251bWJlcixcbiAgc3RhcnREcmFnUG9zOiA/U2NyZWVuQ29vcmRpbmF0ZXMsXG4gIGlzRHJhZ2dpbmc6ID9ib29sZWFuLFxuICBkaWREcmFnOiA/Ym9vbGVhblxufTtcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBtb2RlOiBNT0RFUy5SRUFEX09OTFksXG4gIGNsaWNrUmFkaXVzOiAwLFxuICBnZXRFZGl0SGFuZGxlU3R5bGU6IGRlZmF1bHRHZXRFZGl0SGFuZGxlU3R5bGUsXG4gIGdldEZlYXR1cmVTdHlsZTogZGVmYXVsdEdldEZlYXR1cmVTdHlsZSxcbiAgZ2V0RmVhdHVyZVNoYXBlOiAnY2lyY2xlJyxcbiAgZ2V0RWRpdEhhbmRsZVNoYXBlOiAnY2lyY2xlJyxcbiAgb25TZWxlY3Q6ICgpID0+IHt9XG59O1xuXG5jb25zdCBVTkNPTU1JVFRFRF9JRCA9ICd1bmNvbW1pdHRlZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvciBleHRlbmRzIFB1cmVDb21wb25lbnQ8RWRpdG9yUHJvcHMsIEVkaXRvclN0YXRlPiB7XG4gIHN0YXRpYyBkZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IEVkaXRvclByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBmZWF0dXJlczogcHJvcHMuZmVhdHVyZXNcbiAgICAgICAgPyBwcm9wcy5mZWF0dXJlcy5tYXAoZiA9PiBGZWF0dXJlLmZyb21GZWF0dXJlKGYpKS5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgOiBudWxsLFxuXG4gICAgICBzZWxlY3RlZEZlYXR1cmVJZDogLTEsXG5cbiAgICAgIGhvdmVyZWRGZWF0dXJlSWQ6IG51bGwsXG4gICAgICBob3ZlcmVkTG5nTGF0OiBudWxsLFxuICAgICAgaG92ZXJlZFZlcnRleEluZGV4OiAtMSxcblxuICAgICAgLy8gaW50ZXJtZWRpYXRlIG1vdXNlIHBvc2l0aW9uIHdoZW4gZHJhd2luZ1xuICAgICAgdW5jb21taXR0ZWRMbmdMYXQ6IG51bGwsXG5cbiAgICAgIGRyYWdnaW5nVmVydGV4SW5kZXg6IC0xLFxuICAgICAgc3RhcnREcmFnUG9zOiBudWxsLFxuICAgICAgaXNEcmFnZ2luZzogZmFsc2UsXG4gICAgICBkaWREcmFnOiBmYWxzZVxuICAgIH07XG5cbiAgICB0aGlzLl9jb250YWluZXJSZWYgPSBudWxsO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHRoaXMuX2NvbnRleHQgPSBudWxsO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubW9kZSAmJiB0aGlzLnByb3BzLm1vZGUgIT09IE1PREVTLlJFQURfT05MWSkge1xuICAgICAgdGhpcy5fc2V0dXBFdmVudHMoKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogRWRpdG9yUHJvcHMpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5tb2RlICE9PSBuZXh0UHJvcHMubW9kZSkge1xuICAgICAgaWYgKCFuZXh0UHJvcHMubW9kZSB8fCBuZXh0UHJvcHMubW9kZSA9PT0gTU9ERVMuUkVBRF9PTkxZKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUV2ZW50cygpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLnByb3BzLm1vZGUgfHwgdGhpcy5wcm9wcy5tb2RlID09PSBNT0RFUy5SRUFEX09OTFkpIHtcbiAgICAgICAgdGhpcy5fc2V0dXBFdmVudHMoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5tb2RlICE9PSBuZXh0UHJvcHMubW9kZSB8fCB0aGlzLnByb3BzLmZlYXR1cmVzICE9PSBuZXh0UHJvcHMuZmVhdHVyZXMpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmZWF0dXJlczpcbiAgICAgICAgICBuZXh0UHJvcHMuZmVhdHVyZXMgJiYgbmV4dFByb3BzLmZlYXR1cmVzLm1hcChmID0+IEZlYXR1cmUuZnJvbUZlYXR1cmUoZikpLmZpbHRlcihCb29sZWFuKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdGhpcy5wcm9wcy5tb2RlICE9PSBuZXh0UHJvcHMubW9kZSB8fFxuICAgICAgdGhpcy5wcm9wcy5zZWxlY3RlZEZlYXR1cmVJZCAhPT0gbmV4dFByb3BzLnNlbGVjdGVkRmVhdHVyZUlkXG4gICAgKSB7XG4gICAgICB0aGlzLl9jbGVhckNhY2hlKCk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSWQ6IG5leHRQcm9wcy5zZWxlY3RlZEZlYXR1cmVJZFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5fcmVtb3ZlRXZlbnRzKCk7XG4gIH1cblxuICBfY29udGFpbmVyUmVmOiA/SFRNTERpdkVsZW1lbnQ7XG4gIF9ldmVudHM6IGFueTtcbiAgX2NvbnRleHQ6ID9NYXBDb250ZXh0O1xuXG4gIC8qIEZFQVRVUkUgT1BFUkFUSU9OUyAqL1xuICBfdXBkYXRlID0gKGZlYXR1cmVzOiA/QXJyYXk8RmVhdHVyZT4pID0+IHtcbiAgICBpZiAoZmVhdHVyZXMpIHtcbiAgICAgIHRoaXMucHJvcHMub25VcGRhdGUoZmVhdHVyZXMubWFwKGYgPT4gZi50b0ZlYXR1cmUoKSkpO1xuICAgIH1cbiAgfTtcblxuICBfdXBkYXRlUmVjdGFuZ2xlID0gKGZlYXR1cmU6IEZlYXR1cmUsIG9wdGlvbnM6IGFueSkgPT4ge1xuICAgIGNvbnN0IHsgdmVydGV4SW5kZXgsIGxuZ0xhdCB9ID0gb3B0aW9ucztcbiAgICAvKlxuICAgICogICBwMC54LCBwMC55ICAgLS0tLS0tLS0tLSAgZGlhZ29uYWwueCwgcDAueVxuICAgICogICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICogICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICogICBwMC54LCBkaWFnb25hbC55IC0tLS0tIGRpYWdvbmFsLngsIGRpYWdvbmFsLnlcbiAgICAqL1xuICAgIGNvbnN0IGRpYWdvbmFsID0gdmVydGV4SW5kZXg7XG4gICAgY29uc3QgcDAgPSBmZWF0dXJlLnBvaW50c1soZGlhZ29uYWwgKyAyKSAlIDRdO1xuXG4gICAgZmVhdHVyZS5yZXBsYWNlUG9pbnQoZGlhZ29uYWwsIFtsbmdMYXRbMF0sIGxuZ0xhdFsxXV0pO1xuICAgIGZlYXR1cmUucmVwbGFjZVBvaW50KChkaWFnb25hbCArIDEpICUgNCwgW2xuZ0xhdFswXSwgcDBbMV1dKTtcbiAgICBmZWF0dXJlLnJlcGxhY2VQb2ludCgoZGlhZ29uYWwgKyAzKSAlIDQsIFtwMFswXSwgbG5nTGF0WzFdXSk7XG5cbiAgICB0aGlzLl91cGRhdGUodGhpcy5zdGF0ZS5mZWF0dXJlcyk7XG4gIH07XG5cbiAgX3VwZGF0ZUZlYXR1cmUgPSAoZmVhdHVyZTogYW55LCBtb2RlOiBzdHJpbmcsIG9wdGlvbnM6IGFueSkgPT4ge1xuICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgY2FzZSAndmVydGV4JzpcbiAgICAgICAgaWYgKGZlYXR1cmUucmVuZGVyVHlwZSA9PT0gUkVOREVSX1RZUEUuUkVDVEFOR0xFKSB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlUmVjdGFuZ2xlKGZlYXR1cmUsIG9wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZlYXR1cmUucmVwbGFjZVBvaW50KG9wdGlvbnMudmVydGV4SW5kZXgsIFtvcHRpb25zLmxuZ0xhdFswXSwgb3B0aW9ucy5sbmdMYXRbMV1dKTtcbiAgICAgICAgICB0aGlzLl91cGRhdGUodGhpcy5zdGF0ZS5mZWF0dXJlcyk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2ZlYXR1cmUnOlxuICAgICAgICBjb25zdCB7IGR4LCBkeSB9ID0gb3B0aW9ucztcbiAgICAgICAgZmVhdHVyZS5wb2ludHMgPSBmZWF0dXJlLnBvaW50c1xuICAgICAgICAgIC5tYXAobG5nTGF0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBpeGVscyA9IHRoaXMuX3Byb2plY3QobG5nTGF0KTtcbiAgICAgICAgICAgIGlmIChwaXhlbHMpIHtcbiAgICAgICAgICAgICAgcGl4ZWxzWzBdICs9IGR4O1xuICAgICAgICAgICAgICBwaXhlbHNbMV0gKz0gZHk7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLl91bnByb2plY3QocGl4ZWxzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmZpbHRlcihCb29sZWFuKTtcblxuICAgICAgICB0aGlzLl91cGRhdGUodGhpcy5zdGF0ZS5mZWF0dXJlcyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdSZWN0YW5nbGUnOlxuICAgICAgICB0aGlzLl91cGRhdGVSZWN0YW5nbGUoZmVhdHVyZSwgb3B0aW9ucyk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgIH1cbiAgfTtcblxuICBfYWRkUG9pbnQgPSAoeDogbnVtYmVyLCB5OiBudW1iZXIsIGZlYXR1cmU6ID9GZWF0dXJlLCBpc05ldzogYm9vbGVhbiA9IGZhbHNlKSA9PiB7XG4gICAgZmVhdHVyZSA9IGZlYXR1cmUgfHwgdGhpcy5fZ2V0U2VsZWN0ZWRGZWF0dXJlKCk7XG5cbiAgICBpZiAoIWZlYXR1cmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsbmdMYXQgPSB0aGlzLl91bnByb2plY3QoW3gsIHldKTtcbiAgICBpZiAoIWxuZ0xhdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZlYXR1cmUuYWRkUG9pbnQoW2xuZ0xhdFswXSwgbG5nTGF0WzFdXSk7XG5cbiAgICBjb25zdCBmZWF0dXJlcyA9IHRoaXMuc3RhdGUuZmVhdHVyZXMgfHwgW107XG4gICAgaWYgKGlzTmV3KSB7XG4gICAgICBmZWF0dXJlcy5wdXNoKGZlYXR1cmUpO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbGlkUGF0aCA9IGZlYXR1cmUucG9pbnRzICYmIGZlYXR1cmUucG9pbnRzLmxlbmd0aCA+PSAyO1xuICAgIGNvbnN0IHsgbW9kZSwgb25TZWxlY3QgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAobW9kZSA9PT0gTU9ERVMuRFJBV19QT0lOVCB8fCAobW9kZSA9PT0gTU9ERVMuRFJBV19QQVRIICYmIHZhbGlkUGF0aCkpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZShmZWF0dXJlcyk7XG4gICAgICBvblNlbGVjdCh7IHNlbGVjdGVkRmVhdHVyZUlkOiBmZWF0dXJlICYmIGZlYXR1cmUuaWQgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmZWF0dXJlczogWy4uLmZlYXR1cmVzXSxcbiAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSWQ6IGZlYXR1cmUgJiYgZmVhdHVyZS5pZFxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIF9jbGVhckNhY2hlID0gKCkgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VsZWN0ZWRGZWF0dXJlSWQ6IG51bGwsXG4gICAgICB1bmNvbW1pdHRlZExuZ0xhdDogbnVsbCxcblxuICAgICAgaG92ZXJlZEZlYXR1cmVJZDogbnVsbCxcbiAgICAgIGhvdmVyZWRMbmdMYXQ6IG51bGwsXG4gICAgICBob3ZlcmVkVmVydGV4SW5kZXg6IC0xLFxuXG4gICAgICBkcmFnZ2luZ1ZlcnRleEluZGV4OiAtMSxcbiAgICAgIHN0YXJ0RHJhZ1BvczogbnVsbCxcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgZGlkRHJhZzogZmFsc2VcbiAgICB9KTtcbiAgfTtcblxuICBfY2xvc2VQYXRoID0gKCkgPT4ge1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZSA9IHRoaXMuX2dldFNlbGVjdGVkRmVhdHVyZSgpO1xuICAgIGlmIChzZWxlY3RlZEZlYXR1cmUpIHtcbiAgICAgIHNlbGVjdGVkRmVhdHVyZS5jbG9zZVBhdGgoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZSh0aGlzLnN0YXRlLmZlYXR1cmVzKTtcbiAgICB9XG4gIH07XG5cbiAgX2FkZEZlYXR1cmUgPSAobW9kZTogc3RyaW5nLCBwb2ludDogU2NyZWVuQ29vcmRpbmF0ZXMpID0+IHtcbiAgICBjb25zdCB0eXBlID0gTU9ERV9UT19HRU9KU09OX1RZUEVbbW9kZV07XG4gICAgY29uc3QgcmVuZGVyVHlwZSA9IE1PREVfVE9fUkVOREVSX1RZUEVbbW9kZV07XG5cbiAgICBjb25zdCBmZWF0dXJlID0gbmV3IEZlYXR1cmUoe1xuICAgICAgaWQ6IHV1aWQoKSxcbiAgICAgIHR5cGUsXG4gICAgICByZW5kZXJUeXBlXG4gICAgfSk7XG4gICAgaWYgKG1vZGUgPT09IE1PREVTLkRSQVdfNU1JTEVfQ0lSQ0xFIHx8IG1vZGUgPT09IE1PREVTLkRSQVdfM01JTEVfQ0lSQ0xFIHx8IG1vZGUgPT09IE1PREVTLkRSQVdfMU1JTEVfQ0lSQ0xFKSB7XG4gICAgICBjb25zdCByYWRpdXMgPSBtb2RlID09PSBNT0RFUy5EUkFXXzVNSUxFX0NJUkNMRSA/IDgwNDYuNzIgOiAobW9kZSA9PT0gTU9ERVMuRFJBV18zTUlMRV9DSVJDTEUgPyA0ODI4LjAzMiA6IDE2MDkuMzQ0KTtcbiAgICAgIGZlYXR1cmUuaXNDbG9zZWQgPSB0cnVlO1xuICAgICAgY29uc3QgcG9seWdvbiA9IGNpcmNsZVRvUG9seWdvbih0aGlzLl91bnByb2plY3QoW3BvaW50LngsIHBvaW50LnldKSwgcmFkaXVzLCAzNik7XG4gICAgICBsZXQgbmV3Rmlyc3RQb2ludDogQXJyYXk8bnVtYmVyPiA9IFtcbiAgICAgICAgcG9seWdvbi5jb29yZGluYXRlc1swXVswXVswXSxcbiAgICAgICAgcG9seWdvbi5jb29yZGluYXRlc1swXVswXVsxXVxuICAgICAgXTtcbiAgICAgIG5ld0ZpcnN0UG9pbnQgPSB0aGlzLl9wcm9qZWN0KG5ld0ZpcnN0UG9pbnQpO1xuICAgICAgdGhpcy5fYWRkUG9pbnQobmV3Rmlyc3RQb2ludFswXSwgbmV3Rmlyc3RQb2ludFsxXSwgZmVhdHVyZSwgdHJ1ZSk7XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHBvbHlnb24uY29vcmRpbmF0ZXNbMF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IG5ld1BvaW50OiBBcnJheTxudW1iZXI+ID0gW3BvbHlnb24uY29vcmRpbmF0ZXNbMF1baV1bMF0sIHBvbHlnb24uY29vcmRpbmF0ZXNbMF1baV1bMV1dO1xuICAgICAgICBuZXdQb2ludCA9IHRoaXMuX3Byb2plY3QobmV3UG9pbnQpO1xuICAgICAgICB0aGlzLl9hZGRQb2ludChuZXdQb2ludFswXSwgbmV3UG9pbnRbMV0sIGZlYXR1cmUsIGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3VwZGF0ZSh0aGlzLnN0YXRlLmZlYXR1cmVzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9hZGRQb2ludChwb2ludC54LCBwb2ludC55LCBmZWF0dXJlLCB0cnVlKTtcblxuICAgIGlmIChtb2RlID09PSBNT0RFUy5EUkFXX1JFQ1RBTkdMRSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgdGhpcy5fYWRkUG9pbnQocG9pbnQueCwgcG9pbnQueSwgZmVhdHVyZSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKiBFVkVOVFMgKi9cbiAgX3NldHVwRXZlbnRzKCkge1xuICAgIGNvbnN0IHJlZiA9IHRoaXMuX2NvbnRhaW5lclJlZjtcblxuICAgIGlmICghcmVmIHx8ICF0aGlzLl9jb250ZXh0IHx8ICF0aGlzLl9jb250ZXh0LmV2ZW50TWFuYWdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2V2ZW50cyA9IHtcbiAgICAgIGFueWNsaWNrOiBldnQgPT4gdGhpcy5fb25FdmVudCh0aGlzLl9vbkNsaWNrLCBldnQsIHRydWUpLFxuICAgICAgY2xpY2s6IGV2dCA9PiBldnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCksXG4gICAgICBwb2ludGVybW92ZTogZXZ0ID0+IHRoaXMuX29uRXZlbnQodGhpcy5fb25Nb3VzZU1vdmUsIGV2dCwgdHJ1ZSksXG4gICAgICBwb2ludGVyZG93bjogZXZ0ID0+IHRoaXMuX29uRXZlbnQodGhpcy5fb25Nb3VzZURvd24sIGV2dCwgdHJ1ZSksXG4gICAgICBwb2ludGVydXA6IGV2dCA9PiB0aGlzLl9vbkV2ZW50KHRoaXMuX29uTW91c2VVcCwgZXZ0LCB0cnVlKSxcbiAgICAgIHBhbm1vdmU6IGV2dCA9PiB0aGlzLl9vbkV2ZW50KHRoaXMuX29uUGFuLCBldnQsIGZhbHNlKSxcbiAgICAgIHBhbnN0YXJ0OiBldnQgPT4gdGhpcy5fb25FdmVudCh0aGlzLl9vblBhbiwgZXZ0LCBmYWxzZSksXG4gICAgICBwYW5lbmQ6IGV2dCA9PiB0aGlzLl9vbkV2ZW50KHRoaXMuX29uUGFuLCBldnQsIGZhbHNlKVxuICAgIH07XG5cbiAgICB0aGlzLl9jb250ZXh0LmV2ZW50TWFuYWdlci5vbih0aGlzLl9ldmVudHMsIHJlZik7XG4gIH1cblxuICBfcmVtb3ZlRXZlbnRzKCkge1xuICAgIGlmICghdGhpcy5fY29udGV4dCB8fCAhdGhpcy5fY29udGV4dC5ldmVudE1hbmFnZXIgfHwgIXRoaXMuX2V2ZW50cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9jb250ZXh0LmV2ZW50TWFuYWdlci5vZmYodGhpcy5fZXZlbnRzKTtcbiAgICB0aGlzLl9ldmVudHMgPSBudWxsO1xuICB9XG5cbiAgX29uRXZlbnQgPSAoaGFuZGxlcjogRnVuY3Rpb24sIGV2dDogTWpvbG5pckV2ZW50LCBzdG9wUHJvcGFnYXRpb246IGJvb2xlYW4sIC4uLmFyZ3M6IGFueSkgPT4ge1xuICAgIGNvbnN0IHsgbW9kZSB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAobW9kZSA9PT0gTU9ERVMuUkVBRF9PTkxZKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaGFuZGxlcihldnQsIC4uLmFyZ3MpO1xuXG4gICAgaWYgKHN0b3BQcm9wYWdhdGlvbikge1xuICAgICAgZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfTtcblxuICBfb25Nb3VzZVVwID0gKGV2dDogTWpvbG5pckV2ZW50KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc0RyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGRpZERyYWc6IGZhbHNlXG4gICAgfSk7XG4gICAgY29uc3QgeyBkcmFnZ2luZ1ZlcnRleEluZGV4IH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKE51bWJlcihkcmFnZ2luZ1ZlcnRleEluZGV4KSA+PSAwKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZHJhZ2dpbmdWZXJ0ZXhJbmRleDogLTFcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBfb25Nb3VzZURvd24gPSAoZXZ0OiBNam9sbmlyRXZlbnQpID0+IHtcbiAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMuX2dldEV2ZW50UG9zaXRpb24oZXZ0KTtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gcGFyc2VFbGVtRGF0YUF0dHJpYnV0ZXMoZXZ0LnRhcmdldCk7XG5cbiAgICAvLyBjbGljayBzZWdtZW50XG4gICAgaWYgKGF0dHJpYnV0ZXMgJiYgYXR0cmlidXRlcy50eXBlID09PSBFTEVNRU5UX1RZUEUuVkVSVEVYKSB7XG4gICAgICBjb25zdCB7IHZlcnRleEluZGV4IH0gPSBhdHRyaWJ1dGVzO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGRyYWdnaW5nVmVydGV4SW5kZXg6IHZlcnRleEluZGV4LFxuICAgICAgICBzdGFydERyYWdQb3M6IHsgeCwgeSB9LFxuICAgICAgICBpc0RyYWdnaW5nOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgLy8gY2xpY2sgc2VsZWN0ZWQgZmVhdHVyZVxuICAgIH0gZWxzZSBpZiAodGhpcy5fbWF0Y2hlc0ZlYXR1cmUoYXR0cmlidXRlcywgdGhpcy5fZ2V0U2VsZWN0ZWRGZWF0dXJlKCkpKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgc3RhcnREcmFnUG9zOiB7IHgsIHkgfSxcbiAgICAgICAgaXNEcmFnZ2luZzogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG1heC1kZXB0aCAqL1xuICBfb25Nb3VzZU1vdmUgPSAoZXZ0OiBNam9sbmlyRXZlbnQpID0+IHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gcGFyc2VFbGVtRGF0YUF0dHJpYnV0ZXMoZXZ0LnRhcmdldCkgfHwge307XG4gICAgY29uc3QgeyB2ZXJ0ZXhJbmRleCwgZmVhdHVyZUluZGV4LCB0eXBlIH0gPSBhdHRyaWJ1dGVzO1xuXG4gICAgY29uc3QgeyBzdGFydERyYWdQb3MsIGlzRHJhZ2dpbmcsIGRpZERyYWcgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgeyBtb2RlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5fZ2V0RXZlbnRQb3NpdGlvbihldnQpO1xuICAgIGNvbnN0IGxuZ0xhdCA9IHRoaXMuX3VucHJvamVjdChbeCwgeV0pO1xuXG4gICAgaWYgKGlzRHJhZ2dpbmcgJiYgIWRpZERyYWcgJiYgc3RhcnREcmFnUG9zKSB7XG4gICAgICBjb25zdCBkeCA9IHggLSBzdGFydERyYWdQb3MueDtcbiAgICAgIGNvbnN0IGR5ID0geSAtIHN0YXJ0RHJhZ1Bvcy55O1xuICAgICAgaWYgKGR4ICogZHggKyBkeSAqIGR5ID4gNSkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZGlkRHJhZzogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZEZlYXR1cmUgPSB0aGlzLl9nZXRTZWxlY3RlZEZlYXR1cmUoKTtcbiAgICBjb25zdCBpc0RyYXdpbmcgPSBEUkFXSU5HX01PREVTLmluZGV4T2YobW9kZSkgIT09IC0xO1xuICAgIGNvbnN0IGlzRWRpdGluZyA9IG1vZGUgPT09IE1PREVTLkVESVRfVkVSVEVYO1xuXG4gICAgaWYgKHNlbGVjdGVkRmVhdHVyZSkge1xuICAgICAgLy8gZHJhZ2dpbmdcbiAgICAgIGlmIChkaWREcmFnICYmIHN0YXJ0RHJhZ1Bvcykge1xuICAgICAgICBjb25zdCBkcmFnZ2luZ1ZlcnRleEluZGV4ID0gTnVtYmVyKHRoaXMuc3RhdGUuZHJhZ2dpbmdWZXJ0ZXhJbmRleCk7XG5cbiAgICAgICAgaWYgKGRyYWdnaW5nVmVydGV4SW5kZXggPj0gMCkge1xuICAgICAgICAgIC8vIGRyYWdnaW5nIHZlcnRleFxuICAgICAgICAgIHRoaXMuX3VwZGF0ZUZlYXR1cmUoc2VsZWN0ZWRGZWF0dXJlLCAndmVydGV4Jywge1xuICAgICAgICAgICAgdmVydGV4SW5kZXg6IGRyYWdnaW5nVmVydGV4SW5kZXgsXG4gICAgICAgICAgICBsbmdMYXRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBkcmFnZ2luZyBmZWF0dXJlXG4gICAgICAgICAgY29uc3QgZHggPSB4IC0gc3RhcnREcmFnUG9zLng7XG4gICAgICAgICAgY29uc3QgZHkgPSB5IC0gc3RhcnREcmFnUG9zLnk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHN0YXJ0RHJhZ1BvczogeyB4LCB5IH0gfSk7XG5cbiAgICAgICAgICB0aGlzLl91cGRhdGVGZWF0dXJlKHNlbGVjdGVkRmVhdHVyZSwgJ2ZlYXR1cmUnLCB7IGR4LCBkeSB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChtb2RlID09PSBNT0RFUy5EUkFXX1JFQ1RBTkdMRSkge1xuICAgICAgICAvLyBkcmF3aW5nIHJlY3RhbmdsZVxuICAgICAgICB0aGlzLl91cGRhdGVGZWF0dXJlKHNlbGVjdGVkRmVhdHVyZSwgJ1JlY3RhbmdsZScsIHsgdmVydGV4SW5kZXg6IDIsIGxuZ0xhdCB9KTtcbiAgICAgIH0gZWxzZSBpZiAoaXNEcmF3aW5nKSB7XG4gICAgICAgIC8vIGRyYXdpbmcgb3RoZXIgc2hhcGVzXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB1bmNvbW1pdHRlZExuZ0xhdDogbG5nTGF0IH0pO1xuICAgICAgfSBlbHNlIGlmIChpc0VkaXRpbmcpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChzZWxlY3RlZEZlYXR1cmUucmVuZGVyVHlwZSA9PT0gUkVOREVSX1RZUEUuTElORV9TVFJJTkcgfHxcbiAgICAgICAgICAgIHNlbGVjdGVkRmVhdHVyZS5yZW5kZXJUeXBlID09PSBSRU5ERVJfVFlQRS5QT0xZR09OKSAmJlxuICAgICAgICAgIHR5cGUgPT09IEVMRU1FTlRfVFlQRS5TRUdNRU5UXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIHNlZ21lbnRJZCBpcyBzdGFydCB2ZXJ0ZXhJbmRleFxuICAgICAgICAgIGxldCB1bmNvbW1pdHRlZExuZ0xhdCA9IG51bGw7XG4gICAgICAgICAgaWYgKGxuZ0xhdCAmJiB0eXBlb2YgdmVydGV4SW5kZXggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB1bmNvbW1pdHRlZExuZ0xhdCA9IHRoaXMuX2dldENsb3Nlc3RQb3NpdGlvbk9uU2VnbWVudChcbiAgICAgICAgICAgICAgdmVydGV4SW5kZXgsXG4gICAgICAgICAgICAgIGxuZ0xhdCxcbiAgICAgICAgICAgICAgc2VsZWN0ZWRGZWF0dXJlXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgdW5jb21taXR0ZWRMbmdMYXRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIHVuY29tbWl0dGVkTG5nTGF0OiBudWxsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB7IGZlYXR1cmVzLCBzZWxlY3RlZEZlYXR1cmVJZCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAoc2VsZWN0ZWRGZWF0dXJlSWQgJiYgdHlwZSA9PT0gRUxFTUVOVF9UWVBFLlZFUlRFWCAmJiB0eXBlb2YgZmVhdHVyZUluZGV4ID09PSAnbnVtYmVyJykge1xuICAgICAgY29uc3QgZmVhdHVyZSA9IGZlYXR1cmVzICYmIGZlYXR1cmVzW2ZlYXR1cmVJbmRleF07XG4gICAgICBpZiAoc2VsZWN0ZWRGZWF0dXJlSWQgPT09IChmZWF0dXJlICYmIGZlYXR1cmUuaWQpKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGhvdmVyZWRWZXJ0ZXhJbmRleDogdmVydGV4SW5kZXhcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlICE9PSBFTEVNRU5UX1RZUEUuVkVSVEVYKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaG92ZXJlZFZlcnRleEluZGV4OiBudWxsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gRUxFTUVOVF9UWVBFLkZFQVRVUkUgJiYgdHlwZW9mIGZlYXR1cmVJbmRleCA9PT0gJ251bWJlcicpIHtcbiAgICAgIGNvbnN0IGZlYXR1cmUgPSBmZWF0dXJlcyAmJiBmZWF0dXJlc1tmZWF0dXJlSW5kZXhdO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGhvdmVyZWRGZWF0dXJlSWQ6IGZlYXR1cmUgJiYgZmVhdHVyZS5pZFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBob3ZlcmVkRmVhdHVyZUlkOiBudWxsXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIC8qIGVzbGludC1lbmFibGUgbWF4LWRlcHRoICovXG5cbiAgX29uQ2xpY2tGZWF0dXJlID0gKGV2dDogTWpvbG5pckV2ZW50LCBhdHRyaWJ1dGVzOiBhbnkpID0+IHtcbiAgICBjb25zdCB7IGZlYXR1cmVJbmRleCB9ID0gYXR0cmlidXRlcztcbiAgICBjb25zdCB7IGZlYXR1cmVzIH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZSA9IGZlYXR1cmVzICYmIHR5cGVvZiBmZWF0dXJlSW5kZXggPT09ICdudW1iZXInICYmIGZlYXR1cmVzW2ZlYXR1cmVJbmRleF07XG5cbiAgICBpZiAoc2VsZWN0ZWRGZWF0dXJlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uU2VsZWN0KHtcbiAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSWQ6IHNlbGVjdGVkRmVhdHVyZS5pZCxcbiAgICAgICAgc291cmNlRXZlbnQ6IGV2dFxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIF9vbkNsaWNrVmVydGV4ID0gKGV2dDogTWpvbG5pckV2ZW50LCBhdHRyaWJ1dGVzOiBhbnkpID0+IHtcbiAgICBjb25zdCB7IG1vZGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgb3BlcmF0aW9uID0gYXR0cmlidXRlcy5vcGVyYXRpb247XG4gICAgaWYgKFxuICAgICAgb3BlcmF0aW9uID09PSBPUEVSQVRJT05TLklOVEVSU0VDVCB8fFxuICAgICAgKG9wZXJhdGlvbiA9PT0gT1BFUkFUSU9OUy5TRVQgJiYgbW9kZSA9PT0gTU9ERVMuRFJBV19SRUNUQU5HTEUpXG4gICAgKSB7XG4gICAgICB0aGlzLl9jbG9zZVBhdGgoKTtcbiAgICAgIHRoaXMuX2NsZWFyQ2FjaGUoKTtcbiAgICB9XG4gIH07XG5cbiAgX29uQ2xpY2tTZWdtZW50ID0gKGV2dDogTWpvbG5pckV2ZW50LCBhdHRyaWJ1dGVzOiBhbnkpID0+IHtcbiAgICBjb25zdCBmZWF0dXJlID0gdGhpcy5fZ2V0U2VsZWN0ZWRGZWF0dXJlKCk7XG5cbiAgICBpZiAoXG4gICAgICBmZWF0dXJlICYmXG4gICAgICAoZmVhdHVyZS5yZW5kZXJUeXBlID09PSBSRU5ERVJfVFlQRS5QT0xZR09OIHx8XG4gICAgICAgIGZlYXR1cmUucmVuZGVyVHlwZSA9PT0gUkVOREVSX1RZUEUuTElORV9TVFJJTkcpICYmXG4gICAgICBhdHRyaWJ1dGVzXG4gICAgKSB7XG4gICAgICBjb25zdCB7IHZlcnRleEluZGV4IH0gPSBhdHRyaWJ1dGVzO1xuXG4gICAgICBjb25zdCB7IHVuY29tbWl0dGVkTG5nTGF0IH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgICBsZXQgbG5nTGF0ID0gdW5jb21taXR0ZWRMbmdMYXQ7XG4gICAgICBpZiAoIWxuZ0xhdCAmJiB0eXBlb2YgdmVydGV4SW5kZXggPT09ICdudW1iZXInKSB7XG4gICAgICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5fZ2V0RXZlbnRQb3NpdGlvbihldnQpO1xuICAgICAgICBsbmdMYXQgPSB0aGlzLl91bnByb2plY3QoW3gsIHldKTtcbiAgICAgICAgbG5nTGF0ID0gdGhpcy5fZ2V0Q2xvc2VzdFBvc2l0aW9uT25TZWdtZW50KHZlcnRleEluZGV4LCBsbmdMYXQsIGZlYXR1cmUpO1xuICAgICAgfVxuXG4gICAgICBpZiAobG5nTGF0KSB7XG4gICAgICAgIGNvbnN0IGluc2VydFBvc2l0aW9uID0gKHZlcnRleEluZGV4ICsgMSkgJSBmZWF0dXJlLnBvaW50cy5sZW5ndGg7XG4gICAgICAgIGZlYXR1cmUuaW5zZXJ0UG9pbnQobG5nTGF0LCBpbnNlcnRQb3NpdGlvbik7XG4gICAgICAgIHRoaXMuX3VwZGF0ZSh0aGlzLnN0YXRlLmZlYXR1cmVzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHVuY29tbWl0dGVkTG5nTGF0OiBudWxsLFxuICAgICAgICBob3ZlcmVkTG5nTGF0OiBudWxsXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgX29uQ2xpY2sgPSAoZXZ0OiBNam9sbmlyRXZlbnQpID0+IHtcbiAgICBjb25zdCB7IG1vZGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHBhcnNlRWxlbURhdGFBdHRyaWJ1dGVzKGV2dC50YXJnZXQpO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXMgJiYgYXR0cmlidXRlcy50eXBlID09PSBFTEVNRU5UX1RZUEUuVkVSVEVYKSB7XG4gICAgICB0aGlzLl9vbkNsaWNrVmVydGV4KGV2dCwgYXR0cmlidXRlcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG1vZGUgPT09IE1PREVTLkVESVRfVkVSVEVYICYmIGF0dHJpYnV0ZXMgJiYgYXR0cmlidXRlcy50eXBlID09PSBFTEVNRU5UX1RZUEUuU0VHTUVOVCkge1xuICAgICAgdGhpcy5fb25DbGlja1NlZ21lbnQoZXZ0LCBhdHRyaWJ1dGVzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAobW9kZSA9PT0gTU9ERVMuU0VMRUNUX0ZFQVRVUkUgfHwgbW9kZSA9PT0gTU9ERVMuRURJVF9WRVJURVgpICYmXG4gICAgICBhdHRyaWJ1dGVzICYmXG4gICAgICBhdHRyaWJ1dGVzLnR5cGUgPT09IEVMRU1FTlRfVFlQRS5GRUFUVVJFXG4gICAgKSB7XG4gICAgICB0aGlzLl9vbkNsaWNrRmVhdHVyZShldnQsIGF0dHJpYnV0ZXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNlbGVjdGVkRmVhdHVyZSA9IHRoaXMuX2dldFNlbGVjdGVkRmVhdHVyZSgpO1xuICAgIGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5fZ2V0RXZlbnRQb3NpdGlvbihldnQpO1xuICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgY2FzZSBNT0RFUy5FRElUX1ZFUlRFWDpcbiAgICAgICAgaWYgKHNlbGVjdGVkRmVhdHVyZSkge1xuICAgICAgICAgIHRoaXMucHJvcHMub25TZWxlY3Qoe1xuICAgICAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSWQ6IG51bGwsXG4gICAgICAgICAgICBzb3VyY2VFdmVudDogZXZ0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgTU9ERVMuRFJBV19QT0lOVDpcbiAgICAgIGNhc2UgTU9ERVMuRFJBV181TUlMRV9DSVJDTEU6XG4gICAgICBjYXNlIE1PREVTLkRSQVdfM01JTEVfQ0lSQ0xFOlxuICAgICAgY2FzZSBNT0RFUy5EUkFXXzFNSUxFX0NJUkNMRTpcbiAgICAgICAgdGhpcy5fYWRkRmVhdHVyZShtb2RlLCB7IHgsIHkgfSk7XG4gICAgICAgIHRoaXMuX2NsZWFyQ2FjaGUoKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgTU9ERVMuRFJBV19QQVRIOlxuICAgICAgY2FzZSBNT0RFUy5EUkFXX1BPTFlHT046XG4gICAgICAgIGlmIChzZWxlY3RlZEZlYXR1cmUgJiYgc2VsZWN0ZWRGZWF0dXJlLmlzQ2xvc2VkKSB7XG4gICAgICAgICAgLy8gY2xpY2tlZCBvdXRzaWRlXG4gICAgICAgICAgdGhpcy5fY2xlYXJDYWNoZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKHNlbGVjdGVkRmVhdHVyZSkge1xuICAgICAgICAgIHRoaXMuX2FkZFBvaW50KHgsIHksIHNlbGVjdGVkRmVhdHVyZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fYWRkRmVhdHVyZShtb2RlLCB7IHgsIHkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgTU9ERVMuRFJBV19SRUNUQU5HTEU6XG4gICAgICAgIGlmIChzZWxlY3RlZEZlYXR1cmUgJiYgc2VsZWN0ZWRGZWF0dXJlLmlzQ2xvc2VkKSB7XG4gICAgICAgICAgLy8gY2xpY2tlZCBvdXRzaWRlXG4gICAgICAgICAgdGhpcy5fY2xlYXJDYWNoZSgpO1xuICAgICAgICAgIHRoaXMucHJvcHMub25TZWxlY3Qoe1xuICAgICAgICAgICAgc2VsZWN0ZWRGZWF0dXJlSWQ6IG51bGwsXG4gICAgICAgICAgICBzb3VyY2VFdmVudDogZXZ0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fYWRkRmVhdHVyZShtb2RlLCB7IHgsIHkgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH07XG5cbiAgLy8gZG9uJ3QgZm9yd2FyZCBwYW4gZXZlbnRzIHRvIHRoZSB1bmRlcmx5aW5nIG1hcCB3aGVuOlxuICAvLyAtIHRoZSBwYW4gdGFyZ2V0IGlzIGEgdmVydGV4L2xpbmUvdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBmZWF0dXJlXG4gIC8vIC0gdGhlIHVzZXIgaXMgZHJhZ2dpbmcgc29tZXRoaW5nIGFyb3VuZFxuICAvLyAtIHRoZXJlIGlzIGN1cnJlbnRseSBhbiB1bmNvbW1pdHRlZCBwb3NpdGlvblxuICAvLyAoaS5lLiB0aGUgdXNlciBpcyBjcmVhdGluZyBhIGZlYXR1cmUvdmVydGV4L2xpbmUpXG4gIF9vblBhbiA9IChldnQ6IE1qb2xuaXJFdmVudCkgPT4ge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBwYXJzZUVsZW1EYXRhQXR0cmlidXRlcyhldnQudGFyZ2V0KTtcbiAgICBjb25zdCB0eXBlID0gYXR0cmlidXRlcyAmJiBhdHRyaWJ1dGVzLnR5cGU7XG4gICAgaWYgKFxuICAgICAgdHlwZSA9PT0gRUxFTUVOVF9UWVBFLlZFUlRFWCB8fFxuICAgICAgdHlwZSA9PT0gRUxFTUVOVF9UWVBFLlNFR01FTlQgfHxcbiAgICAgIHRoaXMuc3RhdGUuaXNEcmFnZ2luZyB8fFxuICAgICAgdGhpcy5zdGF0ZS51bmNvbW1pdHRlZExuZ0xhdCAhPT0gbnVsbFxuICAgICkge1xuICAgICAgZXZ0LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgfTtcblxuICAvKiBIRUxQRVJTICovXG4gIC8vIGxuZ0xhdCB0byBwaXhlbHNcbiAgX3Byb2plY3QgPSAocHQ6IFBvc2l0aW9uKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRleHQgJiYgdGhpcy5fY29udGV4dC52aWV3cG9ydCAmJiB0aGlzLl9jb250ZXh0LnZpZXdwb3J0LnByb2plY3QocHQpO1xuICB9O1xuXG4gIC8vIHBpeGVscyB0byBsbmdMYXRcbiAgX3VucHJvamVjdCA9IChwdDogUG9zaXRpb24pID0+IHtcbiAgICByZXR1cm4gdGhpcy5fY29udGV4dCAmJiB0aGlzLl9jb250ZXh0LnZpZXdwb3J0ICYmIHRoaXMuX2NvbnRleHQudmlld3BvcnQudW5wcm9qZWN0KHB0KTtcbiAgfTtcblxuICBfbWF0Y2hlc0ZlYXR1cmUgPSAoYXR0cmlidXRlczogYW55LCBmZWF0dXJlOiA/RmVhdHVyZSkgPT4ge1xuICAgIGlmICghYXR0cmlidXRlcyB8fCBhdHRyaWJ1dGVzLnR5cGUgIT09IEVMRU1FTlRfVFlQRS5GRUFUVVJFIHx8ICFmZWF0dXJlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgeyBmZWF0dXJlSW5kZXggfSA9IGF0dHJpYnV0ZXM7XG4gICAgY29uc3QgeyBmZWF0dXJlcyB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBlbGVtRmVhdHVyZSA9IGZlYXR1cmVzICYmIGZlYXR1cmVzW2ZlYXR1cmVJbmRleF07XG4gICAgcmV0dXJuIGVsZW1GZWF0dXJlICYmIGZlYXR1cmUuaWQgPT09IGVsZW1GZWF0dXJlLmlkO1xuICB9O1xuXG4gIF9nZXRDbG9zZXN0UG9zaXRpb25PblNlZ21lbnQgPSAodmVydGV4SW5kZXg6IG51bWJlciwgcG9pbnRMbmdMYXQ6IFBvc2l0aW9uLCBmZWF0dXJlOiBGZWF0dXJlKSA9PiB7XG4gICAgY29uc3QgcG9pbnRzID0gZmVhdHVyZSAmJiBmZWF0dXJlLnBvaW50cztcbiAgICBpZiAoIXBvaW50cyB8fCAhcG9pbnRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gc2VnbWVudElkIGlzIHN0YXJ0IHZlcnRleEluZGV4XG4gICAgY29uc3Qgc3RhcnRQb3MgPSBwb2ludHNbdmVydGV4SW5kZXhdO1xuICAgIGNvbnN0IGVuZFBvcyA9IHBvaW50c1sodmVydGV4SW5kZXggKyAxKSAlIHBvaW50cy5sZW5ndGhdO1xuICAgIHJldHVybiBmaW5kQ2xvc2VzdFBvaW50T25MaW5lU2VnbWVudChzdGFydFBvcywgZW5kUG9zLCBwb2ludExuZ0xhdCk7XG4gIH07XG5cbiAgX2dldEV2ZW50UG9zaXRpb24gPSAoZXZ0OiBNam9sbmlyRXZlbnQpOiB7IHg6IG51bWJlciwgeTogbnVtYmVyIH0gPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIG9mZnNldENlbnRlcjogeyB4LCB5IH1cbiAgICB9ID0gZXZ0O1xuICAgIHJldHVybiB7IHg6IE51bWJlcih4KSwgeTogTnVtYmVyKHkpIH07XG4gIH07XG5cbiAgX2dldFByb2plY3RlZERhdGEocG9pbnRzOiBhbnksIHJlbmRlclR5cGU6ID9SZW5kZXJUeXBlIHwgc3RyaW5nLCBpc0Nsb3NlZDogP2Jvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmIChwb2ludHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvamVjdGVkID0gcG9pbnRzLm1hcChwID0+IHRoaXMuX3Byb2plY3QocCkpO1xuICAgIHN3aXRjaCAocmVuZGVyVHlwZSkge1xuICAgICAgY2FzZSBSRU5ERVJfVFlQRS5QT0lOVDpcbiAgICAgICAgcmV0dXJuIHByb2plY3RlZDtcbiAgICAgIGNhc2UgUkVOREVSX1RZUEUuTElORV9TVFJJTkc6XG4gICAgICBjYXNlIFJFTkRFUl9UWVBFLlBPTFlHT046XG4gICAgICBjYXNlIFJFTkRFUl9UWVBFLlJFQ1RBTkdMRTpcbiAgICAgICAgY29uc3QgcGF0aFN0cmluZyA9IHByb2plY3RlZFxuICAgICAgICAgIC5tYXAocCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYCR7cFswXX0sJHtwWzFdfWA7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuam9pbignTCcpO1xuICAgICAgICByZXR1cm4gYE0gJHtwYXRoU3RyaW5nfSAke2lzQ2xvc2VkID8gJ3onIDogJyd9YDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRTZWxlY3RlZEZlYXR1cmUgPSAoKTogP0ZlYXR1cmUgPT4ge1xuICAgIGNvbnN0IHsgZmVhdHVyZXMsIHNlbGVjdGVkRmVhdHVyZUlkIH0gPSB0aGlzLnN0YXRlO1xuICAgIHJldHVybiBmZWF0dXJlcyAmJiBmZWF0dXJlcy5maW5kKGYgPT4gZi5pZCA9PT0gc2VsZWN0ZWRGZWF0dXJlSWQpO1xuICB9O1xuXG4gIF9nZXRFZGl0SGFuZGxlU3RhdGUgPSAoaW5kZXg6IG51bWJlciwgcmVuZGVyU3RhdGU6ID9zdHJpbmcpID0+IHtcbiAgICBjb25zdCB7IG1vZGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBkcmFnZ2luZ1ZlcnRleEluZGV4LCBob3ZlcmVkVmVydGV4SW5kZXggfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qgc2VsZWN0ZWRGZWF0dXJlID0gdGhpcy5fZ2V0U2VsZWN0ZWRGZWF0dXJlKCk7XG4gICAgY29uc3QgaXNTZWxlY3RlZCA9XG4gICAgICBpbmRleCA9PT0gZHJhZ2dpbmdWZXJ0ZXhJbmRleCB8fFxuICAgICAgKHNlbGVjdGVkRmVhdHVyZSAmJiBzZWxlY3RlZEZlYXR1cmUucmVuZGVyVHlwZSA9PT0gUkVOREVSX1RZUEUuUE9JTlQpO1xuICAgIGNvbnN0IGlzQ2xvc2luZyA9IG1vZGUgPT09IE1PREVTLkRSQVdfUE9MWUdPTiAmJiBob3ZlcmVkVmVydGV4SW5kZXggPT09IDAgJiYgaW5kZXggPT09IC0xO1xuXG4gICAgaWYgKHJlbmRlclN0YXRlKSB7XG4gICAgICByZXR1cm4gcmVuZGVyU3RhdGU7XG4gICAgfVxuXG4gICAgaWYgKGlzQ2xvc2luZykge1xuICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5DTE9TSU5HO1xuICAgIH1cblxuICAgIGlmIChpc1NlbGVjdGVkKSB7XG4gICAgICByZXR1cm4gUkVOREVSX1NUQVRFLlNFTEVDVEVEO1xuICAgIH1cblxuICAgIHN3aXRjaCAoaW5kZXgpIHtcbiAgICAgIGNhc2UgaG92ZXJlZFZlcnRleEluZGV4OlxuICAgICAgICByZXR1cm4gUkVOREVSX1NUQVRFLkhPVkVSRUQ7XG4gICAgICBjYXNlIFVOQ09NTUlUVEVEX0lEOlxuICAgICAgICByZXR1cm4gUkVOREVSX1NUQVRFLlVOQ09NTUlUVEVEO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5JTkFDVElWRTtcbiAgICB9XG4gIH07XG5cbiAgX2dldEZlYXR1cmVSZW5kZXJTdGF0ZSA9IChpZDogSWQsIHJlbmRlclN0YXRlOiA/c3RyaW5nKSA9PiB7XG4gICAgY29uc3QgeyBzZWxlY3RlZEZlYXR1cmVJZCwgaG92ZXJlZEZlYXR1cmVJZCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAocmVuZGVyU3RhdGUpIHtcbiAgICAgIHJldHVybiByZW5kZXJTdGF0ZTtcbiAgICB9XG4gICAgc3dpdGNoIChpZCkge1xuICAgICAgY2FzZSBzZWxlY3RlZEZlYXR1cmVJZDpcbiAgICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5TRUxFQ1RFRDtcbiAgICAgIGNhc2UgaG92ZXJlZEZlYXR1cmVJZDpcbiAgICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5IT1ZFUkVEO1xuICAgICAgY2FzZSBVTkNPTU1JVFRFRF9JRDpcbiAgICAgICAgcmV0dXJuIFJFTkRFUl9TVEFURS5VTkNPTU1JVFRFRDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBSRU5ERVJfU1RBVEUuSU5BQ1RJVkU7XG4gICAgfVxuICB9O1xuXG4gIC8qIFJFTkRFUiAqL1xuICAvKiBlc2xpbnQtZGlzYWJsZSBtYXgtcGFyYW1zICovXG4gIF9yZW5kZXJWZXJ0ZXggPSAoXG4gICAgcG9zaXRpb246IFBvc2l0aW9uLFxuICAgIGZlYXR1cmVJbmRleDogbnVtYmVyLFxuICAgIHZlcnRleEluZGV4OiBJZCxcbiAgICBvcGVyYXRpb246IE9wZXJhdGlvbixcbiAgICBzdHlsZTogYW55LFxuICAgIHNoYXBlOiBzdHJpbmdcbiAgKSA9PiB7XG4gICAgLyogZXNsaW50LWVuYWJsZSBtYXgtcGFyYW1zICovXG4gICAgY29uc3QgcCA9IHRoaXMuX3Byb2plY3QocG9zaXRpb24pO1xuICAgIGlmICghcCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgeyBjbGlja1JhZGl1cyB9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGVsZW1LZXkgPSBgJHtFTEVNRU5UX1RZUEUuVkVSVEVYfS4ke2ZlYXR1cmVJbmRleH0uJHt2ZXJ0ZXhJbmRleH0uJHtvcGVyYXRpb259YDtcbiAgICAvLyBmaXJzdCA8Y2lyY2xlfHJlY3Q+IGlzIHRvIG1ha2UgcGF0aCBlYXNpbHkgaW50ZXJhY3RlZCB3aXRoXG4gICAgc3dpdGNoIChzaGFwZSkge1xuICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZyBrZXk9e2VsZW1LZXl9IHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke3BbMF19LCAke3BbMV19KWB9PlxuICAgICAgICAgICAgPGNpcmNsZVxuICAgICAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5WRVJURVh9XG4gICAgICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17ZmVhdHVyZUluZGV4fVxuICAgICAgICAgICAgICBkYXRhLXZlcnRleC1pbmRleD17dmVydGV4SW5kZXh9XG4gICAgICAgICAgICAgIGRhdGEtb3BlcmF0aW9uPXtvcGVyYXRpb259XG4gICAgICAgICAgICAgIGtleT17YCR7ZWxlbUtleX0uaGlkZGVuYH1cbiAgICAgICAgICAgICAgc3R5bGU9e3sgLi4uc3R5bGUsIC4uLkhJRERFTl9DTElDS0FCTEVfU1RZTEUsIHN0cm9rZTogJ25vbmUnIH19XG4gICAgICAgICAgICAgIGN4PXswfVxuICAgICAgICAgICAgICBjeT17MH1cbiAgICAgICAgICAgICAgcj17Y2xpY2tSYWRpdXN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGNpcmNsZVxuICAgICAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5WRVJURVh9XG4gICAgICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17ZmVhdHVyZUluZGV4fVxuICAgICAgICAgICAgICBkYXRhLXZlcnRleC1pbmRleD17dmVydGV4SW5kZXh9XG4gICAgICAgICAgICAgIGRhdGEtb3BlcmF0aW9uPXtvcGVyYXRpb259XG4gICAgICAgICAgICAgIGtleT17ZWxlbUtleX1cbiAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgICAgICBjeD17MH1cbiAgICAgICAgICAgICAgY3k9ezB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ3JlY3QnOlxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxnIGtleT17YHZlcnRleC4ke3ZlcnRleEluZGV4fWB9IHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke3BbMF19LCAke3BbMV19KWB9PlxuICAgICAgICAgICAgPHJlY3RcbiAgICAgICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuVkVSVEVYfVxuICAgICAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgICAgICAgZGF0YS12ZXJ0ZXgtaW5kZXg9e3ZlcnRleEluZGV4fVxuICAgICAgICAgICAgICBkYXRhLW9wZXJhdGlvbj17b3BlcmF0aW9ufVxuICAgICAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgICAgICAgICAgLi4uSElEREVOX0NMSUNLQUJMRV9TVFlMRSxcbiAgICAgICAgICAgICAgICB3aWR0aDogY2xpY2tSYWRpdXMsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBjbGlja1JhZGl1c1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLlZFUlRFWH1cbiAgICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtmZWF0dXJlSW5kZXh9XG4gICAgICAgICAgICAgIGRhdGEtdmVydGV4LWluZGV4PXt2ZXJ0ZXhJbmRleH1cbiAgICAgICAgICAgICAgZGF0YS1vcGVyYXRpb249e29wZXJhdGlvbn1cbiAgICAgICAgICAgICAga2V5PXtlbGVtS2V5fVxuICAgICAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZz5cbiAgICAgICAgKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIF9yZW5kZXJTZWdtZW50ID0gKFxuICAgIGZlYXR1cmVJbmRleDogbnVtYmVyLFxuICAgIHN0YXJ0VmVydGV4SWQ6IElkLFxuICAgIHN0YXJ0UG9zOiBQb3NpdGlvbixcbiAgICBlbmRQb3M6IFBvc2l0aW9uLFxuICAgIHN0eWxlOiBhbnkgPSB7fVxuICApID0+IHtcbiAgICBjb25zdCB7IGNsaWNrUmFkaXVzIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHByb2plY3RlZCA9IHRoaXMuX2dldFByb2plY3RlZERhdGEoW3N0YXJ0UG9zLCBlbmRQb3NdLCBSRU5ERVJfVFlQRS5MSU5FX1NUUklORyk7XG4gICAgY29uc3QgeyByYWRpdXMsIC4uLm90aGVycyB9ID0gc3R5bGU7XG5cbiAgICBjb25zdCBlbGVtS2V5ID0gYCR7RUxFTUVOVF9UWVBFLlNFR01FTlR9LiR7ZmVhdHVyZUluZGV4fS4ke3N0YXJ0VmVydGV4SWR9YDtcbiAgICByZXR1cm4gKFxuICAgICAgPGcga2V5PXtlbGVtS2V5fT5cbiAgICAgICAgPHBhdGhcbiAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5TRUdNRU5UfVxuICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17ZmVhdHVyZUluZGV4fVxuICAgICAgICAgIGRhdGEtdmVydGV4LWluZGV4PXtzdGFydFZlcnRleElkfVxuICAgICAgICAgIGtleT17YCR7ZWxlbUtleX0uaGlkZGVuYH1cbiAgICAgICAgICBzdHlsZT17eyAuLi5vdGhlcnMsIHN0cm9rZVdpZHRoOiBjbGlja1JhZGl1cyB8fCByYWRpdXMsIG9wYWNpdHk6IDAgfX1cbiAgICAgICAgICBkPXtwcm9qZWN0ZWR9XG4gICAgICAgIC8+XG4gICAgICAgIDxwYXRoXG4gICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuU0VHTUVOVH1cbiAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2ZlYXR1cmVJbmRleH1cbiAgICAgICAgICBkYXRhLXZlcnRleC1pbmRleD17c3RhcnRWZXJ0ZXhJZH1cbiAgICAgICAgICBrZXk9e2VsZW1LZXl9XG4gICAgICAgICAgc3R5bGU9e290aGVyc31cbiAgICAgICAgICBkPXtwcm9qZWN0ZWR9XG4gICAgICAgIC8+XG4gICAgICA8L2c+XG4gICAgKTtcbiAgfTtcblxuICBfcmVuZGVyQ29tbWl0dGVkU3Ryb2tlID0gKGZlYXR1cmVJbmRleDogbnVtYmVyLCBmZWF0dXJlOiBGZWF0dXJlLCBzdHlsZTogYW55KSA9PiB7XG4gICAgY29uc3QgeyBwb2ludHMsIGlzQ2xvc2VkLCByZW5kZXJUeXBlIH0gPSBmZWF0dXJlO1xuICAgIGlmICghcG9pbnRzIHx8IHBvaW50cy5sZW5ndGggPCAyIHx8IChyZW5kZXJUeXBlID09PSBSRU5ERVJfVFlQRS5SRUNUQU5HTEUgJiYgIWlzQ2xvc2VkKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VnbWVudHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIHNlZ21lbnRzLnB1c2godGhpcy5fcmVuZGVyU2VnbWVudChmZWF0dXJlSW5kZXgsIGksIHBvaW50c1tpXSwgcG9pbnRzW2kgKyAxXSwgc3R5bGUpKTtcbiAgICB9XG5cbiAgICBpZiAoaXNDbG9zZWQpIHtcbiAgICAgIGNvbnN0IGxhc3RJbmRleCA9IHBvaW50cy5sZW5ndGggLSAxO1xuICAgICAgc2VnbWVudHMucHVzaChcbiAgICAgICAgdGhpcy5fcmVuZGVyU2VnbWVudChmZWF0dXJlSW5kZXgsIGxhc3RJbmRleCwgcG9pbnRzW2xhc3RJbmRleF0sIHBvaW50c1swXSwgc3R5bGUpXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiA8ZyBrZXk9XCJjb21taXR0ZWQgZ3JvdXBcIj57c2VnbWVudHN9PC9nPjtcbiAgfTtcblxuICBfcmVuZGVyVW5jb21taXR0ZWRTdHJva2VzID0gKGZlYXR1cmVJbmRleDogbnVtYmVyLCBmZWF0dXJlOiBGZWF0dXJlLCBzdHlsZTogYW55KSA9PiB7XG4gICAgY29uc3QgeyBwb2ludHMsIGlzQ2xvc2VkLCByZW5kZXJUeXBlIH0gPSBmZWF0dXJlO1xuICAgIGNvbnN0IHsgbW9kZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IHVuY29tbWl0dGVkTG5nTGF0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGlzRHJhd2luZyA9IERSQVdJTkdfTU9ERVMuZmluZChtID0+IG0gPT09IG1vZGUpO1xuXG4gICAgaWYgKCFwb2ludHMgfHwgaXNDbG9zZWQgfHwgIWlzRHJhd2luZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgdW5jb21taXR0ZWRTZWdtZW50cyA9IFtdO1xuXG4gICAgaWYgKHJlbmRlclR5cGUgPT09IFJFTkRFUl9UWVBFLlJFQ1RBTkdMRSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgIHVuY29tbWl0dGVkU2VnbWVudHMucHVzaChcbiAgICAgICAgICB0aGlzLl9yZW5kZXJTZWdtZW50KGZlYXR1cmVJbmRleCwgaSwgcG9pbnRzW2ldLCBwb2ludHNbaSArIDFdLCBzdHlsZSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGlmIChwb2ludHMubGVuZ3RoID09PSA0KSB7XG4gICAgICAgIHVuY29tbWl0dGVkU2VnbWVudHMucHVzaCh0aGlzLl9yZW5kZXJTZWdtZW50KGZlYXR1cmVJbmRleCwgMywgcG9pbnRzWzNdLCBwb2ludHNbMF0sIHN0eWxlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF1bmNvbW1pdHRlZExuZ0xhdCkge1xuICAgICAgcmV0dXJuIHVuY29tbWl0dGVkU2VnbWVudHMubGVuZ3RoID8gdW5jb21taXR0ZWRTZWdtZW50cyA6IG51bGw7XG4gICAgfVxuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8taW5saW5lLWNvbW1lbnRzICovXG4gICAgdW5jb21taXR0ZWRTZWdtZW50cy5wdXNoKFxuICAgICAgdGhpcy5fcmVuZGVyU2VnbWVudChcbiAgICAgICAgZmVhdHVyZUluZGV4LFxuICAgICAgICBwb2ludHMubGVuZ3RoIC0gMSwgLy8gaWRcbiAgICAgICAgcG9pbnRzLnNsaWNlKC0xKVswXSwgLy8gc3RhcnRQb3NcbiAgICAgICAgdW5jb21taXR0ZWRMbmdMYXQsIC8vIGVuZFBvc1xuICAgICAgICBzdHlsZVxuICAgICAgKVxuICAgICk7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1pbmxpbmUtY29tbWVudHMgKi9cblxuICAgIHJldHVybiB1bmNvbW1pdHRlZFNlZ21lbnRzLmZpbHRlcihCb29sZWFuKTtcbiAgfTtcblxuICBfcmVuZGVyQ2xvc2luZ1N0cm9rZSA9IChmZWF0dXJlSW5kZXg6IG51bWJlciwgZmVhdHVyZTogRmVhdHVyZSwgc3R5bGU6IGFueSkgPT4ge1xuICAgIGNvbnN0IHsgcG9pbnRzLCBpc0Nsb3NlZCB9ID0gZmVhdHVyZTtcbiAgICBjb25zdCB7IG1vZGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyB1bmNvbW1pdHRlZExuZ0xhdCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAodW5jb21taXR0ZWRMbmdMYXQgJiYgbW9kZSA9PT0gTU9ERVMuRFJBV19QT0xZR09OICYmIHBvaW50cy5sZW5ndGggPiAyICYmICFpc0Nsb3NlZCkge1xuICAgICAgLy8gZnJvbSB1bmNvbW1pdHRlZCBwb3NpdGlvbiB0byB0aGUgZmlyc3QgcG9pbnQgb2YgdGhlIHBvbHlnb25cbiAgICAgIHJldHVybiB0aGlzLl9yZW5kZXJTZWdtZW50KFxuICAgICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICAgICd1bmNvbW1pdHRlZC1jbG9zZScsXG4gICAgICAgIHVuY29tbWl0dGVkTG5nTGF0LFxuICAgICAgICBwb2ludHNbMF0sXG4gICAgICAgIHN0eWxlXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBfcmVuZGVyRmlsbCA9IChpbmRleDogbnVtYmVyLCBmZWF0dXJlOiBGZWF0dXJlLCBzdHlsZTogYW55KSA9PiB7XG4gICAgY29uc3QgeyBtb2RlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IGlzRHJhd2luZyA9IERSQVdJTkdfTU9ERVMuZmluZChtID0+IG0gPT09IG1vZGUpO1xuICAgIGNvbnN0IHsgcG9pbnRzLCByZW5kZXJUeXBlLCBpc0Nsb3NlZCB9ID0gZmVhdHVyZTtcbiAgICBpZiAocmVuZGVyVHlwZSAhPT0gUkVOREVSX1RZUEUuUE9MWUdPTiAmJiByZW5kZXJUeXBlICE9PSBSRU5ERVJfVFlQRS5SRUNUQU5HTEUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdW5jb21taXR0ZWRMbmdMYXQgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBsZXQgZmlsbFBvaW50cyA9IHBvaW50cztcbiAgICBpZiAodW5jb21taXR0ZWRMbmdMYXQgJiYgaXNEcmF3aW5nKSB7XG4gICAgICBmaWxsUG9pbnRzID0gWy4uLnBvaW50cywgdW5jb21taXR0ZWRMbmdMYXRdO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGxQYXRoID0gdGhpcy5fZ2V0UHJvamVjdGVkRGF0YShmaWxsUG9pbnRzLCByZW5kZXJUeXBlLCBpc0Nsb3NlZCk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxwYXRoXG4gICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17aW5kZXh9XG4gICAgICAgIGtleT17YCR7RUxFTUVOVF9UWVBFLkZFQVRVUkV9LiR7aW5kZXh9LmZpbGxgfVxuICAgICAgICBzdHlsZT17eyAuLi5zdHlsZSwgc3Ryb2tlOiAnbm9uZScgfX1cbiAgICAgICAgZD17ZmlsbFBhdGh9XG4gICAgICAvPlxuICAgICk7XG4gIH07XG5cbiAgX3JlbmRlckN1cnJlbnRQYXRoID0gKGZlYXR1cmU6IEZlYXR1cmUsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCB7IHBvaW50cywgcmVuZGVyVHlwZSB9ID0gZmVhdHVyZTtcbiAgICBpZiAoIXBvaW50cyB8fCAhcG9pbnRzLmxlbmd0aCB8fCByZW5kZXJUeXBlID09PSBSRU5ERVJfVFlQRS5QT0lOVCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgeyBnZXRGZWF0dXJlU3R5bGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZ2VvSnNvbiA9IGZlYXR1cmUudG9GZWF0dXJlKCk7XG4gICAgY29uc3QgY29tbWl0dGVkU3R5bGUgPSBnZXRGZWF0dXJlU3R5bGUoeyBmZWF0dXJlOiBnZW9Kc29uLCBzdGF0ZTogUkVOREVSX1NUQVRFLlNFTEVDVEVEIH0pO1xuICAgIGNvbnN0IHVuY29tbWl0dGVkU3R5bGUgPSBnZXRGZWF0dXJlU3R5bGUoeyBmZWF0dXJlOiBnZW9Kc29uLCBzdGF0ZTogUkVOREVSX1NUQVRFLlVOQ09NTUlUVEVEIH0pO1xuICAgIGNvbnN0IGNsb3NpbmdTdHlsZSA9IGdldEZlYXR1cmVTdHlsZSh7IGZlYXR1cmU6IGdlb0pzb24sIHN0YXRlOiBSRU5ERVJfU1RBVEUuQ0xPU0lORyB9KTtcblxuICAgIGNvbnN0IGNvbW1pdHRlZFN0cm9rZSA9IHRoaXMuX3JlbmRlckNvbW1pdHRlZFN0cm9rZShpbmRleCwgZmVhdHVyZSwgY29tbWl0dGVkU3R5bGUpO1xuICAgIGNvbnN0IHVuY29tbWl0dGVkU3Ryb2tlcyA9XG4gICAgICB0aGlzLl9yZW5kZXJVbmNvbW1pdHRlZFN0cm9rZXMoaW5kZXgsIGZlYXR1cmUsIHVuY29tbWl0dGVkU3R5bGUpIHx8IFtdO1xuICAgIGNvbnN0IGNsb3NpbmdTdHJva2UgPSB0aGlzLl9yZW5kZXJDbG9zaW5nU3Ryb2tlKGluZGV4LCBmZWF0dXJlLCBjbG9zaW5nU3R5bGUpO1xuICAgIGNvbnN0IGZpbGwgPSB0aGlzLl9yZW5kZXJGaWxsKGluZGV4LCBmZWF0dXJlLCB1bmNvbW1pdHRlZFN0eWxlKTtcblxuICAgIHJldHVybiBbZmlsbCwgY29tbWl0dGVkU3Ryb2tlLCAuLi51bmNvbW1pdHRlZFN0cm9rZXMsIGNsb3NpbmdTdHJva2VdLmZpbHRlcihCb29sZWFuKTtcbiAgfTtcblxuICBfcmVuZGVyQ29tbWl0dGVkVmVydGljZXMgPSAoZmVhdHVyZUluZGV4OiBudW1iZXIsIGZlYXR1cmU6IEZlYXR1cmUsIGdlb0pzb246IEdlb0pzb24pID0+IHtcbiAgICBjb25zdCB7IG1vZGUsIGdldEVkaXRIYW5kbGVTdHlsZSwgZ2V0RWRpdEhhbmRsZVNoYXBlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgaXNDbG9zZWQsIHBvaW50cyB9ID0gZmVhdHVyZTtcblxuICAgIGNvbnN0IGNvbW1pdHRlZFZlcnRpY2VzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHAgPSBwb2ludHNbaV07XG4gICAgICBsZXQgb3BlcmF0aW9uID0gT1BFUkFUSU9OUy5TRVQ7XG5cbiAgICAgIGNvbnN0IHN0eWxlID0gZ2V0RWRpdEhhbmRsZVN0eWxlKHtcbiAgICAgICAgZmVhdHVyZTogZ2VvSnNvbixcbiAgICAgICAgaW5kZXg6IGksXG4gICAgICAgIHN0YXRlOiB0aGlzLl9nZXRFZGl0SGFuZGxlU3RhdGUoaSlcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc2hhcGUgPVxuICAgICAgICB0eXBlb2YgZ2V0RWRpdEhhbmRsZVNoYXBlID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgPyBnZXRFZGl0SGFuZGxlU2hhcGUoe1xuICAgICAgICAgICAgICBmZWF0dXJlOiBnZW9Kc29uLFxuICAgICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgICAgc3RhdGU6IHRoaXMuX2dldEVkaXRIYW5kbGVTdGF0ZShpKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICA6IGdldEVkaXRIYW5kbGVTaGFwZTtcblxuICAgICAgaWYgKGlzQ2xvc2VkKSB7XG4gICAgICAgIGNvbW1pdHRlZFZlcnRpY2VzLnB1c2godGhpcy5fcmVuZGVyVmVydGV4KHAsIGZlYXR1cmVJbmRleCwgaSwgb3BlcmF0aW9uLCBzdHlsZSwgc2hhcGUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChtb2RlID09PSBNT0RFUy5EUkFXX1BPTFlHT04gJiYgaSA9PT0gMCAmJiBwb2ludHMubGVuZ3RoID4gMikge1xuICAgICAgICAgIG9wZXJhdGlvbiA9IE9QRVJBVElPTlMuSU5URVJTRUNUO1xuICAgICAgICB9XG5cbiAgICAgICAgY29tbWl0dGVkVmVydGljZXMucHVzaCh0aGlzLl9yZW5kZXJWZXJ0ZXgocCwgZmVhdHVyZUluZGV4LCBpLCBvcGVyYXRpb24sIHN0eWxlLCBzaGFwZSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb21taXR0ZWRWZXJ0aWNlcztcbiAgfTtcblxuICBfcmVuZGVyVW5jb21taXR0ZWRWZXJ0ZXggPSAoZmVhdHVyZUluZGV4OiBudW1iZXIsIGZlYXR1cmU6IEZlYXR1cmUsIGdlb0pzb246IEdlb0pzb24pID0+IHtcbiAgICBjb25zdCB7IGdldEVkaXRIYW5kbGVTdHlsZSwgZ2V0RWRpdEhhbmRsZVNoYXBlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgc2VsZWN0ZWRGZWF0dXJlSWQsIHVuY29tbWl0dGVkTG5nTGF0IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHsgaWQgfSA9IGZlYXR1cmU7XG5cbiAgICBsZXQgdW5jb21taXR0ZWRWZXJ0ZXggPSBudWxsO1xuICAgIGlmIChzZWxlY3RlZEZlYXR1cmVJZCA9PT0gaWQgJiYgdW5jb21taXR0ZWRMbmdMYXQpIHtcbiAgICAgIGNvbnN0IHN0eWxlID0gZ2V0RWRpdEhhbmRsZVN0eWxlKHtcbiAgICAgICAgZmVhdHVyZTogZ2VvSnNvbixcbiAgICAgICAgaW5kZXg6ICd1bmNvbW1pdHRlZCcsXG4gICAgICAgIHN0YXRlOiB0aGlzLl9nZXRFZGl0SGFuZGxlU3RhdGUoLTEsIFJFTkRFUl9TVEFURS5VTkNPTU1JVFRFRClcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzaGFwZSA9XG4gICAgICAgIHR5cGVvZiBnZXRFZGl0SGFuZGxlU2hhcGUgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICA/IGdldEVkaXRIYW5kbGVTaGFwZSh7XG4gICAgICAgICAgICAgIGZlYXR1cmU6IGdlb0pzb24sXG4gICAgICAgICAgICAgIGluZGV4OiBudWxsLFxuICAgICAgICAgICAgICBzdGF0ZTogdGhpcy5fZ2V0RWRpdEhhbmRsZVN0YXRlKC0xKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICA6IGdldEVkaXRIYW5kbGVTaGFwZTtcblxuICAgICAgdW5jb21taXR0ZWRWZXJ0ZXggPSB0aGlzLl9yZW5kZXJWZXJ0ZXgoXG4gICAgICAgIHVuY29tbWl0dGVkTG5nTGF0LFxuICAgICAgICBmZWF0dXJlSW5kZXgsXG4gICAgICAgICd1bmNvbW1pdHRlZCcsXG4gICAgICAgIE9QRVJBVElPTlMuSU5TRVJULFxuICAgICAgICB7IC4uLnN0eWxlLCBwb2ludGVyRXZlbnRzOiAnbm9uZScgfSxcbiAgICAgICAgc2hhcGVcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuY29tbWl0dGVkVmVydGV4O1xuICB9O1xuXG4gIF9yZW5kZXJDdXJyZW50VmVydGljZXMgPSAoZmVhdHVyZTogRmVhdHVyZSwgZmVhdHVyZUluZGV4OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCB7IHBvaW50cyB9ID0gZmVhdHVyZTtcblxuICAgIGlmICghcG9pbnRzIHx8ICFwb2ludHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBnZW9Kc29uID0gZmVhdHVyZS50b0ZlYXR1cmUoKTtcbiAgICBjb25zdCBjb21taXR0ZWRWZXJ0aWNlcyA9IHRoaXMuX3JlbmRlckNvbW1pdHRlZFZlcnRpY2VzKGZlYXR1cmVJbmRleCwgZmVhdHVyZSwgZ2VvSnNvbik7XG4gICAgY29uc3QgdW5jb21taXR0ZWRWZXJ0ZXggPSB0aGlzLl9yZW5kZXJVbmNvbW1pdHRlZFZlcnRleChmZWF0dXJlSW5kZXgsIGZlYXR1cmUsIGdlb0pzb24pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxnIGtleT1cImVkaXQtaGFuZGxlc1wiPlxuICAgICAgICB7Y29tbWl0dGVkVmVydGljZXN9XG4gICAgICAgIHt1bmNvbW1pdHRlZFZlcnRleH1cbiAgICAgIDwvZz5cbiAgICApO1xuICB9O1xuXG4gIF9yZW5kZXJDdXJyZW50ID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgZmVhdHVyZXMgfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgZmVhdHVyZSA9IHRoaXMuX2dldFNlbGVjdGVkRmVhdHVyZSgpO1xuXG4gICAgaWYgKCFmZWF0dXJlcyB8fCAhZmVhdHVyZSB8fCAhZmVhdHVyZS5wb2ludHMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHsgbW9kZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBpbmRleCA9IGZlYXR1cmVzLmZpbmRJbmRleChmID0+IGYuaWQgPT09IGZlYXR1cmUuaWQpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxnXG4gICAgICAgIGtleT1cImZlYXR1cmUgY3VycmVudFwiXG4gICAgICAgIHN0eWxlPXttb2RlID09PSBNT0RFUy5SRUFEX09OTFkgfHwgbW9kZSA9PT0gTU9ERVMuU0VMRUNUX0ZFQVRVUkUgPyBTVEFUSUNfU1RZTEUgOiBudWxsfVxuICAgICAgPlxuICAgICAgICB7dGhpcy5fcmVuZGVyQ3VycmVudFBhdGgoZmVhdHVyZSwgaW5kZXgpfVxuICAgICAgICB7dGhpcy5fcmVuZGVyQ3VycmVudFZlcnRpY2VzKGZlYXR1cmUsIGluZGV4KX1cbiAgICAgIDwvZz5cbiAgICApO1xuICB9O1xuXG4gIF9yZW5kZXJGZWF0dXJlID0gKGZlYXR1cmU6IEZlYXR1cmUsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICBpZiAoZmVhdHVyZSA9PT0gdGhpcy5fZ2V0U2VsZWN0ZWRGZWF0dXJlKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHsgY2xpY2tSYWRpdXMgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBpZCwgcG9pbnRzLCByZW5kZXJUeXBlLCBpc0Nsb3NlZCB9ID0gZmVhdHVyZTtcbiAgICBpZiAoIXBvaW50cyB8fCAhcG9pbnRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvamVjdGVkID0gdGhpcy5fZ2V0UHJvamVjdGVkRGF0YShwb2ludHMsIHJlbmRlclR5cGUsIGlzQ2xvc2VkKTtcblxuICAgIGlmICghcHJvamVjdGVkKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBnZW9Kc29uID0gZmVhdHVyZS50b0ZlYXR1cmUoKTtcbiAgICBjb25zdCByZW5kZXJTdGF0ZSA9IHRoaXMuX2dldEZlYXR1cmVSZW5kZXJTdGF0ZShpZCk7XG4gICAgY29uc3QgeyBnZXRGZWF0dXJlU3R5bGUsIGdldEZlYXR1cmVTaGFwZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBzdHlsZSA9IGdldEZlYXR1cmVTdHlsZSh7IGZlYXR1cmU6IGdlb0pzb24sIHN0YXRlOiByZW5kZXJTdGF0ZSB9KTtcbiAgICBjb25zdCBzaGFwZSA9XG4gICAgICB0eXBlb2YgZ2V0RmVhdHVyZVNoYXBlID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gZ2V0RmVhdHVyZVNoYXBlKHsgZmVhdHVyZTogZ2VvSnNvbiwgc3RhdGU6IHJlbmRlclN0YXRlIH0pXG4gICAgICAgIDogZ2V0RmVhdHVyZVNoYXBlO1xuXG4gICAgY29uc3QgZWxlbUtleSA9IGAke0VMRU1FTlRfVFlQRS5GRUFUVVJFfS4ke2luZGV4fWA7XG5cbiAgICBzd2l0Y2ggKHJlbmRlclR5cGUpIHtcbiAgICAgIGNhc2UgUkVOREVSX1RZUEUuUE9JTlQ6XG4gICAgICAgIGlmIChzaGFwZSA9PT0gJ3JlY3QnKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxnIGtleT17ZWxlbUtleX0gdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7cHJvamVjdGVkWzBdWzBdfSwgJHtwcm9qZWN0ZWRbMF1bMV19KWB9PlxuICAgICAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIC4uLnN0eWxlLFxuICAgICAgICAgICAgICAgICAgLi4uSElEREVOX0NMSUNLQUJMRV9TVFlMRSxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiBjbGlja1JhZGl1cyxcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogY2xpY2tSYWRpdXNcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgICAgIGRhdGEtdHlwZT17RUxFTUVOVF9UWVBFLkZFQVRVUkV9XG4gICAgICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAgICBrZXk9e2VsZW1LZXl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxnIGtleT17ZWxlbUtleX0gdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7cHJvamVjdGVkWzBdWzBdfSwgJHtwcm9qZWN0ZWRbMF1bMV19KWB9PlxuICAgICAgICAgICAgPGNpcmNsZVxuICAgICAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GRUFUVVJFfVxuICAgICAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICBrZXk9e2Ake2VsZW1LZXl9LmhpZGRlbmB9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgLi4uc3R5bGUsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBjeD17MH1cbiAgICAgICAgICAgICAgY3k9ezB9XG4gICAgICAgICAgICAgIHI9e2NsaWNrUmFkaXVzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxjaXJjbGVcbiAgICAgICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRkVBVFVSRX1cbiAgICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAga2V5PXtgZmVhdHVyZS4ke2luZGV4fWB9XG4gICAgICAgICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgICAgICAgY3g9ezB9XG4gICAgICAgICAgICAgIGN5PXswfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2c+XG4gICAgICAgICk7XG5cbiAgICAgIC8vIGZpcnN0IDxwYXRoPiBpcyB0byBtYWtlIHBhdGggZWFzaWx5IGludGVyYWN0ZWQgd2l0aFxuICAgICAgY2FzZSBSRU5ERVJfVFlQRS5MSU5FX1NUUklORzpcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZyBrZXk9e2VsZW1LZXl9PlxuICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRkVBVFVSRX1cbiAgICAgICAgICAgICAgZGF0YS1mZWF0dXJlLWluZGV4PXtpbmRleH1cbiAgICAgICAgICAgICAga2V5PXtgJHtlbGVtS2V5fS5oaWRkZW5gfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIC4uLnN0eWxlLFxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiBjbGlja1JhZGl1cyxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGQ9e3Byb2plY3RlZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICBkYXRhLXR5cGU9e0VMRU1FTlRfVFlQRS5GRUFUVVJFfVxuICAgICAgICAgICAgICBkYXRhLWZlYXR1cmUtaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICBrZXk9e2VsZW1LZXl9XG4gICAgICAgICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgICAgICAgZD17cHJvamVjdGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2c+XG4gICAgICAgICk7XG5cbiAgICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgICAgY2FzZSAnUmVjdGFuZ2xlJzpcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgZGF0YS10eXBlPXtFTEVNRU5UX1RZUEUuRkVBVFVSRX1cbiAgICAgICAgICAgIGRhdGEtZmVhdHVyZS1pbmRleD17aW5kZXh9XG4gICAgICAgICAgICBrZXk9e2VsZW1LZXl9XG4gICAgICAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgICAgICBkPXtwcm9qZWN0ZWR9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9O1xuXG4gIF9yZW5kZXJGZWF0dXJlcyA9ICgpID0+IHtcbiAgICBjb25zdCB7IGZlYXR1cmVzIH0gPSB0aGlzLnN0YXRlO1xuICAgIHJldHVybiBmZWF0dXJlcyAmJiBmZWF0dXJlcy5tYXAodGhpcy5fcmVuZGVyRmVhdHVyZSk7XG4gIH07XG5cbiAgX3JlbmRlckNhbnZhcyA9ICgpID0+IHtcbiAgICBjb25zdCB7IHNlbGVjdGVkRmVhdHVyZUlkLCBmZWF0dXJlcyB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIHJldHVybiAoXG4gICAgICA8c3ZnIGtleT1cImRyYXctY2FudmFzXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPlxuICAgICAgICB7ZmVhdHVyZXMgJiYgZmVhdHVyZXMubGVuZ3RoID4gMCAmJiA8ZyBrZXk9XCJmZWF0dXJlLWdyb3VwXCI+e3RoaXMuX3JlbmRlckZlYXR1cmVzKCl9PC9nPn1cbiAgICAgICAge3NlbGVjdGVkRmVhdHVyZUlkICYmIHRoaXMuX3JlbmRlckN1cnJlbnQoKX1cbiAgICAgIDwvc3ZnPlxuICAgICk7XG4gIH07XG5cbiAgX3JlbmRlckVkaXRvciA9ICgpID0+IHtcbiAgICBjb25zdCB2aWV3cG9ydCA9ICh0aGlzLl9jb250ZXh0ICYmIHRoaXMuX2NvbnRleHQudmlld3BvcnQpIHx8IHt9O1xuICAgIGNvbnN0IHsgc3R5bGUgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSB2aWV3cG9ydDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGlkPVwiZWRpdG9yXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aCxcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgLi4uc3R5bGVcbiAgICAgICAgfX1cbiAgICAgICAgcmVmPXtfID0+IHtcbiAgICAgICAgICB0aGlzLl9jb250YWluZXJSZWYgPSBfO1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7dGhpcy5fcmVuZGVyQ2FudmFzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPE1hcENvbnRleHQuQ29uc3VtZXI+XG4gICAgICAgIHtjb250ZXh0ID0+IHtcbiAgICAgICAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICBjb25zdCB2aWV3cG9ydCA9IGNvbnRleHQgJiYgY29udGV4dC52aWV3cG9ydDtcblxuICAgICAgICAgIGlmICghdmlld3BvcnQgfHwgdmlld3BvcnQuaGVpZ2h0IDw9IDAgfHwgdmlld3BvcnQud2lkdGggPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX3JlbmRlckVkaXRvcigpO1xuICAgICAgICB9fVxuICAgICAgPC9NYXBDb250ZXh0LkNvbnN1bWVyPlxuICAgICk7XG4gIH1cbn1cbiJdfQ==