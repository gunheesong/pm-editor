import { EditorState } from "prosemirror-state";
import { schema } from "prosemirror-schema-basic";
import { EditorView } from "./editor-view";

// schema are the list of rules.
// doc node is root of the document tree, thus first node of schema.node is never passed through
const doc = schema.node("doc", null, [
    schema.node("paragraph", null, [schema.text("Hello, ProseMirror!")]),
    schema.node("blockquote", null, [
        schema.node("paragraph", null, [schema.text("Editing time!!")]),
    ]),
]);

window.view = new EditorView(document.querySelector("#editor"), {
    state: EditorState.create( { doc } ),
})