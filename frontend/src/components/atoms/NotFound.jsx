import React from "react";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/index";

import {
  BACKGROUND_IMG_URL,
  GROUPS,
  MEMBER_NOTFOUND_IMG_URL,
  OTAPICK_TWITTER_URL,
} from "~/constants/env";

export class NotFoundBlogsContent extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {!this.props.hideAlert && (
          <div
            className="alert alert-danger search-suggestions-title"
            role="alert"
            style={{ borderRadius: "1rem" }}
          >
            このURLは有効ではありません。入力されたURLのページからブログが見つかりませんでした。
          </div>
        )}
        <div className="mx-2 search-suggestions-description">
          <p>
            入力されたURLのページにブログ情報が含まれているか、今一度ご確認ください。
          </p>
          <p>
            現在、
            <a
              rel="noreferrer"
              target="_blank"
              href={GROUPS["1"].blogUrl}
            >{`${GROUPS["1"].name}公式ブログ`}</a>
            ・
            <a
              rel="noreferrer"
              target="_blank"
              href={GROUPS["2"].blogUrl}
            >{`${GROUPS["2"].name}公式ブログ`}</a>
            ・
            <a
              rel="noreferrer"
              target="_blank"
              href={GROUPS["3"].blogUrl}
            >{`${GROUPS["3"].name}公式ブログ`}</a>
            以外のサイトはサポートされておりません。ご了承ください。
          </p>
          <hr />
          <p>{`入力例1）${GROUPS["1"].blogUrlExample}`}</p>
          <p>{`入力例2）${GROUPS["2"].blogUrlExample}`}</p>
        </div>
      </div>
    );
  }
}

export class NotFoundMembersContent extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {!this.props.hideAlert && (
          <div
            className="alert alert-danger search-suggestions-title"
            role="alert"
            style={{ borderRadius: "1rem" }}
          >
            該当するメンバーが見つかりませんでした。
          </div>
        )}
        <div className="mx-2 search-suggestions-description">
          <p>
            今一度以下を参考に<b>メンバーの名前</b>・<b>あだ名</b>
            を入力してください。
          </p>
          <div className="d-flex">
            <img
              src={MEMBER_NOTFOUND_IMG_URL}
              className="mx-auto member_notfound_img"
              alt="メンバー検索参考画像"
            />
          </div>
          <hr />
          <h5 className="search-suggestions-title">メンバーリスト</h5>
          <p>
            お探しのメンバーを
            <Link to="/members/" style={{ color: "deepskyblue" }}>
              <b>メンバーリスト</b>
            </Link>
            から見つけ出すこともできます。
          </p>
          <hr />
          <h5 className="search-suggestions-title">あだ名リクエスト</h5>
          <p className="mb-0">
            ヲタピックはより良いメンバー検索体験を提供するため、あだ名対応に努めています。もしあなたがあだ名で検索してヒットが無かった場合、今現在そのあだ名は登録されていないかもしれません。良かったら未知なるそのあだ名を教えていただけませんか？
            <br />
            <a
              rel="noreferrer"
              target="_blank"
              href={OTAPICK_TWITTER_URL}
              style={{ color: "deepskyblue" }}
            >
              <FontAwesomeIcon icon={faTwitter} />{" "}
              <b>ヲタピック公式Twitter DM</b>
            </a>
            までお願いします！
          </p>
        </div>
      </div>
    );
  }
}

export class NotFoundImagesContent extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {!this.props.hideAlert && (
          <div
            className="alert alert-danger"
            role="alert"
            style={{ borderRadius: "1rem" }}
          >
            画像が見つかりませんでした。
          </div>
        )}
        <div className="mx-2">
          <p>
            申し訳ございませんが、お探しのブログから画像が見つかりませんでした。
          </p>
        </div>
      </div>
    );
  }
}

