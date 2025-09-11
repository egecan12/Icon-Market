/**
 * Redux store type definitions
 * Contains root state interface and store-related types
 */

import { IconsState } from './icon';
import { ErrorState } from './error';

export interface RootState {
  icons: IconsState;
  error: ErrorState;
}
