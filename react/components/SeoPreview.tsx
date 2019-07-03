import * as React from 'react'

import styles from './style.css'

interface Props {
  title?: string
  description?: string
  url?: string
}

const SeoPreview = ({ title, description, url }: Props) => (
  <div className="pl5 pt4 ba br2 b--muted-4 h-100 pb4">
    <div>
      <span className={styles.gc_seo_button__close} />
      <span className={styles.gc_seo_button__maximize} />
      <span className={styles.gc_seo_button__minimize} />
    </div>
    <div className="pt5">
      {title && <span className={`db f4 pb1 word-break ${styles.gc_seo__title}`}>{title}</span>}
      {url && <span className={`db f6 pb1 word-break ${styles.gc_seo__url}`}>{url}</span>}
      {description && <span className={`db pt2 f6 fw3 word-break ${styles.gc_seo__description}`}>{description}</span>}
    </div>
  </div>
)

export default SeoPreview