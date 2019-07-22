import { camelCase, last, orderBy } from 'lodash';
import { ISchemaV2 } from './schema/types';
import { IApiOperation, IOperationParam } from './tempTypes';
import { getBestResponse } from '../tools/util';
import { getTSParamType } from '../gen/js/support';
import { getParamName } from '../gen/js/genOperations';

export class OperationConverter {
  constructor(private schema: ISchemaV2) {}

  convert(operations: ApiOperation[]): IApiOperation[] {
    const ops = fixDuplicateOperations(operations);

    return ops.map((op) => {
      const response = getBestResponse(op);
      const respType = getTSParamType(response, true);

      return {
        returnType: respType,
        method: op.method.toUpperCase(),
        name: getOperationName(op.id, op.group),
        url: op.path,
        parameters: getParams(op.parameters),
        query: getParams(op.parameters, ['query']),
        pathParams: getParams(op.parameters, ['path']),
        body: last(getParams(op.parameters, ['body'])),
        headers: getParams(op.parameters, ['header']),
      };
    });
  }
}

/**
 * We will add numbers to the duplicated operation names to avoid breaking code
 * @param operations
 */
function fixDuplicateOperations(operations: ApiOperation[]): ApiOperation[] {
  if (!operations || operations.length < 2) {
    return operations;
  }

  const results = orderBy(operations, (o) => o.id);

  let inc = 0;
  let prevOpId = results[0].id;
  for (let i = 1; i < results.length; i++) {
    if (results[i].id === prevOpId) {
      results[i].id += (++inc).toString();
    } else {
      inc = 0;
      prevOpId = results[i].id;
    }
  }

  return results;
}

function getOperationName(opId: string, group?: string) {
  if (!group) {
    return opId;
  }

  return camelCase(opId.replace(group + '_', ''));
}

function getParams(params: ApiOperationParam[], where?: string[]): IOperationParam[] {
  if (!params || params.length < 1) {
    return [];
  }

  return params
    .filter((p) => !where || where.indexOf(p.in) > -1)
    .map((p) => ({
      originalName: p.name,
      name: getParamName(p.name),
      type: getTSParamType(p, true),
      optional: !p.required,
    }));
}
