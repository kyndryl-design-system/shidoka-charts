import { deepmerge } from 'deepmerge-ts';
import {
  graphCommonOptions,
  graphCommonDatasetOptions,
} from './graphCommon.js';

export const type = 'tree';

export const options = (ctx) => {
  return deepmerge(graphCommonOptions(ctx), {
    edgeLineBorderWidth: (ctx) => {
      return ctx.dataIndex;
    },
  });
};

export const datasetOptions = (ctx, index) => {
  return deepmerge(graphCommonDatasetOptions(ctx, index), {});
};
