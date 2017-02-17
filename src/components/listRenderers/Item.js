import React from 'react';
import {dispatch} from 'ringa';
import {watch} from 'react-ringa';
import AppController from '../../global/AppController';

import './Item.scss';

export default class Item extends React.Component {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    watch(this, props.item);

    this.clickHandler = this.clickHandler.bind(this);
    this.deleteClickHandler = this.deleteClickHandler.bind(this);
    this.blurHandler = this.blurHandler.bind(this);
    this.inputKeyUpHandler = this.inputKeyUpHandler.bind(this);
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  tryFocusInput() {
    if (this.refs.input && this.refs.input !== document.activeElement) {
      this.refs.input.focus();
    }
  }

  componentDidUpdate() {
    this.tryFocusInput();
  }

  componentDidMount() {
    this.tryFocusInput();
  }

  render() {
    const {title, editing} = this.props.item;

    if (editing) {
      return <div className="item" ref="rootNode">
        <input ref="input" defaultValue={title} onBlur={this.blurHandler} onKeyUp={this.inputKeyUpHandler} />
      </div>;
    }

    return <div className="item" ref="rootNode" onClick={this.clickHandler}>
      <div className="item--title">{title}</div>
      <div className="item--delete" onClick={this.deleteClickHandler}><i className="fa fa-times-circle" aria-hidden="true"></i></div>
    </div>;
  }

  save() {
    this.props.item.title = this.refs.input.value;
    this.props.item.editing = false;
    this.props.item.saving = false;

    dispatch(AppController.SAVE_ITEM, {
      item: this.props.item
    }, this.refs.rootNode);
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  clickHandler() {
    this.props.item.editing = true;
  }

  inputKeyUpHandler(event) {
    if (event.key === 'Enter') {
      this.save();
    }
  }

  blurHandler() {
    this.save();
  }

  deleteClickHandler(event) {
    event.stopPropagation();

    dispatch(AppController.REMOVE_ITEM, {
      item: this.props.item
    }, this.refs.rootNode);
  }
}
