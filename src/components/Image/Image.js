import React from 'react'
import { isString } from 'lodash'

export default class Image extends React.Component {
  static propTypes = {
    value: React.PropTypes.object.isRequired
  }

  static defaultProps = {
    value: {}
  }

  state = {
    dataUrl: null
  }

  componentDidMount () {
    this.mounted = true
    this.checkValueForBlob(this.props.value)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value.url !== this.props.value.url) {
      this.checkValueForBlob(nextProps.value)
    }
  }

  componentWillUnmount () {
    this.mounted = false
  }

  checkValueForBlob (value) {
    if (value.url instanceof window.Blob) {
      this.readBlob(value.url)
    }
  }

  readBlob (blob) {
    const reader = new window.FileReader()
    reader.addEventListener('load', this.onReadDataUrl)
    reader.readAsDataURL(blob)
  }

  onReadDataUrl = (e) => {
    if (this.mounted) {
      this.setState({
        dataUrl: e.target.result
      })
    }
  }

  getSrc () {
    const { dataUrl } = this.state
    const { value } = this.props

    if (isString(value.url)) {
      return value.url
    }

    if (dataUrl) {
      return dataUrl
    }
  }

  render () {
    const src = this.getSrc()

    if (src) {
      return (
        <img src={src} />
      )
    }

    return null
  }
}
