import React from 'react';
import { BOTTOM_NAVBAR_HEIGHT } from '../tools/env';
import { Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';


class BottomNavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeType: "", // "" or "home" or "images" or "blogs" or "members"
    }
  }

  activateType = (type) => {
    if (type === "" || type === "home" || type === "images" || type === "blogs" || type === "members") {
      if (this.state.activeType !== type) {
        this.setState({ activeType: type });
      }
    }
  }

  deactivateType = () => {
    if (this.state.activeType !== "") {
      this.setState({ activeType: "" });
    }
  }

  checkTypeActivation() {
    if (this.props.location.pathname === "/") {
      this.activateType("home");
    } else if (this.props.location.pathname.startsWith("/images")) {
      this.activateType("images");
    } else if (this.props.location.pathname.startsWith("/blogs")) {
      this.activateType("blogs");
    } else if (this.props.location.pathname.startsWith("/members")) {
      this.activateType("members");
    } else {
      this.activateType("");
    }
  }

  componentDidMount() {
    this.checkTypeActivation();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.checkTypeActivation();
    }
  }

  render() {
    return (
      <>
        <div className="bottom-navbar border-top text-muted" id="otapick-bottom-navbar"
          style={{ height: BOTTOM_NAVBAR_HEIGHT }}>
          <div className="container">
            <div className="d-flex">
              <div className="col-3 bottom-navbar-button-wrapper">
                <BottomNavigationBarButton href="/" title="ホーム" iconClassName="fas fa-home" history={this.props.history}
                  className={this.state.activeType === "home" ? "active" : ""} />
              </div>
              <div className="col-3 bottom-navbar-button-wrapper">
                <BottomNavigationBarButton href="/images" title="画像一覧" iconClassName="fas fa-image" history={this.props.history}
                  className={this.state.activeType === "images" ? "active" : ""} />
              </div>
              <div className="col-3 bottom-navbar-button-wrapper">
                <BottomNavigationBarButton href="/blogs" title="ブログ一覧" iconClassName="fas fa-book-open" history={this.props.history}
                  className={this.state.activeType === "blogs" ? "active" : ""} />
              </div>
              <div className="col-3 bottom-navbar-button-wrapper">
                <BottomNavigationBarButton href="/members" title="メンバー" iconClassName="fas fa-user" history={this.props.history}
                  className={this.state.activeType === "members" ? "active" : ""} />
              </div>
            </div>
          </div>
        </div >
      </>
    );
  };
};

const BottomNavigationBarButton = (props) => {
  return (
    <Button className={"transparent-button-mobile bottom-navbar-button " + (props.className ? props.className : "")}
      onClick={() => props.history.push(props.href)}>
      <i className={"bottom-navbar-button-icon " + props.iconClassName} />
      <div className="bottom-navbar-button-title">{props.title}</div>
    </Button>
  );
}


export default withRouter(BottomNavigationBar);