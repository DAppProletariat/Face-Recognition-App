import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Clarifai from'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css';


const app = new Clarifai.App({
  apiKey: 'd54288ae14604af0a94ca72b0d3c4758'
 });

const particleOptions = {
      
            	particles: {
            	number: {
                value: 30,
                density: {
                  enable: true,
                  value_area: 800

                }
              }		
            }
          }
              

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL:'',
      box: {},
      route: 'signin'
      isSignedIn: false
    }
  }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_col * height,
    rightCol: width -(clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input})
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.setState.input)
      .then (response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }


  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState ({route: route});
  }

  render() {
    const { isSignedIn, imageURL, box, route} = this.state;
    return (
      <div className="App">
        <Particles className = 'particles'
        param={particlesOptions}              
        />

         <Navigation isSignedIn ={isSignedIn} onRouteChange= { this.onRouteChange />
         { route === 'home' 
         ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageURL = {imageURL} />
              </div> 
         : (
           route === 'signin' 
           ?  <Signin onRouteChange={this.onRouteChange}/>
           : <Register onRouteChange={this.onRouteChange} />
         )

         }
         </div>
    );
  }
  }
export default App;
