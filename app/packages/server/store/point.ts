import { Row, Sql } from "postgres";
import { Point } from "@charpoints/core/point";
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

  const replace = async (payload: {imageId: string, points: Point[]}) => {
    return await imageApi.point.annotate({imageId: payload.imageId, points: payload.points})
  };

  return {
    filter,
    replace,
  };
};
