import React from "react";
import Loading from "./Loading";

export default {
  title: "Loading",
  component: Loading,
};

export const Primary = (args) =>( 
  <div>
    <Loading {...args}/> 
    <span> aaa </span>
  </div>
)
