import { deepmerge } from 'deepmerge-ts';
import {
  graphCommonOptions,
  graphCommonDatasetOptions,
} from './graphCommon.js';

export const type = 'graph';

export const options = (ctx) => {
  // return {};
  return deepmerge(graphCommonOptions(ctx), {});
};

export const datasetOptions = (ctx, index) => {
  // return {};
  return deepmerge(graphCommonDatasetOptions(ctx, index), {});
};
