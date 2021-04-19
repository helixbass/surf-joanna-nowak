import {FC} from 'react'
import {flowMax, addDisplayName} from 'ad-hok'

interface PanoramaProps {
  isShowing: boolean
}

const Panorama: FC<PanoramaProps> = flowMax(
  addDisplayName('Panorama'),
  () => null,
)

export default Panorama
