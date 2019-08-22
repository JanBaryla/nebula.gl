"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ELEMENT_TYPE = exports.STATIC_STYLE = exports.OPERATIONS = exports.RENDER_STATE = exports.MODE_TO_RENDER_TYPE = exports.RENDER_TYPE = exports.MODE_TO_GEOJSON_TYPE = exports.GEOJSON_TYPE = exports.DRAWING_MODES = exports.MODES = void 0;

var _MODE_TO_GEOJSON_TYPE, _MODE_TO_RENDER_TYPE;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MODES = {
  READ_ONLY: 'READ_ONLY',
  SELECT_FEATURE: 'SELECT_FEATURE',
  EDIT_VERTEX: 'EDIT_VERTEX',
  DRAW_POINT: 'DRAW_POINT',
  DRAW_PATH: 'DRAW_PATH',
  DRAW_POLYGON: 'DRAW_POLYGON',
  DRAW_RECTANGLE: 'DRAW_RECTANGLE',
  DRAW_1MILE_CIRCLE: 'DRAW_1MILE_CIRCLE',
  DRAW_3MILE_CIRCLE: 'DRAW_3MILE_CIRCLE',
  DRAW_5MILE_CIRCLE: 'DRAW_5MILE_CIRCLE'
};
exports.MODES = MODES;
var DRAWING_MODES = [MODES.DRAW_POINT, MODES.DRAW_PATH, MODES.DRAW_POLYGON, MODES.DRAW_RECTANGLE, MODES.DRAW_1MILE_CIRCLE, MODES.DRAW_3MILE_CIRCLE, MODES.DRAW_5MILE_CIRCLE];
exports.DRAWING_MODES = DRAWING_MODES;
var GEOJSON_TYPE = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  POLYGON: 'Polygon'
};
exports.GEOJSON_TYPE = GEOJSON_TYPE;
var MODE_TO_GEOJSON_TYPE = (_MODE_TO_GEOJSON_TYPE = {}, _defineProperty(_MODE_TO_GEOJSON_TYPE, MODES.DRAW_POINT, GEOJSON_TYPE.POINT), _defineProperty(_MODE_TO_GEOJSON_TYPE, MODES.DRAW_PATH, GEOJSON_TYPE.LINE_STRING), _defineProperty(_MODE_TO_GEOJSON_TYPE, MODES.DRAW_POLYGON, GEOJSON_TYPE.POLYGON), _defineProperty(_MODE_TO_GEOJSON_TYPE, MODES.DRAW_RECTANGLE, GEOJSON_TYPE.POLYGON), _defineProperty(_MODE_TO_GEOJSON_TYPE, MODES.DRAW_1MILE_CIRCLE, GEOJSON_TYPE.POLYGON), _defineProperty(_MODE_TO_GEOJSON_TYPE, MODES.DRAW_3MILE_CIRCLE, GEOJSON_TYPE.POLYGON), _defineProperty(_MODE_TO_GEOJSON_TYPE, MODES.DRAW_5MILE_CIRCLE, GEOJSON_TYPE.POLYGON), _MODE_TO_GEOJSON_TYPE);
exports.MODE_TO_GEOJSON_TYPE = MODE_TO_GEOJSON_TYPE;
var RENDER_TYPE = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  POLYGON: 'Polygon',
  RECTANGLE: 'Rectangle'
};
exports.RENDER_TYPE = RENDER_TYPE;
var MODE_TO_RENDER_TYPE = (_MODE_TO_RENDER_TYPE = {}, _defineProperty(_MODE_TO_RENDER_TYPE, MODES.DRAW_POINT, RENDER_TYPE.POINT), _defineProperty(_MODE_TO_RENDER_TYPE, MODES.DRAW_PATH, RENDER_TYPE.LINE_STRING), _defineProperty(_MODE_TO_RENDER_TYPE, MODES.DRAW_POLYGON, RENDER_TYPE.POLYGON), _defineProperty(_MODE_TO_RENDER_TYPE, MODES.DRAW_RECTANGLE, RENDER_TYPE.RECTANGLE), _defineProperty(_MODE_TO_RENDER_TYPE, MODES.DRAW_1MILE_CIRCLE, RENDER_TYPE.POLYGON), _defineProperty(_MODE_TO_RENDER_TYPE, MODES.DRAW_3MILE_CIRCLE, RENDER_TYPE.POLYGON), _defineProperty(_MODE_TO_RENDER_TYPE, MODES.DRAW_5MILE_CIRCLE, RENDER_TYPE.POLYGON), _MODE_TO_RENDER_TYPE);
exports.MODE_TO_RENDER_TYPE = MODE_TO_RENDER_TYPE;
var RENDER_STATE = {
  INACTIVE: 'INACTIVE',
  UNCOMMITTED: 'UNCOMMITTED',
  SELECTED: 'SELECTED',
  HOVERED: 'HOVERED',
  CLOSING: 'CLOSING'
};
exports.RENDER_STATE = RENDER_STATE;
var OPERATIONS = {
  NONE: 'NONE',
  SET: 'SET',
  INTERSECT: 'INTERSECT',
  INSERT: 'INSERT'
};
exports.OPERATIONS = OPERATIONS;
var STATIC_STYLE = {
  cursor: 'default',
  pointerEvents: 'none'
};
exports.STATIC_STYLE = STATIC_STYLE;
var ELEMENT_TYPE = {
  FEATURE: 'feature',
  SEGMENT: 'segment',
  VERTEX: 'vertex'
};
exports.ELEMENT_TYPE = ELEMENT_TYPE;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25zdGFudHMuanMiXSwibmFtZXMiOlsiTU9ERVMiLCJSRUFEX09OTFkiLCJTRUxFQ1RfRkVBVFVSRSIsIkVESVRfVkVSVEVYIiwiRFJBV19QT0lOVCIsIkRSQVdfUEFUSCIsIkRSQVdfUE9MWUdPTiIsIkRSQVdfUkVDVEFOR0xFIiwiRFJBV18xTUlMRV9DSVJDTEUiLCJEUkFXXzNNSUxFX0NJUkNMRSIsIkRSQVdfNU1JTEVfQ0lSQ0xFIiwiRFJBV0lOR19NT0RFUyIsIkdFT0pTT05fVFlQRSIsIlBPSU5UIiwiTElORV9TVFJJTkciLCJQT0xZR09OIiwiTU9ERV9UT19HRU9KU09OX1RZUEUiLCJSRU5ERVJfVFlQRSIsIlJFQ1RBTkdMRSIsIk1PREVfVE9fUkVOREVSX1RZUEUiLCJSRU5ERVJfU1RBVEUiLCJJTkFDVElWRSIsIlVOQ09NTUlUVEVEIiwiU0VMRUNURUQiLCJIT1ZFUkVEIiwiQ0xPU0lORyIsIk9QRVJBVElPTlMiLCJOT05FIiwiU0VUIiwiSU5URVJTRUNUIiwiSU5TRVJUIiwiU1RBVElDX1NUWUxFIiwiY3Vyc29yIiwicG9pbnRlckV2ZW50cyIsIkVMRU1FTlRfVFlQRSIsIkZFQVRVUkUiLCJTRUdNRU5UIiwiVkVSVEVYIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNPLElBQU1BLEtBQUssR0FBRztBQUNuQkMsRUFBQUEsU0FBUyxFQUFFLFdBRFE7QUFFbkJDLEVBQUFBLGNBQWMsRUFBRSxnQkFGRztBQUduQkMsRUFBQUEsV0FBVyxFQUFFLGFBSE07QUFJbkJDLEVBQUFBLFVBQVUsRUFBRSxZQUpPO0FBS25CQyxFQUFBQSxTQUFTLEVBQUUsV0FMUTtBQU1uQkMsRUFBQUEsWUFBWSxFQUFFLGNBTks7QUFPbkJDLEVBQUFBLGNBQWMsRUFBRSxnQkFQRztBQVFuQkMsRUFBQUEsaUJBQWlCLEVBQUUsbUJBUkE7QUFTbkJDLEVBQUFBLGlCQUFpQixFQUFFLG1CQVRBO0FBVW5CQyxFQUFBQSxpQkFBaUIsRUFBRTtBQVZBLENBQWQ7O0FBYUEsSUFBTUMsYUFBYSxHQUFHLENBQzNCWCxLQUFLLENBQUNJLFVBRHFCLEVBRTNCSixLQUFLLENBQUNLLFNBRnFCLEVBRzNCTCxLQUFLLENBQUNNLFlBSHFCLEVBSTNCTixLQUFLLENBQUNPLGNBSnFCLEVBSzNCUCxLQUFLLENBQUNRLGlCQUxxQixFQU0zQlIsS0FBSyxDQUFDUyxpQkFOcUIsRUFPM0JULEtBQUssQ0FBQ1UsaUJBUHFCLENBQXRCOztBQVVBLElBQU1FLFlBQVksR0FBRztBQUMxQkMsRUFBQUEsS0FBSyxFQUFFLE9BRG1CO0FBRTFCQyxFQUFBQSxXQUFXLEVBQUUsWUFGYTtBQUcxQkMsRUFBQUEsT0FBTyxFQUFFO0FBSGlCLENBQXJCOztBQU1BLElBQU1DLG9CQUFvQix1RUFDOUJoQixLQUFLLENBQUNJLFVBRHdCLEVBQ1hRLFlBQVksQ0FBQ0MsS0FERiwwQ0FFOUJiLEtBQUssQ0FBQ0ssU0FGd0IsRUFFWk8sWUFBWSxDQUFDRSxXQUZELDBDQUc5QmQsS0FBSyxDQUFDTSxZQUh3QixFQUdUTSxZQUFZLENBQUNHLE9BSEosMENBSTlCZixLQUFLLENBQUNPLGNBSndCLEVBSVBLLFlBQVksQ0FBQ0csT0FKTiwwQ0FLOUJmLEtBQUssQ0FBQ1EsaUJBTHdCLEVBS0pJLFlBQVksQ0FBQ0csT0FMVCwwQ0FNOUJmLEtBQUssQ0FBQ1MsaUJBTndCLEVBTUpHLFlBQVksQ0FBQ0csT0FOVCwwQ0FPOUJmLEtBQUssQ0FBQ1UsaUJBUHdCLEVBT0pFLFlBQVksQ0FBQ0csT0FQVCx5QkFBMUI7O0FBVUEsSUFBTUUsV0FBVyxHQUFHO0FBQ3pCSixFQUFBQSxLQUFLLEVBQUUsT0FEa0I7QUFFekJDLEVBQUFBLFdBQVcsRUFBRSxZQUZZO0FBR3pCQyxFQUFBQSxPQUFPLEVBQUUsU0FIZ0I7QUFJekJHLEVBQUFBLFNBQVMsRUFBRTtBQUpjLENBQXBCOztBQU9BLElBQU1DLG1CQUFtQixxRUFDN0JuQixLQUFLLENBQUNJLFVBRHVCLEVBQ1ZhLFdBQVcsQ0FBQ0osS0FERix5Q0FFN0JiLEtBQUssQ0FBQ0ssU0FGdUIsRUFFWFksV0FBVyxDQUFDSCxXQUZELHlDQUc3QmQsS0FBSyxDQUFDTSxZQUh1QixFQUdSVyxXQUFXLENBQUNGLE9BSEoseUNBSTdCZixLQUFLLENBQUNPLGNBSnVCLEVBSU5VLFdBQVcsQ0FBQ0MsU0FKTix5Q0FLN0JsQixLQUFLLENBQUNRLGlCQUx1QixFQUtIUyxXQUFXLENBQUNGLE9BTFQseUNBTTdCZixLQUFLLENBQUNTLGlCQU51QixFQU1IUSxXQUFXLENBQUNGLE9BTlQseUNBTzdCZixLQUFLLENBQUNVLGlCQVB1QixFQU9ITyxXQUFXLENBQUNGLE9BUFQsd0JBQXpCOztBQVVBLElBQU1LLFlBQVksR0FBRztBQUMxQkMsRUFBQUEsUUFBUSxFQUFFLFVBRGdCO0FBRTFCQyxFQUFBQSxXQUFXLEVBQUUsYUFGYTtBQUcxQkMsRUFBQUEsUUFBUSxFQUFFLFVBSGdCO0FBSTFCQyxFQUFBQSxPQUFPLEVBQUUsU0FKaUI7QUFLMUJDLEVBQUFBLE9BQU8sRUFBRTtBQUxpQixDQUFyQjs7QUFRQSxJQUFNQyxVQUFVLEdBQUc7QUFDeEJDLEVBQUFBLElBQUksRUFBRSxNQURrQjtBQUV4QkMsRUFBQUEsR0FBRyxFQUFFLEtBRm1CO0FBR3hCQyxFQUFBQSxTQUFTLEVBQUUsV0FIYTtBQUl4QkMsRUFBQUEsTUFBTSxFQUFFO0FBSmdCLENBQW5COztBQU9BLElBQU1DLFlBQVksR0FBRztBQUMxQkMsRUFBQUEsTUFBTSxFQUFFLFNBRGtCO0FBRTFCQyxFQUFBQSxhQUFhLEVBQUU7QUFGVyxDQUFyQjs7QUFLQSxJQUFNQyxZQUFZLEdBQUc7QUFDMUJDLEVBQUFBLE9BQU8sRUFBRSxTQURpQjtBQUUxQkMsRUFBQUEsT0FBTyxFQUFFLFNBRmlCO0FBRzFCQyxFQUFBQSxNQUFNLEVBQUU7QUFIa0IsQ0FBckIiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuZXhwb3J0IGNvbnN0IE1PREVTID0ge1xuICBSRUFEX09OTFk6ICdSRUFEX09OTFknLFxuICBTRUxFQ1RfRkVBVFVSRTogJ1NFTEVDVF9GRUFUVVJFJyxcbiAgRURJVF9WRVJURVg6ICdFRElUX1ZFUlRFWCcsXG4gIERSQVdfUE9JTlQ6ICdEUkFXX1BPSU5UJyxcbiAgRFJBV19QQVRIOiAnRFJBV19QQVRIJyxcbiAgRFJBV19QT0xZR09OOiAnRFJBV19QT0xZR09OJyxcbiAgRFJBV19SRUNUQU5HTEU6ICdEUkFXX1JFQ1RBTkdMRScsXG4gIERSQVdfMU1JTEVfQ0lSQ0xFOiAnRFJBV18xTUlMRV9DSVJDTEUnLFxuICBEUkFXXzNNSUxFX0NJUkNMRTogJ0RSQVdfM01JTEVfQ0lSQ0xFJyxcbiAgRFJBV181TUlMRV9DSVJDTEU6ICdEUkFXXzVNSUxFX0NJUkNMRSdcbn07XG5cbmV4cG9ydCBjb25zdCBEUkFXSU5HX01PREVTID0gW1xuICBNT0RFUy5EUkFXX1BPSU5ULFxuICBNT0RFUy5EUkFXX1BBVEgsXG4gIE1PREVTLkRSQVdfUE9MWUdPTixcbiAgTU9ERVMuRFJBV19SRUNUQU5HTEUsXG4gIE1PREVTLkRSQVdfMU1JTEVfQ0lSQ0xFLFxuICBNT0RFUy5EUkFXXzNNSUxFX0NJUkNMRSxcbiAgTU9ERVMuRFJBV181TUlMRV9DSVJDTEVcbl07XG5cbmV4cG9ydCBjb25zdCBHRU9KU09OX1RZUEUgPSB7XG4gIFBPSU5UOiAnUG9pbnQnLFxuICBMSU5FX1NUUklORzogJ0xpbmVTdHJpbmcnLFxuICBQT0xZR09OOiAnUG9seWdvbidcbn07XG5cbmV4cG9ydCBjb25zdCBNT0RFX1RPX0dFT0pTT05fVFlQRSA9IHtcbiAgW01PREVTLkRSQVdfUE9JTlRdOiBHRU9KU09OX1RZUEUuUE9JTlQsXG4gIFtNT0RFUy5EUkFXX1BBVEhdOiBHRU9KU09OX1RZUEUuTElORV9TVFJJTkcsXG4gIFtNT0RFUy5EUkFXX1BPTFlHT05dOiBHRU9KU09OX1RZUEUuUE9MWUdPTixcbiAgW01PREVTLkRSQVdfUkVDVEFOR0xFXTogR0VPSlNPTl9UWVBFLlBPTFlHT04sXG4gIFtNT0RFUy5EUkFXXzFNSUxFX0NJUkNMRV06IEdFT0pTT05fVFlQRS5QT0xZR09OLFxuICBbTU9ERVMuRFJBV18zTUlMRV9DSVJDTEVdOiBHRU9KU09OX1RZUEUuUE9MWUdPTixcbiAgW01PREVTLkRSQVdfNU1JTEVfQ0lSQ0xFXTogR0VPSlNPTl9UWVBFLlBPTFlHT05cbn07XG5cbmV4cG9ydCBjb25zdCBSRU5ERVJfVFlQRSA9IHtcbiAgUE9JTlQ6ICdQb2ludCcsXG4gIExJTkVfU1RSSU5HOiAnTGluZVN0cmluZycsXG4gIFBPTFlHT046ICdQb2x5Z29uJyxcbiAgUkVDVEFOR0xFOiAnUmVjdGFuZ2xlJ1xufTtcblxuZXhwb3J0IGNvbnN0IE1PREVfVE9fUkVOREVSX1RZUEUgPSB7XG4gIFtNT0RFUy5EUkFXX1BPSU5UXTogUkVOREVSX1RZUEUuUE9JTlQsXG4gIFtNT0RFUy5EUkFXX1BBVEhdOiBSRU5ERVJfVFlQRS5MSU5FX1NUUklORyxcbiAgW01PREVTLkRSQVdfUE9MWUdPTl06IFJFTkRFUl9UWVBFLlBPTFlHT04sXG4gIFtNT0RFUy5EUkFXX1JFQ1RBTkdMRV06IFJFTkRFUl9UWVBFLlJFQ1RBTkdMRSxcbiAgW01PREVTLkRSQVdfMU1JTEVfQ0lSQ0xFXTogUkVOREVSX1RZUEUuUE9MWUdPTixcbiAgW01PREVTLkRSQVdfM01JTEVfQ0lSQ0xFXTogUkVOREVSX1RZUEUuUE9MWUdPTixcbiAgW01PREVTLkRSQVdfNU1JTEVfQ0lSQ0xFXTogUkVOREVSX1RZUEUuUE9MWUdPTlxufTtcblxuZXhwb3J0IGNvbnN0IFJFTkRFUl9TVEFURSA9IHtcbiAgSU5BQ1RJVkU6ICdJTkFDVElWRScsXG4gIFVOQ09NTUlUVEVEOiAnVU5DT01NSVRURUQnLFxuICBTRUxFQ1RFRDogJ1NFTEVDVEVEJyxcbiAgSE9WRVJFRDogJ0hPVkVSRUQnLFxuICBDTE9TSU5HOiAnQ0xPU0lORydcbn07XG5cbmV4cG9ydCBjb25zdCBPUEVSQVRJT05TID0ge1xuICBOT05FOiAnTk9ORScsXG4gIFNFVDogJ1NFVCcsXG4gIElOVEVSU0VDVDogJ0lOVEVSU0VDVCcsXG4gIElOU0VSVDogJ0lOU0VSVCdcbn07XG5cbmV4cG9ydCBjb25zdCBTVEFUSUNfU1RZTEUgPSB7XG4gIGN1cnNvcjogJ2RlZmF1bHQnLFxuICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbn07XG5cbmV4cG9ydCBjb25zdCBFTEVNRU5UX1RZUEUgPSB7XG4gIEZFQVRVUkU6ICdmZWF0dXJlJyxcbiAgU0VHTUVOVDogJ3NlZ21lbnQnLFxuICBWRVJURVg6ICd2ZXJ0ZXgnXG59O1xuIl19