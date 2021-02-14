import { Store, DetectedBoxesFn, ErrorKind } from "@sivic/core"
import { Image as CharImage } from "@charpoints/core/image"
import { Box as CharBox } from "@charpoints/core/box"

export type ImageTag = "Source" | "Target"

export type Image = CharImage & {
  tag: ImageTag
}

export type DetectCharBoxFn = (payload: {imageId: string}) => Promise<CharBox[]|Error>

const DetectCharBox = (args:{
  store: Store,
  detectBoxes: DetectedBoxesFn
}):DetectCharBoxFn => {
  const { store, detectBoxes } = args
  return async (payload: {imageId:string}) => {
    const image = await store.image.find({id: payload.imageId })
    if(image instanceof Error) { return image }
    if(image.data === undefined) { return new Error(ErrorKind.ImageNotFound) }
    const detectRes = await detectBoxes({data: image.data})
    if(detectRes instanceof Error) { return detectRes }
    const [boxes, data] = detectRes
    image.data = data
    let updateErr = await store.image.update(image)
    if(updateErr instanceof Error) { return updateErr }
    return boxes.map( x => {
      return {...x, imageId: image.id}
    })
  }
}
