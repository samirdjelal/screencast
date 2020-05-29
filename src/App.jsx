import React, {Component, Fragment} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import './assets/styles/App.scss';
import {withRouter} from "react-router";
import Home from "./screens/Home";
import Recorder from "./screens/Recorder";
import Compressor from "./screens/Compressor";
import Header from "./components/Header";

// const {dialog} = require('electron').remote
// const {writeFile} = require('fs');

let videoElement;
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sources: [],
			source: null
		}
		this.openSettings = this.openSettings.bind(this);
		this.startRecording = this.startRecording.bind(this);
		this.stopRecording = this.stopRecording.bind(this);
		this.setVideoSource = this.setVideoSource.bind(this);
		this.getVideoSources = this.getVideoSources.bind(this);
	}
	
	componentDidMount() {
		videoElement = document.getElementById('videoStream');
	}
	
	render() {
		
		return (
			<Fragment>
				<div className="App">
					<Header
						openSettings={this.openSettings}
						getVideoSources={this.getVideoSources}
						startRecording={this.startRecording}
						stopRecording={this.stopRecording}
					/>
					
					<div className="Main">
						
						<video id="videoStream" className="App bg-gray-900 mb-4"/>
						
						{/*<div className="px-3 space-x-3">*/}
						{/*	<button onClick={this.getVideoSources} className="py-1 rounded px-3 bg-gray-300 text-gray-900 focus:outline-none focus:shadow-outline">get sources</button>*/}
						{/*	<button onClick={this.startRecording} className="py-1 rounded px-3 bg-gray-300 text-gray-900 focus:outline-none focus:shadow-outline">start</button>*/}
						{/*	<button onClick={this.stopRecording} className="py-1 rounded px-3 bg-gray-300 text-gray-900 focus:outline-none focus:shadow-outline">stop</button>*/}
						{/*</div>*/}
						<div className="List">
							{(this.state.sources && this.state.source === null) && <div className="h-full">
								<ul>
									{this.state.sources.map(source => (
										<li key={source.id} onClick={() => this.setVideoSource(source)}>{source.name}</li>
									))}
								</ul>
							</div>}
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
	
	openSettings() {
		console.log('openSettings');
	}
	
	async startRecording() {
		console.log('startRecording');
		if (typeof mediaRecorder !== 'undefined') mediaRecorder.start();

	}
	
	async stopRecording() {
		
		if (typeof mediaRecorder !== 'undefined' && mediaRecorder.state === 'recording') {
			mediaRecorder.stop();
		}
		// mediaRecorder.stop();
		// if (typeof mediaRecorder !== 'undefined') console.log(mediaRecorder);
		console.log('stopRecording');
		
	}
	
	async setVideoSource(source) {
		this.setState({source: source});
		
		const constraints = {
			audio: false,
			video: {
				mandatory: {
					chromeMediaSource: 'desktop',
					chromeMediaSourceId: source.id
				}
			}
		};
		// Create a Stream
		const stream = await navigator.mediaDevices
			.getUserMedia(constraints);
		
		// Preview the source in a video element
		videoElement.srcObject = stream;
		videoElement.play();
		
		// Create the Media Recorder
		const options = {mimeType: 'video/webm; codecs=vp9'};
		mediaRecorder = new MediaRecorder(stream, options);
		
		// Register Event Handlers
		mediaRecorder.ondataavailable = this.handleDataAvailable;
		mediaRecorder.onstop = this.handleStop;
		
	}
	
	async getVideoSources() {
		this.setState({sources: [], source: null});
		const inputSources = await window.desktopCapturer.getSources({
			types: ['window', 'screen']
		});
		this.setState({sources: inputSources});
	}
	
	
	// Captures all recorded chunks
	handleDataAvailable(e) {
		console.log('video data available');
		recordedChunks.push(e.data);
	}

// Saves the video file on stop
	async handleStop(e) {
		const blob = new Blob(recordedChunks, {
			type: 'video/webm; codecs=vp9'
		});
		
		const buffer = Buffer.from(await blob.arrayBuffer());
		console.log(buffer);
		// const {filePath} = await dialog.showSaveDialog({
		// 	buttonLabel: 'Save video',
		// 	defaultPath: `vid-${Date.now()}.webm`
		// });
		//
		// console.log(filePath);
		
		// writeFile(filePath, buffer, () => console.log('video saved successfully!'));
	}


// const Main = () => {
// 	return (
// 		<div className="Main">
// 			<Switch>
// 				<Route path="/" component={Home} exact/>
// 				<Route path="/recorder" component={Recorder} exact/>
// 				<Route path="/compressor" component={Compressor} exact/>
// 				<Redirect to="/"/>
// 			</Switch>
// 		</div>
// 	);
}

export default withRouter(connect(
	state => ({
		app_name: state.app.name,
		app_version: state.app.version
	}),
	{}
)(App));
