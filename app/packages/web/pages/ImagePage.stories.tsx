import React from "react";
import ImagePage from "./ImagePage";
import { Router, Switch, Route } from "react-router-dom";
import { createHashHistory } from "history";
import { Image } from "@sivic/core/image";
import store from "@sivic/web/store"
import annot from "/srv/data/annto.json";

const history = createHashHistory();

const { imageData } = annot;
export default {
  title: "pages/ImagePage",
  component: ImagePage,
  decorators: [(Story) => (
    <Router history={history}>
      <div style={{height: 500}}>
        <Story/>
      </div>
    </Router>

  )]
};

store.imageProcess.image = Image({data: imageData})
export const Primary = (args) => <ImagePage /> 
