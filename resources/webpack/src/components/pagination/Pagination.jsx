import React, { PropTypes } from 'react'

import PageLink from './components/PageLink.jsx'

class Pagination extends React.Component {
  onClick = (page) => {
    if (page > 0) {
      this.props.onChange(page)
    }
  }
  getInterval = () => {
    const { currentPage, displayedPages, pages } = this.props
    const halfDisplayed = Math.floor(displayedPages / 2)
    return {
      start: Math.ceil(currentPage > halfDisplayed ?
        Math.max(Math.min(currentPage - halfDisplayed, (pages - displayedPages)), 1) : 1),
      end: Math.ceil(currentPage > halfDisplayed ?
        Math.min(currentPage + halfDisplayed, pages) : Math.min(displayedPages, pages)),
    }
  }
  renderStart = (edges, start, currentPage) => {
    const end = Math.min(edges, start)
    const starts = []
    if (start > edges) {
      for (let i = 1; i <= end; i++) {
        starts.push(<PageLink key={i} onClick={this.onClick} page={i} currentPage={currentPage} />)
      }
    }
    if (start - end === 2) {
      starts.push(<PageLink
        key={end + 1}
        onClick={this.onClick}
        page={end + 1}
        currentPage={currentPage}
      />)
    }
    if (start - end > 2) {
      starts.push(<PageLink key="a" onClick={this.onClick} page={0} currentPage={currentPage} />)
    }
    return starts
  }
  renderInterval = (start, end, currentPage) => {
    const intervals = []
    for (let i = start; i <= end; i++) {
      intervals.push(<PageLink key={i} onClick={this.onClick} page={i} currentPage={currentPage} />)
    }
    return intervals
  }
  renderEnd = (edges, end, pages, currentPage) => {
    const ends = []
    const begin = Math.max(end + 1, pages - edges + 1)
    if (begin - end === 2) {
      ends.push(
        <PageLink
          key={begin - 1}
          onClick={this.onClick}
          page={begin - 1}
          currentPage={currentPage}
        />
      )
    }
    if (begin - end > 2) {
      ends.push(<PageLink key="b" onClick={this.onClick} page={0} currentPage={currentPage} />)
    }
    for (let i = begin; i <= pages; i++) {
      ends.push(<PageLink key={i} onClick={this.onClick} page={i} currentPage={currentPage} />)
    }
    return ends
  }
  render() {
    const { pages, edges, currentPage, style, className } = this.props
    const { start, end } = this.getInterval()
    return (
      <ul style={style} className={className}>
        {this.renderStart(edges, start, currentPage)}
        {this.renderInterval(start, end, currentPage)}
        {this.renderEnd(edges, end, pages, currentPage)}
      </ul>
    )
  }
}
Pagination.defaultProps = {
  pages: 1,
  edges: 1,
  displayedPages: 6,
  currentPage: 1,
  onChange: () => {},
}
Pagination.propTypes = {
  pages: PropTypes.number.isRequired,
  edges: PropTypes.number,
  displayedPages: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}
export default Pagination
