import { Row, Sql } from "postgres";
import { Box } from "@charpoints/core/box";
import { BoxStore } from "@sivic/core";
import { RootApi as ImageApi } from "@charpoints/api"

export const Store = (
  imageApi: ImageApi,
  sql: Sql<any>
): BoxStore => {
  const filter = async (payload: {
    imageId: string;
  }) => {
    try {
      const boxes = await imageApi.box.filter({imageId:payload.imageId})
      return boxes;
    } catch (err) {
      return err;
    }
  };

  const replace = async (payload: {imageId: string, boxes: Box[]}) => {
    try {
      await imageApi.box.annotate({imageId: payload.imageId, boxes: payload.boxes})
    } catch (err) {
      return err;
    }
  };

  return {
    filter,
    replace,
  };
};
