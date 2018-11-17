import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload as AntUpload } from 'antd'

import * as styles from './upload.module.less'

const UPLOAD_API = 'http://39.98.50.55:3000/mock/12/sys/image'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

class Upload extends Component {
  static propTypes = {
    imgUrl: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    imgUrl: '',
    onChange: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      imgUrl: props.imgUrl,
      loading: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { imgUrl } = this.props
    if (nextProps.imgUrl !== imgUrl) {
      this.setState({
        imgUrl: nextProps.imgUrl,
      })
    }
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      const { onChange } = this.props
      const { response } = info.file
      const { data } = response
      onChange(data.image_url)
      getBase64(info.file.originFileObj, (imgUrl) => {
        this.setState({
          imgUrl,
          loading: false,
        })
      })
    }
  }

  render() {
    const { imgUrl, loading } = this.state
    const uploadText = loading ? '上传中' : '上传二维码'

    return (
      <AntUpload
        className={styles.upload}
        name="avatar"
        listType="picture-card"
        showUploadList={false}
        action={UPLOAD_API}
        onChange={this.handleChange}
      >
        {imgUrl ? <img src={imgUrl} alt="avatar" className={styles.img} /> : uploadText}
      </AntUpload>
    )
  }
}

export default Upload
