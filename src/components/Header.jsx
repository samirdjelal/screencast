import React, {Component} from 'react';


class Header extends Component {
	render() {
		return (
			<div className="Header h-10 px-4 leading-10 bg-gray-800 border-b border-gray-900 flex">
				
				<div className="Menu flex pt-2 space-x-2">
					
					<div className="w-6 h-6" onClick={this.props.openSettings}>
						<svg className="fill-current cursor-pointer text-gray-500 hover:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"/>
						</svg>
					</div>
					
					<div className="w-6 h-6" onClick={this.props.getVideoSources}>
						<svg className="fill-current cursor-pointer text-gray-500 hover:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd"
							      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
							      clipRule="evenodd"/>
						</svg>
					</div>
					
					
					<div className="w-6 h-6" onClick={this.props.startRecording}>
						<svg className="fill-current cursor-pointer text-gray-500 hover:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
						</svg>
					</div>
					<div className="w-6 h-6" onClick={this.props.stopRecording}>
						<svg className="fill-current cursor-pointer text-gray-500 hover:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"/>
						</svg>
					</div>
				</div>
				
				<div className="Title flex-1 text-gray-500">Screencast v1.2</div>
				
				<div className="flex align-middle h-10 pt-3 w-24 justify-end">
					
					<div className="minimize-btn w-4 h-4 pt-3 cursor-pointer" onClick={()=>window.remote.getCurrentWindow().minimize()}>
						<svg className="fill-current text-gray-500 hover:text-gray-400" viewBox="0 0 15 3" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"
						     strokeLinejoin="round" strokeMiterlimit="2">
							<path d="M13.5 3c.828 0 1.5-.672 1.5-1.5S14.328 0 13.5 0h-12C.672 0 0 .672 0 1.5S.672 3 1.5 3h12z"/>
						</svg>
					</div>
					
					<div className="close-btn w-4 h-4 ml-4 cursor-pointer" onClick={()=>window.remote.getCurrentWindow().close()}>
						<svg className="fill-current text-gray-500 hover:text-gray-400" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"
						     strokeLinejoin="round" strokeMiterlimit="2">
							<path
								d="M6.449 4.3279l3.889-3.889c.585-.585 1.536-.585 2.121 0 .586.586.586 1.536 0 2.121l-3.889 3.89 3.889 3.889c.586.585.586 1.536 0 2.121-.585.585-1.536.585-2.121 0l-3.889-3.889-3.889 3.889c-.585.585-1.536.585-2.121 0-.586-.585-.586-1.536 0-2.121l3.889-3.889-3.889-3.89c-.586-.585-.586-1.535 0-2.121.585-.585 1.536-.585 2.121 0l3.889 3.889z"/>
						</svg>
					</div>
				
				</div>
			
			</div>
		);
	}
}

export default Header;
