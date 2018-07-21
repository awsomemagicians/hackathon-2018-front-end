import React, { Component } from "react";
import axios from "axios";
import { download } from "./utils";
import "./App.css";

class App extends Component {
  state = {
    imgData: ""
  };
  componentDidMount() {
    setTimeout(() => {
      requestAnimationFrame(this._renderCanvas);
    }, 2000);
  }
  _drawHighlight = () => {
    if (this.rectData && this.rectData.length != 0 && this.video) {
      const canvas = document.getElementById("highlight");
      const hlctx = canvas.getContext("2d");
      hlctx.beginPath();
      hlctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < this.rectData.length; i++) {
        const rect = this.rectData[i];
        const x_Rate = 720 / this.video.videoWidth;
        const y_Rate = 405 / this.video.videoHeight;
        const x = (rect[0] - rect[2] / 2) * x_Rate;
        const y = (rect[1] - rect[3] / 2) * y_Rate;
        const w = rect[2] * x_Rate;
        const h = rect[3] * y_Rate;
        this._draw(x, y, w, h, hlctx);
      }
      // requestAnimationFrame(this._renderImage);
    }
  };
  _renderCanvas = () => {
    this._renderImage();
    this._drawHighlight();
    // requestAnimationFrame(this._renderCanvas);
  };
  _renderImage = () => {
    this.render.height = this.video.videoHeight;
    this.render.width = this.video.videoWidth;

    // this.renderHL.height = this.video.videoHeight;
    // this.renderHL.width = this.video.videoWidth;

    const ctx = this.render.getContext("2d");
    ctx.drawImage(this.video, 0, 0, this.render.width, this.render.height);
    const data = this.render.toDataURL("image/png");
    // download(data.replace(/^data:image\/png;base64,/, ""), "1.png");
    // this.setState({
    //   imgData: data
    // });
    // this.download(data.replace(/^data:image\/png;base64,/, ""));
    axios
      .post("http://localhost:1234/checkin", {
        data
      })
      .then(response => {
        const { data: { data } } = response;
        this.rectData = data;
      })
      .catch(error => {
        console.log(error);
      });
  };
  _draw = (x, y, width, height, hlctx) => {
    hlctx.rect(x, y, width, height);
    hlctx.stroke();
  };
  _getVideoRef = ref => {
    this.video = ref;
  };
  _getRenderRef = ref => {
    this.render = ref;
  };
  // _getRenderHighlightRef = ref => {
  //   this.renderHL = ref;
  // };
  render() {
    return (
      <div className="App">
        <video
          width="720"
          id="video"
          ref={this._getVideoRef}
          controls
          autoPlay
          crossOrigin="anonymous"
        >
          <source
            src="https://video.fsgn2-1.fna.fbcdn.net/v/t42.9040-2/37417655_2192667157414075_8949066004806238208_n.mp4?_nc_cat=0&efg=eyJybHIiOjI3NTEsInJsYSI6MTA2MSwidmVuY29kZV90YWciOiJzdmVfaGQifQ%3D%3D&rl=2751&vabr=1834&oh=7c019032905492e6fa696a4dcaf8ace9&oe=5B534367"
            type="video/mp4"
          />
          Your browser does not support HTML5 video.
        </video>
        <canvas id="highlight" width="720" height="405" />
        <div className="hl_wrapper">
          <canvas id="render" ref={this._getRenderRef} />
          {/* <canvas
            id="render_highlight"
            ref={this._getRenderHighlightRef}
            width="720"
            height="396"
          /> */}
          {/* <img src={this.state.imgData} /> */}
        </div>
      </div>
    );
  }
}

export default App;
