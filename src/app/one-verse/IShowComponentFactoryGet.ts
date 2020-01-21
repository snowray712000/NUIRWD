import { ComponentFactory } from '@angular/core';
import { ShowBase } from './show-data/ShowBase';

export interface IShowComponentFactoryGet {
  getFact(showObj: ShowBase): ComponentFactory<any>;
}
