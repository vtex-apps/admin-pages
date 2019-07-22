import * as React from 'react'
import { defineMessages, injectIntl } from 'react-intl'

interface CustomProps {
  title?: string | null
  description?: string | null
  url?: string | null
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

const messages = defineMessages({
  seoDescription: {
    defaultMessage: '<Page description>',
    id: 'admin/pages.admin.institutional.general.seo.description',
  },
  seoTitle: {
    defaultMessage: '<Page title>',
    id: 'admin/pages.admin.institutional.general.seo.page-title',
  },
})

const SeoPreview = ({ title, description, url, intl }: Props) => (
  <div className="pl5 pt4 ba br2 bw1 b--muted-4 h-100 pb4">
    <div>
      <span style={{ ...styles.button, ...styles.buttonClose }} />
      <span style={{ ...styles.button, ...styles.buttonMaximize }} />
      <span style={{ ...styles.button, ...styles.buttonMinimize }} />
    </div>
    <div className="pt5">
      <span
        className={`db f4 pb1 word-break ${!title && 'o-30'}`}
        style={styles.title}
      >
        {title || intl.formatMessage(messages.seoTitle)}
      </span>
      <span
        className={`db f6 pb1 word-break ${!url && 'o-30'}`}
        style={styles.url}
      >
        {`${window.location.origin}${url || '<url>'}`}
      </span>
      <span
        className={`db pt2 f6 fw3 word-break ${!description && 'o-30'}`}
        style={styles.description}
      >
        {description || intl.formatMessage(messages.seoDescription)}
      </span>
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

export default injectIntl(SeoPreview)
