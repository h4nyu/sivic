import { Row, Sql } from "postgres";
import { first, keyBy } from "lodash";

import { ErrorKind } from '@sivic/core'
import { Box as CharBox } from "@charpoints/core/box"
import { Point } from "@charpoints/core/point"
import { TransformStore } from "@sivic/core";
import { RootApi as ImageApi } from "@charpoints/api"

export const Store = (
  imageApi: ImageApi,
  sql: Sql<any>,
): TransformStore => {
  const crop = async (payload:{data:string, box:CharBox}): Promise<string | Error> => {
    try{
      let image = await imageApi.transform.crop({imageData:payload.data, box:payload.box})
      if(image instanceof Error) { return image }
      return image
    }catch(e) {
      return e
    }
  };

  return {
    crop,
  };
};
