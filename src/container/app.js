import React, { Component } from 'react';
import TagList from './tagList';
import ImageList from './imageList';

export default class App extends Component {
  render() {
    return (
      <div id='app'>
        <div className='content'>
          <ImageList />
        </div>
        <div className='sidebar'>
          <div className='content'>
            <TagList />
          </div>
        </div>
      </div>
    );
  }
}
