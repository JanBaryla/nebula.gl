// @flow
/* istanbul ignore file */

import type {
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  ModeProps
} from '../types.js';

export interface EditMode<TData, TGuides> {
  // Called when the pointer went down and up without dragging regardless of whether something was picked
  handleClick(event: ClickEvent, props: ModeProps<TData>): void;

  // Called when the pointer moved, regardless of whether the pointer is down, up, and whether something was picked
  handlePointerMove(event: PointerMoveEvent, props: ModeProps<TData>): void;

  // Called when the pointer went down on something rendered by this layer and the pointer started to move
  handleStartDragging(event: StartDraggingEvent, props: ModeProps<TData>): void;

  // Called when the pointer went down on something rendered by this layer, the pointer moved, and now the pointer is up
  handleStopDragging(event: StopDraggingEvent, props: ModeProps<TData>): void;

  // Return features that can be used as a guide for editing the data
  getGuides(props: ModeProps<TData>): TGuides;
}

export function doNothing() {
  return null;
}
