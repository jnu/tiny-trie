import BitWriter from './BitWriter';
import {CHAR_OFFSET, W} from './constants';

const FINAL_MASK = 1 << (W - 1);

/**
  A Trie node, for use in building the encoding trie. This is not needed for
  the decoder.
  */
class TrieNode {

    constructor( letter ) {
        this.letter = letter;
        this.final = false;
        this.children = [];
    }

}

export default class Trie {

    constructor() {
        this.previousWord = "";
        this.root = new TrieNode(' ');
        this.cache = [ this.root ];
        this.nodeCount = 1;
    }

    /**
      Returns the number of nodes in the trie
     */
    getNodeCount() {
        return this.nodeCount;
    }

    /**
      Inserts a word into the trie. This function is fastest if the words are
      inserted in alphabetical order.
     */
    insert( word ) {
        var commonPrefix = 0;
        for( var i = 0; i < Math.min( word.length, this.previousWord.length );
                i++ )
        {
            if ( word[i] !== this.previousWord[i] ) { break; }
            commonPrefix += 1;
        }

        this.cache.length = commonPrefix + 1;
        var node = this.cache[ this.cache.length - 1 ];

        for( i = commonPrefix; i < word.length; i++ ) {
            var next = new TrieNode( word[i] );
            this.nodeCount++;
            node.children.push( next );
            this.cache.push( next );
            node = next;
        }

        node.final = true;
        this.previousWord = word;
    }

    /**
      Apply a function to each node, traversing the trie in level order.
      */
    apply( fn ) {
        var level = [ this.root ];
        while( level.length > 0 ) {
            var node = level.shift();
            for( var i = 0; i < node.children.length; i++ ) {
                level.push( node.children[i] );
            }
            fn( node );
        }
    }

    /**
      Encode the trie and all of its nodes. Returns a string representing the
      encoded data.
      */
    encode() {
        // Write the unary encoding of the tree in level order.
        var bits = new BitWriter();
        bits.write( 0x02, 2 );
        this.apply( function( node ) {
            for( var i = 0; i < node.children.length; i++ ) {
                bits.write( 1, 1 );
            }
            bits.write( 0, 1 );
        });

        // Write the data for each node, using 1 bit for the "final" indicator
        // and the remaining bits for the character itself.
        this.apply( function( node ) {
            var value = node.letter.charCodeAt(0) - CHAR_OFFSET;
            if ( node.final ) {
                value |= FINAL_MASK;
            }

            bits.write( value, W );
        });

        return bits.getData();
    }
};
