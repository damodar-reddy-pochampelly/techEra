import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Navbar from '../Navbar'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class Home extends Component {
  state = {apiStatus: apiStatusConstants.initial, coursesList: []}

  componentDidMount = () => {
    this.getCoursesList()
  }

  getCoursesList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/te/courses'

    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const data = await response.json()
      const modifiedData = data.courses.map(eachCourse => ({
        id: eachCourse.id,
        name: eachCourse.name,
        logoUrl: eachCourse.logo_url,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        coursesList: modifiedData,
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
        onClick={this.getCoursesList}
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
    const {coursesList} = this.state
    return (
      <div className="success-container">
        <h1 className="courses-heading">Courses</h1>
        <ul className="courses-container">
          {coursesList.map(eachCourse => (
            <Link
              to={`/courses/${eachCourse.id}`}
              className="link"
              key={eachCourse.id}
            >
              <li className="courses-item">
                <img
                  src={eachCourse.logoUrl}
                  alt={eachCourse.name}
                  className="course-logo"
                />
                <p className="course-name">{eachCourse.name}</p>
              </li>
            </Link>
          ))}
        </ul>
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
      <div className="home-container">
        <Navbar />
        {this.renderApiResult()}
      </div>
    )
  }
}

export default Home
