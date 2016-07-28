import React from 'react'

import styles from './Transform.scss'

import Translate from './components/Translate/Translate'
import Rotate from './components/Rotate/Rotate'
import Scale from './components/Scale/Scale'
import RotateTranslate from './components/RotateTranslate/RotateTranslate'
import Rotating from './components/Rotating/Rotating'

class Transform extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className={styles.transform}>
                <Translate/>
                <Rotate/>
                <Scale/>
                <RotateTranslate/>
                <Rotating/>
            </div>
        )
    }
}
module.exports = Transform
