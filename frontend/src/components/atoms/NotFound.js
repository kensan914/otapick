import React from 'react';
import { Link } from 'react-router-dom';


export class NotFoundBlogs extends React.Component {
  render() {
    return (
      <>
        <div className="alert alert-danger" role="alert" style={{ borderRadius: "1rem" }}>このURLは有効ではありません。入力されたURLのページからブログが見つかりませんでした。</div>
        <div className="mx-2">
          <p>入力されたURLのページにブログ情報が含まれているか、今一度ご確認ください。</p>
          <p>現在、<a target="_blank" href="https://www.keyakizaka46.com/s/k46o/diary/member?ima=0000">欅坂46公式ブログ</a>と<a target="_blank" href="https://www.hinatazaka46.com/s/official/diary/member?ima=0000">日向坂46公式ブログ</a>以外のサイトはサポートされておりません。ご了承ください。</p>
          <hr />
          <p>入力例1）https://www.keyakizaka46.com/s/k46o/diary/member?ima=0000</p>
          <p>入力例2）https://www.hinatazaka46.com/s/official/diary/member/list?ima=0000</p>
        </div>
      </>
    );
  };
};


export class NotFoundMembers extends React.Component {
  render() {
    return (
      <>
        <div className="alert alert-danger" role="alert" style={{ borderRadius: "1rem" }}>該当するメンバーが見つかりませんでした。</div>
        <div className="mx-2">
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
      </>
    );
  };
};