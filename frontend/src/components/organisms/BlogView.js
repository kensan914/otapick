import React from 'react';
import axios from 'axios';
import { saveAs } from "file-saver";
import DownloadModal from '../molecules/DownloadModal';
import { DELAY_TIME } from '../tools/env';


class BlogView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCheck: false,
      check: Array(this.props.images.length).fill(false),
      showAleart: false,
    }
    this.modalRef = React.createRef();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.check.includes(true)) {
      let orderList = [];
      for (const [index, val] of this.state.check.entries()) {
        if (val) orderList.push(index);
      }
      axios
        .post(this.props.blogViewURL, orderList, {
          headers: {
            'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').getAttribute('value')
          },
          responseType: 'blob'
        })
        .then(res => {
          this.modalRef.current.toggleModal();
          this.setState({
            allCheck: false,
            check: Array(this.props.images.length).fill(false),
            showAleart: false,
          })

          const blob = new Blob([res.data], {
            type: res.data.type
          });
          const fileName = res.headers["content-disposition"].match(/filename="(.*)"/)[1];
          saveAs(blob, fileName);
          this.props.incrementNumOfDownloads(-1, orderList.length);
        });
    } else {
      if (!this.state.showAleart) this.setState({ showAleart: true });
    }
  }

  handleAllCheckChange(e) {
    const target = e.target;
    const value = target.checked;
    this.setState(function (state) {
      let check = state.check;
      return {
        allCheck: value,
        check: check.fill(value),
      };
    });
  }

  handleCheckChange(e) {
    const target = e.target;
    const value = target.checked;

    this.setState(function (state) {
      let check = state.check;
      check[target.name] = value;
      return {
        check: check,
      };
    });
  }

  changeCheck(order) {
    this.setState(function (state) {
      let check = state.check;
      check[order] = !check[order];
      return {
        check: check,
      };
    });
  }

  componentDidMount() {
    let imageObjcts = [];
    for (const [index, image] of this.props.images.entries()) {
      imageObjcts.push(new Image());
      imageObjcts[index].onload = setTimeout(() => {
        document.getElementById(`image_${image.order}`).style.backgroundImage = 'url(' + imageObjcts[index].src + ')';
      }, DELAY_TIME)
      imageObjcts[index].src = image.src["originals"];
    }
  }

  render() {
    return (
      <>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <div className="col-md-3 col-lg-2 ml-auto" style={{ width: 200 }}>
            <div className="custom-control custom-checkbox">
              <input name="allCheck" type="checkbox" className="custom-control-input" id="allCheck"
                checked={this.state.allCheck} onChange={(e) => this.handleAllCheckChange(e)} />
              <label className="custom-control-label" for="allCheck">すべて選択</label>
            </div>
          </div>

          <div className="container my-4">
            <div className="row text-center">

              {
                this.props.images.map((image, index) => (
                  <div className="col-6 col-md-4 col-xl-3 mb-5">
                    <div style={{ cursor: "pointer" }} onClick={() => this.changeCheck(image.order)}>
                      <div className={this.props.group}>
                        <div className={"thumbnail img-thumbnail mx-auto " + (this.state.check[image.order] ? "checked" : "")} id={`image_${image.order}`}
                          style={{ background: `-webkit-image-set( url(${image.src["250x"]}) 1x, url(${image.src["500x"]}) 2x )`, backgroundSize: "cover", backgroundPosition: "center" }}>
                          <input className="save_img_checkbox" type="checkbox"
                            onChange={(e) => this.handleCheckChange(e)} name={image.order} checked={this.state.check[image.order]} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }

            </div>
          </div>
          {this.state.showAleart &&
            <div className="alert alert-danger py-2 mb-5 mt-0" role="alert" style={{ borderRadius: "1rem" }}>
              画像を選択してください。
          </div>
          }
          <div className="mx-auto mb-5" style={{ width: 150 }}>
            <button type="submit" className={"gradient-btn " + this.props.group} style={{ width: 150 }}>
              <b>保存</b>
            </button>
          </div>
        </form>

        <DownloadModal ref={this.modalRef} group={this.props.group} />
      </>
    );
  };
};


export default BlogView;