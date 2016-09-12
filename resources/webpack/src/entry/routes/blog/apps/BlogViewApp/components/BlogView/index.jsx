import React from 'react'
import marked from 'Marked'
import R from 'R'
import { Connector } from 'react-store-set'
import BlogViewView from './BlogView'

export default function () {
  return (
    <Connector
      component={BlogViewView}
      connects={{
        BlogView: ['id', 'title', 'content', 'author', 'updateDate', 'viewTimes', 'commentSize'],
        Auth: ['id'],
      }}
      setProps={({ BlogView, Auth, DelBlogModal }) => ({
        id: BlogView.state.id,
        title: BlogView.state.title,
        html: marked(BlogView.state.content),
        authorName: BlogView.state.author.username,
        authorIcon: BlogView.state.author.headerIcon,
        viewTimes: BlogView.state.viewTimes,
        commentSize: BlogView.state.commentSize,
        time: BlogView.state.updateDate,
        isOwner: Auth.state.id === BlogView.state.author.id && !! Auth.state.id,
        onEdit: () => R.BlogEdit.go({ blogId: BlogView.state.id }),
        onDel: DelBlogModal.actions.onDelBlog,
      })}
    />
  )
}
