import React, {FC} from 'react'
import {flowMax, addDisplayName} from 'ad-hok'

import Portal from 'components/Portal'

const NON_SVG_PORTAL_HOST_ID = 'non-svg-portal-host'

export const NonSvgPortalHost: FC = flowMax(
  addDisplayName('NonSvgPortalHost'),
  () => <div id={NON_SVG_PORTAL_HOST_ID} />,
)

export const NonSvgPortal: FC = flowMax(
  addDisplayName('NonSvgPortal'),
  ({children}) => <Portal to={NON_SVG_PORTAL_HOST_ID}>{children}</Portal>,
)
