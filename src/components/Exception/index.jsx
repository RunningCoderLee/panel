import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Button } from 'antd'
import config from './typeConfig'

import styles from './Exception.module.less'

const Exception = (props) => {
  const {
    className,
    backText,
    linkElement,
    type,
    title,
    desc,
    img,
    actions,
    redirect,
    ...rest
  } = props

  const pageType = type in config ? type : '404'
  const clsString = classNames(styles.exception, className)

  return (
    <div className={clsString} {...rest}>
      <div className={styles.imgBlock}>
        <div
          className={styles.imgEle}
          style={{ backgroundImage: `url(${img || config[pageType].img})` }}
        />
      </div>
      <div className={styles.content}>
        <h1>{title || config[pageType].title}</h1>
        <div className={styles.desc}>{desc || config[pageType].desc}</div>
        <div className={styles.actions}>
          {actions
            || createElement(
              linkElement,
              {
                to: redirect,
                href: redirect,
              },
              <Button type="primary">{backText}</Button>,
            )}
        </div>
      </div>
    </div>
  )
}

Exception.propTypes = {
  backText: PropTypes.string,
  redirect: PropTypes.string,
  className: PropTypes.string,
  linkElement: PropTypes.oneOfType([PropTypes.element, PropTypes.node, PropTypes.func]),
  type: PropTypes.oneOf(['403', '404', '500']),
  title: PropTypes.string,
  desc: PropTypes.string,
  img: PropTypes.string,
  actions: PropTypes.node,
}

Exception.defaultProps = {
  backText: 'back to home',
  redirect: '/',
  className: '',
  linkElement: 'a',
  type: '404',
  title: '',
  desc: '',
  img: '',
  actions: null,
}

export default Exception
