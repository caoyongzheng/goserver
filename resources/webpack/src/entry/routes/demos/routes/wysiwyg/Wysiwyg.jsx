import React, { Component } from 'react'
import './lib/wysiwyg-editor.css'
import './Wysiwyg.css'
import './lib/wysiwyg.js'
import './lib/wysiwyg-editor.js'
import smilies from './smiley/index.jsx'
import _ from 'lodash'

class Wysiwyg extends Component {
  componentDidMount() {
    const elem = '#editor'
    $(elem).wysiwyg({
      class: 'fake-bootstrap',
      toolbar: 'top-selection',
      buttons: {
        dummybutton1: false,
        dummybutton2: false,
        smilies: {
          title: 'Smilies',
          image: '\uf118',
          popup($popup, $button) {
            const listSmilies = _.map(smilies,
              (s) => `<img src=${s} width="16" height="16" alt="" />`)
            const $smilies = $('<div/>').addClass('wysiwyg-plugin-smilies')
                                      .attr('unselectable', 'on')
            $.each(listSmilies, (i, smiley) => {
              const $image = $(smiley).attr('unselectable', 'on')
              // Append smiley
              const imagehtml = ` ${$('<div/>').append($image.clone()).html()} `
              $image
                .css({ cursor: 'pointer' })
                .click((e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  $(elem).wysiwyg('shell').insertHTML(imagehtml)
                }).appendTo($smilies)
            })
            const $container = $(elem).wysiwyg('container')
            $smilies.css({ maxWidth: `${parseInt($container.width() * 0.95, 10)}px` })
            $popup.append($smilies)
            const $toolbar = $button.parents('.wysiwyg-toolbar')
            if (!$toolbar.length) {
              return null
            }
            return {
              left: parseInt(($toolbar.outerWidth() - $popup.outerWidth()) / 2, 10),
              top: parseInt($button.outerHeight() / 4, 10) - $popup.height(),
            }
          },
          showselection: false,
        },
        insertimage: {
          title: 'Insert image',
          image: '\uf030',
          showselection: false,
        },
        insertlink: {
          title: 'Insert link',
          image: '\uf08e',
        },
        fontname: {
          title: 'Font',
          image: '\uf031',
          popup($popup) {
            const listFontnames = {
              'Arial, Helvetica': 'Arial,Helvetica',
              Verdana: 'Verdana,Geneva',
              Georgia: 'Georgia',
              'Courier New': 'Courier New,Courier',
              'Times New Roman': 'Times New Roman,Times',
            }
            const $list = $('<div/>').addClass('wysiwyg-plugin-list')
                                   .attr('unselectable', 'on')
            $.each(listFontnames, (name, font) => {
              const $link = $('<a/>').attr('href', '#')
                .css('font-family', font)
                .html(name)
                .click((event) => {
                  $(elem).wysiwyg('shell').fontName(font)
                  .closePopup()
                  event.stopPropagation()
                  event.preventDefault()
                  return false
                })
              $list.append($link)
            })
            $popup.append($list)
          },
          showselection: true,
        },
        // Fontsize plugin
        fontsize: {
          title: 'Size',
          image: '\uf034',
          popup($popup) {
            const listFontsizes = []
            for (let i = 8; i <= 11; ++i) {
              listFontsizes.push()
            }
            for (let i = 12; i <= 28; i += 2) {
              listFontsizes.push(`${i}px`)
              listFontsizes.push('36px')
              listFontsizes.push('48px')
              listFontsizes.push('72px')
            }

            const $list = $('<div/>').addClass('wysiwyg-plugin-list')
                                   .attr('unselectable', 'on')
            $.each(listFontsizes, (index, size) => {
              const $link = $('<a/>').attr('href', '#')
                .html(size)
                .click((event) => {
                  $(elem).wysiwyg('shell').fontSize(7)
                  .closePopup()
                  $(elem).wysiwyg('container')
                    .find('font[size=7]')
                    .removeAttr('size')
                    .css('font-size', size)
                  event.stopPropagation()
                  event.preventDefault()
                  return false
                })
              $list.append($link)
            })
            $popup.append($list)
          },
        },
        header: {
          title: 'Header',
          image: '\uf1dc',
          popup($popup) {
            const listHeaders = {
              // Name : Font
              'Header 1': '<h1>',
              'Header 2': '<h2>',
              'Header 3': '<h3>',
              'Header 4': '<h4>',
              'Header 5': '<h5>',
              'Header 6': '<h6>',
              Code: '<pre>',
            }
            const $list = $('<div/>').addClass('wysiwyg-plugin-list')
                                   .attr('unselectable', 'on')
            $.each(listHeaders, (name, format) => {
              const $link = $('<a/>').attr('href', '#')
                .css('font-family', format)
                .html(name)
                .click((event) => {
                  $(elem).wysiwyg('shell').format(format)
                  .closePopup()
                  event.stopPropagation()
                  event.preventDefault()
                  return false
                })
              $list.append($link)
            })
            $popup.append($list)
          },
        },
        bold: {
          title: 'Bold (Ctrl+B)',
          image: '\uf032',
          hotkey: 'b',
        },
        italic: {
          title: 'Italic (Ctrl+I)',
          image: '\uf033',
          hotkey: 'i',
        },
        underline: {
          title: 'Underline (Ctrl+U)',
          image: '\uf0cd',
          hotkey: 'u',
        },
        strikethrough: {
          title: 'Strikethrough (Ctrl+S)',
          image: '\uf0cc',
          hotkey: 's',
        },
        forecolor: {
          title: 'Text color',
          image: '\uf1fc',
        },
        highlight: {
          title: 'Background color',
          image: '\uf043',
        },
        alignleft: {
          title: 'Left',
          image: '\uf036',
          showselection: false,
        },
        aligncenter: {
          title: 'Center',
          image: '\uf037',
          showselection: false,
        },
        alignright: {
          title: 'Right',
          image: '\uf038',
          showselection: false,
        },
        alignjustify: {
          title: 'Justify',
          image: '\uf039',
          showselection: false,
        },
        subscript: {
          title: 'Subscript',
          image: '\uf12c',
          showselection: true,
        },
        superscript: {
          title: 'Superscript',
          image: '\uf12b',
          showselection: true,
        },
        indent: {
          title: 'Indent',
          image: '\uf03c',
          showselection: false,
        },
        outdent: {
          title: 'Outdent',
          image: '\uf03b',
          showselection: false,
        },
        orderedList: {
          title: 'Ordered list',
          image: '\uf0cb',
          showselection: false,
        },
        unorderedList: {
          title: 'Unordered list',
          image: '\uf0ca',
          showselection: false,
        },
        removeformat: {
          title: 'Remove format',
          image: '\uf12d',
        },
      },
      selectImage: 'Click or drop image',
      placeholderUrl: 'www.example.com',
      placeholderEmbed: '<embed/>',
    })
  }
  getContent = () => $('#editor').wysiwyg('shell').getHTML()
  render() {
    return (
      <div style={{ width: '900px', margin: '100px auto' }}>
        <textarea
          id="editor"
          name="editor"
          placeholder="Type your text here..."
          style={{ display: 'none' }}
        />
      </div>
    )
  }
}

module.exports = Wysiwyg
