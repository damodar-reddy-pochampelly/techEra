import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Navbar from '../Navbar'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class Home extends Component {
  state = {apiStatus: apiStatusConstants.initial, courseDetails: {}}

  componentDidMount = () => {
    this.getCourseDetails()
  }

  getCourseDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/te/courses/${id}`

    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const data = await response.json()
      const courseDetails = data.course_details
      const modifiedData = {
        id: courseDetails.id,
        description: courseDetails.description,
        name: courseDetails.name,
        imageUrl: courseDetails.image_url,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        courseDetails: modifiedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt=" failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getCourseDetails}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="loading-container">
      <Loader type="ThreeDots" width={50} height={50} color=" #4656a1" />
    </div>
  )

  renderSuccessView = () => {
    const {courseDetails} = this.state
    return (
      <div className="course-details-success-container">
        <img
          src={courseDetails.imageUrl}
          alt={courseDetails.name}
          className="course-image "
        />
        <div className="content-container">
          <h1 className="heading">{courseDetails.name}</h1>
          <p className="description">{courseDetails.description}</p>
        </div>
      </div>
    )
  }

  renderApiResult = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="course-details-container">
        <Navbar />
        {this.renderApiResult()}
      </div>
    )
  }
}

export default Home
