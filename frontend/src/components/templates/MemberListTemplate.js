import React, { useState } from "react";
import Headline from '../molecules/Headline';
import MemberListInfo from '../molecules/MemberListInfo';
import MemberCard from "../molecules/MemberCard";
import { URLJoin } from '../tools/support';
import axios from 'axios';
import { getGroup, generateWavesVals } from '../tools/support';
import { UncontrolledCollapse } from 'reactstrap';
import { BASE_URL } from "../tools/env";
import { LoaderScreen } from "../molecules/Loader";


class MemberListByGeneration extends React.Component {
  render() {
    const togglerID = `toggler-${this.props.group}-${this.props.generation}`;

    return (
      <>
        <div className="row justify-content-between mx-2">
          <h3 className="my-auto d-flex align-items-center">{this.props.generation}期生</h3>
          <button onClick={() => this.props.setTogglerMemory(this.props.group, this.props.index)}
            className="btn rounded-circle p-0 otapick-hidden-button my-auto" id={togglerID}>
            {this.props.isOpen ? <i className="fas fa-chevron-up" style={{ color: "gray" }}></i>
              : <i className="fas fa-chevron-down" style={{ color: "gray" }}></i>}

          </button>
        </div>
        <hr className="mt-1" />
        <UncontrolledCollapse toggler={"#" + togglerID} defaultOpen={this.props.isOpen}>
          <div className="row mb-5">
            {this.props.members.map(({ image, url, offcialUrl, ct, lastKanji, firstKanji, lastKana, firstKana, belongingGroup }, i) => (
              <MemberCard key={i} ct={ct} image={image} blogsUrl={url["blogs"]} imagesUrl={url["images"]} offcialUrl={offcialUrl} lastKanji={lastKanji} firstKanji={firstKanji} lastKana={lastKana}
                firstKana={firstKana} belongingGroup={belongingGroup} wavesVals={this.props.wavesVals} />
            ))}
          </div>
        </UncontrolledCollapse>
      </>
    );
  }
}

class MemberListTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: "keyaki",
      keyakiMembers: [], // [[1期生], [2期生]]
      hinataMembers: [], // [[1期生], [2期生], [3期生]]
      wavesVals: [],
      togglerMemory: { "keyaki": [], "hinata": [] },
    }
    this.getMembers();
  };

  changeGroup = (group) => {
    if (group !== this.state.group) {
      if (group === "keyaki" || group === "hinata") this.setState({ group: group });
      else this.setState({ group: "" });
    }
  }

  getMembers = () => {
    const url = URLJoin(BASE_URL, "api/members/");

    setTimeout(() => {
      axios
        .get(url)
        .then(res => {
          let keyakiMembers = [];
          for (const members of res.data["keyaki"]) {
            keyakiMembers.push(members.map((member, index) =>
              ({
                image: member.image,
                url: member.url,
                offcialUrl: member.official_url,
                ct: member.ct,
                lastKanji: member.last_kanji,
                firstKanji: member.first_kanji,
                lastKana: member.last_kana,
                firstKana: member.first_kana,
                belongingGroup: getGroup(member.belonging_group),
              })
            ))
          }
          let hinataMembers = [];
          for (const members of res.data["hinata"]) {
            hinataMembers.push(members.map((member, index) =>
              ({
                image: member.image,
                url: member.url,
                offcialUrl: member.official_url,
                ct: member.ct,
                lastKanji: member.last_kanji,
                firstKanji: member.first_kanji,
                lastKana: member.last_kana,
                firstKana: member.first_kana,
                belongingGroup: getGroup(member.belonging_group),
              })
            ))
          }
          let togglerMemoryKeyaki = new Array(keyakiMembers.length);
          togglerMemoryKeyaki.fill(true);
          let togglerMemoryHinata = new Array(hinataMembers.length);
          togglerMemoryHinata.fill(true);
          this.setState({
            keyakiMembers: keyakiMembers,
            hinataMembers: hinataMembers,
            wavesVals: generateWavesVals(),
            togglerMemory: { "keyaki": togglerMemoryKeyaki, "hinata": togglerMemoryHinata },
          })
        })
        .catch(err => {
          console.log(err);
        })
        .finally()
    }, 300);
  }

  setTogglerMemory(group, index) {
    let newToggleMemory = this.state.togglerMemory;
    newToggleMemory[group][index] = !newToggleMemory[group][index];
    this.setState({ togglerMemory: newToggleMemory });
  }

  render() {
    let membersComponent = [];
    let numOfHit = 0;
    if (this.state.group === "keyaki") {
      for (const [index, members] of this.state.keyakiMembers.entries()) {
        membersComponent.push(<MemberListByGeneration key={`${this.state.group}-${index + 1}`} generation={index + 1} members={members} wavesVals={this.state.wavesVals}
          group={this.state.group} isOpen={this.state.togglerMemory.keyaki[index]} index={index} setTogglerMemory={(group, index) => this.setTogglerMemory(group, index)} />);
        numOfHit += members.length;
      }
    } else if (this.state.group === "hinata") {
      for (const [index, members] of this.state.hinataMembers.entries()) {
        membersComponent.push(<MemberListByGeneration key={`${this.state.group}-${index + 1}`} generation={index + 1} members={members} wavesVals={this.state.wavesVals}
          group={this.state.group} isOpen={this.state.togglerMemory.hinata[index]} index={index} setTogglerMemory={(group, index) => this.setTogglerMemory(group, index)} />);
        numOfHit += members.length;
      }
    }

    return (
      <>
        <Headline title="メンバーリスト" />
        <MemberListInfo group={this.state.group} numOfHit={numOfHit} changeGroup={(group) => this.changeGroup(group)} />

        <div className="container">
          {membersComponent.length === 0
            ? <LoaderScreen type="horizontal" />
            : membersComponent}
        </div>
      </>
    );
  };
};

export default MemberListTemplate;