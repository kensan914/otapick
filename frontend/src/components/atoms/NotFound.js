import React from 'react';
import { Link } from 'react-router-dom';
import { BACKGROUNG_IMG_URL } from '../tools/env';


export class NotFoundBlogsContent extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {!this.props.hideAlert &&
          <div className="alert alert-danger search-suggestions-title" role="alert" style={{ borderRadius: "1rem" }}>このURLは有効ではありません。入力されたURLのページからブログが見つかりませんでした。</div>
        }
        <div className="mx-2 search-suggestions-discription">
          <p>入力されたURLのページにブログ情報が含まれているか、今一度ご確認ください。</p>
          <p>現在、<a target="_blank" href="https://www.keyakizaka46.com/s/k46o/diary/member?ima=0000">欅坂46公式ブログ</a>と<a target="_blank" href="https://www.hinatazaka46.com/s/official/diary/member?ima=0000">日向坂46公式ブログ</a>以外のサイトはサポートされておりません。ご了承ください。</p>
          <hr />
          <p>入力例1）https://www.keyakizaka46.com/s/k46o/diary/member?ima=0000</p>
          <p>入力例2）https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000</p>
        </div>
      </div>
    );
  };
};

export class NotFoundMembersContent extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {!this.props.hideAlert &&
          <div className="alert alert-danger search-suggestions-title" role="alert" style={{ borderRadius: "1rem" }}>該当するメンバーが見つかりませんでした。</div>
        }
        <div className="mx-2 search-suggestions-discription">
          <p>入力された文字列に間違いがないか、以下を参考に今一度ご確認ください。</p>
          <p><i class="fas fa-hand-point-right" />現在ニックネームやあだ名による検索はサポートしておりません。ご了承ください。</p>
          <p><i class="fas fa-hand-point-right" />ひらがなでの入力をお試しください。</p>
          <p><i class="fas fa-hand-point-right" />
            <Link to={'/members'}>メンバーリスト</Link>にお探しのメンバーがいるか確認してください。
          </p>
          <hr />
          <p>入力例1）平手友梨奈</p>
          <p>入力例2）わたなべ</p>
        </div>
      </div>
    );
  };
};

export class NotFoundImagesContent extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {!this.props.hideAlert &&
          <div className="alert alert-danger" role="alert" style={{ borderRadius: "1rem" }}>画像が見つかりませんでした。</div>
        }
        <div className="mx-2">
          <p>申し訳ございませんが、お探しのブログから画像が見つかりませんでした。</p>
        </div>
      </div>
    );
  };
};

export class NotFoundBlogsFaildContent extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {!this.props.hideAlert &&
          <div className="alert alert-danger" role="alert" style={{ borderRadius: "1rem" }}>ブログが見つかりませんでした。</div>
        }
        <div className="mx-2">
          <p>申し訳ございません。お探しのブログは見つかりませんでした。</p>
          <p>お探しのブログが公式ブログから一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。</p>
        </div>
      </div>
    );
  };
};

export class NotFoundImagesFaildContent extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        {!this.props.hideAlert &&
          <div className="alert alert-danger" role="alert" style={{ borderRadius: "1rem" }}>画像が見つかりませんでした。</div>
        }
        <div className="mx-2">
          <p>申し訳ございません。お探しの画像は見つかりませんでした。</p>
          <p>お探しの画像が掲載されているブログが公式ブログから一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。</p>
        </div>
      </div>
    );
  };
};

export class NotFound404Content extends React.Component {
  render() {
    return (
      <div className={this.props.className} style={this.props.style}>
        <div className="mx-2">
          <p>申し訳ございません。お探しのページは見つかりませんでした。</p>
          <p>一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。</p>
        </div>
      </div>
    );
  };
};


export class NotFoundMessage extends React.Component {
  render() {
    let content;
    if (this.props.type === "blog") {
      content = (
        <>
          <span class="display-3" style={{ color: "white" }}>Not Found Blog</span>
          <NotFoundBlogsContent className="p-3 mt-3 mb-2 notfound-message-body" hideAlert={true} />
        </>
      );
    } else if (this.props.type === "member") {
      content = (
        <>
          <span class="display-3" style={{ color: "white" }}>Not Found Member</span>
          <NotFoundMembersContent className="p-3 mt-3 mb-2 notfound-message-body" hideAlert={true} />
        </>
      );
    } else if (this.props.type === "image") {
      content = (
        <>
          <span class="display-3" style={{ color: "white" }}>Not Found Image</span>
          <NotFoundImagesContent className="p-3 mt-3 mb-2 notfound-message-body" hideAlert={true} />
        </>
      );
    } else if (this.props.type === "blogFailed") {
      content = (
        <>
          <span class="display-3" style={{ color: "white" }}>Not Found Blog</span>
          <NotFoundBlogsFaildContent className="p-3 mt-3 mb-2 notfound-message-body" hideAlert={true} />
        </>
      );
    } else if (this.props.type === "imageFailed") {
      content = (
        <>
          <span class="display-3" style={{ color: "white" }}>Not Found Image</span>
          <NotFoundImagesFaildContent className="p-3 mt-3 mb-2 notfound-message-body" hideAlert={true} />
        </>
      );
    } else if (this.props.type === "404") {
      content = (
        <>
          <span class="display-3" style={{ color: "white" }}>404 Not Found</span>
          <NotFound404Content className="p-3 mt-3 mb-2 notfound-message-body" hideAlert={true} />
        </>
      );
    }

    return (
      <div className={"notfound-message py-4 px-3 px-sm-4 shadow-sm text-muted " + (this.props.margin && "notfound-message-margin-bottom")}
        style={{ backgroundImage: `url(${BACKGROUNG_IMG_URL})` }}>
        {content}
      </div>
    );
  }
}