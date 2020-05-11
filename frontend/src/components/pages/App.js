import React from "react";
import NavigationBar from '../organisms/NavigationBar';
import Headline from '../molecules/Headline';
import BlogListTopCard from '../molecules/BlogListTopCard';
import BlogList from '../organisms/BlogList';


function App() {
  return (
    <div>
      <NavigationBar />
      <div className="container mt-3 text-muted">
        <Headline title="ブログ一覧" />
        <BlogListTopCard title="テスト" narrowing_keyword="テスト" narrowing_date="テスト" numOfHit="100" />
        <BlogList />
      </div>
    </div>
  );
}

export default App;