import React from "react"
import { Tag } from "@sivic/core/tag"
import { Image } from "@sivic/core/image"
import { File } from "@sivic/core/file"

const centerStyle = {
  display: "grid",
  alignItems: "center",
  justifyContent: "center",
}

export const TagTable = (props: {
  tags?: Tag[],
  images?: Image[],
  files?: File[],
  onImageClick?: (imageId:string) => void,
  onTagClick?:(tagId:string) => void
}) => {
  const tags = props.tags || []
  const images = props.images || []
  const parentImages = images.filter(x => x.parentId === undefined)
  const cropedImages = images.filter(x => x.parentId !== undefined)
  const files = props.files || []
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `auto repeat(${tags.length}, 1fr)`,
      }}
    >
      <div
        className="card"
        style={centerStyle}
      >
        <div className="button"> + tag </div>
      </div>
      {
        tags.map((t, i) => {
          return (
            <div
              className="card p-1 has-text-weight-semibold"
              key={t.id}
              style={{
                ...centerStyle,
                gridRow: 1,
                gridColumn: i + 2,
              }}
            >
              <a
                onClick={() => props.onTagClick && props.onTagClick(t.id)}
              > { t.name } 
              </a>
            </div>
          )
        })
      }
      {
        parentImages.map((p, rowIdx) => {
          return (
            <div
              key={p.id}
            >
              <div
                className="card p-1 has-text-weight-semibold"
                style={{
                  ...centerStyle,
                  gridRow: rowIdx + 2,
                  gridColumn: 1,
                }}
              >
                <a onClick={() => props.onImageClick && props.onImageClick(p.id)}> 
                  { p.name } 
                </a>
              </div>
              {
                tags.map((t, colIdx) => {
                  const cropedImages = images.filter(i => i.parentId === p.id && i.tagId === t.id)
                  return (
                    <div
                      className="card"
                      key={t.id}
                      style={{
                        gridRow: rowIdx + 2,
                        gridColumn: colIdx + 2,
                      }}
                    >
                      {
                        cropedImages.map(c => {
                          const file = files.find(x => x.id === c.fileId)
                          return(
                            file && <img 
                              src={`data:image;base64,${file.data}`}
                            /> 
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  )
}
export default TagTable
