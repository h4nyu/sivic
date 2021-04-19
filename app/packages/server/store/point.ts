import { Row, Sql } from "postgres";
import { Box } from "@charpoints/core/box";
import { PointStore } from "@sivic/core";
import { RootApi as ImageApi } from "@charpoints/api"

export const Store = (
  imageApi: ImageApi,
  sql: Sql<any>
): PointStore => {
  const filter = async (payload: {
    imageId?: string;
  }) => {
    return await imageApi.point.filter(payload)
  };

  return {
    filter,
  };
};
