// @flow

import turfCentroid from '@turf/centroid';
import turfBearing from '@turf/bearing';
import turfTransformRotate from '@turf/transform-rotate';
import type { FeatureCollection, Position } from '@nebula.gl/edit-modes';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class RotateHandler extends ModeHandler {
  _isRotatable: boolean;
  _geometryBeingRotated: ?FeatureCollection;

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    let editAction: ?EditAction = null;

    this._isRotatable = Boolean(this._geometryBeingRotated) || this.isSelectionPicked(event.picks);

    if (!this._isRotatable || !event.pointerDownGroundCoords) {
      // Nothing to do
      return { editAction: null, cancelMapPan: false };
    }

    if (event.isDragging && this._geometryBeingRotated) {
      // Rotate the geometry
      editAction = this.getRotateAction(
        event.pointerDownGroundCoords,
        event.groundCoords,
        'rotating'
      );
    }

    return { editAction, cancelMapPan: true };
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    if (!this._isRotatable) {
      return null;
    }

    this._geometryBeingRotated = this.getSelectedFeaturesAsFeatureCollection();
    return null;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    if (this._geometryBeingRotated) {
      // Rotate the geometry
      editAction = this.getRotateAction(
        event.pointerDownGroundCoords,
        event.groundCoords,
        'rotated'
      );
      this._geometryBeingRotated = null;
    }

    return editAction;
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    if (this._isRotatable) {
      // TODO: look at doing SVG cursors to get a better "rotate" cursor
      return 'move';
    }
    return isDragging ? 'grabbing' : 'grab';
  }

  getRotateAction(startDragPoint: Position, currentPoint: Position, editType: string): EditAction {
    const startPosition = startDragPoint;
    const centroid = turfCentroid(this._geometryBeingRotated);
    const angle = getRotationAngle(centroid, startPosition, currentPoint);

    const rotatedFeatures = turfTransformRotate(this._geometryBeingRotated, angle);

    let updatedData = this.getImmutableFeatureCollection();

    const selectedIndexes = this.getSelectedFeatureIndexes();
    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = rotatedFeatures.features[i];
      updatedData = updatedData.replaceGeometry(selectedIndex, movedFeature.geometry);
    }

    return {
      updatedData: updatedData.getObject(),
      editType,
      featureIndexes: selectedIndexes,
      editContext: null
    };
  }
}

function getRotationAngle(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const bearing1 = turfBearing(centroid, startDragPoint);
  const bearing2 = turfBearing(centroid, currentPoint);
  return bearing2 - bearing1;
}
