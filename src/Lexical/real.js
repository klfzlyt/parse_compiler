import Token from './token.js';
import Tag from './tag.js';
export default class Real extends Token {
	constructor(real) {
		super(Tag.REAL);
		this.value = real;
	}
}
