import React, { useState } from 'react';
import BackButton from '../atoms/BackButton';
import { Button, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { URLJoin } from '../tools/support';
import { BASE_URL } from "../tools/env";
import { Link } from 'react-router-dom';


const ModeSelectButtonDropdown = (props) => {
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  let contents = [];
  for (const [index, membersDividedByGeneration] of props.members.entries()) {
    contents.push(
      <>
        <DropdownItem header>{`${index + 1}期生`}</DropdownItem>
        <DropdownItem divider />
        {membersDividedByGeneration.map(({ url, full_kanji }, j) => (
          <DropdownItem tag={Link} to={url[props.type]}>{full_kanji}</DropdownItem>
        ))}
        {index != props.members.length - 1 && <DropdownItem divider />}
      </>
    );
  }

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} onClick={(e) => e.stopPropagation()}>
      <DropdownToggle className={"rounded-circle mode-select-dropdown-button " + props.group} >
        <i class="fas fa-angle-down"></i>
      </DropdownToggle>
      <DropdownMenu className="mode-select-dropdown-menu">
        {contents}
      </DropdownMenu>
    </ButtonDropdown>
  );
}

class Headline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyakiMembers: [], // [[1期生], [2期生]]
      hinataMembers: [], // [[1期生], [2期生], [3期生]]
    }
  };

  componentDidMount() {
    if (typeof this.props.type != "undefined") {
      console.log("ccc")
      const url = URLJoin(BASE_URL, "api/members/");
      axios
        .get(url)
        .then(res => {
          let keyakiMembers = [];
          for (const members of res.data["keyaki"]) {
            keyakiMembers.push(members.map((member, index) =>
              ({
                url: member.url,
                full_kanji: member.full_kanji,
              })
            ))
          }
          let hinataMembers = [];
          for (const members of res.data["hinata"]) {
            hinataMembers.push(members.map((member, index) =>
              ({
                url: member.url,
                full_kanji: member.full_kanji,
              })
            ))
          }
          this.setState({
            keyakiMembers: keyakiMembers,
            hinataMembers: hinataMembers,
          })
        })
        .catch(err => {
          console.log(err);
        })
        .finally()
    }
  }

  render() {
    if (typeof this.props.type == "undefined") {
      return (
        <div className="row d-flex align-items-center">
          <BackButton />
          <h3 className="ml-3 my-0">{this.props.title}</h3>
        </div>
      );
    } else {
      let modeSelectButtonGroup;
      if (this.props.type === "blogs" || this.props.type === "images") {
        modeSelectButtonGroup = (
          <ButtonGroup size="lg">
            <Button className={"rounded-pill mode-select-button recommend " + (this.props.mode === "recommend" && "active")}>おすすめ</Button>
            <Button className={"rounded-pill d-flex align-items-center mode-select-button keyaki " + (this.props.mode === "keyaki" && "active")}
              onClick={() => this.props.history.push(`/${this.props.type}/1`)}>
              欅坂46<ModeSelectButtonDropdown group="keyaki" members={this.state.keyakiMembers} type={this.props.type} />
            </Button>
            <Button className={"rounded-pill d-flex align-items-center mode-select-button hinata " + (this.props.mode === "hinata" && "active")}
              onClick={() => this.props.history.push(`/${this.props.type}/2`)}>
              日向坂46<ModeSelectButtonDropdown group="hinata" members={this.state.hinataMembers} type={this.props.type} />
            </Button>
          </ButtonGroup>
        );
      }

      return (
        <div className="row justify-content-between mr-0">
          <div className="d-flex align-items-center">
            <BackButton />
            <h3 className="ml-3 my-0">{this.props.title}</h3>
          </div>

          {modeSelectButtonGroup}
        </div>
      );
    }
  };
};

export default withRouter(Headline);