import React, { Component } from 'react'
import Button from 'Button'
import { withRouter } from 'react-router'
import R from 'R'
import css from './Novels.scss'

class Novels extends Component {
  state = {
    novels: [],
  }
  addBook = () => {
    this.props.router.push(R.myaddnovel)
  }
  render() {
    const { novels } = this.state
    return (
      <div>
        <div className={css.controlPanel}>
          <Button onClick={this.addBook}>
            {'新增'}
          </Button>
        </div>
        <div className={css.novelList}>
          {
            novels.map((n, i) => (
              <div key={i} className={css.novel}>
                <div className={css.rowCell}>
                  {n.name}
                </div>
                <div className={css.rowCell}>{n.author}</div>
                <Button>
                  {'修改'}
                </Button>
                <Button>
                  {'删除'}
                </Button>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

module.exports = withRouter(Novels)
