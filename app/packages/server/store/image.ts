import { Row, Sql } from "postgres";
import { first } from "lodash";

import { Image } from "@sivic/core/image";
import { ImageStore } from "@sivic/core";
import { RootApi as ImageApi } from "@charpoints/api"

export const Store = (
  imageApi: ImageApi
): ImageStore => {
  // const to = (r: Row): Image => {
  //   return {
  //   };
  // };

  // const from = (r: Image): Row => {
  //   return {
  //     id: r.id,
  //     name: r.name,
  //     created_at: r.createdAt,
  //   };
  // };

  const find = async (payload: {
    id?: string;
  }): Promise<Image | Error> => {
    return new Error("NotImplemented")
  };
  const insert = async (payload:Image): Promise<void | Error> => {
  };

  const update = async (payload:Image): Promise<void | Error> => {
  };

  const delete_ = async (payload:{id:string}): Promise<void | Error> => {
  };
  return {
    find,
    insert,
    update,
    delete: delete_,
  };
};
