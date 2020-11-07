import React from "react";
import { UncontrolledCollapse, Button } from "reactstrap";
import OtapickButton from "../atoms/OtapickButton";
import Picker from "react-month-picker"
import "../../static/css/month-picker.css";


class MonthBox extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      value: this.props.value || "-/-",
    }
    this._handleClick = this._handleClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value || "-/-",
    })
  }
  render() {
    return (
      <input className="form-control form-control-sm" value={this.state.value} id="month_picker"
        name="post" onClick={this._handleClick} autoComplete="off" onChange={(val) => { }} />
    );
  }
  _handleClick(e) {
    this.props.onClick && this.props.onClick(e);
  }
}

class NarrowCard extends React.Component {
  constructor(props) {
    super(props);
    this.pickAMonth = React.createRef();
    const now = new Date();
    this.initMvalue = { year: now.getFullYear(), month: now.getMonth() + 1 };
    this.state = {
      kwvalue: "",
      mvalue: {},
    }

    this.handleClickMonthBox = this.handleClickMonthBox.bind(this)
    this.handleAMonthChange = this.handleAMonthChange.bind(this)
    this.handleAMonthDissmis = this.handleAMonthDissmis.bind(this)
  }

  handleChangeKw(e) {
    this.setState({ kwvalue: e.target.value });
  }
  handleClickMonthBox(e) {
    this.refs.pickAMonth.show()
  }
  handleAMonthChange(changedYear, changedMonth) {
    if (this.state.mvalue["year"] == changedYear && this.state.mvalue["month"] == changedMonth) {
      this.setState({ mvalue: {} });
    } else this.setState({ mvalue: { year: changedYear, month: changedMonth } });
  }
  handleAMonthDissmis(value) {
    //
  }
  applyNarrowing() {
    let queryParams = {};
    if (this.state.kwvalue) queryParams["keyword"] = this.state.kwvalue;
    if (Object.keys(this.state.mvalue).length !== 0) queryParams["post"] = `${this.state.mvalue.year}-${this.state.mvalue.month}`;
    this.props.pushHistory(queryParams);
  }

  render() {
    const pickerLang = {
      months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    }
    const mvalue = this.state.mvalue
    const makeText = m => {
      if (m && m.year && m.month) return (`${m.year}-${pickerLang.months[m.month - 1]}`)
      else return ""
    }


    return (
      <UncontrolledCollapse toggler="#narrowing">
        <div className="container mb-3 px-1">
          <div className="mt-2">
            <div className="card card-body">
              <h5 className="mb-3"><b>絞り込み</b></h5>

              <div className="form-group row mx-0 mx-sm-2">
                <label htmlFor="keyword_form" className="col-md-2 col-form-label col-form-label-sm">キーワード</label>
                <div className="col-md-10">
                  <input type="text" value={this.state.kwvalue} onChange={(e) => this.handleChangeKw(e)} maxLength="20"
                    className="form-control form-control-sm" id="keyword_form" placeholder="例)握手会" name="keyword" autoComplete="off" />
                </div>
              </div>
              <div className="form-group row mx-0 mx-sm-2">
                <label htmlFor="month_picker" className="col-md-2 col-form-label col-form-label-sm">投稿月</label>
                <div className="col-md-10">
                  <Picker
                    ref="pickAMonth"
                    years={{ min: 2013 }}
                    value={this.initMvalue}
                    lang={pickerLang.months}
                    onChange={this.handleAMonthChange}
                    onDismiss={this.handleAMonthDissmis}
                  >
                    <MonthBox value={makeText(mvalue)} onClick={this.handleClickMonthBox} />
                  </Picker>
                </div>
              </div>

              <hr />
              <div className="row">
                <Button color="light" className="rounded-pill ml-auto mr-3 d-flex align-items-center" onClick={() => this.props.pushHistory({})}
                  style={{ border: "solid 1px silver", borderRadius: "5%", backgroundColor: "#F4F3F3", color: "dimgray" }}>
                  条件を解除
                </Button>

                <div className="mr-4">
                  <OtapickButton group={this.props.group} width="100" title="適用" onClick={() => this.applyNarrowing()} />
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