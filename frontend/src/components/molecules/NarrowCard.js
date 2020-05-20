import React from 'react';
import { UncontrolledCollapse } from 'reactstrap';
import OtapickButton from '../atoms/OtapickButton'


class NarrowCard extends React.Component {
  render() {
    return (
      <UncontrolledCollapse toggler="#narrowing">
        <div className="container mb-3 px-1">
          <div className="mt-2">
            <div className="card card-body">
              <h5 className="mb-3"><b>絞り込み</b></h5>

              <div className="form-group row mx-2">
                <label for="keyword_form" className="col-md-2 col-form-label col-form-label-sm">キーワード</label>
                <div className="col-md-10">
                  <input type="search" className="form-control form-control-sm" id="keyword_form"
                    placeholder="例)握手会" name="keyword" maxlength='20' />
                </div>
              </div>
              <div className="form-group row mx-2">
                <label for="month_picker" className="col-md-2 col-form-label col-form-label-sm">投稿月</label>
                <div className="col-md-10">
                  <input type="month" className="form-control form-control-sm" value="" id="month_picker"
                    name="post" />
                </div>
              </div>

              <hr />
              <div className="row">
                <a className="btn btn-light rounded-pill ml-auto mr-3 d-flex align-items-center" href=""
                  style={{ border: "solid 1px silver", borderRadius: "5%", backgroundColor: "#F4F3F3", color: "dimgray" }}>
                  条件を解除
                </a>

                <div className="mr-4">
                  <OtapickButton group={this.props.group} href="" width="100" title="適用" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </UncontrolledCollapse>
    );
  };
};

export default NarrowCard;