import React from 'react'

import styles from './ColoredAndTexture.scss'

import ColoredTriangle from './components/ColoredTriangle/ColoredTriangle.jsx'
import TextureQuad from './components/TextureQuad/TextureQuad.jsx'
import MultiTexture from './components/MultiTexture/MultiTexture.jsx'

function Transform() {
  return (
    <div className={styles.transform}>
      <ColoredTriangle />
      <TextureQuad />
      <MultiTexture />
    </div>
  )
}
module.exports = Transform
