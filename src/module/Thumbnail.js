import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useLocation
} from 'react-router-dom'

class Thumbnail extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="item">
        <Link to={'result/' + this.props.videoId}>
          <img data-id={this.props.videoId}
            className="thumbnail"
            src={`${process.env.PUBLIC_URL}` + this.props.imgPath} />
        </Link>
        <Link to={'result/' + this.props.videoId}>
          <p className="video-name"
            data-id={this.props.videoId}>{this.props.productName}</p>
        </Link>
      </div>
    )
  }
}
export default Thumbnail