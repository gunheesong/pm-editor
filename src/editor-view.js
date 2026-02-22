// renders for a single node?
function renderNode(node) {
    if (node.isText) {
        // document is from standard JS library. 
        return document.createTextNode(node.text);
    }
    // [] is destructuring ouput array
    const [tagName] = node.type.spec.toDOM(node);

    return document.createElement(tagName);
}

// views for all of the nodes of the model
class View {
    // dom represents the html element for A node. 
    constructor(node, dom, parent) {
        this.node = node;
        this.dom = dom;
        this.parent = parent;
    }
    destroy() {
        this.parent = null;
    }
}

class TextView extends View {}

class NodeView extends View {
    constructor(node, dom, parent) {
        // super calls views constructor
        super(node, dom, parent);
        this.children = [];
        this.updateChildren();
    }

    updateChildren() {
        // iterate through child nodes of the node
        // this.node is a ProseMirror Node object, and child is an immediate child node.
        this.node.forEach(( child, offset, index ) => {
            const childView = this.children[index];
            // if childview already exists return it
            if (childView) {
                return;
            }
            
            const childDOM = renderNode(child);
            // every nodeview only owns one dom element
            this.dom.appendChild(childDOM);
            if (child.isText) {
                this.children[index] = new TextView(child, childDOM, this);
              } else {
                this.children[index] = new NodeView(child, childDOM, this);
              }
                });
    }


    destroy() {
        super.destroy();
        for (const child of this.children) {
            child.destroy();
        }
    }
}

// this is the view for the document
export class EditorView extends NodeView {
    constructor(dom, { state }) {
        // pass in these into super
        super(state.doc, dom, null);
        this.state = state;
        this.dom.contentEditable = true;
    }

    destroy() {
        super.destroy();
    }
}