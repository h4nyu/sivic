import { observable, computed } from "mobx";
import { Point } from "@charpoints/core/point";
import { Map, List } from "immutable";
import { Images } from ".";
import { ToastStore } from "./toast";
import { LoadingStore } from "./loading";
import { RootApi } from "@sivic/api";
import {
  FilterPayload,
} from "@sivic/core/point";
import { saveAs } from 'file-saver';
import { keyBy } from "lodash";

export type PointStore = {
  points: Map<string, Point>;
  fetch: (payload: FilterPayload) => Promise<void>
};

export const PointStore = (args: {
  api: RootApi;
}): PointStore => {
  const { api } = args;
  const fetch = async (payload:FilterPayload) => {
    const points = await api.point.filter(payload)
    if(points instanceof Error) { return }
    self.points = self.points.merge(Map(keyBy(points, x => x.id)))
  }
  const self = observable({
    points: Map<string, Point>(),
    fetch,
  })
  return self
}

export default PointStore 
