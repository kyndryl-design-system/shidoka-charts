import { deepmerge } from 'deepmerge-ts';
import {
  graphCommonOptions,
  graphCommonDatasetOptions,
} from './graphCommon.js';

export const type = 'dendrogram';

export const options = (ctx) => {
  return deepmerge(graphCommonOptions(ctx), {});
};

export const datasetOptions = (ctx, index) => {
  return deepmerge(graphCommonDatasetOptions(ctx, index), {});
};
