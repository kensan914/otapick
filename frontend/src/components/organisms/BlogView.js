import React from 'react';
import axios from 'axios';
import { saveAs } from "file-saver";
import DownloadModal from '../molecules/DownloadModal';
import { DELAY_TIME } from '../tools/env';
import Masonry from 'react-masonry-component';
import ImageCard from '../molecules/ImageCard';
import { addLongPressEventListeners, isMobile, isSmp } from '../tools/support';


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

  loadOriginalImage() {
    let imageObjcts = [];
    for (const [index, image] of this.props.images.entries()) {
      if (this.props.mode === "view") {
        imageObjcts.push(new Image());
        imageObjcts[index].onload = setTimeout(() => {
          const targetImage = document.getElementById(`image_${image.order}`);
          if (targetImage !== null) {
            if (isSmp) {
              targetImage.setAttribute('src', imageObjcts[index].src);
              targetImage.removeAttribute("srcset");
            } else {
              targetImage.setAttribute('srcset', `${imageObjcts[index].src} 1x, ${imageObjcts[index].src} 2x`);
              targetImage.removeAttribute("src");
            }
          }
        }, DELAY_TIME);
        imageObjcts[index].src = image.src["originals"];
      } else if (this.props.mode === "download") {
        imageObjcts.push(new Image());
        imageObjcts[index].onload = setTimeout(() => {
          document.getElementById(`image_${image.order}`).style.backgroundImage = 'url(' + imageObjcts[index].src + ')';
        }, DELAY_TIME);
        imageObjcts[index].src = image.src["originals"];
      }
    }
  }

  componentDidMount() {
    this.loadOriginalImage();

    for (const image of this.props.images) {
      addLongPressEventListeners(document.getElementById(`image_${image.order}`), () => this.props.putDownload(image.order));
    }
  }

  componentDidUpdate(prevProps) {
    // mode が変わったとき
    if (prevProps.mode !== this.props.mode) {
      this.loadOriginalImage();
    }
  }

  render() {
    if (this.props.mode === "view") {
      const options = {
        itemSelector: '.grid-item',
        transitionDuration: 0,
        stagger: 0,
      };

      return (
        <div className="container">
          {isMobile &&
            <div className="alert alert-success mb-1" role="alert" style={{ borderRadius: "1rem", fontSize: 14 }}>画像を長押しして保存をおこなってください</div>
          }
          <Masonry options={options} className="mt-3 image-list-in-blog-view">
            {this.props.images.map(({ src, url, order }, i) => (
              <div key={i} className="grid-item col-12 col-sm-6 my-2 my-sm-3 px-0 px-sm-2">
                <ImageCard key={i} id={i} groupID={this.props.groupID} group={this.props.group} blogCt={this.props.blogCt} blogTitle={this.props.blogTitle}
                  src={src} url={url} blogUrl={this.props.blogUrl} officialUrl={this.props.officialUrl} writer={this.props.writer} imageID={`image_${order}`} />
              </div >
            ))}
          </Masonry>
        </div>
      );
    } else if (this.props.mode === "download") {
      return (
        <>
          <form onSubmit={(e) => this.handleSubmit(e)}>
            <div className="col-md-3 col-lg-2 ml-auto" style={{ width: 200 }}>
              <div className="custom-control custom-checkbox">
                <input name="allCheck" type="checkbox" className="custom-control-input" id="allCheck"
                  checked={this.state.allCheck} onChange={(e) => this.handleAllCheckChange(e)} />
                <label className="custom-control-label" htmlFor="allCheck">すべて選択</label>
              </div>
            </div>

            <div className="container my-4">
              <div className="row text-center">

                {
                  this.props.images.map((image, index) => (
                    <div key={index} className="col-6 col-md-4 col-xl-3 mb-5">
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
    }
  };
};


export default BlogView;