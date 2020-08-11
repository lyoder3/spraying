class Node {
  children: Node[];
  parent: Node;
  value: string;

  constructor(value, parentNode = null) {
    this.parent = parentNode;
    this.value = value;
    this.children = [];
  }

  addNode(value: string | number) {
    if (typeof value === "string") {
      const segments = value.split("/");

      if (segments.length === 0) {
        return;
      }
      if (segments.length === 1) {
        const node = new Node(segments[0], this);
        this.children.push(node);
        return {node: node, index: this.children.length - 1};
      }
      const existingChildNode = this.children.filter(child => child.value === segments[0])[0];

      if (existingChildNode) {
        existingChildNode.addNode(segments.slice(1).join("/"));
      } else {
        const node = new Node(segments[0], this);
        node.addNode(segments.slice(1).join("/"));
        this.children.push(node);
        return {node: node, index: this.children.length - 1};
      }
    }
  }

  removeNode(value: string) {
    const segments = value.split("/");
    if (segments.length === 0) {
      return;
    }
    if (segments.length === 1) {
      const existingNodeIndex = this.children.findIndex(child => child.value === segments[0]);
      if (existingNodeIndex < 0) {
        throw new Error("Could not find matching value!");
      }
      this.children.splice(existingNodeIndex, 1);
    }
    if (segments.length > 1) {
      const existingChildNode = this.children.filter(child => child.value === segments[0])[0];
      if (!existingChildNode) {
        throw new Error("Could not find matching path! Path segment: " + segments[0]);
      }

      existingChildNode.removeNode(segments.slice(1).join("/"));
    }
  }

  find(value) {
    for (const child of this.children) {
      if (child.value === value) {
        return child;
      }
    }
    for (const child of this.children) {
      const nestedChildNode = child.find(value);
      if (nestedChildNode) {
        return nestedChildNode;
      }
    }
  }
}

class Tree {
  root: Node;

  constructor(rootValue) {
    this.root = new Node(rootValue);
  }

  add(path) {
    this.root.addNode(path)
  }

  remove(path) {
    this.root.removeNode(path);
  }

  find(value) {
    if (this.root.value === value) {
      return this.root;
    }
    return this.root.find(value);
  }
}






