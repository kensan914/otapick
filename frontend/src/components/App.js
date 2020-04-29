import React from 'react';
import BlogList from './pages/BlogList'

function App() {
    const posts = [
    {
      id: 1,
      title: "仮データ1",
      description: "仮テキストです。"
    },
    {
      id: 2,
      title: "仮データ2",
      description: "仮テキストです。仮テキストです。"
    },
    {
      id: 3,
      title: "仮データ3",
      description: "仮テキストです。仮テキストです。仮テキストです。"
    }
    ]

    return(
        <BlogList />
    );
}

export default App;
