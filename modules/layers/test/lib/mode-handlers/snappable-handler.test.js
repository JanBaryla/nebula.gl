// @flow

import { SnappableHandler } from '../../../src/mode-handlers/snappable-handler';
import { TranslateHandler } from '../../../src/mode-handlers/translate-handler';
import {
  createFeatureCollection,
  createPointerDragEvent,
  createPointerMoveEvent,
  featuresForSnappingTests,
  mockPickedHandle,
  mockNonPickedHandle,
  createPolygonFeature
} from '../test-utils.js';

const mockTranslateEditAction = updatedData => ({
  editContext: null,
  editType: 'translating',
  featureIndexes: [0],
  updatedData
});

function mockFeatureCollectionState(features: any) {
  const translateHandler = new TranslateHandler(features);
  const snappableHandler = new SnappableHandler(translateHandler);

  snappableHandler.setSelectedFeatureIndexes([1]);

  return { snappableHandler, translateHandler };
}

describe('SnappableHandler - TranslateHandler tests', () => {
  let translateHandler;
  let snappableHandler;

  beforeEach(() => {
    const { translateHandler: translate, snappableHandler: snappable } = mockFeatureCollectionState(
      featuresForSnappingTests
    );
    translateHandler = translate;
    snappableHandler = snappable;
  });

  test('setFeatureCollection()', () => {
    const initialFeatureCollection = translateHandler.getFeatureCollection();
    expect(translateHandler.getFeatureCollection()).toEqual(initialFeatureCollection);
    const differentFeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [-122.28103267622373, 37.98843664327903]
          }
        }
      ]
    };

    snappableHandler.setFeatureCollection(differentFeatureCollection);
    expect(translateHandler.getFeatureCollection()).toEqual(differentFeatureCollection);
  });

  test('setSelectedFeatureIndexes()', () => {
    expect(translateHandler.getSelectedFeatureIndexes()).toEqual([1]);
    const udpatedSelectedIndexes = [1, 2, 3];
    snappableHandler.setSelectedFeatureIndexes(udpatedSelectedIndexes);
    expect(translateHandler.getSelectedFeatureIndexes()).toEqual(udpatedSelectedIndexes);
  });

  test('_getSnappedMouseEvent()', () => {
    const initialMoveEvent = createPointerMoveEvent([1, 1]);
    const snapPos = [123, 123];
    const startDragSnapHandlePosition = [19, 15];
    snappableHandler._startDragSnapHandlePosition = startDragSnapHandlePosition;
    const expectedSnappedMouseEvent = Object.assign({}, initialMoveEvent, {
      mapCoords: snapPos,
      pointerDownMapCoords: startDragSnapHandlePosition
    });
    const snappedMouseEvent = snappableHandler._getSnappedMouseEvent(initialMoveEvent, snapPos);
    expect(snappedMouseEvent).toEqual(expectedSnappedMouseEvent);
  });

  test('_getEditHandlePicks() - positive case', () => {
    const mouseMoveEvent = createPointerMoveEvent(
      [100, 100],
      [
        {
          object: mockNonPickedHandle
        }
      ]
    );
    mouseMoveEvent.screenCoords = [1, 1];
    mouseMoveEvent.pointerDownPicks = [{ index: 0, isGuide: true, object: mockPickedHandle }];

    const picks = snappableHandler._getEditHandlePicks(mouseMoveEvent);
    expect(picks.pickedHandle).toBeDefined();
    if (picks.pickedHandle) {
      expect(picks.pickedHandle.type).toEqual('snap');
    }
    expect(picks.potentialSnapHandle).toBeDefined();
    if (picks.potentialSnapHandle) {
      expect(picks.potentialSnapHandle.type).toEqual('intermediate');
    }
    expect(picks).toMatchSnapshot();
  });

  test('_getEditHandlePicks() - no pickedHandle', () => {
    const mouseMoveEvent = createPointerMoveEvent([100, 100], []);
    mouseMoveEvent.screenCoords = [1, 1];

    const picks = snappableHandler._getEditHandlePicks(mouseMoveEvent);
    expect(picks.pickedHandle).not.toBeDefined();
    expect(picks.potentialSnapHandle).not.toBeDefined();
    expect(picks).toMatchSnapshot();
  });

  test('_updatePickedHandlePosition() - positive case', () => {
    const initialPickedHandle = {
      featureIndex: 2,
      position: [100, 100],
      positionIndexes: [0, 0],
      type: 'snap'
    };
    snappableHandler._editHandlePicks = {
      pickedHandle: { ...initialPickedHandle }
    };

    const editAction = mockTranslateEditAction(createFeatureCollection());
    editAction.featureIndexes = [2];
    snappableHandler._updatePickedHandlePosition(editAction);

    const expectedPickedHandle = {
      featureIndex: 2,
      position: [-1, -1],
      positionIndexes: [0, 0],
      type: 'snap'
    };
    const finalPickedHandle = (snappableHandler._editHandlePicks || {}).pickedHandle;
    expect(finalPickedHandle).not.toEqual(initialPickedHandle);
    expect(finalPickedHandle).toEqual(expectedPickedHandle);
  });

  test('_updatePickedHandlePosition() - no _editHandlePicks case', () => {
    const editAction = mockTranslateEditAction(createFeatureCollection());
    snappableHandler._updatePickedHandlePosition(editAction);
    expect(snappableHandler._editHandlePicks).toBeUndefined();
  });

  test('_updatePickedHandlePosition() - featureIndex not equal to index', () => {
    const initialPickedHandle = {
      featureIndex: 10,
      position: [100, 100],
      positionIndexes: [0, 0],
      type: 'snap'
    };
    snappableHandler._editHandlePicks = {
      pickedHandle: { ...initialPickedHandle }
    };

    const editAction = mockTranslateEditAction(createFeatureCollection());
    snappableHandler._updatePickedHandlePosition(editAction);
    const { pickedHandle } = snappableHandler._editHandlePicks || {};
    expect(pickedHandle).toEqual(initialPickedHandle);
  });

  test('_getSnapTargets() - additionalSnapTargets not specified', () => {
    const features = snappableHandler._getSnapTargets();
    expect(features.length).toEqual(5);
    expect(features).toMatchSnapshot();
  });

  test('_getSnapTargets() - valid additionalSnapTargets specified', () => {
    snappableHandler.setModeConfig({ additionalSnapTargets: [createPolygonFeature()] });
    const features = snappableHandler._getSnapTargets();
    expect(features.length).toEqual(6);
    expect(features).toMatchSnapshot();
  });

  test('_getNonPickedIntermediateHandles() - additionalSnapTargets not specified', () => {
    const intermediateHandles = snappableHandler._getNonPickedIntermediateHandles();
    const areAllHandleTypesIntermediate = intermediateHandles.every(
      ({ type }) => type === 'intermediate'
    );
    expect(areAllHandleTypesIntermediate).toBeTruthy();
    expect(intermediateHandles).toMatchSnapshot();
  });

  test('_getNonPickedIntermediateHandles() - valid additionalSnapTargets specified', () => {
    snappableHandler.setModeConfig({ additionalSnapTargets: [createPolygonFeature()] });
    const intermediateHandles = snappableHandler._getNonPickedIntermediateHandles();
    const areAllHandleTypesIntermediate = intermediateHandles.every(
      ({ type }) => type === 'intermediate'
    );
    expect(areAllHandleTypesIntermediate).toBeTruthy();
    expect(intermediateHandles).toMatchSnapshot();
  });

  test('getEditHandlesAdapter()', () => {
    snappableHandler.setSelectedFeatureIndexes([1]);
    snappableHandler.setModeConfig({ enableSnapping: true });
    snappableHandler._editHandlePicks = { pickedHandle: mockPickedHandle };

    const allHandles = snappableHandler.getEditHandlesAdapter();
    expect(allHandles.length).toEqual(14);
    expect(allHandles).toMatchSnapshot();

    const snapHandles = allHandles.filter(({ type }) => type === 'snap');
    expect(snapHandles.length).toEqual(1);
    expect(snapHandles).toMatchSnapshot();

    const intermediateHandles = allHandles.filter(({ type }) => type === 'intermediate');
    expect(intermediateHandles.length).toEqual(13);
    expect(intermediateHandles).toMatchSnapshot();
  });

  test('getEditHandlesAdapter() - no _editHandlePicks', () => {
    snappableHandler.setModeConfig({ enableSnapping: true });
    const allHandles = snappableHandler.getEditHandlesAdapter();
    expect(allHandles.length > 0).toBeTruthy();
    expect(allHandles).toMatchSnapshot();
  });

  test('getEditHandlesAdapter() - enableSnapping not defined', () => {
    snappableHandler._editHandlePicks = { pickedHandle: mockPickedHandle };

    const allHandles = snappableHandler.getEditHandlesAdapter();
    expect(allHandles.length).toEqual(0);
  });

  test('getEditHandlesAdapter() - selectedFeatureIndex greater than feature count', () => {
    snappableHandler.setModeConfig({ enableSnapping: true });
    translateHandler.setSelectedFeatureIndexes([1000]);

    const allHandles = snappableHandler.getEditHandlesAdapter();
    expect(allHandles.length).toEqual(0);
  });

  test('_performSnapIfRequired() - positive case', () => {
    expect(snappableHandler._isSnapped).toBeFalsy();
    snappableHandler._editHandlePicks = {
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    };

    snappableHandler._performSnapIfRequired();
    expect(snappableHandler._isSnapped).toBeTruthy();
  });

  test('_performSnapIfRequired() - already snapped', () => {
    snappableHandler._isSnapped = true;
    snappableHandler._editHandlePicks = {
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    };

    snappableHandler._performSnapIfRequired();
    expect(snappableHandler._isSnapped).toBeTruthy();
  });

  test('_performSnapIfRequired() - no _editHandlePicks', () => {
    snappableHandler._performSnapIfRequired();
    expect(snappableHandler._isSnapped).toBeFalsy();
  });

  test('_performSnapIfRequired() - no pickedHandles', () => {
    snappableHandler._editHandlePicks = {
      potentialSnapHandle: mockNonPickedHandle
    };

    snappableHandler._performSnapIfRequired();
    expect(snappableHandler._isSnapped).toBeFalsy();
  });

  test('_performSnapIfRequired() - no potentialSnapHandle', () => {
    expect(snappableHandler._isSnapped).toBeFalsy();
    snappableHandler._editHandlePicks = {
      pickedHandle: mockPickedHandle
    };

    snappableHandler._performSnapIfRequired();
    expect(snappableHandler._isSnapped).toBeFalsy();
  });

  test('_performUnsnapIfRequired() - positive case', () => {
    snappableHandler._isSnapped = true;
    expect(snappableHandler._isSnapped).toBeTruthy();
    snappableHandler._editHandlePicks = { pickedHandle: mockPickedHandle };
    snappableHandler._performUnsnapIfRequired();
    expect(snappableHandler._isSnapped).toBeFalsy();
  });

  test('_performUnsnapIfRequired() - selected hasnt already been snapped', () => {
    snappableHandler._editHandlePicks = {
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    };
    snappableHandler._performUnsnapIfRequired();
    expect(snappableHandler._isSnapped).toBeFalsy();
  });

  test('_performUnsnapIfRequired() - no _editHandlePicks', () => {
    snappableHandler._isSnapped = true;
    expect(snappableHandler._isSnapped).toBeTruthy();
    snappableHandler._performUnsnapIfRequired();
    expect(snappableHandler._isSnapped).toBeFalsy();
  });

  test('_performUnsnapIfRequired() - potentialSnapHandle is present', () => {
    snappableHandler._isSnapped = true;
    snappableHandler._editHandlePicks = {
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    };
    snappableHandler._performUnsnapIfRequired();
    expect(snappableHandler._isSnapped).toBeTruthy();
  });

  test('_getSnapAwareEvent() - potentialSnapHandle is present', () => {
    const pointerDownPos = [19, 15];
    const screenMapCoords = mockNonPickedHandle.position;

    snappableHandler._isSnapped = true;
    snappableHandler._startDragSnapHandlePosition = pointerDownPos;
    snappableHandler._editHandlePicks = { potentialSnapHandle: mockNonPickedHandle };

    const originalEvent = createPointerMoveEvent([1, 1]);
    const expectedSnappedEvent = {
      ...originalEvent,
      mapCoords: screenMapCoords,
      pointerDownMapCoords: pointerDownPos
    };
    const snappedEvent = snappableHandler._getSnapAwareEvent(originalEvent);
    expect(snappedEvent).toEqual(expectedSnappedEvent);
  });

  test('_getSnapAwareEvent() - no potentialSnapHandle', () => {
    const originalEvent = createPointerMoveEvent([1, 1]);
    const snappedEvent = snappableHandler._getSnapAwareEvent(originalEvent);
    expect(snappedEvent).toEqual(originalEvent);
  });

  test('handleStartDraggingAdapter()', () => {
    const eventWithPicks = createPointerDragEvent(
      [20, 20],
      [20, 20],
      [{ isGuide: true, object: mockNonPickedHandle }]
    );
    // $FlowFixMe
    translateHandler.handleStartDraggingAdapter = jest.fn();
    snappableHandler.handleStartDraggingAdapter(eventWithPicks);

    expect(snappableHandler._startDragSnapHandlePosition).toEqual(mockNonPickedHandle.position);
    expect(translateHandler.handleStartDraggingAdapter).toBeCalled();
    expect(translateHandler.handleStartDraggingAdapter).toBeCalledWith(eventWithPicks);
  });

  test('handleStartDraggingAdapter() - no picks', () => {
    // $FlowFixMe
    translateHandler.handleStartDraggingAdapter = jest.fn(v => v);

    const event = createPointerDragEvent([20, 20], [20, 20]);
    const eventSummary = snappableHandler.handleStartDraggingAdapter(event);
    expect(eventSummary).toBeDefined();

    expect(snappableHandler._startDragSnapHandlePosition).not.toBeDefined();
    expect(translateHandler.handleStartDraggingAdapter).toBeCalled();
    expect(translateHandler.handleStartDraggingAdapter).toBeCalledWith(event);
  });

  test('handleStopDraggingAdapter()', () => {
    snappableHandler._isSnapped = true;
    snappableHandler._editHandlePicks = {
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    };
    // $FlowFixMe
    translateHandler.handleStopDraggingAdapter = jest.fn(v => v);

    const event = createPointerDragEvent([20, 20], [20, 20]);
    const eventSummary = snappableHandler.handleStopDraggingAdapter(event);
    expect(eventSummary).toBeDefined();

    expect(snappableHandler._editHandlePicks).toBeNull();
    expect(snappableHandler._isSnapped).toBeFalsy();
    expect(translateHandler.handleStopDraggingAdapter).toBeCalled();
  });

  test('getCursorAdapter()', () => {
    // $FlowFixMe
    translateHandler.getCursorAdapter = jest.fn(v => v);
    const event = { isDragging: true };
    const result = snappableHandler.getCursorAdapter(event);

    expect(result).toBeDefined();
    expect(translateHandler.getCursorAdapter).toBeCalled();
    expect(translateHandler.getCursorAdapter).toBeCalledWith(event);
  });

  test('handlePointerMoveAdapter() - positive case', () => {
    snappableHandler.setModeConfig({ enableSnapping: true });
    snappableHandler._editHandlePicks = {
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    };
    // $FlowFixMe
    snappableHandler._performSnapIfRequired = jest.fn();
    // $FlowFixMe
    snappableHandler._performUnsnapIfRequired = jest.fn();
    // $FlowFixMe
    snappableHandler._updatePickedHandlePosition = jest.fn();
    const mockedEditActionSummary = {
      editAction: Object.assign({}, mockTranslateEditAction(createFeatureCollection()), {
        featureindexes: [2]
      })
    };
    // $FlowFixMe
    translateHandler.handlePointerMoveAdapter = jest.fn(v => mockedEditActionSummary);
    const event = createPointerMoveEvent([20, 20]);
    const eventSummary = snappableHandler.handlePointerMoveAdapter(event);
    expect(eventSummary).toBeDefined();

    expect(snappableHandler._performSnapIfRequired).toBeCalled();
    expect(snappableHandler._performUnsnapIfRequired).toBeCalled();
    expect(snappableHandler._updatePickedHandlePosition).toBeCalled();
    expect(snappableHandler._updatePickedHandlePosition.mock.calls[0]).toMatchSnapshot();
  });

  test('handlePointerMoveAdapter() - this._getEditHandlePicks does not return anything', () => {
    snappableHandler.setModeConfig({ enableSnapping: true });
    snappableHandler._editHandlePicks = {
      pickedHandle: mockPickedHandle,
      potentialSnapHandle: mockNonPickedHandle
    };
    // $FlowFixMe
    snappableHandler._performSnapIfRequired = jest.fn();
    // $FlowFixMe
    snappableHandler._performUnsnapIfRequired = jest.fn();
    // $FlowFixMe
    snappableHandler._updatePickedHandlePosition = jest.fn();
    const mockedEditActionSummary = {
      editAction: Object.assign({}, mockTranslateEditAction(createFeatureCollection()), {
        featureindexes: [2]
      })
    };
    // $FlowFixMe
    snappableHandler._getEditHandlePicks = jest.fn(v => null);
    // $FlowFixMe
    translateHandler.handlePointerMoveAdapter = jest.fn(v => mockedEditActionSummary);
    const event = createPointerMoveEvent([20, 20]);
    const eventSummary = snappableHandler.handlePointerMoveAdapter(event);
    expect(eventSummary).toBeDefined();

    expect(snappableHandler._performSnapIfRequired).not.toBeCalled();
    expect(snappableHandler._performUnsnapIfRequired).not.toBeCalled();
    expect(snappableHandler._updatePickedHandlePosition).toBeCalled();
    expect(snappableHandler._updatePickedHandlePosition.mock.calls[0]).toMatchSnapshot();
  });

  test('handlePointerMoveAdapter() - enableSnapping = false', () => {
    // $FlowFixMe
    snappableHandler._performSnapIfRequired = jest.fn();
    // $FlowFixMe
    snappableHandler._performUnsnapIfRequired = jest.fn();
    // $FlowFixMe
    snappableHandler._updatePickedHandlePosition = jest.fn();
    const mockedEditActionSummary = {
      editAction: Object.assign({}, mockTranslateEditAction(createFeatureCollection()), {
        featureindexes: [0]
      })
    };
    // $FlowFixMe
    translateHandler.handlePointerMoveAdapter = jest.fn(v => mockedEditActionSummary);
    const event = createPointerMoveEvent([20, 20]);
    const eventSummary = snappableHandler.handlePointerMoveAdapter(event);
    expect(eventSummary).toBeDefined();

    expect(snappableHandler._performSnapIfRequired).not.toBeCalled();
    expect(snappableHandler._performUnsnapIfRequired).not.toBeCalled();
    expect(snappableHandler._updatePickedHandlePosition).toBeCalled();
    expect(snappableHandler._updatePickedHandlePosition.mock.calls[0]).toMatchSnapshot();
  });

  test('handlePointerMoveAdapter() - editAction does not require pickedHandle position update', () => {
    // $FlowFixMe
    snappableHandler._performSnapIfRequired = jest.fn();
    // $FlowFixMe
    snappableHandler._performUnsnapIfRequired = jest.fn();
    // $FlowFixMe
    snappableHandler._updatePickedHandlePosition = jest.fn();
    // $FlowFixMe
    translateHandler.handlePointerMoveAdapter = jest.fn(v => ({
      editAction: null,
      cancelMapPan: true
    }));
    const event = createPointerMoveEvent([20, 20]);
    const eventSummary = snappableHandler.handlePointerMoveAdapter(event);
    expect(eventSummary).toBeDefined();

    expect(snappableHandler._performSnapIfRequired).not.toBeCalled();
    expect(snappableHandler._performUnsnapIfRequired).not.toBeCalled();
    expect(snappableHandler._updatePickedHandlePosition).not.toBeCalled();
  });
});
