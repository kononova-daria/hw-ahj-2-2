import Action from './Actions';
import Rendering from './Rendering';
import Storage from './Storage';

const storage = new Storage(localStorage);

const page = new Rendering();

page.bindToDOM(document.querySelector('#container'));
page.draw();

const actions = new Action(page, storage);
actions.init();
