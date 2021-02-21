import React from "react";
import Headline from "../molecules/Headline";
import MemberListInfo from "../molecules/info/MemberListInfo";
import MemberCard from "../molecules/MemberCard";
import { URLJoin, updateMeta, gtagTo } from "../modules/utils";
import axios from "axios";
import { getGroup, generateWavesVals } from "../modules/utils";
import { Collapse } from "reactstrap";
import { BASE_URL, DELAY_TIME, GROUPS, MEMBERS_DESCRIPTION } from "../modules/env";
import { LoaderScreen } from "../molecules/Loader";
import { withRouter } from "react-router-dom";


class MemberListByGeneration extends React.Component {
  render() {
    return (
      <>
        <div className="row justify-content-between mx-2">
          <h3 className="my-auto d-flex align-items-center">{this.props.generation}期生</h3>
          <button onClick={() => this.props.setTogglerMemory(this.props.group, this.props.index)}
            className="btn rounded-circle p-0 otapick-hidden-button my-auto">
            {this.props.isOpen ? <i className="fas fa-chevron-up" style={{ color: "gray" }}></i>
              : <i className="fas fa-chevron-down" style={{ color: "gray" }}></i>}
          </button>
        </div>
        <hr className="mt-1" />
        <Collapse isOpen={this.props.isOpen}>
          <div className="row mb-5">
            {this.props.members.map(({ image, url, officialUrl, ct, lastKanji, firstKanji, lastKana, firstKana, belongingGroup }, i) => (
              <div key={i} className="col-6 col-md-4 col-xl-3 my-2 px-1 px-sm-3">
                <MemberCard key={i} id={i} ct={ct} image={image} url={url} officialUrl={officialUrl} lastKanji={lastKanji} firstKanji={firstKanji} lastKana={lastKana}
                  firstKana={firstKana} belongingGroup={belongingGroup} wavesVals={this.props.wavesVals} />
              </div>
            ))}
          </div>
        </Collapse>
      </>
    );
  }
}

class MemberListTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.initMembers = {};
    Object.values(GROUPS).forEach(groupObj => this.initMembers[groupObj.id] = []);
    this.initTogglerMemory = {};
    Object.values(GROUPS).forEach(groupObj => this.initTogglerMemory[groupObj.key] = []);
    this.state = {
      group: Object.values(GROUPS)[0].key,
      membersCollection: this.initMembers, // {"1": [[1期生], [2期生]], "2": [[1期生], [2期生], [3期生]]}
      wavesVals: [],
      togglerMemory: this.initTogglerMemory, // { "sakura": [], "hinata": [] },
    }
    this.getMembers();
    this.isRender = true;
  };

  changeGroup = (group) => {
    if (group !== this.state.group) {
      Object.values(GROUPS).forEach(groupObj => {
        if (groupObj.key === group) this.setState({ group: group });
      });
    }
  }

  getMembers = () => {
    const url = URLJoin(BASE_URL, "members/");

    setTimeout(() => {
      axios
        .get(url)
        .then(res => {
          if (this.isRender) {
            const _membersCollection = this.initMembers;
            const _togglerMemory = this.initTogglerMemory;
            Object.values(GROUPS).forEach(groupObj => {
              if (groupObj.isActive) {
                _membersCollection[groupObj.id] = [];
                for (const membersByGene of res.data[groupObj.key]) {
                  _membersCollection[groupObj.id].push(membersByGene.map(member =>
                    ({
                      image: member.image,
                      url: member.url,
                      officialUrl: member.official_url,
                      ct: member.ct,
                      lastKanji: member.last_kanji,
                      firstKanji: member.first_kanji,
                      lastKana: member.last_kana,
                      firstKana: member.first_kana,
                      belongingGroup: getGroup(member.belonging_group),
                    })
                  ))
                }

                const _togglerMemory_by_group = new Array(_membersCollection[groupObj.id].length);
                _togglerMemory_by_group.fill(true);
                _togglerMemory[groupObj.key] = _togglerMemory_by_group
              }
            });
            this.setState({
              membersCollection: _membersCollection,
              wavesVals: generateWavesVals(),
              togglerMemory: _togglerMemory,
            });

            updateMeta({ title: `メンバーリスト｜${GROUPS["1"].name}・${GROUPS["2"].name}`, description: MEMBERS_DESCRIPTION });
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          gtagTo(this.props.location.pathname);
        })
    }, DELAY_TIME);
  }

  setTogglerMemory(group, index) {
    let newToggleMemory = this.state.togglerMemory;
    newToggleMemory[group][index] = !newToggleMemory[group][index];
    this.setState({ togglerMemory: newToggleMemory });
  }

  componentWillUnmount() {
    this.isRender = false;
  }

  render() {
    let membersComponent = [];
    let numOfHit = 0;

    Object.values(GROUPS).forEach(groupObj => {
      if (groupObj.key === this.state.group) {
        for (const [index, members] of this.state.membersCollection[groupObj.id].entries()) {
          membersComponent.push(<MemberListByGeneration key={`${this.state.group}-${index + 1}`} generation={index + 1} members={members} wavesVals={this.state.wavesVals}
            group={this.state.group} isOpen={this.state.togglerMemory[groupObj.key][index]} index={index} setTogglerMemory={(group, index) => this.setTogglerMemory(group, index)} />);
          numOfHit += members.length;
        }
      }
    });

    return (
      <div className="container mt-3 text-muted">
        <Headline title="メンバーリスト" type="members" group={this.state.group} changeGroup={(group) => this.changeGroup(group)} />

        <MemberListInfo group={this.state.group} numOfHit={numOfHit} />
        <div className="container">
          {membersComponent.length === 0
            ? <LoaderScreen type="horizontal" />
            : membersComponent}
        </div>
      </div>
    );
  };
};

export default withRouter(MemberListTemplate);