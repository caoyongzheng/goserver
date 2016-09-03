import React from 'react'
import BlogView from './BlogView'
import marked from 'Marked'
import R from 'R'
import { Connector, globalAppStores } from 'react-appstores'

export default function () {
  return (
    <Connector
      component={BlogView}
      connects={{
        BlogView: ['id', 'title', 'content', 'author', 'updateDate', 'viewTimes', 'commentSize'],
        Auth: ['id'],
      }}
      setProps={({
        BlogView: { id, title, content, author, updateDate, viewTimes, commentSize }, Auth,
      }) => ({
        id,
        title,
        html: marked(content),
        authorName: author.username,
        authorIcon: author.headerIcon,
        viewTimes,
        commentSize,
        time: updateDate,
        isOwner: Auth.id === author.id && !! Auth.id,
        onEdit: () => R.BlogEdit.go({ blogId: id }),
        onDel: globalAppStores.actions.DelBlogModal.onDelBlog,
      })}
    />
  )
}
