import React, {FC} from 'react'

import {sharedStyles} from 'utils/style'

const CenteredContainer: FC = ({children}) => (
  <div css={sharedStyles.centeredContainer}>{children}</div>
)

export default CenteredContainer
