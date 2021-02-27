import React from "react";
import Progress from "../components/Progress";
import { Observer } from "mobx-react-lite";
import store from "../store";

export default function Loading() {
  const { loadingStore } = store;
  return (
    <Observer>{() => <Progress isActive={loadingStore.state.isActive} />}</Observer>
  );
}
