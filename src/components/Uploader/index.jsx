import React, { Component } from 'react'
import { Upload, Icon, message } from 'antd'
import { baseURL } from '-/services/index'
import classNames from 'classnames/bind'

import styles from './Uploader.module.less'

const cx = classNames.bind(styles)

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg'
  // if (!isJPG) {
  //   message.error('You can only upload JPG file!')
  // }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJPG && isLt2M
}

// function getBase64(img, callback) {
//   const reader = new FileReader()
//   reader.addEventListener('load', () => callback(reader.result))
//   reader.readAsDataURL(img)
// }

class Uploader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      imageUrl: '',
    }
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, imageUrl => this.setState({
      //   imageUrl,
      //   loading: false,
      // }))
      this.setState({
        imageUrl: `${baseURL}/${info.file.response.data.image_url}`,
        loading: false,
      })
    }
  }

  render() {
    const { className } = this.props
    const { loading, imageUrl } = this.state
    const cls = cx({
      container: true,
      [className]: className,
    })

    const uploadButton = (
      <div>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    )

    console.log(baseURL)

    return (
      <Upload
        name="file"
        listType="picture-card"
        className={cls}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        {...this.props}
        action="http://39.98.50.55:3000/mock/12/sys/image"
        // action={`${baseURL}/sys/image`}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>
    )
  }
}

export default Uploader
