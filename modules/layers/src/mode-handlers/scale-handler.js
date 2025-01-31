// @flow

import turfCentroid from '@turf/centroid';
import turfDistance from '@turf/distance';
import turfTransformScale from '@turf/transform-scale';
import type { FeatureCollection, Position } from '@nebula.gl/edit-modes';
import type { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types.js';
import type { EditAction } from './mode-handler.js';
import { ModeHandler } from './mode-handler.js';

export class ScaleHandler extends ModeHandler {
  _isScalable: boolean;
  _geometryBeingScaled: ?FeatureCollection;

  handlePointerMove(event: PointerMoveEvent): { editAction: ?EditAction, cancelMapPan: boolean } {
    let editAction: ?EditAction = null;

    this._isScalable = Boolean(this._geometryBeingScaled) || this.isSelectionPicked(event.picks);

    if (!this._isScalable || !event.pointerDownGroundCoords) {
      // Nothing to do
      return { editAction: null, cancelMapPan: false };
    }

    if (event.isDragging && this._geometryBeingScaled) {
      // Scale the geometry
      editAction = this.getScaleAction(
        event.pointerDownGroundCoords,
        event.groundCoords,
        'scaling'
      );
    }

    return { editAction, cancelMapPan: true };
  }

  handleStartDragging(event: StartDraggingEvent): ?EditAction {
    if (!this._isScalable) {
      return null;
    }

    this._geometryBeingScaled = this.getSelectedFeaturesAsFeatureCollection();
    return null;
  }

  handleStopDragging(event: StopDraggingEvent): ?EditAction {
    let editAction: ?EditAction = null;

    if (this._geometryBeingScaled) {
      // Scale the geometry
      editAction = this.getScaleAction(event.pointerDownGroundCoords, event.groundCoords, 'scaled');
      this._geometryBeingScaled = null;
    }

    return editAction;
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    if (this._isScalable) {
      // TODO: look at doing SVG cursors to get a better "scale" cursor
      return 'move';
    }
    return isDragging ? 'grabbing' : 'grab';
  }

  getScaleAction(startDragPoint: Position, currentPoint: Position, editType: string): EditAction {
    const startPosition = startDragPoint;
    const centroid = turfCentroid(this._geometryBeingScaled);
    const factor = getScaleFactor(centroid, startPosition, currentPoint);
    const scaledFeatures = turfTransformScale(this._geometryBeingScaled, factor, {
      origin: centroid
    });

    let updatedData = this.getImmutableFeatureCollection();

    const selectedIndexes = this.getSelectedFeatureIndexes();
    for (let i = 0; i < selectedIndexes.length; i++) {
      const selectedIndex = selectedIndexes[i];
      const movedFeature = scaledFeatures.features[i];
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

function getScaleFactor(centroid: Position, startDragPoint: Position, currentPoint: Position) {
  const startDistance = turfDistance(centroid, startDragPoint);
  const endDistance = turfDistance(centroid, currentPoint);
  return endDistance / startDistance;
}