export class NotFoundBlogsFailedContent extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {!this.props.hideAlert && (
          <div
            className="alert alert-danger"
            role="alert"
            style={{ borderRadius: "1rem" }}
          >
            ブログが見つかりませんでした。
          </div>
        )}
        <div className="mx-2">
          <p>申し訳ございません。お探しのブログは見つかりませんでした。</p>
          <p>
            お探しのブログが公式ブログから一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。
          </p>
        </div>
      </div>
    );
  }
}

export class NotFoundImagesFailedContent extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {!this.props.hideAlert && (
          <div
            className="alert alert-danger"
            role="alert"
            style={{ borderRadius: "1rem" }}
          >
            画像が見つかりませんでした。
          </div>
        )}
        <div className="mx-2">
          <p>申し訳ございません。お探しの画像は見つかりませんでした。</p>
          <p>
            お探しの画像が掲載されているブログが公式ブログから一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。
          </p>
        </div>
      </div>
    );
  }
}

class NotFoundFavoriteImagesContent extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        <div className="mx-2">
          {/* {!isSmp && <p>マイフォルダに追加された画像がありません。</p>} */}
          <p>
            <b>お気に入り画像を追加しましょう</b>
          </p>
          <p>
            お気に入り画像を探し <FontAwesomeIcon icon={faBookmark} />{" "}
            を押すことでマイフォルダに追加できます。お気に入り画像はここからいつでも確認できます。
          </p>
        </div>
      </div>
    );
  }
}

class NotFound404Content extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        <div className="mx-2">
          <p>申し訳ございません。お探しのページは見つかりませんでした。</p>
          <p>
            一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。
          </p>
        </div>
      </div>
    );
  }
}

export class NotFoundMessage extends React.Component {
  render() {
    let content;
    if (this.props.type === "blog") {
      content = (
        <>
          <span className="display-3" style={{ color: "white" }}>
            Not Found Blog
          </span>
          <NotFoundBlogsContent
            className="p-3 mt-3 mb-2 notfound-message-body"
            hideAlert={true}
          />
        </>
      );
    } else if (this.props.type === "member") {
      content = (
        <>
          <span className="display-3" style={{ color: "white" }}>
            Not Found Member
          </span>
          <NotFoundMembersContent
            className="p-3 mt-3 mb-2 notfound-message-body"
            hideAlert={true}
          />
        </>
      );
    } else if (this.props.type === "image") {
      content = (
        <>
          <span className="display-3" style={{ color: "white" }}>
            Not Found Image
          </span>
          <NotFoundImagesContent
            className="p-3 mt-3 mb-2 notfound-message-body"
            hideAlert={true}
          />
        </>
      );
    } else if (this.props.type === "blogFailed") {
      content = (
        <>
          <span className="display-3" style={{ color: "white" }}>
            Not Found Blog
          </span>
          <NotFoundBlogsFailedContent
            className="p-3 mt-3 mb-2 notfound-message-body"
            hideAlert={true}
          />
        </>
      );
    } else if (this.props.type === "imageFailed") {
      content = (
        <>
          <span className="display-3" style={{ color: "white" }}>
            Not Found Image
          </span>
          <NotFoundImagesFailedContent
            className="p-3 mt-3 mb-2 notfound-message-body"
            hideAlert={true}
          />
        </>
      );
    } else if (this.props.type === "favoriteImage") {
      content = (
        <>
          <span className="display-3" style={{ color: "white" }}>
            Not Found Image
          </span>
          <NotFoundFavoriteImagesContent
            className="p-3 mt-3 mb-2 notfound-message-body"
            hideAlert={true}
          />
        </>
      );
    } else if (this.props.type === "404") {
      content = (
        <>
          <span className="display-3" style={{ color: "white" }}>
            404 Not Found
          </span>
          <NotFound404Content
            className="p-3 mt-3 mb-2 notfound-message-body"
            hideAlert={true}
          />
        </>
      );
    }

    return (
      <div
        className={
          "notfound-message py-4 px-3 px-sm-4 shadow-sm text-muted " +
          (this.props.margin && "notfound-message-margin-bottom")
        }
        style={{ backgroundImage: `url(${BACKGROUND_IMG_URL})` }}
      >
        {content}
      </div>
    );
  }
}
