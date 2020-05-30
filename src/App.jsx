import React, {Component, Fragment} from 'react';
import './assets/styles/App.scss';
import Header from "./components/Header";

const {dialog} = window.require('electron').remote
const {writeFile} = window.require('fs');

let videoElement, mediaRecorder, recordedChunks = [];

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sources: [],
			source: null,
			openSoucesList: false,
			openCompressor: false,
			status: 'idle'
		}
		this.startRecording = this.startRecording.bind(this);
		this.stopRecording = this.stopRecording.bind(this);
		this.setVideoSource = this.setVideoSource.bind(this);
		this.getVideoSources = this.getVideoSources.bind(this);
		this.openCompressor = this.openCompressor.bind(this);
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
						openCompressor={this.openCompressor}
					/>
					
					<div className="Main">
						
						<video id="videoStream" className="App mb-4"/>
						
						{/*<div className="px-3 space-x-3">*/}
						{/*	<button onClick={this.getVideoSources} className="py-1 rounded px-3 bg-gray-300 text-gray-900 focus:outline-none focus:shadow-outline">get sources</button>*/}
						{/*	<button onClick={this.startRecording} className="py-1 rounded px-3 bg-gray-300 text-gray-900 focus:outline-none focus:shadow-outline">start</button>*/}
						{/*	<button onClick={this.stopRecording} className="py-1 rounded px-3 bg-gray-300 text-gray-900 focus:outline-none focus:shadow-outline">stop</button>*/}
						{/*</div>*/}
						
						
						{this.state.openCompressor && <div className="Compressor bg-gray-800">
							openCompressor
						</div>}
						
						{this.state.openSoucesList && <div className="List bg-gray-800">
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
	
	openCompressor() {
		this.setState(prevState => ({openCompressor: !prevState.openCompressor, openSoucesList: false}));
	}
	
	async startRecording() {
		console.log('startRecording');
		if (typeof mediaRecorder !== 'undefined' && mediaRecorder.state === 'inactive') {
			mediaRecorder.start();
			this.setState({status: 'recording'});
		}
	}
	
	async stopRecording() {
		console.log('stopRecording');
		this.setState({status: 'idle'});
		if (typeof mediaRecorder !== 'undefined' && mediaRecorder.state === 'recording') {
			mediaRecorder.stop();
		}
	}
	
	async setVideoSource(source) {
		this.setState({source: source, openSoucesList: false, openCompressor: false});
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
		
		videoElement.volume = 0;
		videoElement.srcObject = stream;
		videoElement.play();
		
		const options = {mimeType: 'video/webm; codecs=vp9'};
		mediaRecorder = new MediaRecorder(stream, options);
		
		mediaRecorder.ondataavailable = async (e) => {
			console.log('video data available');
			recordedChunks.push(e.data);
		}
		
		mediaRecorder.onstop = async (e) => {
			const blob = new Blob(recordedChunks, {type: 'video/webm; codecs=vp9'});
			const buffer = Buffer.from(await blob.arrayBuffer());
			const {filePath} = await dialog.showSaveDialog({
				buttonLabel: 'Save video',
				defaultPath: `vid-${Date.now()}.webm`
			});
			//
			writeFile(filePath, buffer, () => console.log('video saved successfully!'));
		};
		
	}
	
	async getVideoSources() {
		if (this.state.openSoucesList === true) {
			this.setState({openSoucesList: false, openCompressor: false});
		} else {
			const inputSources = await window.desktopCapturer.getSources({types: ['window', 'screen']});
			this.setState({openSoucesList: true, sources: inputSources, source: null, openCompressor: false});
		}
	}
	
	
}

