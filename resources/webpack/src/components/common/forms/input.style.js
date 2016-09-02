module.exports = {
  normal: {
    display: 'block',
    width: 'calc(100% - 24px)',
    height: '20px',
    padding: '6px 12px',
    fontSize: '14px',
    lineHeight: '1.42857143',
    color: '#555555',
    backgroundColor: '#ffffff!important',
    backgroundImage: 'none',
    border: '1px solid #e4e4e4',
    borderRadius: '0px',
    transition: 'border-color ease-in-out .15s, box-shadow ease-in-out .15s',
    outline: 'none',
    ':focus': {
      outline: 'none',
      border: '1px solid rgba(104, 184, 40, 0.5)',
    },
  },
}
