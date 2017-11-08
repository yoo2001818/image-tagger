import React, { Component } from 'react';
import TagList from './tagList';
import ImageList from './imageList';

export default class App extends Component {
  render() {
    return (
      <div id='app'>
        <h1>Hello, world!</h1>
        <TagList />
        <ImageList />
      </div>
    );
  }
}
