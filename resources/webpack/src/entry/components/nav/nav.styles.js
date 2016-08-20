const HEIGHT = '60px'

const styles = {
  nav: {
    position: 'relative',
    width: '100%',
    height: HEIGHT,
    lineHeight: HEIGHT,
    backgroundColor: '#ffffff',
    padding: '0 45px',
    color: '#000000',
    display: 'flex',
  },
  link: {
    textDecoration: 'initial',
    textAlign: 'center',
    height: HEIGHT,
    width: '65px',
    color: '#000000',
    lineHeight: HEIGHT,
    fontSize: '1.2rem',
    fontWeight: 'bold',
    display: 'inline-block',
    margin: '0 10px',
    cursor: 'pointer',
  },
}
export default styles
export const ACTIVE = {
  borderBottom: 'solid 2px #ff9f1f',
}
