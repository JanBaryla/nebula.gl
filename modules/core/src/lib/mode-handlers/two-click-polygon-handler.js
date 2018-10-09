// @flow

import type { Polygon } from '../../geojson-types.js';
import type { ClickEvent } from '../event-types.js';
import { ModeHandler } from './mode-handler.js';
import type { EditAction } from './mode-handler.js';

export class TwoClickPolygonHandler extends ModeHandler {
  handleClick(event: ClickEvent): ?EditAction {
    super.handleClick(event);

    const tentativeFeature = this.getTentativeFeature();
    const clickSequence = this.getClickSequence();

    if (
      clickSequence.length > 1 &&
      tentativeFeature &&
      tentativeFeature.geometry.type === 'Polygon'
    ) {
      const geometry: Polygon = tentativeFeature.geometry;
      this.resetClickSequence();

      const updatedData = this.getImmutableFeatureCollection()
        .addFeature({
          type: 'Feature',
          properties: {},
          geometry
        })
        .getObject();

      return {
        updatedData,
        editType: 'addFeature',
        featureIndex: updatedData.features.length - 1,
        positionIndexes: null,
        position: null
      };
    }

    return null;
  }
}
