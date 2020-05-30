import React, {Component, Fragment} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import './assets/styles/App.scss';
import {withRouter} from "react-router";
import Home from "./screens/Home";
import Recorder from "./screens/Recorder";
import Compressor from "./screens/Compressor";
import Header from "./components/Header";

const {dialog} = window.require('electron').remote
const {writeFile} = window.require('fs');

let videoElement;
let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sources: [],
			source: null,
			openSoucesList: false,
			status: 'idle'
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
						status={this.state.status}
						openSettings={this.openSettings}
						getVideoSources={this.getVideoSources}
						startRecording={this.startRecording}
						stopRecording={this.stopRecording}
					/>
					
					<div className="Main">
						
						<video id="videoStream" className="App mb-4"/>
						
						{/*<div className="px-3 space-x-3">*/}
						{/*	<button onClick={this.getVideoSources} className="py-1 rounded px-3 bg-gray-300 text-gray-900 focus:outline-none focus:shadow-outline">get sources</button>*/}
						{/*	<button onClick={this.startRecording} className="py-1 rounded px-3 bg-gray-300 text-gray-900 focus:outline-none focus:shadow-outline">start</button>*/}
						{/*	<button onClick={this.stopRecording} className="py-1 rounded px-3 bg-gray-300 text-gray-900 focus:outline-none focus:shadow-outline">stop</button>*/}
						{/*</div>*/}
						{this.state.openSoucesList && <div className="List">
							<div className="ListItems h-full overflow-y-scroll">
								{this.state.sources.map(source => (
									<div className="Item mb-4 flex" key={source.id} onClick={() => this.setVideoSource(source)}>
										<img className="rounded w-12 h-10 object-contain bg-gray-900" src={source.thumbnail.toDataURL()} alt={source.name}/>
										<div className="pt-2 pl-4">{source.name}</div>
									</div>
								))}
							</div>
						</div>}
					</div>
				</div>
			</Fragment>
		);
	}
	
	openSettings() {
		console.log('openSettings');
	}
	
	async startRecording() {
		console.log(mediaRecorder.state)
		console.log('startRecording');
		this.setState({status: 'recording'});
		
		if (typeof mediaRecorder !== 'undefined' && mediaRecorder.state === 'inactive') mediaRecorder.start();
		
	}
	
	async stopRecording() {
		console.log(mediaRecorder.state)
		this.setState({status: 'idle'});
		if (typeof mediaRecorder !== 'undefined' && mediaRecorder.state === 'recording') {
			// videoElement.stop();
			// if (typeof videoElement.stop === 'function') videoElement.stop();
			// videoElement.srcObject = null;
			mediaRecorder.stop();
		}
		
		// mediaRecorder.stop();
		// if (typeof mediaRecorder !== 'undefined') console.log(mediaRecorder);
		console.log('stopRecording');
		
	}
	
	async setVideoSource(source) {
		this.setState({source: source, openSoucesList: false});
		
		// Create a Stream
		const stream = await navigator.mediaDevices
			.getUserMedia({
				audio: {
					mandatory: {
						chromeMediaSource: 'desktop',
						chromeMediaSourceId: source.id
					}
				},
				video: {
					mandatory: {
						chromeMediaSource: 'desktop',
						chromeMediaSourceId: source.id
					}
				}
			});
		
		// Preview the source in a video element
		videoElement.volume = 0;
		videoElement.srcObject = stream;
		videoElement.play();
		
		// Create the Media Recorder
		const options = {mimeType: 'video/webm; codecs=vp9'};
		// const options = {mimeType: 'video/mp4; codecs=H.264'};
		mediaRecorder = new MediaRecorder(stream, options);
		
		// Register Event Handlers
		mediaRecorder.ondataavailable = this.handleDataAvailable;
		mediaRecorder.onstop = this.handleStop;
		
	}
	
	async getVideoSources() {
		// if (typeof videoElement.stop === 'function') videoElement.stop();
		// if (this.state.sources.length === 0 && this.state.source === null) {
		if (this.state.openSoucesList === true) {
			this.setState({openSoucesList: false});
		} else {
			const inputSources = await window.desktopCapturer.getSources({
				types: ['window', 'screen']
			});
			this.setState({openSoucesList: true, sources: inputSources, source: null});
			// console.log(inputSources[0].thumbnail.toDataURL())
		}
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
			// type: 'video/mp4; codecs=H.264'
		});
		const buffer = Buffer.from(await blob.arrayBuffer());
		// console.log(buffer);
		const {filePath} = await dialog.showSaveDialog({
			buttonLabel: 'Save video',
			defaultPath: `vid-${Date.now()}.webm`
		});
		//
		// console.log(filePath);
		writeFile(filePath, buffer, () => console.log('video saved successfully!'));
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
