import React, { Component } from 'react';
import './ImageSlider.css'

class ImageSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            translateValue: 0
        };
    }

    componentDidMount = () => {
        this.timerID = setInterval(() => {
            this.goToNextSlide()
        }, 3000)
    }

    componentWillUnmount = () => {
        clearInterval(this.timerID);
    }

    render() {
        return (
            <div className="slider">
                <div className="slider-wrapper"
                    style={{
                        transform: `translateX(${this.state.translateValue}px)`,
                        transition: this.state.index > 0 ? 'transform ease-out 0.45s' : ''
                    }}
                    onTransitionEnd={this.transitionEnd}>
                    {this.renderSlides()}
                </div>
            </div>
        )
    }

    renderSlides = () => {
        const { images } = this.props;
        const doubleImages = images.concat(images);
        return doubleImages.map((image, index) => <div key={index} className="slide" style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 60%'
        }}></div>)
    }

    goToNextSlide = () => {
        if (this.props.images.length === 0) return;
        
        this.setState((prevState, props) => {
            return {
                index: prevState.index + 1,
                translateValue: prevState.translateValue - this.slideWidth()
            }
        })
    }

    transitionEnd = () => {
        const { images } = this.props;

        this.setState((prevState) => {
            if (prevState.index > images.length - 1) {
                return {
                    index: 0,
                    translateValue: 0
                }
            }
        })
    }

    slideWidth = () => document.querySelector('.slide').clientWidth
}

export default ImageSlider;