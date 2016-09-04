import React, { PropTypes } from 'react'
import _ from 'lodash'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'

function isSelected(selectedRows, row) {
  return _.findIndex(selectedRows, (r) => r === row) !== -1
}

function DataTable({ data, rowKey, cols, selectedRows, onRowSelection, offset }) {
  return (
    <Table onRowSelection={onRowSelection}>
      <TableHeader>
        <TableRow>
          <TableHeaderColumn key={0}>{'#'}</TableHeaderColumn>
          {
            _.map(cols, (c, i) => (
              <TableHeaderColumn key={i + 1}>{c.title}</TableHeaderColumn>
            ))
          }
        </TableRow>
      </TableHeader>
      <TableBody deselectOnClickaway={false}>
        {
          _.map(data, (d, i) => (
            <TableRow key={d[rowKey]} selected={isSelected(selectedRows, d[rowKey])}>
              <TableRowColumn key={0}>{offset + i + 1}</TableRowColumn>
              {
                _.map(cols, (c) => (
                  <TableRowColumn key={c.name}>{d[c.name]}</TableRowColumn>
                ))
              }
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}
DataTable.defaultProps = {
  offset: 0,
}
DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  rowKey: PropTypes.string.isRequired,
  cols: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.string),
  offset: PropTypes.number,
  onRowSelection: PropTypes.func,
}

export default DataTable
