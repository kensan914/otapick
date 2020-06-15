import React from 'react';
import BlogCard from '../molecules/BlogCard';
import Loader from '../atoms/Loader';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios';
import { URLJoin } from '../tools/support';
import { withRouter } from 'react-router-dom';


class BlogView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCheck: false,
      check: [],
    }
  }

  handleSubmit(e) {
    e.preventDefault();
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

  componentDidUpdate(prevProps) {
    if (prevProps.images !== this.props.images && this.props.images.length > 0) {
      this.setState({ check: Array(this.props.images.length).fill(false) });
    }
  }

  render() {
    return (
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
                <div className="col-6 col-md-4 col-lg-3 mb-5">
                  <div className="row">
                    <div className="mx-auto image-box" style={{ position: "relative", cursor: "pointer" }} onClick={() => this.changeCheck(image.order)}>
                      <div className={this.props.group}>
                        <div className={"thumbnail img-thumbnail " + (this.state.check[image.order] ? "checked" : "")}
                          style={{ background: `url(${image.url})`, backgroundSize: "cover", backgroundPosition: "center", }}>
                        </div>
                      </div>
                      <input className="save_img_checkbox" style={{ position: "absolute" }} type="checkbox"
                        onChange={(e) => this.handleCheckChange(e)} name={image.order} checked={this.state.check[image.order]} />
                    </div>
                  </div>
                </div>
              ))
            }

          </div>
        </div>
        {/* <div className="alert alert-danger py-2 mb-5 mt-0" role="alert" id="choice-image-alert" style="display:none;">
            画像を選択してください。
      </div> */}
        <div className="mx-auto mb-5" style={{ width: 150 }}>

          <button type="submit" className={"gradient-btn " + this.props.group} style={{ width: 150 }}>
            <b>保存</b>
          </button>

        </div>

      </form>
    );
  };
};


export default BlogView;