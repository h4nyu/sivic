import React from "react";
import { observer } from "mobx-react-lite";
import store from "../store";
import _Loading from "@sivic/web/components/Loading"

export const Loading = observer(() => {
  return <_Loading />
})
export default Loading

