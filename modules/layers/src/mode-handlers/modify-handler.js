// @flow

import nearestPointOnLine from '@turf/nearest-point-on-line';
import { point, lineString as toLineString } from '@turf/helpers';
import { recursivelyTraverseNestedArrays } from '../utils.js';
import type { FeatureCollection, Feature, Position } from '../geojson-types.js';
import type {
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent
} from '../event-types.js';
import type { ModeState } from '../edit-mode.js';
import type { FeatureCollectionEditAction, EditHandle } from './mode-handler.js';
import { ModeHandler, getPickedEditHandle, getEditHandlesForGeometry } from './mode-handler.js';

export class ModifyHandler extends ModeHandler {
  _lastPointerMovePicks: *;

  updateState(
    state: ModeState<FeatureCollection, { tentativeFeature: ?Feature, editHandles: EditHandle[] }>
  ) {
    if (Math.random() > 0.5) {
      const editHandles = this.getEditHandles();
      state.onUpdateGuides({
        tentativeFeature: state.guides && state.guides.tentativeFeature,
        editHandles
      });
    }

    super.updateState(state);
  }

  getEditHandles(picks?: Array<Object>, groundCoords?: Position): EditHandle[] {
    let handles = [];
    const { features } = this.featureCollection.getObject();

    for (const index of this.getSelectedFeatureIndexes()) {
      if (index < features.length) {
        const { geometry } = features[index];
        handles.push(...getEditHandlesForGeometry(geometry, index));
      } else {
        console.warn(`selectedFeatureIndexes out of range ${index}`); // eslint-disable-line no-console,no-undef
      }
    }

    // intermediate edit handle
    if (picks && picks.length && groundCoords) {
      const existingEditHandle = picks.find(
        pick => pick.isEditingHandle && pick.object && pick.object.type === 'existing'
      );
      // don't show intermediate point when too close to an existing edit handle
      const featureAsPick = !existingEditHandle && picks.find(pick => !pick.isEditingHandle);

      // is the feature in the pick selected
      if (
        featureAsPick &&
        !featureAsPick.object.geometry.type.includes('Point') &&
        this.getSelectedFeatureIndexes().includes(featureAsPick.index)
      ) {
        let intermediatePoint = null;
        let positionIndexPrefix = [];
        const referencePoint = point(groundCoords);
        // process all lines of the (single) feature
        recursivelyTraverseNestedArrays(
          featureAsPick.object.geometry.coordinates,
          [],
          (lineString, prefix) => {
            const lineStringFeature = toLineString(lineString);
            const candidateIntermediatePoint = this.nearestPointOnLine(
              lineStringFeature,
              referencePoint
            );
            if (
              !intermediatePoint ||
              candidateIntermediatePoint.properties.dist < intermediatePoint.properties.dist
            ) {
              intermediatePoint = candidateIntermediatePoint;
              positionIndexPrefix = prefix;
            }
          }
        );
        // tack on the lone intermediate point to the set of handles
        if (intermediatePoint) {
          const {
            geometry: { coordinates: position },
            properties: { index }
          } = intermediatePoint;
          handles = [
            ...handles,
            {
              position,
              positionIndexes: [...positionIndexPrefix, index + 1],
              featureIndex: featureAsPick.index,
              type: 'intermediate'
            }
          ];
        }
      }
    }

    return handles;
  }

  // turf.js does not support elevation for nearestPointOnLine
  nearestPointOnLine(line: any, inPoint: any): any {
    // TODO: implement 3D nearestPointOnLine
    return nearestPointOnLine(line, inPoint);
  }

  handleClick(event: ClickEvent): ?FeatureCollectionEditAction {
    let editAction: ?FeatureCollectionEditAction = null;

    const clickedEditHandle = getPickedEditHandle(event.picks);

    if (clickedEditHandle && clickedEditHandle.featureIndex >= 0) {
      if (clickedEditHandle.type === 'existing') {
        let updatedData;
        try {
          updatedData = this.getImmutableFeatureCollection()
            .removePosition(clickedEditHandle.featureIndex, clickedEditHandle.positionIndexes)
            .getObject();
        } catch (ignored) {
          // This happens if user attempts to remove the last point
        }

        if (updatedData) {
          editAction = {
            updatedData,
            editType: 'removePosition',
            featureIndexes: [clickedEditHandle.featureIndex],
            editContext: {
              positionIndexes: clickedEditHandle.positionIndexes,
              position: clickedEditHandle.position
            }
          };
        }
      } else if (clickedEditHandle.type === 'intermediate') {
        const updatedData = this.getImmutableFeatureCollection()
          .addPosition(
            clickedEditHandle.featureIndex,
            clickedEditHandle.positionIndexes,
            clickedEditHandle.position
          )
          .getObject();

        if (updatedData) {
          editAction = {
            updatedData,
            editType: 'addPosition',
            featureIndexes: [clickedEditHandle.featureIndex],
            editContext: {
              positionIndexes: clickedEditHandle.positionIndexes,
              position: clickedEditHandle.position
            }
          };
        }
      }
    }
    return editAction;
  }

  handlePointerMove(
    event: PointerMoveEvent
  ): { editAction: ?FeatureCollectionEditAction, cancelMapPan: boolean } {
    this._lastPointerMovePicks = event.picks;

    let editAction: ?FeatureCollectionEditAction = null;

    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (event.isDragging && editHandle) {
      const updatedData = this.getImmutableFeatureCollection()
        .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'movePosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords
        }
      };
    }

    // Cancel map panning if pointer went down on an edit handle
    const cancelMapPan = Boolean(editHandle);

    if (cancelMapPan) {
      // TODO: find a less hacky way to prevent map panning
      // Stop propagation to prevent map panning while dragging an edit handle
      event.sourceEvent.stopPropagation();
    }

    if (event.picks && event.picks.length > 0) {
      const handlePicked = event.picks.some(pick => pick.isEditingHandle);
      if (handlePicked) {
        this.onUpdateCursor('cell');
      }
    } else {
      this.onUpdateCursor(event.isDragging ? 'grabbing' : 'grab');
    }

    return { editAction, cancelMapPan };
  }

  handleStartDragging(event: StartDraggingEvent): ?FeatureCollectionEditAction {
    let editAction: ?FeatureCollectionEditAction = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();

    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle && editHandle.type === 'intermediate') {
      const updatedData = this.getImmutableFeatureCollection()
        .addPosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'addPosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords
        }
      };
    }

    return editAction;
  }

  handleStopDragging(event: StopDraggingEvent): ?FeatureCollectionEditAction {
    let editAction: ?FeatureCollectionEditAction = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const updatedData = this.getImmutableFeatureCollection()
        .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'finishMovePosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords
        }
      };
    }

    return editAction;
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    const picks = this._lastPointerMovePicks;

    if (picks && picks.length > 0) {
      const handlePicked = picks.some(pick => pick.isEditingHandle);
      if (handlePicked) {
        return 'cell';
      }
    }

    return isDragging ? 'grabbing' : 'grab';
  }
}
