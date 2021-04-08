import { Row, Sql } from "postgres";
import { Box } from "@charpoints/core/box";
import { BoxStore } from "@sivic/core";
import { RootApi as ImageApi } from "@charpoints/api"

export const Store = (
  imageApi: ImageApi,
  sql: Sql<any>
): BoxStore => {
  const filter = async (payload: {
    imageId?: string;
  }) => {
    return await imageApi.box.filter(payload)
  };

  const replace = async (payload: {imageId: string, boxes: Box[]}) => {
    console.log(payload)
    return await imageApi.box.annotate({imageId: payload.imageId, boxes: payload.boxes})
  };

  return {
    filter,
    replace,
  };
};
