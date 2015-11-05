import RankDirectory from './RankDirectory';
import BitString from './BitString';
import {L1, L2, CHAR_OFFSET, W} from './constants';

/**
  This class is used for traversing the succinctly encoded trie.
  */
class FrozenTrieNode {

    constructor(trie, index, letter, final, firstChild, childCount) {
        this.trie = trie;
        this.index = index;
        this.letter = letter;
        this.final = final;
        this.firstChild = firstChild;
        this.childCount = childCount;
    }

    /**
      Returns the number of children.
      */
    getChildCount() {
        return this.childCount;
    }

    /**
      Returns the FrozenTrieNode for the given child.

      @param index The 0-based index of the child of this node. For example, if
      the node has 5 children, and you wanted the 0th one, pass in 0.
    */
    getChild(index) {
        return this.trie.getNodeByIndex(this.firstChild + index);
    }

}


/**
    The FrozenTrie is used for looking up words in the encoded trie.

    @param data A string representing the encoded trie.

    @param directoryData A string representing the RankDirectory. The global L1
    and L2 constants are used to determine the L1Size and L2size.

    @param nodeCount The number of nodes in the trie.
  */
export default class FrozenTrie {

    constructor(data, directoryData, nodeCount) {
        this.data = new BitString( data );
        this._rawData = data;
        this._rawDirectory = directoryData;
        this._nodeCount = nodeCount;
        this.directory = new RankDirectory( directoryData, data,
                nodeCount * 2 + 1, L1, L2 );

        // The position of the first bit of the data in 0th node. In non-root
        // nodes, this would contain 6-bit letters.
        this.letterStart = nodeCount * 2 + 1;
    }

    /**
       Retrieve the FrozenTrieNode of the trie, given its index in level-order.
       This is a private function that you don't have to use.
      */
    getNodeByIndex(index) {
        // retrieve the 6-bit letter.
        var final = this.data.get( this.letterStart + index * W, 1 ) === 1;
        var letter = String.fromCharCode(
                this.data.get( this.letterStart + index * W + 1, (W - 1) ) +
                CHAR_OFFSET);
        var firstChild = this.directory.select( 0, index+1 ) - index;

        // Since the nodes are in level order, this nodes children must go up
        // until the next node's children start.
        var childOfNextNode = this.directory.select( 0, index + 2 ) - index - 1;

        return new FrozenTrieNode( this, index, letter, final, firstChild,
                childOfNextNode - firstChild );
    }

    /**
      Retrieve the root node. You can use this node to obtain all of the other
      nodes in the trie.
      */
    getRoot() {
        return this.getNodeByIndex( 0 );
    }

    /**
      Look-up a word in the trie. Returns true if and only if the word exists
      in the trie.
      */
    lookup(word) {
        var node = this.getRoot();
        for ( var i = 0; i < word.length; i++ ) {
            var child;
            var j = 0;
            for ( ; j < node.getChildCount(); j++ ) {
                child = node.getChild( j );
                if ( child.letter === word[i] ) {
                    break;
                }
            }

            if ( j === node.getChildCount() ) {
                return false;
            }
            node = child;
        }

        return node.final;
    }

    /**
     * Serialize this frozen trie as JSON.
     * @return {Object}
     */
    serialize() {
        return {
            trie: this._rawData,
            directory: this._rawDirectory,
            nodeCount: this._nodeCount
        };
    }

    /**
     * Deserialize a serialized FrozenTrie
     * @param  {Object} json
     * @return {FrozenTrie}
     */
    static deserialize(json) {
        return new FrozenTrie(json.trie, json.directory, json.nodeCount);
    }

    /**
     * Construct a FrozenTrie out of a living Trie
     * @static
     * @param  {Trie} trie
     * @return {FrozenTrie}
     */
    static freeze(trie) {
        let trieData = trie.encode();
        let nodeCount = trie.getNodeCount();
        let directory = RankDirectory.Create(trieData, nodeCount * 2 + 1, L1, L2);

        return new FrozenTrie(trieData, directory.getData(), nodeCount);
    }

}
