import * as React from 'react'

interface Props {
  title?: string
  description?: string
  url?: string
}

const SeoPreview = ({ title, description, url }: Props) => (
  <div className="pl5 pt4 ba br2 bw1 b--muted-4 h-100 pb4">
    <div>
      <span style={{ ...styles.button, ...styles.buttonClose }} />
      <span style={{ ...styles.button, ...styles.buttonMaximize }} />
      <span style={{ ...styles.button, ...styles.buttonMinimize }} />
    </div>
    <div className="pt5">
      {title && <span className={`db f4 pb1 word-break`} style={styles.title}>{title}</span>}
      {url && <span className={`db f6 pb1 word-break`} style={styles.url}>{url}</span>}
      {description && <span className={`db pt2 f6 fw3 word-break`} style={styles.description}>{description}</span>}
    </div>
  </div>
)

const styles = {
  button: {
    borderRadius: '100%',
    display: 'inline-block',
    height: '10px',
    marginRight: '5px',
    width: '10px',
  },
  buttonClose: {
    backgroundColor: '#ff3d44',
  },
  buttonMaximize: {
    backgroundColor: '#ffa721',
  },
  buttonMinimize: {
    backgroundColor: '#7ed321',
  },
  description: {
    color: '#545454',
  },
  title: {
    color: '#1a0dab',
  },
  url: {
    color: '#006621',
  },
}

export default SeoPreview