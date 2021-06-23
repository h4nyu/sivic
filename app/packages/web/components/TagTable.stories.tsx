import React from "react";
import TagTable from "./TagTable";
import { Tag } from "@sivic/core/tag"
import { Image } from "@sivic/core/image"
import annot from "/srv/data/annto.json";
import { File } from "@sivic/core/file"


export default {
  title: "TagTable",
  component: TagTable,
};
const tags = [
  Tag({
    id: "t0",
    name: "あ"
  }),
  Tag({
    id: "t1",
    name: "い"
  }),
  Tag({
    id: "t2",
    name: "う"
  }),
]

const files = [
  File({
    id: "f0",
    data: annot.imageData,
  })
]
const images = [
  Image({
    id: "i0",
    name: "aaaa.png"
  }),
  Image({
    id: "i1",
    name: "bbb.jpg"
  }),
  Image({
    id: "c1",
    name: "croped-0",
    parentId: "i0",
    tagId:  "t2",
    fileId: "f0",
  }),
  Image({
    id: "c2",
    name: "croped-0",
    parentId: "i0",
    tagId:  "t2",
    fileId: "f0",
  }),
  Image({
    id: "c3",
    name: "croped-0",
    parentId: "i1",
    tagId:  "t0",
    fileId: "f0",
  }),
]
export const Primary = (args) => <TagTable 
  tags={tags}
  images={images}
  files={files}
/> 
