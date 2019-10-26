import React, { Component } from 'react'
import _ from 'lodash'
import timeAgo from '../utils/timeAgo.js'

class ShelfCassettes extends Component {
  constructor(props) {
    super(props)
    this.renderCassette = this.renderCassette.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.state = {
      index: 0
    }
  }

  handleNext() {
    this.setState({
      index: this.state.index + this.props.step
    })
  }

  handlePrevious() {
    this.setState({
      index: Math.max(this.state.index - this.props.step, 0)
    })
  }

  renderCassette({ cassette, i, now }) {
    const {
      handleOnClick,
      tokenLogin,
      handleSetVisibility,
      handleRemove
    } = this.props
    const { isPrivate, gist, visits } = cassette
    const visitsCount = visits ? _.sum(Object.values(visits)) : 0
    const counter = visitsCount + cassette.counter
    const title = cassette.title || ''
    const maxLength = 16
    const tooLong = title.length > maxLength
    const finalTitle = [
      title.substring(0, maxLength).trim(),
      tooLong ? '…' : ''
    ].join('')

    const date = new Date(cassette.updated)

    return (
      <li key={i} className="cassette">
        <div className="img">
          <span className="title">{finalTitle || ' '}</span>
          <a
            href={`/?id=${gist}`}
            onClick={e => {
              handleOnClick({ e, id: gist })
            }}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img className="background" alt="" src="./cassette-bg.png" />
            <span className="load">load cassette</span>
            {cassette.cover ? (
              <img className="cover" src={cassette.cover} alt="" />
            ) : null}
          </a>
          <span className="author">by {cassette.user}</span>
          <div className="date-info">
            <span className="date">{timeAgo({ now, before: date })}</span>
            <span className="booted">
              {counter || 0} play{counter === 1 ? '' : 's'}
            </span>
          </div>{' '}
        </div>
        {tokenLogin === cassette.user ? (
          <div className="buttons">
            <button
              className="button"
              onClick={() => {
                handleSetVisibility({ gistId: gist, isPrivate: !isPrivate })
              }}
            >
              make {isPrivate ? 'public' : 'private'}
            </button>
            <button
              className="button"
              onClick={() => {
                handleRemove({ gistId: gist })
              }}
            >
              remove
            </button>
          </div>
        ) : null}
      </li>
    )
  }

  render() {
    const { cassettes, title, step } = this.props
    const { index } = this.state
    const now = new Date()

    return (
      <div className="ShelfCassettes">
        <div className="title-nav">
          <span className="title">{title}</span>
          <button
            disabled={index <= 0}
            className="button"
            onClick={this.handlePrevious}
          >
            &lt;
          </button>
          <button
            disabled={index >= cassettes.length - step}
            className="button"
            onClick={this.handleNext}
          >
            &gt;
          </button>
          <span className="count">
            {index + 1} - {Math.min(index + step, cassettes.length)} (
            {cassettes.length} total)
          </span>
        </div>
        <ul className="cassettes">
          {_(cassettes)
            .slice(index, index + step)
            .map((d, i) => this.renderCassette({ cassette: d, i, now }))
            .value()}
        </ul>
      </div>
    )
  }
}

ShelfCassettes.defaultProps = {
  step: 5
}

export default ShelfCassettes
