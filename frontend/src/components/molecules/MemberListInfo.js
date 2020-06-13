import React from 'react';
import { Button, ButtonGroup } from 'reactstrap';


export class MemberListInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  getTitle = (group) => {
    if (group === "keyaki") return "欅坂46";
    else if (group === "hinata") return "日向坂46";
    else return "\u00A0";
  }

  selectGroup = (group) => {
    if (group !== this.props.group){
      if (group === "keyaki") {
        document.getElementById("keyaki-group-select-button").classList.add("active");
        document.getElementById("hinata-group-select-button").classList.remove("active");
      } else if (group === "hinata") {
        document.getElementById("keyaki-group-select-button").classList.remove("active");
        document.getElementById("hinata-group-select-button").classList.add("active");
      } else {
        document.getElementById("keyaki-group-select-button").classList.remove("active");
        document.getElementById("hinata-group-select-button").classList.remove("active");
      }
      this.props.changeGroup(group);
    }
  }

  render() {
    return (
      <>
        <div className={"card otapick-card2 my-4 " + this.props.group}>
          <div className="card-body px-sm-5 py-4">
            <div className="row mx-2 justify-content-between">
              <h3 className="my-auto d-flex align-items-center">{this.getTitle(this.props.group)}</h3>
              <ButtonGroup size="lg">
                <Button className="active rounded-pill" id="keyaki-group-select-button" onClick={() => this.selectGroup("keyaki")}>欅坂46</Button>
                <Button className="rounded-pill" id="hinata-group-select-button" onClick={() => this.selectGroup("hinata")} >日向坂46</Button>
              </ButtonGroup>
            </div>
            <hr />
            <div className="row justify-content-between">
              <div className="col-12 col-md-6 col-lg-7 col-xl-8">
                <div className="">検索結果（<b>{this.props.numOfHit}</b>件）</div>
              </div>

            </div>
          </div>
        </div>
      </>
    );
  };
};

export default MemberListInfo;