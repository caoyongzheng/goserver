import 'github-markdown-css'
import marked from 'marked'

export default (value = '') => marked(value)
